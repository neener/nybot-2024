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
        await client.fetch(`*[_type == "happening"]{_id, name}`);
        await client.fetch(`*[_type == "holding"]{_id, title}`);
        await client.fetch(`*[_type == "contact"]{_id, title}`);
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
      <section>
        <h2><a href="/artworks">Works</a></h2>
      </section>
      <section>
        <h2><a href="/artists">People</a></h2>
      </section>
      <section>
        <h2><a href="/publications">Publications</a></h2>
      </section>
      <section>
        <h2><a href="/happenings">Events</a></h2>
      </section>
      <section>
        <h2><a href="/holdings">Holdings</a></h2>
      </section>
      <section>
        <h2><a href="/contact">Contact</a></h2> 
      </section>
    </div>
  );
};

export default Home;
