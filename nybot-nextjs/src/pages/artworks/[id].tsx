import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { client } from '../../lib/sanity';
import { urlFor } from '../../lib/sanityImage'; // Import the URL builder

// Define the interface for artwork
interface Artwork {
  _id: string;
  title: string;
  year: number;
  date: string;
  dimensions: string;
  medium: string;
  description?: any[];
  images?: Array<{ _key: string; asset: { _ref: string }; caption: string; alt: string }>;
  videoUrls?: string[];
  press?: any[];
  location?: any[];
  artists?: any[];
  access: string;
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
            dimensions,
            medium,
            description,
            images,
            videoUrls,
            press,
            location,
            artists,
            access
          }`;
          const data = await client.fetch<Artwork>(query, { id });
          console.log("Fetched artwork data:", data); // Add this line to debug
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
      <p><strong>Dimensions:</strong> {artwork.dimensions}</p>
      <p><strong>Medium:</strong> {artwork.medium}</p>

      {artwork.description && (
        <div>
          <strong>Description:</strong>
          {artwork.description.map((block: any) => (
            <p key={block._key}>{block.children.map((child: any) => child.text).join(' ')}</p>
          ))}
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
                style={{ maxWidth: '500px', width: '100%', height: 'auto' }} // Inline style added
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
          {artwork.press.map((block: any) => (
            <p key={block._key}>{block.children.map((child: any) => child.text).join(' ')}</p>
          ))}
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
    </div>
  );
};

export default ArtworkDetails;
