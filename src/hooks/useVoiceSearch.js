import { useState, useCallback, useRef } from 'react';
import { Capacitor } from '@capacitor/core';

export const useVoiceSearch = (onResult) => {
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState(null);
  const recognitionRef = useRef(null);

  const startListening = useCallback(async () => {
    setVoiceError(null);

    // Native Platform (Android / iOS via Capacitor Community Plugin)
    if (Capacitor.isNativePlatform()) {
      try {
        const { SpeechRecognition } = await import('@capacitor-community/speech-recognition');
        const availability = await SpeechRecognition.available();
        if (!availability.available) {
          setVoiceError('Voice recognition is unavailable on this device.');
          return;
        }
        let permission = await SpeechRecognition.checkPermissions();
        if (permission.speechRecognition !== 'granted') {
          permission = await SpeechRecognition.requestPermissions();
          if (permission.speechRecognition !== 'granted') {
            setVoiceError('Microphone permission required for voice search.');
            return;
          }
        }

        setIsListening(true);
        const result = await SpeechRecognition.start({
          language: 'en-IN',
          maxResults: 1,
          prompt: 'Say product or botanical concern (e.g. Aloe Vera Soap)',
          partialResults: false,
          popup: true,
        });
        if (result.matches?.[0]) onResult(result.matches[0]);
      } catch (e) {
        console.error('[NATIVE_VOICE_SEARCH_ERROR]', e);
        setVoiceError(e.message || 'Native voice search unavailable.');
      } finally {
        setIsListening(false);
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
      recognitionRef.current = recognition;
      recognition.lang = 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => {
        recognitionRef.current = null;
        setIsListening(false);
      };
      recognition.onerror = (e) => {
        recognitionRef.current = null;
        setIsListening(false);
        setVoiceError(e.error === 'not-allowed' ? 'Microphone permission denied.' : 'Voice recognition error.');
      };
      recognition.onresult = (e) => {
        const transcript = e.results?.[0]?.[0]?.transcript;
        if (transcript) onResult(transcript);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
      setVoiceError(e.message || 'Could not start voice recognition.');
    }
  }, [onResult]);

  const stopListening = useCallback(async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        const { SpeechRecognition } = await import('@capacitor-community/speech-recognition');
        await SpeechRecognition.stop();
      } catch (error) {
        console.error('[NATIVE_VOICE_SEARCH_STOP_ERROR]', error);
        setVoiceError(error.message || 'Could not stop voice recognition.');
      }
    } else if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  return { isListening, voiceError, startListening, stopListening };
};
