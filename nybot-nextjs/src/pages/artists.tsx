import Link from 'next/link';
import { useEffect, useState } from 'react';
import { sanityClient } from '../lib/sanity';

interface Artist {
  _id: string;
  name: string;
}

const ArtistsList = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const query = '*[_type == "artist"]{_id, name}';
        const data = await sanityClient.fetch<Artist[]>(query);
        setArtists(data);
      } catch (err) {
        console.error("Failed to fetch artists:", err);
        setError("Failed to fetch artists");
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Artists</h1>
      <ul>
        {artists.map((artist) => (
          <li key={artist._id}>
            <Link href={`/artists/${artist._id}`}>
              {artist.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ArtistsList;