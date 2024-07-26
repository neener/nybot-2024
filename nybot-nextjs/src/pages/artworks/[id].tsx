"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { client } from '../../lib/sanity';

const ArtworkDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [artwork, setArtwork] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchArtwork = async () => {
        try {
          const data = await client.fetch(`*[_type == "artwork" && _id == $id][0]`, { id });
          setArtwork(data);
        } catch (err) {
          console.error("Failed to fetch artwork from Sanity:", err);
          setError(err.message);
        }
      };

      fetchArtwork();
    }
  }, [id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!artwork) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{artwork.title}</h1>
      {/* Add more artwork details here */}
    </div>
  );
};

export default ArtworkDetail;
