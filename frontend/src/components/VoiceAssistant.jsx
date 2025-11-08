import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const VoiceAssistant = ({ alerts = [] }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useLocalStorage('guardian-voice-enabled', true);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();
  const toast = useToast();

  // Initialize Speech Recognition
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
      setResponse('');
    };

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      processCommand(text);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      if (event.error !== 'no-speech') {
        toast.error('Voice recognition error. Please try again.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [alerts]);

  // Process voice command
  const processCommand = (text) => {
    const lowerText = text.toLowerCase();
    let responseText = '';

    // Navigation commands
    if (lowerText.includes('show') && lowerText.includes('dashboard')) {
      navigate('/dashboard');
      responseText = 'Opening dashboard';
    } else if (lowerText.includes('show') && lowerText.includes('alert')) {
      navigate('/alerts');
      responseText = 'Opening alerts page';
    } else if (lowerText.includes('show') && lowerText.includes('contact')) {
      navigate('/contacts');
      responseText = 'Opening contacts page';
    } else if (lowerText.includes('show') && lowerText.includes('system')) {
      navigate('/system');
      responseText = 'Opening system health';
    } else if (lowerText.includes('show') && lowerText.includes('room')) {
      // Extract room number
      const roomMatch = lowerText.match(/room\s+(\d+)/);
      if (roomMatch) {
        const roomNumber = roomMatch[1];
        responseText = `Showing patient room ${roomNumber}`;
        navigate(`/screen-capture?room=${roomNumber}`);
      } else {
        responseText = 'Please specify a room number';
      }
    }
    // Query commands
    else if (lowerText.includes('how many') && lowerText.includes('alert')) {
      const activeAlerts = alerts.filter(a => a.status === 'active').length;
      const totalAlerts = alerts.length;
      
      if (lowerText.includes('today')) {
        const today = new Date().toDateString();
        const todayAlerts = alerts.filter(a => 
          new Date(a.created_at).toDateString() === today
        ).length;
        responseText = `There are ${todayAlerts} alerts today. ${activeAlerts} are currently active.`;
      } else if (lowerText.includes('active')) {
        responseText = `There are ${activeAlerts} active alerts out of ${totalAlerts} total.`;
      } else {
        responseText = `There are ${totalAlerts} total alerts. ${activeAlerts} are active.`;
      }
    } else if (lowerText.includes('status')) {
      const activeAlerts = alerts.filter(a => a.status === 'active').length;
      const criticalAlerts = alerts.filter(a => a.alert_type === 'critical').length;
      responseText = `System status: ${activeAlerts} active alerts, ${criticalAlerts} critical.`;
    } else if (lowerText.includes('help')) {
      responseText = 'You can say: Show me alerts, How many alerts today, Show me room 204, or Open dashboard';
    } else {
      responseText = 'I didn\'t understand that command. Say "help" for available commands.';
    }

    setResponse(responseText);
    
    // Speak response if voice is enabled
    if (voiceEnabled) {
      speak(responseText);
    }
  };

  // Text-to-speech
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      window.speechSynthesis.speak(utterance);
    }
  };

  // Start listening
  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsOpen(true);
      } catch (error) {
        console.error('Error starting recognition:', error);
        toast.error('Could not start voice recognition');
      }
    }
  };

  // Stop listening
  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  // Announce critical alerts via TTS
  useEffect(() => {
    if (!voiceEnabled) return;

    const criticalAlerts = alerts.filter(
      a => a.status === 'active' && a.alert_type === 'critical'
    );

    if (criticalAlerts.length > 0) {
      const latestCritical = criticalAlerts[0];
      const announcement = `Critical alert: ${latestCritical.message || 'Immediate attention required'}`;
      
      // Delay to avoid conflicts
      setTimeout(() => {
        speak(announcement);
      }, 500);
    }
  }, [alerts.length, voiceEnabled]);

  // Check if speech recognition is supported
  const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  if (!isSupported) {
    return null; // Don't render if not supported
  }

  return (
    <>
      {/* Voice Assistant Button */}
      <motion.button
        onClick={startListening}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-2xl transition-all ${
          isListening
            ? 'bg-gradient-to-r from-red-500 to-pink-600 animate-pulse'
            : 'bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:shadow-purple-500/50'
        }`}
        title="Voice Assistant (Click or say 'Hey Guardian')"
      >
        {isListening ? '🎙️' : '🎤'}
      </motion.button>

      {/* Voice Assistant Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm flex items-center justify-center"
            onClick={() => {
              setIsOpen(false);
              stopListening();
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl p-8 max-w-lg w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${
                    isListening 
                      ? 'from-red-500 to-pink-600 animate-pulse' 
                      : 'from-purple-600 to-cyan-600'
                  } flex items-center justify-center text-2xl`}>
                    {isListening ? '🎙️' : '🎤'}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                      Voice Assistant
                    </h2>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {isListening ? 'Listening...' : 'Ready to help'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    stopListening();
                  }}
                  className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Waveform Animation */}
              {isListening && (
                <div className="flex items-center justify-center space-x-2 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-gradient-to-t from-purple-600 to-cyan-600 rounded-full"
                      animate={{
                        height: [20, 40, 20],
                      }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Transcript */}
              {transcript && (
                <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-1">
                    You said:
                  </p>
                  <p className="text-neutral-900 dark:text-white">"{transcript}"</p>
                </div>
              )}

              {/* Response */}
              {response && (
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                    Guardian AI:
                  </p>
                  <p className="text-neutral-900 dark:text-white">{response}</p>
                </div>
              )}

              {/* Controls */}
              <div className="flex space-x-3 mb-6">
                {!isListening ? (
                  <button
                    onClick={startListening}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    Start Listening
                  </button>
                ) : (
                  <button
                    onClick={stopListening}
                    className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    Stop Listening
                  </button>
                )}
                
                <button
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    voiceEnabled
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                      : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400'
                  }`}
                  title={voiceEnabled ? 'Voice responses enabled' : 'Voice responses disabled'}
                >
                  {voiceEnabled ? '🔊' : '🔇'}
                </button>
              </div>

              {/* Example Commands */}
              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
                <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-2">
                  Try saying:
                </p>
                <div className="space-y-1 text-xs text-neutral-600 dark:text-neutral-400">
                  <p>• "Show me patient room 204"</p>
                  <p>• "How many alerts today?"</p>
                  <p>• "Show me the dashboard"</p>
                  <p>• "What is the system status?"</p>
                  <p>• "Open contacts"</p>
                  <p>• "Help"</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VoiceAssistant;
