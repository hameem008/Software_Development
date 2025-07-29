import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Bot, User, Trash2, Activity, Users, MessageSquare } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  message: string;
  timestamp: string;
  messageType?: 'general' | 'symptom' | 'recommendation';
}

interface GeminiMessage {
  role: 'user' | 'model';
  message: string;
}

// Message type detection patterns (frontend validation)
const MESSAGE_PATTERNS = {
  symptom: [
    /\b(pain|hurt|ache|sick|fever|headache|nausea|vomit|dizzy|tired|fatigue|weak|symptom|feel bad|not well|unwell|ill|disease|condition|problem|issue|suffer|uncomfortable)\b/i,
    /\b(stomach|head|chest|back|leg|arm|throat|ear|eye|skin|joint|muscle)\s+(pain|hurt|ache|problem|issue)\b/i,
    /\b(my health|health problem|health issue|medical problem|medical issue|not feeling|feeling unwell)\b/i,
    /\b(diagnosis|diagnose|what's wrong|what is wrong|what could be|might have|could have)\b/i
  ],
  recommendation: [
    /\b(doctor|physician|specialist|appointment|visit|see a|consult|consultation|recommend|suggestion)\b/i,
    /\b(cardiologist|neurologist|dermatologist|orthopedic|pediatrician|gynecologist|psychiatrist|oncologist|urologist|gastroenterologist|ophthalmologist|ent|surgeon)\b/i,
    /\b(need a doctor|want to see|looking for|find a doctor|medical help|professional help)\b/i,
    /\b(book appointment|schedule|appointment with|visit to)\b/i
  ]
};

// Simple UUID generation function without crypto
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Detect message type on frontend
const detectMessageType = (message: string): 'general' | 'symptom' | 'recommendation' => {
  // Check recommendation patterns first (more specific)
  for (const pattern of MESSAGE_PATTERNS.recommendation) {
    if (pattern.test(message)) {
      return 'recommendation';
    }
  }
  
  // Check symptom patterns
  for (const pattern of MESSAGE_PATTERNS.symptom) {
    if (pattern.test(message)) {
      return 'symptom';
    }
  }
  
  return 'general';
};

// Get icon for message type
const getMessageTypeIcon = (type: 'general' | 'symptom' | 'recommendation') => {
  switch (type) {
    case 'symptom':
      return <Activity className="w-3 h-3 text-red-500" />;
    case 'recommendation':
      return <Users className="w-3 h-3 text-blue-500" />;
    default:
      return <MessageSquare className="w-3 h-3 text-gray-500" />;
  }
};

// Get message type label
const getMessageTypeLabel = (type: 'general' | 'symptom' | 'recommendation') => {
  switch (type) {
    case 'symptom':
      return 'Health Concern';
    case 'recommendation':
      return 'Doctor Recommendation';
    default:
      return 'General Chat';
  }
};

const Chatbot = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMessageTypes, setShowMessageTypes] = useState(false);
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
        message: `Welcome, ${user.name}! I'm your AI health assistant. I can help you with:

🩺 **Health Concerns & Symptoms** - Describe your symptoms and get guidance
👩‍⚕️ **Doctor Recommendations** - Find specialists and book appointments  
💬 **General Health Questions** - Ask about wellness, medications, and more

What would you like to discuss today?`,
        timestamp: new Date().toLocaleTimeString(),
        messageType: 'general'
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
      - Symptom checking and health concern guidance (always recommend consulting a healthcare professional)
      - Doctor recommendations and appointment scheduling assistance
      - Test result explanations and medication information
      - Wellness tips and preventive care advice
      
      Key Guidelines:
      - Maintain a professional, empathetic, and caring tone
      - For symptom-related queries, provide helpful advice while emphasizing the importance of professional medical consultation
      - When recommending doctors, present information naturally and help users make informed decisions
      - Always remind users to consult healthcare professionals for serious medical concerns
      - Be supportive and understanding, especially when users discuss health problems
      - Provide accurate, evidence-based health information`
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

    // Detect message type
    const messageType = detectMessageType(input);

    // Add user message
    const userMessage: ChatMessage = {
      id: generateUUID(),
      sender: 'user',
      message: input,
      timestamp: new Date().toLocaleTimeString(),
      messageType: messageType
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput(''); // Clear input immediately after adding user message

    try {
      // Build conversation history for Gemini
      const conversationHistory = buildGeminiConversation(updatedMessages);

      // Send conversation history to backend with patient ID
      const requestPayload = {
        conversationHistory: conversationHistory,
        patientId: user?.id || 1 // Include patient ID for symptom/doctor context
      };

      const response = await api.post('/patient/chat', requestPayload);

      const botResponse = response.data.response || 'Error: No response from server';

      // Add bot response
      const botMessage: ChatMessage = {
        id: generateUUID(),
        sender: 'bot',
        message: botResponse,
        timestamp: new Date().toLocaleTimeString(),
        messageType: messageType // Same type as user message for context
      };
      
      setMessages(prev => [...prev, botMessage]);

      // Show success message for different message types
      if (messageType === 'symptom') {
        toast({
          title: 'Health Guidance Provided',
          description: 'I\'ve analyzed your symptoms and provided relevant advice.',
        });
      } else if (messageType === 'recommendation') {
        toast({
          title: 'Doctor Recommendations',
          description: 'I\'ve found suitable doctors based on your needs.',
        });
      }

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
        id: generateUUID(),
        sender: 'bot',
        message: `I apologize, but I encountered an error: ${errorMessage}. Please try again or rephrase your question.`,
        timestamp: new Date().toLocaleTimeString(),
        messageType: 'general'
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

  // Get message type counts for display
  const messageTypeCounts = messages.reduce((counts, msg) => {
    if (msg.messageType && msg.sender === 'user') {
      counts[msg.messageType] = (counts[msg.messageType] || 0) + 1;
    }
    return counts;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bot className="w-5 h-5 mr-2 text-medical-600" />
              <div>
                <CardTitle>AI Health Assistant</CardTitle>
                <p className="text-sm text-gray-600">
                  Smart medical guidance • Symptom analysis • Doctor recommendations
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMessageTypes(!showMessageTypes)}
                className="text-blue-600 hover:text-blue-700"
              >
                <Activity className="w-4 h-4 mr-2" />
                Stats
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearConversation}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>

          {/* Message Type Statistics */}
          {showMessageTypes && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Conversation Statistics</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    {getMessageTypeIcon('general')}
                    <span className="ml-1 text-xs text-gray-600">General</span>
                  </div>
                  <div className="text-lg font-semibold text-gray-700">
                    {messageTypeCounts.general || 0}
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    {getMessageTypeIcon('symptom')}
                    <span className="ml-1 text-xs text-red-600">Symptoms</span>
                  </div>
                  <div className="text-lg font-semibold text-red-600">
                    {messageTypeCounts.symptom || 0}
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    {getMessageTypeIcon('recommendation')}
                    <span className="ml-1 text-xs text-blue-600">Doctors</span>
                  </div>
                  <div className="text-lg font-semibold text-blue-600">
                    {messageTypeCounts.recommendation || 0}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent>
          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto mb-4 p-4 border rounded-lg bg-gray-50">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <Bot className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>Start a conversation with your AI health assistant</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-medical-600 text-white'
                          : 'bg-white text-gray-800 border'
                      }`}
                    >
                      {/* Message Type Indicator */}
                      {message.messageType && message.sender === 'user' && (
                        <div className="flex items-center mb-1 opacity-75">
                          {getMessageTypeIcon(message.messageType)}
                          <span className="ml-1 text-xs">
                            {getMessageTypeLabel(message.messageType)}
                          </span>
                        </div>
                      )}

                      {/* Message Content */}
                      <div className="whitespace-pre-wrap">
                        {message.message}
                      </div>

                      {/* Timestamp */}
                      <div
                        className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}
                      >
                        <div className="flex items-center">
                          {message.sender === 'user' ? (
                            <User className="w-3 h-3 mr-1" />
                          ) : (
                            <Bot className="w-3 h-3 mr-1" />
                          )}
                          {message.timestamp}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Loading Indicator */}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white text-gray-800 border px-4 py-2 rounded-lg">
                      <div className="flex items-center">
                        <Bot className="w-3 h-3 mr-2" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your health question or describe your symptoms..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-medical-600 hover:bg-medical-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* Help Text */}
          <div className="mt-2 text-xs text-gray-500 text-center">
            Press Enter to send • Shift+Enter for new line • This is an AI assistant, not a replacement for professional medical advice
          </div>
        </CardContent>
      </Card>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-red-500"
          onClick={() => setInput("I'm experiencing some symptoms and need guidance")}
        >
          <CardContent className="p-4">
            <div className="flex items-center">
              <Activity className="w-8 h-8 text-red-500 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">Report Symptoms</h3>
                <p className="text-sm text-gray-600">Describe your health concerns</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-blue-500"
          onClick={() => setInput("I need to find a doctor for consultation")}
        >
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">Find Doctors</h3>
                <p className="text-sm text-gray-600">Get specialist recommendations</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-green-500"
          onClick={() => setInput("I have questions about general health and wellness")}
        >
          <CardContent className="p-4">
            <div className="flex items-center">
              <MessageSquare className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">Health Q&A</h3>
                <p className="text-sm text-gray-600">Ask general health questions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Chatbot;