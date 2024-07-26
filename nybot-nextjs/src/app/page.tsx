"use client";

import { useEffect, useState } from 'react';
import { client } from '../lib/sanity';

const Home = () => {
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await client.fetch(`*[_type == "artwork"]{_id, title}`);
        await client.fetch(`*[_type == "artist"]{_id, name}`);
        await client.fetch(`*[_type == "publication"]{_id, title}`);
        await client.fetch(`*[_type == "event"]{_id, title}`);
        await client.fetch(`*[_type == "holding"]{_id, title}`);
      } catch (err) {
        console.error("Failed to fetch data from Sanity:", err);
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Home</h1>
      <section>
        <h2><a href="/artworks">Artworks</a></h2>
      </section>
      <section>
        <h2><a href="/artists">Artists</a></h2>
      </section>
      <section>
        <h2><a href="/publications">Publications</a></h2>
      </section>
      <section>
        <h2><a href="/events">Events</a></h2>
      </section>
      <section>
        <h2><a href="/holdings">Holdings</a></h2>
      </section>
    </div>
  );
};

export default Home;
