import { useEffect, useState } from 'react';
import { client } from '../lib/sanity'; 

// Define the interface for holding
interface Holding {
  _id: string;
  name: string;
}

const Holdings = () => {
  // Use the interface to type the state
  const [holdings, setHoldings] = useState<Holding[]>([]);

  useEffect(() => {
    const fetchHoldings = async () => {
      try {
        const data = await client.fetch<Holding[]>(`*[_type == "holding"]{_id, name}`);
        setHoldings(data);
      } catch (err) {
        console.error("Failed to fetch holdings:", err);
      }
    };

    fetchHoldings();
  }, []);

  return (
    <div>
      <h1>Holdings</h1>
      <ul>
        {holdings.map((holding) => (
          <li key={holding._id}>{holding.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Holdings;
