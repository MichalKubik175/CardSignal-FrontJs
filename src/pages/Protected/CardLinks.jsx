// src/pages/CardLinks.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {getCardLinks} from '../../api/cardLinks';
import './CardLinks.css';

export default function CardLinks() {
  const [cardLinks, setCardLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCardLinks = async () => {
      try {
        console.log("Call API")
        const response = await getCardLinks();
        console.log(response)
        setCardLinks(response);
      } catch (err) {
        if (err.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('authToken');
          navigate('/login');
        } else {
          setError(err.response?.data?.message || 'Failed to fetch card links');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCardLinks();
  }, [navigate]);

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="card-links-container">
      <h1>My Card Links</h1>
      <div className="card-links-grid">
        {cardLinks && cardLinks.length > 0 ? (
          cardLinks.map((link) => (
            <div key={link.id} className="card-link-item">
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                <div className="card-link-image">
                  {link.imageUrl ? (
                    <img src={link.imageUrl} alt={link.title} />
                  ) : (
                    <div className="default-thumbnail">
                      {link.title.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="card-link-info">
                  <h3>{link.title}</h3>
                  <p>{link.description}</p>
                  <span className="card-link-url">{new URL(link.url).hostname}</span>
                </div>
              </a>
            </div>
          ))
        ) : (
          <p>You don't have any card links yet.</p>
        )}
      </div>
    </div>
  );
}