import { useState, useEffect, useRef } from "react";

let defaultLang = 'en-US';
const useSetDefaultLang = (lang) => {
    defaultLang = lang;
};

const useGetDefaultLang = () => {
    return defaultLang;
};

const useSpeechToText = (initialValue = '') => {
    const [value, setValue] = useState(initialValue);
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);
  
    useEffect(() => {
      const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition ||
        window.mozSpeechRecognition ||
        window.msSpeechRecognition;
  
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = defaultLang;
  
        recognition.onresult = (event) => {
          const transcriptArray = Array.from(event.results)
            .map(result => result[0].transcript)
            .join(' ');
          setValue(transcriptArray);
        };
  
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
  
        recognitionRef.current = recognition;
      } else {
        console.warn('Speech recognition not supported');
      }
  
      return () => {
        if (recognitionRef.current) recognitionRef.current.stop();
      };
    }, [defaultLang]);
  
    const toggleListening = () => {
      if (!recognitionRef.current) return;
  
      if (isListening) {
        recognitionRef.current.stop();
        setIsListening(false);
      } else {
        recognitionRef.current.start();
        setIsListening(true);
      }
    };
  
    const clear = () => setValue('');
  
    return { value, setValue, isListening, toggleListening, clear };
  };

  export {useSpeechToText, useSetDefaultLang, useGetDefaultLang};