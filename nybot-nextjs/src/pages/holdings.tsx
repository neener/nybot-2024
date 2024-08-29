import { useEffect, useState } from 'react';
import Link from 'next/link';
import { sanityClient } from '../lib/sanity';

interface Holding {
  _id: string;
  name: string;
}

const Holdings = () => {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHoldings = async () => {
      try {
        const data = await sanityClient.fetch<Holding[]>(`*[_type == "holding"]{_id, name}`);
        setHoldings(data);
      } catch (err) {
        console.error("Failed to fetch holdings:", err);
        setError("Failed to fetch holdings");
      } finally {
        setLoading(false);
      }
    };

    fetchHoldings();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Holdings</h1>
      <ul>
        {holdings.map((holding) => (
          <li key={holding._id}>
            <Link href={`/holdings/${holding._id}`}>
              {holding.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Holdings;
