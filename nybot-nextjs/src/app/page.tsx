/* eslint-disable @next/next/no-html-link-for-pages */

"use client";
import Link from 'next/link';

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
        <h2><Link href="/artworks">Works</Link></h2>
      </section>
      <section>
        <h2><Link href="/artists">People</Link></h2>
      </section>
      <section>
        <h2><Link href="/publications">Publications</Link></h2>
      </section>
      <section>
        <h2><Link href="/happenings">Events</Link></h2>
      </section>
      <section>
        <h2><Link href="/holdings">Holdings</Link></h2>
      </section>
      <section>
        <h2><Link href="/contact">Contact</Link></h2> 
      </section>
    </div>
  );
};

export default Home;
