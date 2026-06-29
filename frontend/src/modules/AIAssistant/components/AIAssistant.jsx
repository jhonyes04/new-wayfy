import { useEffect, useState } from 'react';
import useGlobalReducer from '../../../hooks/useGlobalReducer';
import useAIAssistant from '../hooks/useAIAssistant';

const MIN_LENGTH_QUERY = 3;

export const AIAssistant = () => {
    const { state } = useGlobalReducer();
    const [query, setQuery] = useState('');
    const {
        processQuery,
        isProcessing,
        isListening,
        toggleListening,
        inputRef,
    } = useAIAssistant();

    useEffect(() => {
        const handler = () => {
            if (inputRef.current) inputRef.current.focus();
        };

        window.addEventListener('focus-ai-input', handler);

        return () => window.removeEventListener('focus-ai-input', handler);
    }, [inputRef]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (query.trim().length < MIN_LENGTH_QUERY) return;

        await processQuery(query);
        setQuery('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <>
            {isProcessing && (
                <div
                    className="
                        position-absolute
                        top-0 start-0 end-0 bottom-0
                        d-flex flex-column justify-content-center align-items-center
                        bg-dark bg-opacity-75 z-1
                    "
                >
                    <i className="fa-solid fa-spinner fa-spin fa-4x text-white"></i>
                    <span className={`text-white px-4 rounded-5 mt-2`}>
                        WayFy está en marcha...
                    </span>
                </div>
            )}

            <div
                className="col-10 col-sm-8 position-absolute start-50 translate-middle-x opacity-75 rounded-3 z-1"
                style={{ bottom: '5px' }}
            >
                <form
                    onSubmit={handleSubmit}
                    className="d-flex align-items-center gap-1 bg-dark text-white p-2 rounded-3"
                >
                    <div className="position-relative w-100">
                        <input
                            ref={inputRef}
                            className="form-control bg-dark text-white border border-secondary rounded-3 w-100"
                            placeholder="Pregunta a Wayfy..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            readOnly={isListening}
                            disabled={isProcessing}
                        />
                    </div>
                    <div className="position-relative">
                        <i
                            onClick={() => !isProcessing && toggleListening()}
                            className={`fa-solid ${
                                isListening
                                    ? 'fa-microphone-lines fa-pulse text-danger'
                                    : 'fa-microphone-lines text-white cursor-pointer'
                            }`}
                            style={{ cursor: 'pointer' }}
                            disabled={isProcessing}
                            title="Hablar con la IA"
                        ></i>
                    </div>
                </form>
            </div>
        </>
    );
};
