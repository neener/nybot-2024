import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { client } from '../../lib/sanity';
import { urlFor } from '../../lib/sanityImage';

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
  category?: string;
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
            category
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
      {holding.category && <p>Category: {holding.category}</p>}

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
    </div>
  );
};

export default HoldingDetail;
