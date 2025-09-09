import { useState, useRef, useEffect } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userMessage = { role: "user", text: query.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setQuery("");
    setIsLoading(true);

    try {
      const response = await fetch("https://bb4f34abac5c.ngrok-free.app/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: query.trim() }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      const botMessage = { role: "bot", text: data.answer };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const errorMessage = { 
        role: "bot", 
        text: "Désolé, je ne peux pas répondre pour le moment. Veuillez réessayer." 
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendQuickMessage = (message) => {
    setQuery(message);
    const event = { preventDefault: () => {} };
    setTimeout(() => handleSubmit(event), 100);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // ✅ Styles
  const containerStyle = {
    height: '100vh',
    overflow: 'hidden', // يمنع scroll كامل للصفحة
    background: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  };

  const chatContainerStyle = {
    width: '100%',
    maxWidth: '4000px', // واجهة عريضة
    height: '90vh',     // واجهة تاخذ الطول المناسب
    background: 'white',
    borderRadius: '15px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  };

  const messagesStyle = {
    flex: 1,           // ياخذ المساحة الباقية
    overflowY: 'auto', // scroll غير فالرسائل
    padding: '25px',
    background: '#f8fafc'
  };

  const headerStyle = {
    background: 'linear-gradient(135deg, #1446bcff, #6d83e4ff)',
    padding: '2px',
    color: 'white',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden'
  };

  const avatarStyle = {
    width: '50px',
    height: '50px',
    background: 'linear-gradient(45deg, #4facfe, #00f2fe)',
    borderRadius: '50%',
    margin: '0 auto 15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
    animation: 'bounce 2s infinite'
  };

  const titleStyle = {
    fontSize: '25px',
    fontWeight: 'bold',
    marginBottom: '2px'
  };

  const statusStyle = {
    fontSize: '14px',
    opacity: 0.9,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  };

  const statusDotStyle = {
    width: '8px',
    height: '8px',
    background: '#4ade80',
    borderRadius: '50%',
    animation: 'blink 1.5s infinite'
  };

  const welcomeStyle = {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#64748b'
  };

  const quickActionsStyle = {
    display: 'flex',
    gap: '8px',
    marginTop: '20px',
    flexWrap: 'wrap',
    justifyContent: 'center'
  };

  const quickActionStyle = {
    background: 'rgba(102, 126, 234, 0.1)',
    border: '1px solid rgba(102, 126, 234, 0.3)',
    color: '#667eea',
    padding: '8px 15px',
    borderRadius: '20px',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontWeight: '500'
  };

  const messageStyle = (isUser) => ({
    marginBottom: '20px',
    textAlign: isUser ? 'right' : 'left',
    animation: 'slideIn 0.5s ease-out'
  });

  const messageBubbleStyle = (isUser) => ({
    display: 'inline-block',
    maxWidth: '75%',
    padding: '12px 18px',
    borderRadius: '18px',
    fontSize: '14px',
    lineHeight: '1.5',
    background: isUser 
      ? 'linear-gradient(135deg, #4c61d7ff, #608dc5ff)' 
      : 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    borderBottomLeftRadius: isUser ? '18px' : '6px',
    borderBottomRightRadius: isUser ? '6px' : '18px'
  });

  const timeStyle = (isUser) => ({
    fontSize: '11px',
    opacity: 0.7,
    marginTop: '5px',
    color: '#64748b',
    textAlign: isUser ? 'right' : 'left'
  });

  const typingStyle = {
    marginBottom: '20px',
    animation: 'slideIn 0.5s ease-out'
  };

  const typingBubbleStyle = {
    background: '#e2e8f0',
    padding: '12px 18px',
    borderRadius: '18px',
    borderBottomLeftRadius: '6px',
    display: 'inline-block'
  };

  const typingDotsStyle = {
    display: 'flex',
    gap: '4px',
    alignItems: 'center'
  };

  const typingDotStyle = (delay) => ({
    width: '8px',
    height: '8px',
    background: '#94a3b8',
    borderRadius: '50%',
    animation: `typingDots 1.4s infinite ${delay}s`
  });

  const inputContainerStyle = {
    padding: '25px',
    background: 'white'
  };

  const inputWrapperStyle = {
    display: 'flex',
    alignItems: 'center',
    background: '#f1f5f9',
    borderRadius: '25px',
    padding: '5px',
    transition: 'all 0.3s ease'
  };

  const inputStyle = {
    flex: '1',
    border: 'none',
    outline: 'none',
    padding: '12px 16px',
    fontSize: '14px',
    background: 'transparent',
    borderRadius: '20px'
  };

  const sendButtonStyle = {
    width: '40px',
    height: '40px',
    border: 'none',
    background: !query.trim() || isLoading 
      ? '#e2e8f0' 
      : 'linear-gradient(135deg, #3d54e9ff, #646ee1ff)',
    color: 'white',
    borderRadius: '50%',
    cursor: !query.trim() || isLoading ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    transform: 'scale(1)'
  };

  return (
    <>
      <style>
        {`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
          }
          
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0.3; }
          }
          
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes typingDots {
            0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
            30% { transform: translateY(-8px); opacity: 1; }
          }
          
          .chat-container:hover {
            box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
          }
          
          .quick-action:hover {
            background: rgba(102, 126, 234, 0.2);
            transform: translateY(-2px);
          }
          
          .send-button:hover:not(:disabled) {
            transform: scale(1.1);
            box-shadow: 0 5px 15px rgba(14, 101, 200, 0.4);
          }
          
          .input-wrapper:focus-within {
            background: white;
            box-shadow: 0 0 0 2px rgba(29, 83, 176, 0.3);
          }
        `}
      </style>

      <div style={containerStyle}>
        <div style={chatContainerStyle} className="chat-container">
          {/* Header */}
          <div style={headerStyle}>
            <div style={avatarStyle}>🤖</div>
            <h1 style={titleStyle}>Assistant B2Scala</h1>
            <div style={statusStyle}>
              <span style={statusDotStyle}></span>
              En ligne - Prêt à vous aider
            </div>
          </div>

          {/* Messages */}
          <div style={messagesStyle}>
            {messages.length === 0 && (
              <div style={welcomeStyle}>
                <div style={{fontSize: '48px', marginBottom: '15px'}}>💬</div>
                <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '10px'}}>
                  Bienvenue !
                </h3>
                <p style={{marginBottom: '20px', lineHeight: '1.5'}}>
                  Je suis votre assistant IA B2Scala. Comment puis-je vous aider aujourd'hui ?
                </p>
                
                <div style={quickActionsStyle}>
                  <div 
                    style={quickActionStyle}
                    className="quick-action"
                    onClick={() => sendQuickMessage('Bonjour !')}
                  >
                    👋 Dire bonjour
                  </div>
                  <div 
                    style={quickActionStyle}
                    className="quick-action"
                    onClick={() => sendQuickMessage('Comment ça va ?')}
                  >
                    😊 Comment ça va ?
                  </div>
                  <div 
                    style={quickActionStyle}
                    className="quick-action"
                    onClick={() => sendQuickMessage('Aide-moi avec B2Scala')}
                  >
                    ❓ Aide B2Scala
                  </div>
                </div>
              </div>
            )}

            {messages.map((msg, index) => (
              <div key={index} style={messageStyle(msg.role === 'user')}>
                <div style={messageBubbleStyle(msg.role === 'user')}>
                  {msg.text}
                </div>
                <div style={timeStyle(msg.role === 'user')}>
                  {new Date().toLocaleTimeString('fr-FR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            ))}

            {isLoading && (
              <div style={typingStyle}>
                <div style={typingBubbleStyle}>
                  <div style={typingDotsStyle}>
                    <div style={typingDotStyle(0)}></div>
                    <div style={typingDotStyle(0.2)}></div>
                    <div style={typingDotStyle(0.4)}></div>
                    <span style={{marginLeft: '10px', color: '#64748b', fontSize: '13px'}}>
                      En train de réfléchir...
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={inputContainerStyle}>
            <div style={inputWrapperStyle} className="input-wrapper">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                placeholder="Tapez votre message..."
                disabled={isLoading}
                style={inputStyle}
              />
              
              <button
                onClick={handleSubmit}
                disabled={!query.trim() || isLoading}
                style={sendButtonStyle}
                className="send-button"
              >
                {isLoading ? (
                  <div style={{
                     width: '16px',
                    height: '16px',
                    border: '2px solid #ccc',
                    borderTop: '2px solid #667eea',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                ) : (
                  '➤'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </>
  );
}
