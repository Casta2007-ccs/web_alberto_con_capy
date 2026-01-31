import React, { useState } from 'react';

/**
 * MessagesView Component
 * 
 * Simulated chat interface for communication with talents/agencies.
 * Features a list of chats and a simulated active conversation window.
 */
const MessagesView = ({ activeChatUser }) => {
    // State to manage the input text field
    const [inputText, setInputText] = useState('');

    // State for the list of messages in the active conversation
    const [messages, setMessages] = useState([
        { id: 1, text: "Hola Ana, vi la propuesta para la campaña de verano.", type: "received" },
        { id: 2, text: "Estoy disponible en esas fechas. ¿Cuándo sería el casting presencial?", type: "received" },
        { id: 3, text: "Hola Elena! Genial. Estamos organizando todo para el próximo martes en Santa Cruz.", type: "sent" }
    ]);

    /**
     * Handles sending a new message.
     * Simulation: Adds the message to the local state.
     */
    const handleSend = () => {
        if (!inputText.trim()) return;

        setMessages([...messages, {
            id: Date.now(),
            text: inputText,
            type: "sent"
        }]);
        setInputText('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <div id="view-messages" className="view-section active" style={{ display: 'block' }}>
            <header className="top-header">
                <div className="header-titles">
                    <h1>Mensajes</h1>
                    <p>Comunicaciones con agencias y talento</p>
                </div>
            </header>

            {/* Main Chat Layout Container */}
            <div className="chat-layout">
                {/* Conversations Sidebar List */}
                <div className="chat-list">
                    <div className="chat-item active">
                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" alt="User" />
                        <div className="chat-summ">
                            <h5>Elena R.</h5>
                            <p>{messages[messages.length - 1].text}</p>
                        </div>
                        <span className="chat-time">10:42</span>
                    </div>
                    <div className="chat-item">
                        <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100" alt="User" />
                        <div className="chat-summ">
                            <h5>Javier M.</h5>
                            <p>Gracias por la oportunidad.</p>
                        </div>
                        <span className="chat-time">Ayer</span>
                    </div>
                </div>

                {/* Active Chat Window */}
                <div className="chat-window">
                    <div className="chat-header-inner">
                        <h4>{activeChatUser || 'Elena R.'}</h4>
                        <span>En línea</span>
                    </div>

                    <div className="chat-messages">
                        {messages.map(msg => (
                            <div key={msg.id} className={`msg ${msg.type}`}>
                                <p>{msg.text}</p>
                            </div>
                        ))}
                    </div>

                    <div className="chat-input-area">
                        <input
                            type="text"
                            placeholder="Escribe un mensaje..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <button onClick={handleSend}><i className="fa-solid fa-paper-plane"></i></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessagesView;
