/* eslint-disable */
// @ts-nocheck

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { sanityClient } from '../../lib/sanity';
import { urlFor } from '../../lib/sanityImage';
import Link from 'next/link';
import { PortableTextBlock } from '@sanity/types';

interface Image {
  asset: {
    _ref: string;
  };
  caption?: string;
}

interface Happening {
  _id: string;
  name: string;
  date?: string;
  start_date?: string;
  end_date?: string;
  curator?: string;
  year?: number;
  images?: Image[];
  press?: PortableTextBlock[];
  videoUrls?: string[];
  relatedArtists?: Array<{
    _id: string;
    name: string;
  }>;
  relatedPublications?: Array<{
    _id: string;
    title: string;
  }>;
  relatedLocations?: Array<{
    _id: string;
    city: string;
  }>;
  relatedInstitutions?: Array<{
    _id: string;
    name: string;
  }>;
  relatedGalleries?: Array<{
    _id: string;
    name: string;
  }>;
  relatedBusinesses?: Array<{
    _id: string;
    name: string;
  }>;
  relatedArtworks?: Array<{
    _id: string;
    title: string;
  }>;
}


const HappeningDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [happening, setHappening] = useState<Happening | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchHappening = async () => {
        try {
          const data = await sanityClient.fetch(`
            *[_id == "${id}"][0] {
              _id,
              name,
              date,
              start_date,
              end_date,
              year,
              images[] {
                asset->{
                  _id,
                  url
                },
                caption,
                alt
              },
              press,
              videoUrls,
              relatedArtists[]-> {
                _id,
                name
              },
              relatedPublications[]-> {
                _id,
                title
              },
              relatedLocations[]-> {
                _id,
                city
              },
              relatedInstitutions[]-> {
                _id,
                name
              },
              relatedGalleries[]-> {
                _id,
                name
              },
              relatedBusinesses[]-> {
                _id,
                name
              },
              relatedArtworks[]-> {
                _id,
                title
              }
            }
          `);
          console.log('Fetched Happening:', data); 
          setHappening(data);
        } catch (err) {
          console.error("Failed to fetch happening:", err);
          setError("Failed to fetch happening");
        } finally {
          setLoading(false);
        }
      };
      
      fetchHappening();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!happening) {
    return <div>Happening not found</div>;
  }

  return (
    <div>
      <h1>{happening.name}</h1>
      {happening.date && <p>Date: {happening.date}</p>}
      {happening.start_date && <p>Start Date: {happening.start_date}</p>}
      {happening.end_date && <p>End Date: {happening.end_date}</p>}
      {happening.curator && <p>Curator: {happening.curator}</p>}
      {happening.year && <p>Year: {happening.year}</p>}
  
      {happening.images && (
        <div>
          <h2>Images</h2>
          {happening.images.map((image, index) => (
            <div key={index}>
              {image.asset ? (
                <>
                  <img src={urlFor(image.asset).url()} alt={image.caption || 'Image'} style={{ maxWidth: '500px' }} />
                  {image.caption && <p>{image.caption}</p>}
                </>
              ) : (
                <p>No image available</p> // Optional fallback if asset is not available
              )}
            </div>
          ))}
        </div>
      )}

     {/* Press */}
      {happening.press && happening.press.length > 0 && (
        <div>
          <h2>Press</h2>
          {happening.press.map((block: any, index: number) => {
            // Handle different block types (e.g., block of text or image)
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
            } else if (block._type === 'image' && block.asset) {
              // Handle image block
              return (
                <img
                  key={index}
                  src={urlFor(block.asset).url()}
                  alt="Press image"
                  style={{ maxWidth: '500px', width: '100%' }}
                />
              );
            } else {
              return null; // Fallback for unhandled block types
            }
          })}
        </div>
      )}

      {/* Videos */}
      {happening.videoUrls && Array.isArray(happening.videoUrls) && happening.videoUrls.length > 0 && (
        <div>
          <h2>Videos</h2>
          {happening.videoUrls.map((videoUrl, index) => {
            const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
            const isVimeo = videoUrl.includes('vimeo.com');

            return (
              <div key={`video-${index}`}>
                {isYouTube ? (
                  <iframe
                    width="560"
                    height="315"
                    src={videoUrl.replace('watch?v=', 'embed/')}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : isVimeo ? (
                  <iframe
                    src={videoUrl.replace('vimeo.com', 'player.vimeo.com/video')}
                    width="640"
                    height="360"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                    {videoUrl}
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}

      {happening.relatedArtists && happening.relatedArtists.length > 0 && (
        <div>
          <h2>Related Artists</h2>
          {happening.relatedArtists.map((artist, index) => (
            <p key={index}>
              <Link href={`/artists/${artist._id}`}>{artist.name}</Link>
            </p>
          ))}
        </div>
      )}

      {happening.relatedArtworks && happening.relatedArtworks.length > 0 && (
        <div>
          <h2>Related Artworks</h2>
          {happening.relatedArtworks.map((artwork, index) => (
            <p key={index}>
              <Link href={`/artworks/${artwork._id}`}>{artwork.title}</Link>
            </p>
          ))}
        </div>
      )}
      
      {happening.relatedPublications && happening.relatedPublications.length > 0 && (
        <div>
          <h2>Related Publications</h2>
          {happening.relatedPublications.map((publication, index) => (
            <p key={index}>
              <Link href={`/publications/${publication._id}`}>{publication.title}</Link>
            </p>
          ))}
        </div>
      )}

      {happening.relatedLocations && happening.relatedLocations.length > 0 && (
        <div>
          <h2>Related Locations</h2>
          {happening.relatedLocations.map((location, index) => (
            <p key={index}>{location.city}</p>
          ))}
        </div>
      )}
  
      {happening.relatedInstitutions && happening.relatedInstitutions.length > 0 && (
        <div>
          <h2>Related Institutions</h2>
          {happening.relatedInstitutions.map((institution, index) => (
            <p key={index}>{institution.name}</p>
          ))}
        </div>
      )}
      {happening.relatedGalleries && happening.relatedGalleries.length > 0 && (
        <div>
          <h2>Related Galleries</h2>
          {happening.relatedGalleries.map((gallery, index) => (
            <p key={index}>{gallery.name}</p>
          ))}
        </div>
      )}
      {happening.relatedBusinesses && happening.relatedBusinesses.length > 0 && (
        <div>
          <h2>Related Businesses</h2>
          {happening.relatedBusinesses.map((business, index) => (
            <p key={index}>{business.name}</p>
          ))}
        </div>
      )}
    </div>
  );
};
  
export default HappeningDetail;
