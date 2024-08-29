/* eslint-disable @next/next/no-html-link-for-pages */

"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { sanityClient } from '../lib/sanity';

const Home = () => {
  const [error, setError] = useState<string | null>(null); // Explicitly define the type

  useEffect(() => {
    const fetchData = async () => {
      try {
        await sanityClient.fetch(`*[_type == "artwork"]{_id, title}`);
        await sanityClient.fetch(`*[_type == "artist"]{_id, name}`);
        await sanityClient.fetch(`*[_type == "publication"]{_id, title}`);
        await sanityClient.fetch(`*[_type == "happening"]{_id, name}`);
        await sanityClient.fetch(`*[_type == "holding"]{_id, title}`);
        await sanityClient.fetch(`*[_type == "contact"]{_id, title}`);
      } catch (err) {
        console.error("Failed to fetch data from Sanity:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
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
