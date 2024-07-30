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

interface Event {
  _id: string;
  name: string;
  date?: string;
  start_date?: string;
  end_date?: string;
  curator?: string;
  year?: number;
  images?: Image[];
  press?: any[];
  videoUrls?: string[];
  location?: any[];
  institution?: any[];
  artists?: any[];
}

const EventDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchEvent = async () => {
        try {
          const query = `*[_type == "event" && _id == "${id}"][0]`;
          const data = await client.fetch<Event>(query);
          console.log('Fetched Event:', data); // Debugging log
          setEvent(data);
        } catch (err) {
          console.error("Failed to fetch event:", err);
          setError("Failed to fetch event");
        } finally {
          setLoading(false);
        }
      };

      fetchEvent();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <div>
      <h1>{event.name}</h1>
      {event.date && <p>Date: {event.date}</p>}
      {event.start_date && <p>Start Date: {event.start_date}</p>}
      {event.end_date && <p>End Date: {event.end_date}</p>}
      {event.curator && <p>Curator: {event.curator}</p>}
      {event.year && <p>Year: {event.year}</p>}
      {event.images && (
        <div>
          <h2>Images</h2>
          {event.images.map((image, index) => (
            <div key={index}>
              <img src={urlFor(image.asset).width(500).url()} alt={image.caption || 'Image'} style={{ maxWidth: '500px' }} />
              {image.caption && <p>{image.caption}</p>}
            </div>
          ))}
        </div>
      )}
      {event.press && (
        <div>
          <h2>Press</h2>
          {event.press.map((block: any, index: number) => (
            <p key={index}>{block.children[0].text}</p>
          ))}
        </div>
      )}
      {event.videoUrls && (
        <div>
          <h2>Video URLs</h2>
          {event.videoUrls.map((url, index) => (
            <p key={index}><a href={url} target="_blank" rel="noopener noreferrer">{url}</a></p>
          ))}
        </div>
      )}
      {/* Add more fields as needed */}
    </div>
  );
};

export default EventDetail;
