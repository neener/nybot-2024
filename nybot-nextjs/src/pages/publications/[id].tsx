import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { client } from '../../lib/sanity';
import { urlFor } from '../../lib/sanityImage';

interface Image {
  asset: {
    _ref: string;
  };
  caption?: string;
}

interface Publication {
  _id: string;
  title: string;
  category?: string;
  description?: any;
  images?: Image[];
  event?: any;
  artists?: any[];
  location?: any[];
  institution?: any[];
  gallery?: any[];
  business?: any[];
  dimensions?: string;
  editions?: number;
  year?: number;
  date?: string;
  start_date?: string;
  end_date?: string;
  pdfFile?: { asset: { url: string } };
  visibility?: string;
}

const PublicationDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [publication, setPublication] = useState<Publication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchPublication = async () => {
        try {
          const query = `*[_type == "publication" && _id == "${id}"][0]`;
          const data = await client.fetch<Publication>(query);
          console.log('Fetched Publication:', data); // Debugging log
          setPublication(data);
        } catch (err) {
          console.error("Failed to fetch publication:", err);
          setError("Failed to fetch publication");
        } finally {
          setLoading(false);
        }
      };

      fetchPublication();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!publication) {
    return <div>Publication not found</div>;
  }

  return (
    <div>
      <h1>{publication.title}</h1>
      {publication.category && <p>Category: {publication.category}</p>}
      {publication.description && (
        <div>
          <h2>Description</h2>
          {/* Render the Portable Text blocks */}
          {publication.description.map((block: any, index: number) => (
            <p key={index}>{block.children[0].text}</p>
          ))}
        </div>
      )}
      {publication.images && (
        <div>
          <h2>Images</h2>
          {publication.images.map((image, index) => (
            <div key={index}>
              <img src={urlFor(image.asset).width(500).url()} alt={image.caption || 'Image'} style={{ maxWidth: '500px' }} />
              {image.caption && <p>{image.caption}</p>}
            </div>
          ))}
        </div>
      )}
      {publication.pdfFile && (
        <div>
          <h2>PDF File</h2>
          <a href={publication.pdfFile.asset.url} target="_blank" rel="noopener noreferrer">
            View PDF
          </a>
        </div>
      )}
    </div>
  );
};

export default PublicationDetail;
