import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './CardListByCardLink.css';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;
const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default function CardListByCardLink() {
  const { cardLinkId } = useParams();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        console.log(cardLinkId);
        const res = await api.get(`/api/cards/card-link/${cardLinkId}`);
        setCards(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [cardLinkId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="cards-list-by-card-container">
      <h1>Cards for Card Link {cardLinkId}</h1>
      {cards.length > 0 ? (
        <div className="cards-list-by-card-grid">
          {cards.map(card => (
            <div key={card.id} className="card-list-by-card-item">
              <p><strong>Cardholder:</strong> {card.cardHolderName}</p>
              <p><strong>Card Number:</strong>{card.cardNumber}</p>
              <p><strong>Expires:</strong> {card.expirationDate}</p>
              <p><strong>IP:</strong> {card.cardHolderIp}</p> 
            </div>
            
          ))}
          
          
        </div>
        
      ) : (
        <p>No cards linked to this card link yet.</p>
      )}

      <div>
            <p>dsfdsfsdf</p>
          </div>
    </div>
  );
}
