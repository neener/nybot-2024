import { useEffect, useState } from 'react';
import { client } from '../lib/sanity';

interface Contact {
  _id: string;
  title: string;
  email: string;
  address: string;
  about: any; // Adjust this type as necessary
}

const ContactPage = () => {
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const data = await client.fetch(`*[_type == "contact"][0]`);
        setContact(data);
      } catch (err) {
        console.error("Failed to fetch contact:", err);
        setError("Failed to fetch contact");
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!contact) {
    return <div>Contact not found</div>;
  }

  return (
    <div>
      <h1>{contact.title}</h1>
      <p>Email: {contact.email}</p>
      <p>Address: {contact.address}</p>
      {contact.about && (
        <div>
          <h2>About</h2>
          {contact.about.map((block: any, index: number) => (
            <p key={index}>{block.children[0].text}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactPage;
