import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    MessageSquare, Plus, Send, Paperclip,
    Trash2, Menu, X, Bot, User, Loader2
} from 'lucide-react';
import './AI.css';

const AI = () => {
    const { currentUser } = useAuth();
    const [chats, setChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [model, setModel] = useState('gpt-4');
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
    const [selectedFile, setSelectedFile] = useState(null);

    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);

    // Auto-scroll to bottom when messages change
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    // Fetch user chats on mount
    useEffect(() => {
        if (currentUser) {
            fetchChats();
        }
    }, [currentUser]);

    const getAuthHeaders = async () => {
        if (!currentUser) return {};
        const token = await currentUser.getIdToken();
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    };

    const fetchChats = async () => {
        try {
            const headers = await getAuthHeaders();
            const res = await fetch('http://localhost:5000/api/ai/chats', { headers });
            if (res.ok) {
                const data = await res.json();
                setChats(data);
                // If there are chats, auto-select the most recent one
                if (data.length > 0 && !currentChat) {
                    selectChat(data[0]);
                }
            }
        } catch (error) {
            console.error("Chats fetch xatolik:", error);
        }
    };

    const selectChat = async (chat) => {
        setCurrentChat(chat);
        setModel(chat.model);
        if (window.innerWidth <= 768) setIsSidebarOpen(false); // close sidebar on mobile

        try {
            const headers = await getAuthHeaders();
            const res = await fetch(`http://localhost:5000/api/ai/chats/${chat.id}`, { headers });
            if (res.ok) {
                const data = await res.json();
                setMessages(data.messages || []);
            }
        } catch (error) {
            console.error("Messages fetch xatolik:", error);
        }
    };

    const createNewChat = async () => {
        try {
            const headers = await getAuthHeaders();
            const res = await fetch('http://localhost:5000/api/ai/chats', {
                method: 'POST',
                headers,
                body: JSON.stringify({ model })
            });
            if (res.ok) {
                const newChat = await res.json();
                setChats([newChat, ...chats]);
                setCurrentChat(newChat);
                setMessages([]);
                if (window.innerWidth <= 768) setIsSidebarOpen(false);
            }
        } catch (error) {
            console.error("Yangi chat yaratishda xatolik:", error);
        }
    };

    const deleteChat = async (e, chatId) => {
        e.stopPropagation(); // prevent selectChat running
        if (!window.confirm("Bu chatni o'chirmoqchimisiz?")) return;

        try {
            const headers = await getAuthHeaders();
            const res = await fetch(`http://localhost:5000/api/ai/chats/${chatId}`, {
                method: 'DELETE',
                headers
            });
            if (res.ok) {
                setChats(chats.filter(c => c.id !== chatId));
                if (currentChat?.id === chatId) {
                    setCurrentChat(null);
                    setMessages([]);
                }
            }
        } catch (error) {
            console.error("Chat o'chirishda xatolik:", error);
        }
    };

    const handleSend = async (e) => {
        e?.preventDefault();
        console.log("handleSend START", { input, isLoading, currentChat });
        if (!input.trim() || isLoading) return;

        // If no active chat, create one instantly first
        let activeChat = currentChat;
        if (!activeChat) {
            console.log("No active chat, creating one...");
            try {
                const headers = await getAuthHeaders();
                const res = await fetch('http://localhost:5000/api/ai/chats', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({ model })
                });
                if (res.ok) {
                    activeChat = await res.json();
                    console.log("Created active chat:", activeChat);
                    setChats([activeChat, ...chats]);
                    setCurrentChat(activeChat);
                } else {
                    console.error("Failed to create active chat via early return");
                    return; // Stop if failed
                }
            } catch (err) {
                console.error("Failed to create init chat", err);
                return;
            }
        }

        const messageText = input;
        setInput('');

        console.log("Pre-optimistic UI");
        // Optimistic UI updates
        const tempUserMessage = { id: Date.now().toString(), role: 'user', content: messageText };
        setMessages(prev => [...prev, tempUserMessage]);
        setIsLoading(true);

        console.log("Pre-textarea height reset");
        // Reset textarea height
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }

        console.log("Fetching /messages...", { activeChatId: activeChat.id });
        try {
            const headers = await getAuthHeaders();
            console.log("Got headers for /messages");
            const res = await fetch(`http://localhost:5000/api/ai/chats/${activeChat.id}/messages`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ content: messageText })
            });
            console.log("Fetch /messages returned:", res.status);

            if (res.ok) {
                const data = await res.json();
                console.log("Got /messages json:", data);
                // Replace optimistic user message with actual, and append AI response
                setMessages(prev => [
                    ...prev.filter(m => m.id !== tempUserMessage.id),
                    data.userMessage,
                    data.aiMessage
                ]);
            }
        } catch (error) {
            console.error("Xabar jo'natishda xatolik:", error);
            // Optionally remove optimistic message or show error state
        } finally {
            console.log("Finally block hit");
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
    }, [input]);

    if (!currentUser) {
        return (
            <div className="container py-20 text-center flex flex-col items-center justify-center min-h-[50vh]">
                <Bot size={64} className="text-purple-500 mb-6" />
                <h1 className="text-3xl font-bold mb-4">AI Yordamchi</h1>
                <p className="text-[var(--text-secondary)] mb-6">Ushbu bo'limdan foydalanish uchun tizimga kiring.</p>
                <button
                    onClick={() => window.location.href = '/login'}
                    className="btn btn-primary"
                >
                    Tizimga Kirish
                </button>
            </div>
        );
    }

    return (
        <div className="ai-container">
            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`ai-sidebar ${isSidebarOpen ? 'open' : 'closed'} z-30 md:relative absolute`}>
                <div className="ai-sidebar-header">
                    <button onClick={createNewChat} className="new-chat-btn">
                        <Plus size={20} /> Yangi Chat
                    </button>
                    <button
                        className="md:hidden text-[var(--text-secondary)] p-2 hover:bg-gray-800 rounded-lg ml-2"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="chat-history-list">
                    {chats.length === 0 ? (
                        <p className="text-center text-[var(--text-muted)] text-sm py-4">
                            Hozircha chatlar yo'q
                        </p>
                    ) : (
                        chats.map(chat => (
                            <div
                                key={chat.id}
                                onClick={() => selectChat(chat)}
                                className={`chat-history-item ${currentChat?.id === chat.id ? 'active' : ''}`}
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <MessageSquare size={16} />
                                    <span>{chat.title}</span>
                                </div>
                                <button
                                    onClick={(e) => deleteChat(e, chat.id)}
                                    className="delete-chat-btn"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="ai-main">
                <div className="ai-header">
                    <button
                        className="menu-toggle-btn"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        title="Sidebar menyu"
                    >
                        <Menu size={24} />
                    </button>

                    <div className="flex-1 flex justify-center md:justify-start md:ml-4">
                        <select
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className="model-selector"
                            disabled={messages.length > 0} // lock model after conversation starts
                        >
                            <option value="gpt-4">ChatGPT (GPT-4)</option>
                            <option value="claude-3">Claude 3 (Opus)</option>
                            <option value="gemini-pro">Google Gemini Pro</option>
                        </select>
                    </div>
                </div>

                <div className={`ai-main-content ${messages.length === 0 ? 'empty-layout' : ''}`}>
                    <div className="chat-messages">
                        {!currentChat && messages.length === 0 ? (
                            <div className="ai-empty-state">
                                <div className="ai-empty-icon">
                                    <Bot size={40} />
                                </div>
                                <h2 className="text-2xl font-bold mb-2">Qanday yordam bera olaman?</h2>
                                <p>O'zingizni qiziqtirgan dasturlash savollarini bering yoki rasm yuklang.</p>
                            </div>
                        ) : (
                            <>
                                {messages.map((msg, index) => (
                                    <div key={msg.id || index} className={`message-wrapper ${msg.role}`}>
                                        <div className="message-avatar">
                                            {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                                        </div>
                                        <div className="message-bubble whitespace-pre-wrap">
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="message-wrapper assistant">
                                        <div className="message-avatar">
                                            <Bot size={20} />
                                        </div>
                                        <div className="message-bubble flex items-center gap-2 text-[var(--text-muted)]">
                                            <Loader2 size={16} className="animate-spin" /> Yozmoqda...
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </>
                        )}
                    </div>

                    <div className="chat-input-container">
                        <div className="chat-input-wrapper">
                            {selectedFile && (
                                <div className="file-preview">
                                    <Paperclip size={14} className="text-[var(--primary-color)]" />
                                    <span className="truncate max-w-[150px]">{selectedFile.name}</span>
                                    <button className="file-preview-remove" onClick={() => setSelectedFile(null)}>
                                        <X size={14} />
                                    </button>
                                </div>
                            )}
                            <button className="file-btn" title="Fayl yoki Rasm yuklash" onClick={() => fileInputRef.current?.click()}>
                                <Paperclip size={20} />
                            </button>
                            <input
                                type="file"
                                className="hidden hidden-file-input"
                                style={{ display: 'none' }}
                                ref={fileInputRef}
                                onChange={(e) => setSelectedFile(e.target.files[0])}
                            />
                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={`${model} ga xabar yozing...`}
                                className="chat-textarea"
                                rows={1}
                            />
                            <button
                                className="send-btn"
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="ai-warning-text">
                        AI ba'zan noaniq ma'lumotlar berishi mumkin. Muhim qarorlar qabul qilishdan oldin tekshiring.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AI;
