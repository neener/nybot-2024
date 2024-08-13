import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { client } from '../../lib/sanity';
import { urlFor } from '../../lib/sanityImage';
import Link from 'next/link';
import { PortableTextBlock } from '@sanity/types';

interface Image {
  asset: {
    _ref: string;
  };
  caption?: string;
}

interface Happening {
  _id: string;
  name: string;
  date?: string;
  start_date?: string;
  end_date?: string;
  curator?: string;
  year?: number;
  images?: Image[];
  press?: PortableTextBlock[];
  videoUrls?: string[];
  relatedLocations?: Array<{
    _id: string;
    city: string;
  }>;
  relatedInstitutions?: Array<{
    _id: string;
    name: string;
  }>;
  relatedArtists?: Array<{
    _id: string;
    name: string;
  }>;
}


const HappeningDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [happening, setHappening] = useState<Happening | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchHappening = async () => {
        try {
          const data = await client.fetch(`
            *[_id == "${id}"][0] {
              _id,
              name,
              date,
              start_date,
              end_date,
              year,
              images[] {
                asset->{
                  _id,
                  url
                },
                caption,
                alt
              },
              press,
              videoUrls,
              relatedLocations[]-> {
                _id,
                city
              },
              relatedInstitutions[]-> {
                _id,
                name
              },
              relatedArtists[]-> {
                _id,
                name
              }
            }
          `);
          console.log('Fetched Happening:', data); 
          setHappening(data);
        } catch (err) {
          console.error("Failed to fetch happening:", err);
          setError("Failed to fetch happening");
        } finally {
          setLoading(false);
        }
      };
      
      fetchHappening();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!happening) {
    return <div>Happening not found</div>;
  }

  return (
    <div>
      <h1>{happening.name}</h1>
      {happening.date && <p>Date: {happening.date}</p>}
      {happening.start_date && <p>Start Date: {happening.start_date}</p>}
      {happening.end_date && <p>End Date: {happening.end_date}</p>}
      {happening.curator && <p>Curator: {happening.curator}</p>}
      {happening.year && <p>Year: {happening.year}</p>}
  
      {happening.images && (
        <div>
          <h2>Images</h2>
          {happening.images.map((image, index) => (
            <div key={index}>
              <img src={urlFor(image.asset).width(500).url()} alt={image.caption || 'Image'} style={{ maxWidth: '500px' }} />
              {image.caption && <p>{image.caption}</p>}
            </div>
          ))}
        </div>
      )}
  
      {happening.press && (
        <div>
          <h2>Press</h2>
          {happening.press.map((block: any, index: number) => (
            <p key={index}>{block.children[0].text}</p>
          ))}
        </div>
      )}
  
      {happening.videoUrls && (
        <div>
          <h2>Video URLs</h2>
          {happening.videoUrls.map((url, index) => (
            <p key={index}><a href={url} target="_blank" rel="noopener noreferrer">{url}</a></p>
          ))}
        </div>
      )}
  
      {happening.relatedLocations && happening.relatedLocations.length > 0 && (
        <div>
          <h2>Related Locations</h2>
          {happening.relatedLocations.map((location, index) => (
            <p key={index}>{location.city}</p>
          ))}
        </div>
      )}
  
      {happening.relatedInstitutions && happening.relatedInstitutions.length > 0 && (
        <div>
          <h2>Related Institutions</h2>
          {happening.relatedInstitutions.map((institution, index) => (
            <p key={index}>{institution.name}</p>
          ))}
        </div>
      )}
  
      {happening.relatedArtists && happening.relatedArtists.length > 0 && (
        <div>
          <h2>Related Artists</h2>
          {happening.relatedArtists.map((artist, index) => (
            <p key={index}>{artist.name}</p>
          ))}
        </div>
      )}
    </div>
  );
};
  
export default HappeningDetail;
