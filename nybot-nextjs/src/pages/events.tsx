import { useEffect, useState } from 'react';
import Link from 'next/link';
import { client } from '../lib/sanity';

interface Event {
  _id: string;
  name: string;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await client.fetch<Event[]>(`*[_type == "event"]{_id, name}`);
        setEvents(data);
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setError("Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Events</h1>
      <ul>
        {events.map((event) => (
          <li key={event._id}>
            <Link href={`/events/${event._id}`}>
              {event.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Events;
