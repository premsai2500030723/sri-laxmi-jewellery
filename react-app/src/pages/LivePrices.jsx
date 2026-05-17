import { useState, useEffect } from 'react';
import api from '../api';
import './LivePrices.css';

export default function LivePrices() {
  const [rate1gm, setRate1gm] = useState('Loading...');
  const [rate10gm, setRate10gm] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchPrice = async () => {
    setLoading(true);
    try {
      const data = await api.getGoldPrice();
      if (data.fallback) throw new Error('fallback');
      const pricePerOunce = 1 / data.rates.INR;
      const pricePerGram  = pricePerOunce / 31.1035;
      setRate1gm(`1 Gram: ₹ ${pricePerGram.toFixed(2)}`);
      setRate10gm(`10 Grams: ₹ ${(pricePerGram * 10).toFixed(2)}`);
    } catch {
      setRate1gm('1 Gram: ₹ 6500 (approx)');
      setRate10gm('10 Grams: ₹ 65000 (approx)');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrice();
    const interval = setInterval(fetchPrice, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="live-prices-page">
      <div className="price-card">
        <h2>Live Gold Rate (INR)</h2>
        <p className="price">{rate1gm}</p>
        {rate10gm && <p className="price">{rate10gm}</p>}
        <button onClick={fetchPrice} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>
    </div>
  );
}
