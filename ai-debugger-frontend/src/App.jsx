import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { AiOutlineArrowRight, AiOutlineCode } from 'react-icons/ai';
import HistoryList from './HistoryList';
import AutoSizingTextarea from './AutoSizingTextarea';
import './App.css';

const parseGeminiResponse = (response) => {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  let lastIndex = 0;
  const parts = [];
  let match;

  while ((match = codeBlockRegex.exec(response)) !== null) {
    const textPart = response.substring(lastIndex, match.index).trim();
    if (textPart) {
      parts.push({ type: 'text', content: textPart });
    }
    const lang = match[1] || 'plaintext';
    parts.push({ type: 'code', lang: lang, content: match[2] });
    lastIndex = codeBlockRegex.lastIndex;
  }

  const finaltextPart = response.substring(lastIndex).trim();
  if (finaltextPart) {
    parts.push({ type: 'text', content: finaltextPart });
  }

  return parts;
};

function App() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('java');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [selectedHistory, setSelectedHistory] = useState(null);

  const analyzeCode = async () => {
    setLoading(true);
    setResponse('');
    setSelectedHistory(null);
    setError(null);

    try {
      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, language }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.text();
      setResponse(data);
    } catch (e) {
      setError('Failed to fetch from backend. Check if the backend is running.');
      console.error('Error:', e);
    } finally {
      setLoading(false);
      setCode(''); // <-- This line clears the textarea
    }
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleHistorySelect = (historyItem) => {
    setSelectedHistory(historyItem);
    setResponse('');
  };
  
  const handleNewAnalysis = () => {
    setSelectedHistory(null);
    setResponse('');
    setCode('');
    setLanguage('java');
  };

  const currentViewResponse = selectedHistory ? selectedHistory.aiResponse : response;
  const currentViewLanguage = selectedHistory ? selectedHistory.language : language;
  const currentViewCode = selectedHistory ? selectedHistory.code : code;

  const renderers = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '')
      return !inline && match ? (
        <SyntaxHighlighter
          style={dark}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      )
    },
    p(props) {
      return <p {...props} />;
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar with the HistoryList component */}
      <div className={`history-sidebar ${!isSidebarVisible ? 'hidden' : ''}`}>
        <button className="new-chat-btn" onClick={handleNewAnalysis}>+ New Analysis</button>
        <h2>History</h2>
        <HistoryList onHistorySelect={handleHistorySelect} />
      </div>

      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        className={`sidebar-toggle-btn ${!isSidebarVisible ? 'hidden' : ''}`}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Main content area */}
      <div className="main-content">
        <div className="main-content-area">
          {selectedHistory || response ? (
            <>
              <div className="conversation-message user">
                <div className="message-part">
                  <h4>Your Code:</h4>
                  <SyntaxHighlighter language={currentViewLanguage} style={dark}>
                    {currentViewCode}
                  </SyntaxHighlighter>
                </div>
              </div>
              <div className="conversation-message ai">
                <div className="message-part">
                  <h4>AI Response:</h4>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={renderers}
                  >
                    {currentViewResponse}
                  </ReactMarkdown>
                </div>
              </div>
            </>
          ) : (
            <>
              <header className="main-content-header">
                <h1>AI-Powered Code Debugger</h1>
                <p>Your AI coding assistant.</p>
              </header>
              <p className="loading-message">
                {loading ? 'Analyzing...' : ''}
              </p>
              {error && <div className="error-message">{error}</div>}
            </>
          )}
        </div>

        <div className="input-form-container">
          <div className="input-wrapper">
            <AutoSizingTextarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              rows={1}
            />
            <div className="input-actions">
              <div className="language-input-group">
                <AiOutlineCode />
                <label htmlFor="language">Language</label>
                <input
                  id="language"
                  type="text"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                />
              </div>
              <button onClick={analyzeCode} disabled={loading} className="analyze-button">
                <span>Analyze Code</span>
                <AiOutlineArrowRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;