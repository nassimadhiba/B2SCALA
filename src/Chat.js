import { useState, useRef, useEffect } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const currentQuery = query.trim();
    const userMessage = { role: "user", text: currentQuery };
    setMessages((prev) => [...prev, userMessage]);
    setQuery("");
    setIsLoading(true);

    try {
      const response = await fetch("https://409ab2550b9e.ngrok-free.app/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: currentQuery })
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

  const formatMessage = (text) => {
    const regex = /```(.*?)```/gs;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: "text", content: text.slice(lastIndex, match.index) });
      }
      parts.push({ type: "code", content: match[1] });
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push({ type: "text", content: text.slice(lastIndex) });
    }

    return parts.map((part, i) =>
      part.type === "code" ? (
        <pre key={i} style={{
          background: '#ffffffff',
          color: '#030b13ff',
          padding: '12px',
          borderRadius: '8px',
          overflowX: 'auto',
          fontFamily: 'monospace'
        }}>
          <code>{part.content}</code>
        </pre>
      ) : (
        <span key={i} style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
          {part.content}
        </span>
      )
    );
  };

  // 🎨 Styles modernisés
  const containerStyle = { 
    height: '100vh', 
    overflow: 'hidden', 
    background: '#fcfeffff', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: '0px', 
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' 
  };

  const chatContainerStyle = { 
    width: '100%', 
    maxWidth: '4000px', 
    height: '90vh', 
    background: '#ffffff', 
    borderRadius: '15px', 
    boxShadow: '0 8px 30px rgba(209, 192, 192, 0.12)', 
    border: '1px solid #d1d5db', 
    overflow: 'hidden', 
    display: 'flex', 
    flexDirection: 'column' 
  };

  const messagesStyle = { flex: 1, overflowY: 'auto', padding: '25px', background: '#e9f0ff' };

  const headerStyle = { background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', padding: '2px', color: 'white', textAlign: 'center', position: 'relative', overflow: 'hidden' };
  const avatarStyle = { width: '50px', height: '50px', background: 'linear-gradient(45deg, #2543d7ff, #3b82f6)', borderRadius: '50%', margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', animation: 'bounce 2s infinite' };
  const titleStyle = { fontSize: '15px', fontWeight: 'bold', marginBottom: '0px' };
  const statusStyle = { fontSize: '14px', opacity: 0.9, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' };
  const statusDotStyle = { width: '8px', height: '8px', background: '#4ade80', borderRadius: '50%', animation: 'blink 1.5s infinite' };
  const welcomeStyle = { textAlign: 'center', padding: '40px 20px', color: '#041123ff' };
  const quickActionsStyle = { display: 'flex', gap: '8px', marginTop: '20px', flexWrap: 'wrap', justifyContent: 'center' };
  const quickActionStyle = { background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#3b82f6', padding: '8px 15px', borderRadius: '20px', fontSize: '13px', cursor: 'pointer', transition: 'all 0.3s ease', fontWeight: '500' };
  const messageStyle = (isUser) => ({ marginBottom: '20px', textAlign: isUser ? 'right' : 'left', animation: 'slideIn 0.5s ease-out' });
  const messageBubbleStyle = (isUser) => ({
    display: 'inline-block',
    maxWidth: '75%',
    padding: '12px 18px',
    borderRadius: '18px',
    fontSize: '14px',
    lineHeight: '1.5',
    background: isUser ? 'linear-gradient(135deg, #113b95ff, #60a5fa)' : 'linear-gradient(135deg, #051e62ff, #36249dff)',
    color: 'white',
    borderBottomLeftRadius: isUser ? '18px' : '6px',
    borderBottomRightRadius: isUser ? '6px' : '18px'
  });

  const timeStyle = (isUser) => ({ fontSize: '11px', opacity: 0.7, marginTop: '5px', color: '#64748b', textAlign: isUser ? 'right' : 'left' });
  const typingStyle = { marginBottom: '20px', animation: 'slideIn 0.5s ease-out' };
  const typingBubbleStyle = { background: '#e0e7ff', padding: '12px 18px', borderRadius: '18px', borderBottomLeftRadius: '6px', display: 'inline-block' };
  const typingDotsStyle = { display: 'flex', gap: '4px', alignItems: 'center' };
  const typingDotStyle = (delay) => ({ width: '8px', height: '8px', background: '#1d1fadff', borderRadius: '50%', animation: `typingDots 1.4s infinite ${delay}s` });
  const inputContainerStyle = { padding: '25px', background: 'white' };
  const inputWrapperStyle = { display: 'flex', alignItems: 'center', background: '#dbeafe', borderRadius: '25px', padding: '5px', transition: 'all 0.3s ease' };
  const inputStyle = { flex: '1', border: 'none', outline: 'none', padding: '12px 16px', fontSize: '14px', background: 'transparent', borderRadius: '20px' };
  const sendButtonStyle = { width: '40px', height: '40px', border: 'none', background: !query.trim() || isLoading ? '#c7d2fe' : 'linear-gradient(135deg, #3b82f6, #60a5fa)', color: 'white', borderRadius: '50%', cursor: !query.trim() || isLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', transition: 'all 0.3s ease', transform: 'scale(1)' };

  return (
    <>
      <style>{`
        @keyframes bounce {0%, 20%, 50%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-10px); } 60% { transform: translateY(-5px); }}
        @keyframes blink {0%, 50% { opacity: 1; } 51%, 100% { opacity: 0.3; }}
        @keyframes slideIn {from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); }}
        @keyframes typingDots {0%, 60%, 100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-8px); opacity: 1; }}
        @keyframes spin {0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }}
      `}</style>

      <div style={containerStyle}>
        <div style={chatContainerStyle}>
          <div style={headerStyle}>
            <div style={avatarStyle}>🤖</div>
            <h1 style={titleStyle}>Assistant B2Scala</h1>
            <div style={statusStyle}>
              <span style={statusDotStyle}></span>
              En ligne - Prêt à vous aider
            </div>
          </div>

          <div style={messagesStyle}>
            {messages.length === 0 && (
              <div style={welcomeStyle}>
                <div style={{fontSize: '48px', marginBottom: '15px'}}>💬</div>
                <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '10px'}}>Bienvenue !</h3>
                <p style={{marginBottom: '20px', lineHeight: '1.5'}}>
                  Je suis votre assistant IA B2Scala. Comment puis-je vous aider aujourd'hui ?
                </p>
                <div style={quickActionsStyle}>
                  <div style={quickActionStyle} onClick={() => sendQuickMessage('Bonjour !')}>👋 Dire bonjour</div>
                  <div style={quickActionStyle} onClick={() => sendQuickMessage('Comment ça va ?')}>😊 Comment ça va ?</div>
                  <div style={quickActionStyle} onClick={() => sendQuickMessage('Aide-moi avec B2Scala')}>❓ Aide B2Scala</div>
                </div>
              </div>
            )}

            {messages.map((msg, index) => (
              <div key={index} style={messageStyle(msg.role === 'user')}>
                <div style={messageBubbleStyle(msg.role === 'user')}>
                  {msg.role === 'bot' ? formatMessage(msg.text) : msg.text}
                </div>
                <div style={timeStyle(msg.role === 'user')}>
                  {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
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
                    <span style={{marginLeft: '10px', color: '#64748b', fontSize: '13px'}}>En train de réfléchir...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div style={inputContainerStyle}>
            <div style={inputWrapperStyle}>
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
              >
                {isLoading ? (
                  <div style={{ width: '16px', height: '16px', border: '2px solid #ccc', borderTop: '2px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                ) : ('➤')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
