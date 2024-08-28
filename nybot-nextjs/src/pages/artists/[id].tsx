/* eslint-disable */
// @ts-nocheck

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { client } from '../../lib/sanity';
import { urlFor } from '../../lib/sanityImage';
import { PortableTextBlock } from '@sanity/types';
import Link from 'next/link';


interface Artist {
  _id: string;
  name: string;
  pseudonym?: string[];
  relatedArtworks?: Array<{
    _id: string;
    title: string;
  }>;
  relatedPublications?: Array<{
    _id: string;
    title: string;
  }>;
  relatedHappenings?: Array<{
    _id: string;
    name: string;
  }>;
  relatedLocations?: Array<{
    _id: string;
    city: string;
  }>;
  images?: Array<{ _key: string; asset: { _ref: string }; caption: string; alt: string }>;
  about?: PortableTextBlock[];
}

const ArtistDetails = () => {
  const router = useRouter();
  const { id } = router.query; 
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtist = async () => {
      if (id) {
        try {
          console.log(`Fetching artist with id: ${id}`); // Debugging line
          const query = `*[_type == "artist" && _id == $id][0]{
            _id,
            name,
            pseudonym,
            relatedArtworks[]-> {
              _id,
              title
            },
            relatedPublications[]-> {
              _id,
              title
            },
            relatedHappenings[]-> {
              _id,
              name
            },
            relatedLocations[]-> {
              _id,
              city
            },
            images[] {
              asset->{
                _id,
                url
              },
              caption,
              alt
            },
            about
          }`;
          const data = await client.fetch<Artist>(query, { id });
          console.log('Fetched Artist:', data); // Debugging line
          if (data) {
            setArtist(data);
          } else {
            setError("No artist found");
          }
        } catch (err) {
          console.error("Failed to fetch artist:", err);
          setError("Failed to fetch artist");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchArtist();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>{artist?.name}</h1>
      {artist?.pseudonym && (
        <p><strong>Pseudonym:</strong> {artist.pseudonym.join(', ')}</p>
      )}
  
      <div>
        <h2>About</h2>
        {artist?.about?.map((block, index) => {
          if (block._type === 'block') {
            return (
              <p key={index}>
                {block.children?.map((child: any, childIndex: number) => {
                  const linkMark = child.marks?.find((mark: string) => {
                    return block.markDefs?.some((def) => def._key === mark && def._type === 'link');
                  });

                  if (linkMark) {
                    const link = block.markDefs?.find((def) => def._key === linkMark);
                    return (
                      <a
                        key={childIndex}
                        href={link?.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'blue', textDecoration: 'underline' }}
                      >
                        {child.text}
                      </a>
                    );
                  }
                  return <span key={childIndex}>{child.text}</span>;
                })}
              </p>
            );
          } else if (block._type === 'image') {
            return (
              <img
                key={index}
                src={urlFor(block).url()}
                alt="Press image"
                style={{ maxWidth: '500px', width: '100%' }}
              />
            );
          }
          return null;
        })}
      </div>

      {artist?.relatedArtworks && artist?.relatedArtworks.length > 0 && (
        <div>
          <h2>Related Artwork</h2>
          {artist?.relatedArtworks.map((artwork, index) => (
            <p key={index}>
              <Link href={`/artworks/${artwork._id}`}>
                {artwork.title}
              </Link>
            </p>
          ))}
        </div>
      )}

      {artist?.relatedPublications && artist?.relatedPublications.length > 0 && (
        <div>
          <h2>Related Publications</h2>
          {artist?.relatedPublications.map((publication, index) => (
            <p key={index}>
              <Link href={`/publications/${publication._id}`}>
                {publication.title}
              </Link>
            </p>
          ))}
        </div>
      )}
      
      {artist?.relatedHappenings && artist?.relatedHappenings.length > 0 && (
        <div>
          <h2>Related Happenings</h2>
          {artist?.relatedHappenings.map((happening, index) => (
            <p key={index}>
              <Link href={`/happenings/${happening._id}`}>
                {happening.name}
              </Link>
            </p>
          ))}
        </div>
      )}
      {artist?.relatedLocations && artist?.relatedLocations.length > 0 && (
        <div>
          <h2>Related Locations</h2>
          {artist?.relatedLocations.map((location, index) => (
            <p key={index}>{location.city}</p>
          ))}
        </div>
      )}
      {artist?.images && (
        <div>
          <strong>Images:</strong>
          {artist.images.map(image => (
            <div key={image._key}>
              <img
                src={urlFor(image.asset).url()}
                alt={image.alt}
                style={{ maxWidth: '500px', width: '100%', height: 'auto' }}
              />
              <p>{image.caption}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArtistDetails;
