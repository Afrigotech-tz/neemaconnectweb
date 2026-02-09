import React, { useState, useRef, useEffect } from 'react';
import { Box, Paper, TextField, Button, Typography, Avatar, IconButton, Chip } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'audio' | 'file';
  metadata?: any;
}

interface EnhancedChatProps {
  userId?: string;
  sessionId?: string;
  onMessage?: (message: Message) => void;
  onSessionEnd?: () => void;
}

const EnhancedChat: React.FC<EnhancedChatProps> = ({
  userId,
  sessionId,
  onMessage,
  onSessionEnd
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    onMessage?.(userMessage);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I understand you said: "${userMessage.content}". How can I help you further?`,
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
      onMessage?.(aiMessage);
    }, 1000);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const audioChunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        // Handle audio message
        const audioMessage: Message = {
          id: Date.now().toString(),
          content: 'Audio message',
          sender: 'user',
          timestamp: new Date(),
          type: 'audio',
          metadata: { audioBlob }
        };
        setMessages(prev => [...prev, audioMessage]);
        onMessage?.(audioMessage);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f5f5f5' }}>
      {/* Header */}
      <Paper
        elevation={2}
        sx={{
          p: 2,
          bgcolor: 'primary.main',
          color: 'white',
          borderRadius: 0
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
              🤖
            </Avatar>
            <Box>
              <Typography variant="h6">Enhanced AI Assistant</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                NeuroFractal Cognitive Enhancement
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              label="Active Session"
              color="success"
              size="small"
              sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
              variant="outlined"
            />
          </Box>
        </Box>
      </Paper>

      {/* Messages Area */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  mb: 2
                }}
              >
                <Box
                  sx={{
                    maxWidth: '70%',
                    p: 2,
                    borderRadius: 2,
                    bgcolor: message.sender === 'user' ? 'primary.main' : 'white',
                    color: message.sender === 'user' ? 'white' : 'text.primary',
                    boxShadow: 1
                  }}
                >
                  <Typography variant="body1">{message.content}</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7, mt: 1, display: 'block' }}>
                    {message.timestamp.toLocaleTimeString()}
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: 'white',
                boxShadow: 1
              }}
            >
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                AI is typing...
              </Typography>
            </Box>
          </Box>
        )}

        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Paper
        elevation={2}
        sx={{
          p: 2,
          borderRadius: 0,
          bgcolor: 'white'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton color="primary">
            <AttachFileIcon />
          </IconButton>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3
              }
            }}
          />

          <IconButton
            color={isRecording ? 'error' : 'primary'}
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? <StopIcon /> : <MicIcon />}
          </IconButton>

          <Button
            variant="contained"
            endIcon={<SendIcon />}
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            sx={{
              borderRadius: 3,
              px: 3
            }}
          >
            Send
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default EnhancedChat;
