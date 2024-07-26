import { useEffect, useState } from 'react';
import { client } from '../lib/sanity'; 

// Define the interface for event
interface Event {
  _id: string;
  name: string;
}

const Events = () => {
  // Use the interface to type the state
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await client.fetch<Event[]>(`*[_type == "event"]{_id, name}`);
        setEvents(data);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <h1>Events</h1>
      <ul>
        {events.map((event) => (
          <li key={event._id}>{event.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Events;
