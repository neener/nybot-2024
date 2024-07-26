import { useEffect, useState } from 'react';
import { client } from '../lib/sanity'; 

// Define the interface for artist
interface Artist {
  _id: string;
  name: string;
}

const Artists = () => {
  // Use the interface to type the state
  const [artists, setArtists] = useState<Artist[]>([]);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const data = await client.fetch<Artist[]>(`*[_type == "artist"]{_id, name}`);
        setArtists(data);
      } catch (err) {
        console.error("Failed to fetch artists:", err);
      }
    };

    fetchArtists();
  }, []);

  return (
    <div>
      <h1>Artists</h1>
      <ul>
        {artists.map((artist) => (
          <li key={artist._id}>{artist.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Artists;
