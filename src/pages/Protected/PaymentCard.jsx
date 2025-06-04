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
  const [cardColorClass, setCardColorClass] = useState('grey');
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

  const fetchCard = async () => {
      try {
        const res = await api.get(`/api/card-links/${guid}`);
        setCard(res.data);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 404) {
          navigate('/not-found'); // 🔁 redirect if not found or unauthorized
        } else {
          console.error(err);
        }
      }

  useEffect(() => {
    
    fetchCard();
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
        {
            mask: '0000 000000 0000',
            regex: '^3(?:0([0-5]|9)|[689]\\d?)\\d{0,11}',
            cardtype: 'diners'
        },
        {
            mask: '0000 0000 0000 0000',
            regex: '^(5[1-5]\\d{0,2}|22[2-9]\\d{0,1}|2[3-7]\\d{0,2})\\d{0,12}',
            cardtype: 'mastercard'
        },
        // {
        //     mask: '0000-0000-0000-0000',
        //     regex: '^(5019|4175|4571)\\d{0,12}',
        //     cardtype: 'dankort'
        // },
        // {
        //     mask: '0000-0000-0000-0000',
        //     regex: '^63[7-9]\\d{0,13}',
        //     cardtype: 'instapayment'
        // },
        {
            mask: '0000 000000 00000',
            regex: '^(?:2131|1800)\\d{0,11}',
            cardtype: 'jcb15'
        },
        {
            mask: '0000 0000 0000 0000',
            regex: '^(?:35\\d{0,2})\\d{0,12}',
            cardtype: 'jcb'
        },
        {
            mask: '0000 0000 0000 0000',
            regex: '^(?:5[0678]\\d{0,2}|6304|67\\d{0,2})\\d{0,12}',
            cardtype: 'maestro'
        },
        // {
        //     mask: '0000-0000-0000-0000',
        //     regex: '^220[0-4]\\d{0,12}',
        //     cardtype: 'mir'
        // },
        {
            mask: '0000 0000 0000 0000',
            regex: '^4\\d{0,15}',
            cardtype: 'visa'
        },
        {
            mask: '0000 0000 0000 0000',
            regex: '^62\\d{0,14}',
            cardtype: 'unionpay'
        },
        {
            mask: '0000 0000 0000 0000',
            cardtype: 'Unknown'
        }
    ],
    dispatch: function (appended, dynamicMasked) {
        var number = (dynamicMasked.value + appended).replace(/\D/g, '');

        for (var i = 0; i < dynamicMasked.compiledMasks.length; i++) {
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
      mask: '000'
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
            <div id="ccsingle" ref={ccSingleRef}>
            </div>
            <svg version="1.1" id="cardfront" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                x="0px" y="0px" viewBox="0 0 750 471" style={{enableBackground: 'new 0 0 750 471'}} xmlSpace="preserve">
              {/* Front SVG content */}
              <text transform="matrix(1 0 0 1 60.106 295.0121)" id="svgnumber" className="st2 st3 st4">
                {formatCardNumber(cardData.number)}
              </text>
              <text transform="matrix(1 0 0 1 54.1064 428.1723)" id="svgname" className="st2 st5 st6">
                {cardData.name.toUpperCase()}
              </text>
              <text transform="matrix(1 0 0 1 65.1054 241.5)" class="st7 st5 st8">card number</text>
              <text transform="matrix(1 0 0 1 54.1074 389.8793)" class="st7 st5 st8">cardholder name</text>
              <text transform="matrix(1 0 0 1 574.4219 433.8095)" id="svgexpire" className="st2 st5 st9">
                {cardData.expiry || 'MM/YY'}
              </text>
              <text transform="matrix(1 0 0 1 479.3848 417.0097)" class="st2 st10 st11">VALID</text>
              <text transform="matrix(1 0 0 1 479.3848 435.6762)" class="st2 st10 st11">THRU</text>
              <g id="cchip">
                            <g>
                                <path class="st2" d="M168.1,143.6H82.9c-10.2,0-18.5-8.3-18.5-18.5V74.9c0-10.2,8.3-18.5,18.5-18.5h85.3
                        c10.2,0,18.5,8.3,18.5,18.5v50.2C186.6,135.3,178.3,143.6,168.1,143.6z"></path>
                            </g>
                            <g>
                                <g>
                                    <rect x="82" y="70" class="st12" width="1.5" height="60"></rect>
                                </g>
                                <g>
                                    <rect x="167.4" y="70" class="st12" width="1.5" height="60"></rect>
                                </g>
                                <g>
                                    <path class="st12" d="M125.5,130.8c-10.2,0-18.5-8.3-18.5-18.5c0-4.6,1.7-8.9,4.7-12.3c-3-3.4-4.7-7.7-4.7-12.3
                            c0-10.2,8.3-18.5,18.5-18.5s18.5,8.3,18.5,18.5c0,4.6-1.7,8.9-4.7,12.3c3,3.4,4.7,7.7,4.7,12.3
                            C143.9,122.5,135.7,130.8,125.5,130.8z M125.5,70.8c-9.3,0-16.9,7.6-16.9,16.9c0,4.4,1.7,8.6,4.8,11.8l0.5,0.5l-0.5,0.5
                            c-3.1,3.2-4.8,7.4-4.8,11.8c0,9.3,7.6,16.9,16.9,16.9s16.9-7.6,16.9-16.9c0-4.4-1.7-8.6-4.8-11.8l-0.5-0.5l0.5-0.5
                            c3.1-3.2,4.8-7.4,4.8-11.8C142.4,78.4,134.8,70.8,125.5,70.8z"></path>
                                </g>
                                <g>
                                    <rect x="82.8" y="82.1" class="st12" width="25.8" height="1.5"></rect>
                                </g>
                                <g>
                                    <rect x="82.8" y="117.9" class="st12" width="26.1" height="1.5"></rect>
                                </g>
                                <g>
                                    <rect x="142.4" y="82.1" class="st12" width="25.8" height="1.5"></rect>
                                </g>
                                <g>
                                    <rect x="142" y="117.9" class="st12" width="26.2" height="1.5"></rect>
                                </g>
                            </g>
                        </g>
              <polygon class="st2" points="554.5,421 540.4,414.2 540.4,427.9 		"></polygon>
              {/* Rest of the front SVG */}
            </svg>
            
          </div>
          
          <div className="back">
            <svg version="1.1" id="cardback" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                x="0px" y="0px" viewBox="0 0 750 471" style={{enableBackground: 'new 0 0 750 471'}} xmlSpace="preserve">
              {/* Back SVG content */}
              <g>
                            <path class="st3" d="M701.1,249.1H48.9c-3.3,0-6-2.7-6-6v-52.5c0-3.3,2.7-6,6-6h652.1c3.3,0,6,2.7,6,6v52.5
                    C707.1,246.4,704.4,249.1,701.1,249.1z"></path>
                            <rect x="42.9" y="198.6" class="st4" width="664.1" height="10.5"></rect>
                            <rect x="42.9" y="224.5" class="st4" width="664.1" height="10.5"></rect>
                            <path class="st5" d="M701.1,184.6H618h-8h-10v64.5h10h8h83.1c3.3,0,6-2.7,6-6v-52.5C707.1,187.3,704.4,184.6,701.1,184.6z"></path>
                        </g>
                        <rect x="58.1" y="378.6" class="st11" width="375.5" height="13.5"></rect>
                        <rect x="58.1" y="405.6" class="st11" width="421.7" height="13.5"></rect>
                        <text transform="matrix(1 0 0 1 518.083 280.0879)" class="st9 st6 st10">security code</text>
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