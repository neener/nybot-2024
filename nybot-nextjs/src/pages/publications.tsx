import { useEffect, useState } from 'react';
import { client } from '../lib/sanity'; 

// Define the interface for publication
interface Publication {
  _id: string;
  title: string;
}

const Publications = () => {
  // Use the interface to type the state
  const [publications, setPublications] = useState<Publication[]>([]);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const data = await client.fetch<Publication[]>(`*[_type == "publication"]{_id, title}`);
        setPublications(data);
      } catch (err) {
        console.error("Failed to fetch publications:", err);
      }
    };

    fetchPublications();
  }, []);

  return (
    <div>
      <h1>Publications</h1>
      <ul>
        {publications.map((publication) => (
          <li key={publication._id}>{publication.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Publications;
