"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { client } from '../../lib/sanity';

const ArtistDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [artist, setArtist] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchArtist = async () => {
        try {
          const data = await client.fetch(`*[_type == "artist" && _id == $id][0]`, { id });
          setArtist(data);
        } catch (err) {
          console.error("Failed to fetch artist from Sanity:", err);
          setError(err.message);
        }
      };

      fetchArtist();
    }
  }, [id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!artist) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{artist.name}</h1>
      {/* Add more artist details here */}
    </div>
  );
};

export default ArtistDetail;
