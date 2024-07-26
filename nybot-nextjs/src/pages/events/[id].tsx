"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { client } from '../../lib/sanity';

const EventDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchEvent = async () => {
        try {
          const data = await client.fetch(`*[_type == "event" && _id == $id][0]`, { id });
          setEvent(data);
        } catch (err) {
          console.error("Failed to fetch event from Sanity:", err);
          setError(err.message);
        }
      };

      fetchEvent();
    }
  }, [id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{event.title}</h1>
      {/* Add more event details here */}
    </div>
  );
};

export default EventDetail;
