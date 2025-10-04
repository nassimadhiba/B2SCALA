import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Sparkles, Code, BookOpen, Zap } from "lucide-react";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
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
      const response = await fetch("https://b824edd095bd.ngrok-free.app/ask", {
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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const uploadMessage = { 
      role: "bot", 
      text: `📤 Téléchargement de "${file.name}" en cours...` 
    };
    setMessages((prev) => [...prev, uploadMessage]);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("https://b824edd095bd.ngrok-free.app/upload", {
        method: "POST",
        body: formData
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      
      if (data.status === "success") {
        const successMessage = { 
          role: "bot", 
          text: `✅ ${data.message}` 
        };
        setMessages((prev) => [...prev, successMessage]);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      const errorMessage = { 
        role: "bot", 
        text: `❌ Erreur lors du téléchargement: ${err.message}` 
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const sendQuickMessage = (message) => {
    setQuery(message);
    setTimeout(() => {
      const event = { preventDefault: () => {} };
      handleSubmit(event);
    }, 100);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const formatMessage = (text) => {
    const regex = /```[\s\S]*?```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: "text", content: text.slice(lastIndex, match.index) });
      }
      const codeContent = match[0].replace(/```(\w+)?\n?/, '').replace(/\n?```$/, '');
      parts.push({ type: "code", content: codeContent });
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push({ type: "text", content: text.slice(lastIndex) });
    }

    return parts.map((part, i) =>
      part.type === "code" ? (
        <pre key={i} style={{background: '#ffffff', color: '#1e293b', padding: '16px', borderRadius: '12px', overflowX: 'auto', margin: '16px 0', fontFamily: 'Consolas, Monaco, monospace', fontSize: '13px', border: '1px solid #e2e8f0', lineHeight: '1.5', maxWidth: '100%', textAlign: 'left'}}>
          <code style={{display: 'block', whiteSpace: 'pre', textAlign: 'left'}}>{part.content}</code>
        </pre>
      ) : (
        <span key={i} style={{whiteSpace: 'pre-wrap', lineHeight: '1.7', display: 'block'}}>
          {part.content}
        </span>
      )
    );
  };

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-8px); opacity: 1; }
        }
        .message-enter {
          animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>

      <div style={{height: '100vh', background: '#f8fafc'}}>
        <div style={{width: '100%', height: '100%', background: 'white', display: 'flex', flexDirection: 'column'}}>
          
          {/* En-tête */}
          <div style={{padding: '24px 32px', borderBottom: '1px solid #e2e8f0', background: 'white'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
              <div style={{width: '44px', height: '44px', background: '#1e293b', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
                <Sparkles style={{width: '24px', height: '24px', color: 'white'}} />
              </div>
              <div>
                <h1 style={{fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: 0}}>B2Scala</h1>
                <p style={{fontSize: '12px', color: '#64748b', margin: 0}}>Assistant IA</p>
              </div>
            </div>
          </div>

          {/* Zone de messages */}
          <div style={{flex: 1, overflowY: 'auto', padding: '24px 32px', background: '#f8fafc'}}>
            {messages.length === 0 && (
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '48px', textAlign: 'center'}}>
                <div style={{width: '80px', height: '80px', background: '#1e293b', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
                  <Sparkles style={{width: '40px', height: '40px', color: 'white'}} />
                </div>
                <h2 style={{fontSize: '24px', fontWeight: '600', color: '#1e293b', marginBottom: '8px'}}>
                  Bonjour !
                </h2>
                <p style={{color: '#475569', marginBottom: '32px', maxWidth: '500px', fontSize: '14px'}}>
                  Comment puis-je vous aider aujourd'hui ?
                </p>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', width: '100%', maxWidth: '600px'}}>
                  {[
                    { icon: Zap, text: "C'est quoi B2Scala ?" },
                    { icon: Code, text: "Exemples de code" },
                    { icon: Sparkles, text: "Démarrer un projet" },
                    { icon: BookOpen, text: "Documentation" }
                  ].map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendQuickMessage(action.text)}
                      style={{background: 'white', border: '1px solid #e2e8f0', padding: '12px 16px', borderRadius: '12px', fontWeight: '500', fontSize: '14px', color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', transition: 'all 0.2s'}}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f8fafc';
                        e.currentTarget.style.borderColor = '#cbd5e1';
                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'white';
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <action.icon style={{width: '16px', height: '16px'}} />
                      {action.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, index) => (
              <div key={index} className="message-enter" style={{display: 'flex', marginBottom: '16px', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'}}>
                <div style={{maxWidth: '75%'}}>
                  <div style={{padding: '12px 20px', borderRadius: '16px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', fontSize: '14px', lineHeight: '1.6', ...(msg.role === 'user' ? {background: '#1e293b', color: 'white', borderBottomRightRadius: '4px'} : {background: 'white', color: '#1e293b', border: '1px solid #e2e8f0', borderBottomLeftRadius: '4px'})}}>
                    <div>
                      {msg.role === 'bot' ? formatMessage(msg.text) : msg.text}
                    </div>
                  </div>
                  <div style={{fontSize: '11px', color: '#94a3b8', marginTop: '6px', padding: '0 8px', textAlign: msg.role === 'user' ? 'right' : 'left'}}>
                    {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="message-enter" style={{display: 'flex', justifyContent: 'flex-start', marginBottom: '16px'}}>
                <div style={{background: 'white', padding: '12px 20px', borderRadius: '16px', borderBottomLeftRadius: '4px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <div style={{display: 'flex', gap: '4px'}}>
                      {[0, 1, 2].map(i => (
                        <div
                          key={i}
                          style={{width: '8px', height: '8px', background: '#94a3b8', borderRadius: '50%', animation: 'typing 1.4s infinite', animationDelay: `${i * 0.2}s`}}
                        ></div>
                      ))}
                    </div>
                    <span style={{color: '#64748b', fontSize: '14px'}}>Réflexion...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Zone de saisie */}
          <div style={{padding: '24px 32px', background: 'white', borderTop: '1px solid #e2e8f0'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', borderRadius: '16px', padding: '6px', border: '1px solid #e2e8f0'}}>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                placeholder="Votre message..."
                disabled={isLoading}
                style={{flex: 1, background: 'transparent', border: 'none', outline: 'none', padding: '10px 16px', color: '#1e293b', fontSize: '14px'}}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.scala,.py,.java,.js,.txt"
                onChange={handleFileUpload}
                style={{display: 'none'}}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                style={{width: '40px', height: '40px', borderRadius: '12px', border: isUploading ? 'none' : '1px solid #cbd5e1', background: isUploading ? '#e2e8f0' : 'white', cursor: isUploading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'}}
                title="Télécharger un fichier"
              >
                {isUploading ? (
                  <div style={{width: '16px', height: '16px', border: '2px solid #cbd5e1', borderTopColor: '#475569', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div>
                ) : (
                  <Paperclip style={{width: '16px', height: '16px', color: '#475569'}} />
                )}
              </button>
              <button
                onClick={handleSubmit}
                disabled={!query.trim() || isLoading}
                style={{width: '40px', height: '40px', borderRadius: '12px', border: 'none', background: (!query.trim() || isLoading) ? '#e2e8f0' : '#1e293b', cursor: (!query.trim() || isLoading) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'}}
              >
                {isLoading ? (
                  <div style={{width: '16px', height: '16px', border: '2px solid #cbd5e1', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div>
                ) : (
                  <Send style={{width: '16px', height: '16px', color: 'white'}} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}