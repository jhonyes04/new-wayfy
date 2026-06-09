import os
import json
from flask import jsonify
from groq import Groq
from api.prompts.mapgpt_prompt import MAPGPT_SYSTEM_PROMPT

class AIController:
    @staticmethod
    def map_gpt(user_prompt: str):
        if not user_prompt or not user_prompt.strip():
            return jsonify({'msg': 'Prompt vacío'}), 400
        
        try:
            client = Groq(api_key=os.getenv('GROQ_API_KEY'))
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
                response_format={'type': 'json_object'}
            )

            ai_response = json.loads(completion.choices[0].message.content)

            return jsonify(ai_response), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500