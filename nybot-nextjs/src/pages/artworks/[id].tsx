import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { client } from '../../lib/sanity';
import { urlFor } from '../../lib/sanityImage';
import { PortableText } from '@portabletext/react';

interface Artwork {
  _id: string;
  title: string;
  year: number;
  date: string;
  start_date?: string;
  end_date?: string;
  dimensions: string;
  medium: string;
  description?: any[];
  images?: Array<{ _key: string; asset: { _ref: string }; caption: string; alt: string }>;
  videoUrls?: string[];
  press?: any[];
  location?: string[];  // Now expecting strings
  artists?: string[];   // Now expecting strings
  access: string;
  category?: string;
}

const ArtworkDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [artwork, setArtwork] = useState<Artwork | null>(null);

  useEffect(() => {
    const fetchArtwork = async () => {
      if (id) {
        try {
          const query = `*[_type == "artwork" && slug.current == $id][0]{
            _id,
            title,
            year,
            date,
            start_date,
            end_date,
            dimensions,
            medium,
            description,
            images,
            videoUrls,
            press,
            "location": location[]->city,  
            "artists": artists[]->name,    
            access,
            category
          }`;
          const data = await client.fetch<Artwork>(query, { id });
          console.log("Fetched artwork data:", data);
          setArtwork(data);
        } catch (err) {
          console.error("Failed to fetch artwork:", err);
        }
      }
    };

    if (id) {
      fetchArtwork();
    }
  }, [id]);

  if (!artwork) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{artwork.title}</h1>
      <p><strong>Year:</strong> {artwork.year}</p>
      <p><strong>Date:</strong> {artwork.date}</p>
      {artwork.start_date && <p><strong>Start Date:</strong> {artwork.start_date}</p>}
      {artwork.end_date && <p><strong>End Date:</strong> {artwork.end_date}</p>}
      <p><strong>Dimensions:</strong> {artwork.dimensions}</p>
      <p><strong>Medium:</strong> {artwork.medium}</p>

      {artwork.description && (
        <div>
          <strong>Description:</strong>
          <PortableText value={artwork.description} />
        </div>
      )}

      {artwork.images && (
        <div>
          <strong>Images:</strong>
          {artwork.images.map(image => (
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

      {artwork.videoUrls && (
        <div>
          <strong>Video URLs:</strong>
          <ul>
            {artwork.videoUrls.map((url, index) => (
              <li key={index}><a href={url} target="_blank" rel="noopener noreferrer">{url}</a></li>
            ))}
          </ul>
        </div>
      )}

      {artwork.press && (
        <div>
          <strong>Press:</strong>
          <PortableText value={artwork.press} />
        </div>
      )}

      {artwork.location && (
        <div>
          <strong>Location:</strong>
          <ul>
            {artwork.location.map((loc, index) => (
              <li key={index}>{loc}</li>
            ))}
          </ul>
        </div>
      )}

      {artwork.artists && (
        <div>
          <strong>Artists:</strong>
          <ul>
            {artwork.artists.map((artist, index) => (
              <li key={index}>{artist}</li>
            ))}
          </ul>
        </div>
      )}

      <p><strong>Access:</strong> {artwork.access}</p>
      {artwork.category && <p><strong>Category:</strong> {artwork.category}</p>}
    </div>
  );
};

export default ArtworkDetails;
