import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Bot, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  message: string;
  timestamp: string;
}

const Chatbot = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom of the chat when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add a welcome message when the component mounts
  useEffect(() => {
    if (messages.length === 0 && user) {
      setMessages([
        {
          id: 'welcome',
          sender: 'bot',
          message: `Welcome, ${user.name}! I'm your health assistant. How can I assist you today?`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    }
  }, [user]);

  const handleSendMessage = async () => {
    if (!input.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a message.',
        variant: 'destructive',
      });
      return;
    }

    // Add user message
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      sender: 'user',
      message: input,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput(''); // Clear input immediately after adding user message

    try {
      // Send message to backend
      const response = await api.post('/api/chat', { message: input });
      const botResponse = response.data.response || 'Error: No response from server';

      // Add bot response
      const botMessage: ChatMessage = {
        id: crypto.randomUUID(),
        sender: 'bot',
        message: botResponse,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to get response from server.',
        variant: 'destructive',
      });
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        sender: 'bot',
        message: 'Error: Unable to get response from server.',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bot className="w-5 h-5 mr-2 text-medical-600" />
            Health Assistant Chatbot
          </CardTitle>
          <p className="text-gray-600">Ask about appointments, symptoms, or test results.</p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            {/* Chat History */}
            <div className="h-[400px] overflow-y-auto p-4 bg-gray-50 rounded-lg">
              {messages.map((msg) => (
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
                    <p className="mt-1">{msg.message}</p>
                    <span className="text-xs text-gray-400">{msg.timestamp}</span>
                  </div>
                </div>
              ))}
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
              />
              <Button onClick={handleSendMessage} className="bg-medical-600 hover:bg-medical-700">
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chatbot;