/* eslint-disable */
// @ts-nocheck

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { client } from '../../lib/sanity';
import { urlFor } from '../../lib/sanityImage';
import Link from 'next/link';

interface Image {
  asset: {
    _ref: string;
  };
  caption?: string;
  alt?: string;
}

interface Holding {
  _id: string;
  name: string;
  artist?: {
    _id: string;
    name: string;
  };
  images?: Image[];
  dimensions?: string;
  medium?: string;
  year?: number;
  date?: string;
  start_date?: string;
  end_date?: string;
  acquired?: number;
  visibility?: string;
  seller?: string;
  price_paid?: number;
  value?: number;
  notes?: any[];
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
  relatedHappenings?: Array<{
    _id: string;
    name: string;
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
  categories?: string[];
}

const HoldingDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [holding, setHolding] = useState<Holding | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchHolding = async () => {
        try {
          const query = `*[_type == "holding" && _id == $id][0]{
            _id,
            name,
            artist->{_id, name},
            images,
            dimensions,
            medium,
            year,
            date,
            start_date,
            end_date,
            acquired,
            visibility,
            seller,
            price_paid,
            value,
            notes,
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
            relatedHappenings[]-> {
              _id,
              name
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
            categories
          }`;
          const data = await client.fetch(query, { id });
          console.log('Fetched Holding:', data);
          setHolding(data);
        } catch (err) {
          console.error("Failed to fetch holding:", err);
          setError("Failed to fetch holding");
        } finally {
          setLoading(false);
        }
      };

      fetchHolding();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!holding) {
    return <div>Holding not found</div>;
  }

  return (
    <div>
      <h1>{holding.name}</h1>
      {holding.artist && <p>Artist: {holding.artist.name}</p>}
      {holding.dimensions && <p>Dimensions: {holding.dimensions}</p>}
      {holding.medium && <p>Medium: {holding.medium}</p>}
      {holding.year && <p>Year: {holding.year}</p>}
      {holding.date && <p>Date: {holding.date}</p>}
      {holding.start_date && <p>Start Date: {holding.start_date}</p>}
      {holding.end_date && <p>End Date: {holding.end_date}</p>}
      {holding.acquired && <p>Acquired: {holding.acquired}</p>}
      {holding.visibility && <p>Visibility: {holding.visibility}</p>}
      {holding.seller && <p>Seller: {holding.seller}</p>}
      {holding.price_paid && <p>Price Paid: {holding.price_paid}</p>}
      {holding.value && <p>Value: {holding.value}</p>}
      {holding.categories && <p>Categories: {holding.categories.join(', ')}</p>}

      {holding.images && holding.images.length > 0 && (
        <div>
          <h2>Images</h2>
          {holding.images.map((image, index) => (
            <div key={index}>
              <img
                src={urlFor(image.asset).width(500).url()}
                alt={image.alt || 'Image'}
                style={{ maxWidth: '500px' }}
              />
              {image.caption && <p>{image.caption}</p>}
            </div>
          ))}
        </div>
      )}

      {holding.notes && holding.notes.length > 0 && (
        <div>
          <h2>Notes</h2>
          {holding.notes.map((block: any, index: number) => (
            <p key={index}>
              {block.children.map((child: any) => child.text).join(' ')}
            </p>
          ))}
        </div>
      )}

      {holding.relatedArtists && holding.relatedArtists.length > 0 && (
        <div>
          <h2>Related Artists</h2>
          {holding.relatedArtists.map((artist, index) => (
            <p key={index}>
              <Link href={`/artists/${artist._id}`}>{artist.name}</Link>
            </p>
          ))}
        </div>
      )}


      {holding.relatedPublications && holding.relatedPublications.length > 0 && (
        <div>
          <h2>Related Publications</h2>
          {holding.relatedPublications.map((publication, index) => (
            <p key={index}>
              <Link href={`/publications/${publication._id}`}>{publication.title}</Link>
            </p>
          ))}
        </div>
      )}

  
      {holding.relatedLocations && holding.relatedLocations.length > 0 && (
        <div>
          <h2>Related Locations</h2>
          {holding.relatedLocations.map((location, index) => (
            <p key={index}>{location.city}</p>
          ))}
        </div>
      )}

      {holding.relatedHappenings && holding.relatedHappenings.length > 0 && (
        <div>
          <h2>Related Happenings</h2>
          {holding.relatedHappenings.map((happening, index) => (
            <p key={index}>
              <Link href={`/happenings/${happening._id}`}>{happening.name}</Link>
            </p>
          ))}
        </div>
      )}
  
      {holding.relatedInstitutions && holding.relatedInstitutions.length > 0 && (
        <div>
          <h2>Related Institutions</h2>
          {holding.relatedInstitutions.map((institution, index) => (
            <p key={index}>{institution.name}</p>
          ))}
        </div>
      )}
      {holding.relatedGalleries && holding.relatedGalleries.length > 0 && (
        <div>
          <h2>Related Galleries</h2>
          {holding.relatedGalleries.map((gallery, index) => (
            <p key={index}>{gallery.name}</p>
          ))}
        </div>
      )}
      {holding.relatedBusinesses && holding.relatedBusinesses.length > 0 && (
        <div>
          <h2>Related Businesses</h2>
          {holding.relatedBusinesses.map((business, index) => (
            <p key={index}>{business.name}</p>
          ))}
        </div>
      )}
  
    </div>
  );
};

export default HoldingDetail;
