"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { client } from '../../lib/sanity';

const PublicationDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [publication, setPublication] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchPublication = async () => {
        try {
          const data = await client.fetch(`*[_type == "publication" && _id == $id][0]`, { id });
          setPublication(data);
        } catch (err) {
          console.error("Failed to fetch publication from Sanity:", err);
          setError(err.message);
        }
      };

      fetchPublication();
    }
  }, [id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!publication) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{publication.title}</h1>
      {/* Add more publication details here */}
    </div>
  );
};

export default PublicationDetail;
