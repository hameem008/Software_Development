import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Bot, User, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  message: string;
  timestamp: string;
}

interface GeminiMessage {
  role: 'user' | 'model';
  message: string;
}

const Chatbot = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Key for storing conversation in localStorage
  const CONVERSATION_KEY = `chat_conversation_${user?.id || 'default'}`;

  // Scroll to the bottom of the chat when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load conversation from localStorage on mount
  useEffect(() => {
    if (user) {
      const savedConversation = localStorage.getItem(CONVERSATION_KEY);
      if (savedConversation) {
        try {
          const parsedConversation = JSON.parse(savedConversation);
          setMessages(parsedConversation);
        } catch (error) {
          console.error('Error parsing saved conversation:', error);
          // If parsing fails, start with welcome message
          addWelcomeMessage();
        }
      } else {
        // No saved conversation, start with welcome message
        addWelcomeMessage();
      }
    }
  }, [user]);

  // Save conversation to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(CONVERSATION_KEY, JSON.stringify(messages));
    }
  }, [messages, CONVERSATION_KEY]);

  const addWelcomeMessage = () => {
    if (user) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        sender: 'bot',
        message: `Welcome, ${user.name}! I'm your health assistant. How can I assist you today?`,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages([welcomeMessage]);
    }
  };

  const buildGeminiConversation = (messages: ChatMessage[]): GeminiMessage[] => {
    // Filter out welcome message and convert to Gemini format
    const conversationMessages = messages.filter(msg => msg.id !== 'welcome');
    
    // Add system context at the beginning
    const systemContext: GeminiMessage = {
      role: 'model',
      message: `You are a helpful health assistant chatbot for MediLine, a medical platform. You can help users with:
      - General health information and advice
      - Appointment scheduling queries
      - Symptom checking (always recommend consulting a healthcare professional)
      - Test result explanations
      - Medication information
      - Wellness tips
      
      Always maintain a professional, empathetic tone and remind users to consult healthcare professionals for serious medical concerns.`
    };

    const geminiMessages: GeminiMessage[] = [systemContext];
    
    conversationMessages.forEach(msg => {
      geminiMessages.push({
        role: msg.sender === 'user' ? 'user' : 'model',
        message: msg.message
      });
    });

    return geminiMessages;
  };

  const handleSendMessage = async () => {
    if (!input.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a message.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    // Add user message
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      sender: 'user',
      message: input,
      timestamp: new Date().toLocaleTimeString(),
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput(''); // Clear input immediately after adding user message

    try {
      // Build conversation history for Gemini
      const conversationHistory = buildGeminiConversation(updatedMessages);

      // Send conversation history to backend
      const response = await api.post('/patient/chat', {
        conversationHistory: conversationHistory
      });

      const botResponse = response.data.response || 'Error: No response from server';

      // Add bot response
      const botMessage: ChatMessage = {
        id: crypto.randomUUID(),
        sender: 'bot',
        message: botResponse,
        timestamp: new Date().toLocaleTimeString(),
      };
      
      setMessages(prev => [...prev, botMessage]);

    } catch (error: any) {
      console.error('Chat error:', error);
      
      let errorMessage = 'Failed to get response from server.';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });

      const errorChatMessage: ChatMessage = {
        id: crypto.randomUUID(),
        sender: 'bot',
        message: `Error: ${errorMessage}`,
        timestamp: new Date().toLocaleTimeString(),
      };
      
      setMessages(prev => [...prev, errorChatMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearConversation = () => {
    setMessages([]);
    localStorage.removeItem(CONVERSATION_KEY);
    // Add welcome message after clearing
    setTimeout(() => {
      addWelcomeMessage();
    }, 100);
    
    toast({
      title: 'Success',
      description: 'Conversation cleared successfully.',
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bot className="w-5 h-5 mr-2 text-medical-600" />
              <div>
                <CardTitle>Health Assistant Chatbot</CardTitle>
                <p className="text-sm text-gray-600">Ask about appointments, symptoms, or test results.</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={clearConversation}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Chat
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            {/* Chat History */}
            <div className="h-[400px] overflow-y-auto p-4 bg-gray-50 rounded-lg">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>No messages yet. Start a conversation!</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    } mb-4`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        msg.sender === 'user'
                          ? 'bg-medical-600 text-white'
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {msg.sender === 'user' ? (
                          <User className="w-4 h-4" />
                        ) : (
                          <Bot className="w-4 h-4 text-medical-600" />
                        )}
                        <span className="text-sm font-medium">
                          {msg.sender === 'user' ? user?.name : 'Health Assistant'}
                        </span>
                      </div>
                      <div className="mt-1 whitespace-pre-wrap">{msg.message}</div>
                      <span className="text-xs text-gray-400 mt-1 block">{msg.timestamp}</span>
                    </div>
                  </div>
                ))
              )}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="max-w-[70%] p-3 rounded-lg bg-white border border-gray-200">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-4 h-4 text-medical-600 animate-pulse" />
                      <span className="text-sm font-medium">Health Assistant</span>
                    </div>
                    <div className="mt-1 flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button 
                onClick={handleSendMessage} 
                className="bg-medical-600 hover:bg-medical-700"
                disabled={isLoading || !input.trim()}
              >
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
            </div>
            
            {/* Conversation info */}
            <div className="text-xs text-gray-500 text-center">
              {messages.length > 0 && (
                <p>{messages.length} message{messages.length !== 1 ? 's' : ''} in conversation</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chatbot;