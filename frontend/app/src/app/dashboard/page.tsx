'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { askQuestion, getHistory, HistoryItem } from '@/services/api';
import { useRouter } from 'next/navigation';

// Message type definition
type Message = {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
};

// TypewriterText component
const TypewriterText = ({ text, onComplete }: { text: string; onComplete: () => void }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 1); // Adjust typing speed here (milliseconds)

      return () => clearTimeout(timeout);
    } else {
      onComplete();
    }
  }, [currentIndex, text, onComplete]);

  return <div className="whitespace-pre-line">{displayText}</div>;
};

export default function Dashboard() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [questionInput, setQuestionInput] = useState('');
  const [contextInput, setContextInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showContext, setShowContext] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    async function loadHistory() {
      try {
        const historyData = await getHistory();
        setHistory(historyData.items);
      } catch (error) {
        console.error('Error loading history:', error);
      }
    }

    if (isAuthenticated) {
      loadHistory();
    }
  }, [isAuthenticated]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!questionInput.trim() || isSubmitting) {
      return;
    }
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: questionInput,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsSubmitting(true);
    setQuestionInput('');
    
    // Create placeholder for AI response
    const placeholderId = `ai-${Date.now()}`;
    setMessages(prev => [
      ...prev, 
      { 
        id: placeholderId, 
        type: 'ai', 
        content: '', 
        timestamp: new Date(),
        isTyping: true
      }
    ]);
    
    try {
      const result = await askQuestion({ 
        question: userMessage.content,
        context: contextInput.trim() || undefined
      });
      
      // Replace placeholder with actual response
      setMessages(prev => 
        prev.map(msg => 
          msg.id === placeholderId 
            ? { ...msg, content: result.answer, isTyping: true } 
            : msg
        )
      );
      
      // Refresh history
      const historyData = await getHistory();
      setHistory(historyData.items);
    } catch {
      // Handle error in UI
      setMessages(prev => 
        prev.map(msg => 
          msg.id === placeholderId 
            ? { ...msg, content: 'Sorry, I encountered an error while processing your request.', isTyping: true } 
            : msg
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setShowSidebar(false);
  };

  const loadChatFromHistory = (item: HistoryItem) => {
    setMessages([
      {
        id: `user-${item.id}`,
        type: 'user',
        content: item.question,
        timestamp: new Date(item.timestamp),
      },
      {
        id: `ai-${item.id}`,
        type: 'ai',
        content: item.answer,
        timestamp: new Date(item.timestamp),
      },
    ]);
    setShowSidebar(false);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#2d2d2d]">
        <div className="animate-pulse text-blue-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#2d2d2d] text-gray-200">
      {/* Mobile sidebar toggle */}
      <button 
        onClick={() => setShowSidebar(!showSidebar)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-gray-700 text-gray-200 shadow-md"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      {/* Sidebar */}
      <div className={`fixed lg:static top-0 left-0 h-full bg-[#1e1e1e] w-64 shadow-lg z-40 transform ${showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} transition-transform duration-300 ease-in-out flex flex-col`}>
        <div className="p-4 border-b border-gray-700 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">Q&A</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-100">Q&A Assistant</h1>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          <button 
            onClick={startNewChat}
            className="w-full mb-4 flex items-center gap-2 p-2 border border-gray-700 rounded-md hover:bg-gray-800 transition-colors text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            New Chat
          </button>
          
          <h2 className="text-sm font-medium text-gray-400 mb-2">Recent Activity</h2>
          <div className="space-y-2">
            {history.length === 0 ? (
              <p className="text-sm text-gray-500">No recent activity</p>
            ) : (
              history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => loadChatFromHistory(item)}
                  className="w-full text-left p-2 rounded-md hover:bg-gray-800 transition-colors flex flex-col text-gray-300"
                >
                  <span className="text-sm font-medium truncate">{item.question}</span>
                  <span className="text-xs text-gray-500">{new Date(item.timestamp).toLocaleString()}</span>
                </button>
              ))
            )}
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">{user?.username}</span>
            <button
              onClick={logout}
              className="text-sm text-gray-400 hover:text-gray-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Chat container */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-auto p-4 lg:p-8"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-blue-900/50 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4dabf7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2 text-gray-100">How can I help you today?</h2>
              <p className="text-gray-400 max-w-md">
                Ask me anything about your data or any general knowledge questions.
              </p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`
                      max-w-[80%] rounded-2xl px-4 py-3 
                      ${message.type === 'user' 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-gray-700 text-gray-100 rounded-bl-none'
                      }
                    `}
                  >
                    {message.type === 'ai' && message.content === '' ? (
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                      </div>
                    ) : message.type === 'ai' && message.isTyping ? (
                      <TypewriterText 
                        text={message.content} 
                        onComplete={() => {
                          setMessages(prev =>
                            prev.map(msg =>
                              msg.id === message.id
                                ? { ...msg, isTyping: false }
                                : msg
                            )
                          );
                        }}
                      />
                    ) : (
                      <div className="whitespace-pre-line">{message.content}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Input area */}
        <div className="border-t border-gray-700 bg-[#1e1e1e] p-4">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-4">
            {/* Context toggle button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowContext(!showContext)}
                className="text-sm text-gray-400 hover:text-gray-200 flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transform transition-transform ${showContext ? 'rotate-180' : ''}`}
                >
                  <path d="M18 15l-6-6-6 6"/>
                </svg>
                {showContext ? 'Hide Context' : 'Add Context'}
              </button>
            </div>

            {/* Context input */}
            {showContext && (
              <div className="relative rounded-lg border border-gray-600 overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
                <textarea
                  value={contextInput}
                  onChange={(e) => setContextInput(e.target.value)}
                  placeholder="Add context for your question (optional)..."
                  className="w-full px-4 py-3 bg-gray-800 text-gray-200 focus:outline-none placeholder-gray-500 resize-y min-h-[100px]"
                  disabled={isSubmitting}
                />
              </div>
            )}

            {/* Question input */}
            <div className="relative rounded-full border border-gray-600 overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
              <input
                type="text"
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                placeholder="Ask a question..."
                className="w-full py-3 pl-5 pr-16 bg-gray-800 text-gray-200 focus:outline-none placeholder-gray-500"
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={!questionInput.trim() || isSubmitting}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-400 p-2 rounded-full hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
