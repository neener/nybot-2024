"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { client } from '../../lib/sanity';

const HoldingDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [holding, setHolding] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchHolding = async () => {
        try {
          const data = await client.fetch(`*[_type == "holding" && _id == $id][0]`, { id });
          setHolding(data);
        } catch (err) {
          console.error("Failed to fetch holding from Sanity:", err);
          setError(err.message);
        }
      };

      fetchHolding();
    }
  }, [id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!holding) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{holding.title}</h1>
      {/* Add more holding details here */}
    </div>
  );
};

export default HoldingDetail;
