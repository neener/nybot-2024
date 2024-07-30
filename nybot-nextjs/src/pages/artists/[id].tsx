import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { client } from '../../lib/sanity';
import { urlFor } from '../../lib/sanityImage';

interface Artist {
  _id: string;
  name: string;
  pseudonym?: string[];
  artwork?: { _ref: string };
  publication?: { _ref: string };
  event?: { _ref: string };
  location?: { _ref: string };
  images?: Array<{ _key: string; asset: { _ref: string }; caption: string; alt: string }>;
  about?: any[];
}

const ArtistDetails = () => {
  const router = useRouter();
  const { id } = router.query; // Retrieve the id from the URL
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtist = async () => {
      if (id) {
        console.log('Artist ID:', id); // Debugging line
        try {
          const query = `*[_type == "artist" && _id == $id][0]{
            _id,
            name,
            pseudonym,
            artwork,
            publication,
            event,
            location,
            images,
            about
          }`;
          const data = await client.fetch<Artist>(query, { id });
          console.log('Fetched Artist:', data); // Debugging line
          if (data) {
            setArtist(data);
          } else {
            setError("No artist found");
          }
        } catch (err) {
          console.error("Failed to fetch artist:", err);
          setError("Failed to fetch artist");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchArtist();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>{artist?.name}</h1>
      {artist?.pseudonym && (
        <p><strong>Pseudonym:</strong> {artist.pseudonym.join(', ')}</p>
      )}
      {artist?.about && (
        <div>
          <strong>About:</strong>
          {artist.about.map((block: any) => (
            <p key={block._key}>{block.children.map((child: any) => child.text).join(' ')}</p>
          ))}
        </div>
      )}
      {artist?.images && (
        <div>
          <strong>Images:</strong>
          {artist.images.map(image => (
            <div key={image._key}>
              <img
                src={urlFor(image.asset).url()}
                alt={image.alt}
                style={{ maxWidth: '500px', width: '100%', height: 'auto' }}
              />
              <p>{image.caption}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArtistDetails;
