import Link from 'next/link';
import { useEffect, useState } from 'react';
import { sanityClient } from '../lib/sanity';

interface Publication {
  _id: string;
  title: string;
}

const PublicationsList = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const query = '*[_type == "publication"]{_id, title}';
        const data = await sanityClient.fetch<Publication[]>(query);
        setPublications(data);
      } catch (err) {
        console.error("Failed to fetch publications:", err);
        setError("Failed to fetch publications");
      } finally {
        setLoading(false);
      }
    };

    fetchPublications();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Publications</h1>
      <ul>
        {publications.map((publication) => (
          <li key={publication._id}>
            <Link href={`/publications/${publication._id}`}>
              {publication.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PublicationsList;
