import { useState, useCallback } from 'react';

export const useVoiceSearch = (onResult) => {
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState(null);

  const startListening = useCallback(async () => {
    setVoiceError(null);

    // Native Platform (Android / iOS via Capacitor Community Plugin)
    if (typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.()) {
      try {
        const { SpeechRecognition } = await import('@capacitor-community/speech-recognition');
        const hasPerm = await SpeechRecognition.hasPermission();
        if (!hasPerm.permission) {
          const req = await SpeechRecognition.requestPermission();
          if (!req.permission) {
            setVoiceError('Microphone permission required for voice search.');
            return;
          }
        }

        setIsListening(true);
        SpeechRecognition.start({
          language: 'en-IN',
          maxResults: 1,
          prompt: 'Say product or botanical concern (e.g. Aloe Vera Soap)',
          partialResults: false,
          popup: true,
        }).then(result => {
          setIsListening(false);
          if (result.matches && result.matches.length > 0) {
            onResult(result.matches[0]);
          }
        }).catch(err => {
          setIsListening(false);
          setVoiceError(err.message || 'Voice search failed.');
        });
      } catch (e) {
        setIsListening(false);
        setVoiceError('Native voice search unavailable.');
      }
      return;
    }

    // Web Speech API Fallback (Standard Desktop/Mobile Browser)
    const SpeechRecognition = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SpeechRecognition) {
      setVoiceError('Voice recognition is not supported in this browser.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = (e) => {
        setIsListening(false);
        setVoiceError(e.error === 'not-allowed' ? 'Microphone permission denied.' : 'Voice recognition error.');
      };
      recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        if (transcript) onResult(transcript);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
      setVoiceError(e.message || 'Could not start voice recognition.');
    }
  }, [onResult]);

  const stopListening = useCallback(async () => {
    setIsListening(false);
  }, []);

  return { isListening, voiceError, startListening, stopListening };
};
