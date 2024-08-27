import { useEffect, useState } from 'react';
import Link from 'next/link';
import { client } from '../lib/sanity';

// Define the interface for artwork
interface Artwork {
  _id: string;
  title: string;
}

const Artworks = () => {
  // Use the interface to type the state
  const [artworks, setArtworks] = useState<Artwork[]>([]);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const data = await client.fetch<Artwork[]>(`*[_type == "artwork"]{_id, title}`);
        setArtworks(data);
      } catch (err) {
        console.error("Failed to fetch artworks:", err);
      }
    };

    fetchArtworks();
  }, []);

  return (
    <div>
      <h1>Artworks</h1>
      <ul>
        {artworks.map((artwork) => (
          <li key={artwork._id}>
            <Link href={`/artworks/${artwork._id}`}>
              {artwork.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Artworks;
