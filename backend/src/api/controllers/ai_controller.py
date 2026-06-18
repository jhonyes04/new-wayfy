import os
import json
from urllib import request as urllib_request
from urllib.parse import urlencode
from flask import jsonify
from groq import Groq
from api.prompts.mapgpt_prompt import MAPGPT_SYSTEM_PROMPT

class AIController:
    _contact_email = os.getenv('CONTACT_EMAIL', '')
    _user_agent = f'WayfyAI/1.0 ({_contact_email})'

    @staticmethod
    def map_gpt(user_prompt: str):
        if not user_prompt or not user_prompt.strip():
            return jsonify({'msg': 'Prompt vacío'}), 400

        groq_api_key = os.getenv('GROQ_API_KEY')
        if not groq_api_key:
            return jsonify({'msg': 'Falta GROQ_API_KEY en el servidor'}), 500
        
        try:
            client = Groq(api_key=groq_api_key)
            completion = client.chat.completions.create(
                messages=[
                    {
                        'role': 'system',
                        "content": MAPGPT_SYSTEM_PROMPT
                    },
                    {
                        'role': 'user',
                        'content': user_prompt
                    }
                ],
                model='llama-3.1-8b-instant',
                response_format={'type': 'json_object'},
                temperature=0.2,
                max_tokens=300
            )

            content = completion.choices[0].message.content or '{}'

            try:
                ai_response = json.loads(content)
            except json.JSONDecodeError:
                return jsonify({'msg': 'La IA devolvio una respuesta invalida'}), 502

            return jsonify(ai_response), 200
        except Exception as e:
            return jsonify({'msg': 'Error procesando la peticion de IA', 'error': str(e)}), 500
        
    @staticmethod
    def geocode(query: str):
        if not query or not query.strip():
            return jsonify({'msg': 'Query vacío'}), 400
        
        url = 'https://nominatim.openstreetmap.org/search?' + urlencode({
            'format': 'json',
            'q': query,
            'limit': 1,
        })
        
        req = urllib_request.Request(
            url,
            headers={'User-Agent': AIController._user_agent},
        )
        
        try:
            with urllib_request.urlopen(req, timeout=5) as response:
                results = json.loads(response.read().decode('utf-8'))
        except Exception as e:
            return jsonify({'msg': 'Error al geocodificar', 'error': str(e)}), 502
        
        if not results: 
            return jsonify({'feature': None}), 200
        
        try:
            lon = float(results[0]['lon'])
            lat = float(results[0]['lat'])
        except (KeyError, ValueError, IndexError):
            return jsonify({'feature': None}), 200
        
        return jsonify({
            'feature': {
                'id': query,
                'center': [lon, lat],
                'geometry': {
                    'type': 'Point', 
                    'coordinates': [lon, lat]
                },
                'places_name': query,
                'text': query,
            }
        }), 200
        
    @staticmethod
    def geocode_poi(query: str):
        if not query or not query.strip():
            return jsonify({'feature': None}), 200

        def photon_search(q):
            url = 'https://photon.komoot.io/api/?' + urlencode({
                'q': q,
                'limit': 1,
            })
            req = urllib_request.Request(
                url,
                headers={'User-Agent': AIController._user_agent},
            )
            with urllib_request.urlopen(req, timeout=5) as response:
                data = json.loads(response.read().decode('utf-8'))
            features = data.get('features', [])
            if not features:
                return None
            coords = features[0]['geometry']['coordinates']
            return float(coords[0]), float(coords[1])

        def nominatim_search(q):
            url = 'https://nominatim.openstreetmap.org/search?' + urlencode({
                'format': 'json',
                'q': q,
                'limit': 1,
            })
            req = urllib_request.Request(
                url,
                headers={'User-Agent': AIController._user_agent},
            )
            with urllib_request.urlopen(req, timeout=5) as response:
                results = json.loads(response.read().decode('utf-8'))
            if not results:
                return None
            return float(results[0]['lon']), float(results[0]['lat'])

        words = query.strip().split()
        candidates = list(dict.fromkeys([
            query,
            ' '.join(words[:4]) if len(words) > 4 else None,
            ' '.join(words[:3]) if len(words) > 3 else None,
        ]))
        candidates = [c for c in candidates if c]

        try:
            for candidate in candidates:
                result = None
                try:
                    result = photon_search(candidate)
                except Exception:
                    pass
                if not result:
                    try:
                        result = nominatim_search(candidate)
                    except Exception:
                        pass
                if result:
                    lon, lat = result
                    return jsonify({
                        'feature': {
                            'id': query,
                            'center': [lon, lat],
                            'geometry': {'type': 'Point', 'coordinates': [lon, lat]},
                            'places_name': query,
                            'text': query,
                        }
                    }), 200
        except Exception:
            pass

        return jsonify({'feature': None}), 200