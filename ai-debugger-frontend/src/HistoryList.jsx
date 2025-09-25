import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const HistoryList = ({ onHistorySelect }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/history');
        if (!res.ok) {
          throw new Error('Failed to fetch history');
        }
        const data = await res.json();
        setHistory(data.reverse());
      } catch (e) {
        setError('Could not load history.');
        console.error('Error fetching history:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <div className="loading-message">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="history-container">
      {history.length === 0 ? (
        <p>No history found.</p>
      ) : (
        <div className="history-list">
          {history.map((item) => (
            <div
              key={item.id}
              className="history-item"
              onClick={() => onHistorySelect(item)}
            >
              <span className="history-icon">📜</span>
              <h4>{item.code.substring(0, 30)}...</h4>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryList;