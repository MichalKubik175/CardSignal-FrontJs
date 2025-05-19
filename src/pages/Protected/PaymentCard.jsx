import { useState, useEffect, useRef } from 'react';
import IMask from 'imask';
import './PaymentCard.css';

export default function PaymentCard() {
  const [cardData, setCardData] = useState({
    name: '',
    number: '',
    expiry: '',
    securityCode: '',
    cardType: null
  });

  const [isFlipped, setIsFlipped] = useState(false);
  const cardNumberRef = useRef(null);
  const expiryRef = useRef(null);
  const securityCodeRef = useRef(null);
  const ccIconRef = useRef(null);
  const ccSingleRef = useRef(null);

  // Card type SVGs (simplified versions)
  const cardIcons = {
    'american express': '<svg>...amex svg...</svg>',
    'visa': '<svg>...visa svg...</svg>',
    'diners': '<svg>...diners svg...</svg>',
    'discover': '<svg>...discover svg...</svg>',
    'jcb': '<svg>...jcb svg...</svg>',
    'maestro': '<svg>...maestro svg...</svg>',
    'mastercard': '<svg>...mastercard svg...</svg>',
    'unionpay': '<svg>...unionpay svg...</svg>'
  };

  const cardSingleIcons = {
    'american express': '<svg>...amex single svg...</svg>',
    'visa': '<svg>...visa single svg...</svg>',
    // ... other single icons
  };

  const testCards = [
    '4000056655665556',
    '5200828282828210',
    '371449635398431',
    '6011000990139424',
    '30569309025904',
    '3566002020360505',
    '6200000000000005',
    '6759649826438453',
  ];

  useEffect(() => {
    // Initialize IMask for card number
    const cardNumberMask = IMask(cardNumberRef.current, {
      mask: [
        {
          mask: '0000 000000 00000',
          regex: '^3[47]\\d{0,13}',
          cardtype: 'american express'
        },
        {
          mask: '0000 0000 0000 0000',
          regex: '^(?:6011|65\\d{0,2}|64[4-9]\\d?)\\d{0,12}',
          cardtype: 'discover'
        },
        // ... other card type masks
        {
          mask: '0000 0000 0000 0000',
          cardtype: 'Unknown'
        }
      ],
      dispatch: function (appended, dynamicMasked) {
        const number = (dynamicMasked.value + appended).replace(/\D/g, '');
        for (let i = 0; i < dynamicMasked.compiledMasks.length; i++) {
          let re = new RegExp(dynamicMasked.compiledMasks[i].regex);
          if (number.match(re) != null) {
            return dynamicMasked.compiledMasks[i];
          }
        }
      }
    });

    // Initialize IMask for expiry date
    const expiryMask = IMask(expiryRef.current, {
      mask: 'MM{/}YY',
      blocks: {

MM: {

mask: IMask.MaskedRange,

from: 1,

to: 12

},

YY: {

mask: IMask.MaskedRange,

from: 0,

to: 99

}

}
    });

    // Initialize IMask for security code
    const securityCodeMask = IMask(securityCodeRef.current, {
      mask: '0000'
    });

    // Handle card type changes
    cardNumberMask.on('accept', () => {
      const cardType = cardNumberMask.masked?.currentMask?.cardtype;
      setCardData(prev => ({
        ...prev,
        number: cardNumberMask.value,
        cardType
      }));

      // Update card icon
      if (cardType && cardIcons[cardType]) {
        if (ccIconRef.current) ccIconRef.current.innerHTML = cardIcons[cardType];
        if (ccSingleRef.current) ccSingleRef.current.innerHTML = cardSingleIcons[cardType] || '';
      } else {
        if (ccIconRef.current) ccIconRef.current.innerHTML = '';
        if (ccSingleRef.current) ccSingleRef.current.innerHTML = '';
      }

      // Update color based on card type
      updateCardColor(cardType);
    });

    expiryMask.on('accept', () => {
      setCardData(prev => ({ ...prev, expiry: expiryMask.value }));
    });

    securityCodeMask.on('accept', () => {
      setCardData(prev => ({ ...prev, securityCode: securityCodeMask.value }));
    });

    return () => {
      cardNumberMask.destroy();
      expiryMask.destroy();
      securityCodeMask.destroy();
    };
  }, []);

  const updateCardColor = (cardType) => {
    let colorClass = 'grey';
    switch (cardType) {
      case 'american express': colorClass = 'green'; break;
      case 'visa': colorClass = 'lime'; break;
      case 'diners': colorClass = 'orange'; break;
      case 'discover': colorClass = 'purple'; break;
      case 'jcb': case 'jcb15': colorClass = 'red'; break;
      case 'maestro': colorClass = 'yellow'; break;
      case 'mastercard': colorClass = 'lightblue'; break;
      case 'unionpay': colorClass = 'cyan'; break;
      default: colorClass = 'grey';
    }

    // Update color classes - you'll need to implement this in your CSS
    // This would involve adding/removing the appropriate color classes
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setCardData(prev => ({
      ...prev,
      name: value || 'YOUR NAME'
    }));
  };

  const generateRandomCard = () => {
    const randomNumber = Math.floor(Math.random() * testCards.length);
    setCardData(prev => ({
      ...prev,
      number: testCards[randomNumber],
      expiry: `${Math.floor(Math.random() * 12 + 1).toString().padStart(2, '0')}/${Math.floor(Math.random() * 10 + 24)}`,
      securityCode: Math.floor(Math.random() * 900 + 100).toString()
    }));
  };

  const formatCardNumber = (number) => {
    if (!number) return '0123 4567 8910 1112';
    return number.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="payment-container">
      <div className="payment-title">
        <h1>Ověření pro výběr</h1>
      </div>
      
      <div className="container">
        <div className={`creditcard ${isFlipped ? 'flipped' : ''}`} onClick={toggleFlip}>
          <div className="front">
            <div id="ccsingle" ref={ccSingleRef}></div>
            <svg version="1.1" id="cardfront" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                x="0px" y="0px" viewBox="0 0 750 471" style={{enableBackground: 'new 0 0 750 471'}} xmlSpace="preserve">
              {/* Front SVG content */}
              <text transform="matrix(1 0 0 1 60.106 295.0121)" id="svgnumber" className="st2 st3 st4">
                {formatCardNumber(cardData.number)}
              </text>
              <text transform="matrix(1 0 0 1 54.1064 428.1723)" id="svgname" className="st2 st5 st6">
                {cardData.name.toUpperCase()}
              </text>
              <text transform="matrix(1 0 0 1 574.4219 433.8095)" id="svgexpire" className="st2 st5 st9">
                {cardData.expiry || 'MM/YY'}
              </text>
              {/* Rest of the front SVG */}
            </svg>
          </div>
          
          <div className="back">
            <svg version="1.1" id="cardback" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                x="0px" y="0px" viewBox="0 0 750 471" style={{enableBackground: 'new 0 0 750 471'}} xmlSpace="preserve">
              {/* Back SVG content */}
              <text transform="matrix(1 0 0 1 621.999 227.2734)" id="svgsecurity" className="st6 st7">
                {cardData.securityCode || '•••'}
              </text>
              <text transform="matrix(1 0 0 1 59.5073 228.6099)" id="svgnameback" className="st12 st13">
                {cardData.name.toUpperCase()}
              </text>
              {/* Rest of the back SVG */}
            </svg>
          </div>
        </div>
      </div>

      <div className="form-container">
        <div className="field-container">
          <label htmlFor="name">Name</label>
          <input 
            id="name" 
            maxLength="20" 
            type="text" 
            value={cardData.name}
            onChange={handleNameChange}
            onFocus={() => setIsFlipped(false)}
          />
        </div>
        
        <div className="field-container">
          <label htmlFor="cardnumber">Card Number</label>
          <span id="generatecard" onClick={generateRandomCard}>generate random</span>
          <input 
            id="cardnumber" 
            type="text" 
            pattern="[0-9]*" 
            inputMode="numeric"
            ref={cardNumberRef}
            onFocus={() => setIsFlipped(false)}
          />
          <svg id="ccicon" className="ccicon" width="750" height="471" viewBox="0 0 750 471" version="1.1" 
               xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" ref={ccIconRef}>
          </svg>
        </div>
        
        <div className="field-container">
          <label htmlFor="expirationdate">Expiration (mm/yy)</label>
          <input 
            id="expirationdate" 
            type="text" 
            pattern="[0-9]*" 
            inputMode="numeric"
            ref={expiryRef}
            onFocus={() => setIsFlipped(false)}
          />
        </div>
        
        <div className="field-container">
          <label htmlFor="securitycode">Security Code</label>
          <input 
            id="securitycode" 
            type="text" 
            pattern="[0-9]*" 
            inputMode="numeric"
            ref={securityCodeRef}
            onFocus={() => setIsFlipped(true)}
          />
        </div>
      </div>
    </div>
  );
};