import { useEffect, useState } from 'react';
import Link from 'next/link';
import { sanityClient } from '../lib/sanity';

interface Happening {
  _id: string;
  name: string;
}

const Happenings = () => {
  const [happenings, setHappenings] = useState<Happening[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHappenings = async () => {
      try {
        const data = await sanityClient.fetch<Happening[]>(`*[_type == "happening"]{_id, name}`);
        setHappenings(data);
      } catch (err) {
        console.error("Failed to fetch happenings:", err);
        setError("Failed to fetch happenings");
      } finally {
        setLoading(false);
      }
    };

    fetchHappenings();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Happenings</h1>
      <ul>
        {happenings.map((happening) => (
          <li key={happening._id}>
            <Link href={`/happenings/${happening._id}`}>
              {happening.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Happenings;
