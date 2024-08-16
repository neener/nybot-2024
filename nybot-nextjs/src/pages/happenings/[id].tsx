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
  relatedArtists?: Array<{
    _id: string;
    name: string;
  }>;
  relatedPublications?: Array<{
    _id: string;
    title: string;
  }>;
  relatedLocations?: Array<{
    _id: string;
    city: string;
  }>;
  relatedInstitutions?: Array<{
    _id: string;
    name: string;
  }>;
  relatedGalleries?: Array<{
    _id: string;
    name: string;
  }>;
  relatedBusinesses?: Array<{
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
              relatedArtists[]-> {
                _id,
                name
              },
              relatedPublications[]-> {
                _id,
                title
              },
              relatedLocations[]-> {
                _id,
                city
              },
              relatedInstitutions[]-> {
                _id,
                name
              },
              relatedGalleries[]-> {
                _id,
                name
              },
              relatedBusinesses[]-> {
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

      {happening.relatedArtists && happening.relatedArtists.length > 0 && (
        <div>
          <h2>Related Artists</h2>
          {happening.relatedArtists.map((artist, index) => (
            <p key={index}>
              <Link href={`/artists/${artist._id}`}>{artist.name}</Link>
            </p>
          ))}
        </div>
      )}

      {happening.relatedPublications && happening.relatedPublications.length > 0 && (
        <div>
          <h2>Related Publications</h2>
          {happening.relatedPublications.map((publication, index) => (
            <p key={index}>
              <Link href={`/publications/${publication._id}`}>{publication.title}</Link>
            </p>
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
      {happening.relatedGalleries && happening.relatedGalleries.length > 0 && (
        <div>
          <h2>Related Galleries</h2>
          {happening.relatedGalleries.map((gallery, index) => (
            <p key={index}>{gallery.name}</p>
          ))}
        </div>
      )}
      {happening.relatedBusinesses && happening.relatedBusinesses.length > 0 && (
        <div>
          <h2>Related Businesses</h2>
          {happening.relatedBusinesses.map((business, index) => (
            <p key={index}>{business.name}</p>
          ))}
        </div>
      )}
  
      
    </div>
  );
};
  
export default HappeningDetail;
