import { useState, useRef, useCallback, useEffect } from 'react';
import { fetchMapData } from '../services/mapgpt.api';
import useGlobalReducer from '../../../hooks/useGlobalReducer';

const useAIAssistant = () => {
    const { state, dispatch } = useGlobalReducer()
    const { isListening, isProcessing } = state;
    const recognitionRef = useRef(null);
    const inputRef = useRef(null)

    const updateMapState = useCallback(
        (feature, filters, categories) => {
            if (!feature) return;

            const lon = parseFloat(feature.center?.[0] ?? feature.geometry?.coordinates?.[0]);
            const lat = parseFloat(feature.center?.[1] ?? feature.geometry?.coordinates?.[1]);

            if (!lon || !lat) return;

            dispatch({
                type: 'SET_SELECTED_LOCATION',
                payload: {
                    id: feature.id,
                    longitude: lon,
                    latitude: lat,
                    zoom: 15
                },
            });

            dispatch({ type: 'SET_ACTIVE_FILTERS', payload: filters });
            dispatch({ type: 'SET_ACTIVE_CATEGORIES', payload: categories });
        },
        [dispatch],
    );

    const processQuery = useCallback(
        async (text) => {
            if (!text || text.trim().length < 3) return;

            // setIsProcessing(true);
            dispatch({ type: 'SET_PROCESSING', payload: true })
            try {
                const result = await fetchMapData(text);

                // Guardar texto original y ubicación textual
                dispatch({
                    type: 'SET_AI_QUERY_INFO',
                    payload: {
                        message: result.message,
                        poi: result.poi,
                        address: result.address,
                        place: result.place
                    }
                });

                if (result?.feature) {
                    updateMapState(result.feature, result.filters, result.categories);
                }

                return result;
            } catch (error) {
                console.error('Error en processQuery:', error);
                throw error;
            } finally {
                // setIsProcessing(false);
                dispatch({ type: 'SET_PROCESSING', payload: false })
            }
        },
        [updateMapState, dispatch],
    );

    const toggleListening = useCallback(() => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert('Tu navegador no soporta el reconocimiento de voz.');
            return;
        }

        if (isListening) {
            recognitionRef.current?.stop();
            // setIsListening(false);
            dispatch({ type: 'SET_LISTENING', payload: false })
        } else {
            // setIsListening(true)
            dispatch({ type: 'SET_LISTENING', payload: true })
            const recognition = new SpeechRecognition();
            recognition.lang = 'es-ES';
            recognition.continuous = false;

            recognition.onstart = () => dispatch({ type: 'SET_LISTENING', payload: true });
            recognition.onend = () => dispatch({ type: 'SET_LISTENING', payload: false });
            recognition.onerror = () => dispatch({ type: 'SET_LISTENING', payload: false });

            recognition.onresult = async (e) => {
                const transcript = e.results[0][0].transcript;
                await processQuery(transcript);
            };

            recognitionRef.current = recognition;
            recognition.start();
        }
    }, [isListening, processQuery]);

    const focusInput = () => {
        if (inputRef.current) inputRef.current.focus();
    }

    useEffect(() => {
        return () => {
            recognitionRef.current?.stop();
        };
    }, []);

    return {
        isListening,
        isProcessing,
        toggleListening,
        processQuery,
        inputRef,
        focusInput
    };
};

export default useAIAssistant;
