import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { client } from '../../lib/sanity';
import { urlFor } from '../../lib/sanityImage';
import { PortableText } from '@portabletext/react';
import Link from 'next/link';

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
  images?: Array<{ _key: string; asset: { _ref: string; url: string }; caption: string; alt: string }>;
  videoUrls?: string[];
  press?: any[];
  relatedHappenings?: Array<{
    _id: string;
    name: string;
  }>;
  relatedArtists?: Array<{
    _id: string;
    name: string;
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
  access: string;
  category?: string;
}

const ArtworkDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtwork = async () => {
      if (id) {
        try {
          const data = await client.fetch(`
            *[_id == $id][0] {
              _id,
              title,
              year,
              date,
              start_date,
              end_date,
              dimensions,
              medium,
              description,
              images[] {
                _key,
                asset->{
                  _ref,
                  url
                },
                caption,
                alt
              },
              videoUrls,
              press,
              relatedHappenings[]-> {
                _id,
                name
              },
              relatedArtists[]-> {
                _id,
                name
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
              },
              access,
              category
            }
          `, { id });
          console.log("Fetched artwork data:", data);
          setArtwork(data);
        } catch (err) {
          console.error("Failed to fetch artwork:", err);
          setError("Failed to fetch artwork");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchArtwork();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!artwork) {
    return <div>Artwork not found</div>;
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

      {artwork.relatedHappenings && artwork.relatedHappenings.length > 0 && (
        <div>
          <h2>Related Happenings</h2>
          {artwork.relatedHappenings.map((happening, index) => (
            <p key={index}>
              <Link href={`/happenings/${happening._id}`}>
                {happening.name}
              </Link>
            </p>
          ))}
        </div>
      )}

      {artwork.relatedArtists && artwork.relatedArtists.length > 0 && (
        <div>
          <h2>Related Artists</h2>
          {artwork.relatedArtists.map((artist, index) => (
            <p key={index}>
              <Link href={`/artists/${artist._id}`}>
                {artist.name}
              </Link>
            </p>
          ))}
        </div>
      )}

      {artwork.relatedLocations && artwork.relatedLocations.length > 0 && (
        <div>
          <h2>Related Locations</h2>
          {artwork.relatedLocations.map((location, index) => (
            <p key={index}>{location.city}</p>
          ))}
        </div>
      )}
      {artwork.relatedInstitutions && artwork.relatedInstitutions.length > 0 && (
        <div>
          <h2>Related Institutions</h2>
          {artwork.relatedInstitutions.map((institution, index) => (
            <p key={index}>{institution.name}</p>
          ))}
        </div>
      )}
      {artwork.relatedGalleries && artwork.relatedGalleries.length > 0 && (
        <div>
          <h2>Related Galleries</h2>
          {artwork.relatedGalleries.map((gallery, index) => (
            <p key={index}>{gallery.name}</p>
          ))}
        </div>
      )}
      {artwork.relatedBusinesses && artwork.relatedBusinesses.length > 0 && (
        <div>
          <h2>Related Businesses</h2>
          {artwork.relatedBusinesses.map((business, index) => (
            <p key={index}>{business.name}</p>
          ))}
        </div>
      )}

      <p><strong>Access:</strong> {artwork.access}</p>
      {artwork.category && <p><strong>Category:</strong> {artwork.category}</p>}
    </div>
  );
};

export default ArtworkDetails;
