/* eslint-disable */
// @ts-nocheck

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { sanityClient } from '../../lib/sanity';
import { urlFor } from '../../lib/sanityImage';
import { PortableText } from '@portabletext/react';
import Link from 'next/link';
import Image from 'next/image';

interface Artwork {
  _id: string;
  title: string;
  year: number;
  date: string;
  start_date?: string;
  end_date?: string;
  dimensions: string;
  medium: string;
  description?: any[];
  images?: Array<{ _key: string; asset: { _ref: string; url: string }; caption: string; alt: string }>;
  videoUrls?: string[];
  press?: any[];
  relatedHappenings?: Array<{
    _id: string;
    name: string;
  }>;
  relatedArtists?: Array<{
    _id: string;
    name: string;
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
  access: string;
  categories?: string[];
}

const ArtworkDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtwork = async () => {
      if (id) {
        try {
          const data = await sanityClient.fetch(`
            *[_id == $id][0] {
              _id,
              title,
              year,
              date,
              start_date,
              end_date,
              dimensions,
              medium,
              description,
              images[] {
                _key,
                asset->{
                  _ref,
                  url
                },
                caption,
                alt
              },
              videoUrls,
              press,
              relatedHappenings[]-> {
                _id,
                name
              },
              relatedArtists[]-> {
                _id,
                name
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
              access,
              categories
            }
          `, { id });
          console.log("Fetched artwork data:", data);
          setArtwork(data);
        } catch (err) {
          console.error("Failed to fetch artwork:", err);
          setError("Failed to fetch artwork");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchArtwork();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!artwork) {
    return <div>Artwork not found</div>;
  }

  return (
    <div>
      <h1>{artwork.title}</h1>
      <p><strong>Year:</strong> {artwork.year}</p>
      <p><strong>Date:</strong> {artwork.date}</p>
      {artwork.start_date && <p><strong>Start Date:</strong> {artwork.start_date}</p>}
      {artwork.end_date && <p><strong>End Date:</strong> {artwork.end_date}</p>}
      <p><strong>Dimensions:</strong> {artwork.dimensions}</p>
      <p><strong>Medium:</strong> {artwork.medium}</p>

      {artwork.description && (
        <div>
          <strong>Description:</strong>
          <PortableText value={artwork.description} />
        </div>
      )}

      {artwork.images && (
        <div>
          <strong>Images:</strong>
          {artwork.images.map(image => (
            <div key={image._key}>
              {image.asset && image.asset.url ? ( // Use the direct URL if available
                <>
                  <Image
                    src={image.asset.url} // Use the direct URL here
                    alt={image.alt || 'Artwork image'}
                    width={500} // Set a default width
                    height={image.asset.url.includes('-') ? 500 / (parseInt(image.asset.url.split('-')[1].split('x')[0]) / parseInt(image.asset.url.split('-')[1].split('x')[1])) : 300} // Set a height based on aspect ratio or default
                    style={{ maxWidth: '500px', width: '100%', height: 'auto' }}
                  />
                  <p>{image.caption}</p>
                </>
              ) : (
                <p>No image available</p> // Optional fallback if no image is available
              )}
            </div>
          ))}
        </div>
      )}


     {/* Videos */}
      {artwork.videoUrls && Array.isArray(artwork.videoUrls) && artwork.videoUrls.length > 0 && (
        <div>
          <h2>Videos</h2>
          {artwork.videoUrls.map((videoUrl, index) => {
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

      {artwork.press && (
        <div>
          <strong>Press:</strong>
          <PortableText value={artwork.press} />
        </div>
      )}

      {artwork.relatedHappenings && artwork.relatedHappenings.length > 0 && (
        <div>
          <h2>Related Happenings</h2>
          {artwork.relatedHappenings.map((happening, index) => (
            <p key={index}>
              <Link href={`/happenings/${happening._id}`}>
                {happening.name}
              </Link>
            </p>
          ))}
        </div>
      )}

      {artwork.relatedArtists && artwork.relatedArtists.length > 0 && (
        <div>
          <h2>Related Artists</h2>
          {artwork.relatedArtists.map((artist, index) => (
            <p key={index}>
              <Link href={`/artists/${artist._id}`}>
                {artist.name}
              </Link>
            </p>
          ))}
        </div>
      )}

      {artwork.relatedLocations && artwork.relatedLocations.length > 0 && (
        <div>
          <h2>Related Locations</h2>
          {artwork.relatedLocations.map((location, index) => (
            <p key={index}>{location.city}</p>
          ))}
        </div>
      )}
      {artwork.relatedInstitutions && artwork.relatedInstitutions.length > 0 && (
        <div>
          <h2>Related Institutions</h2>
          {artwork.relatedInstitutions.map((institution, index) => (
            <p key={index}>{institution.name}</p>
          ))}
        </div>
      )}
      {artwork.relatedGalleries && artwork.relatedGalleries.length > 0 && (
        <div>
          <h2>Related Galleries</h2>
          {artwork.relatedGalleries.map((gallery, index) => (
            <p key={index}>{gallery.name}</p>
          ))}
        </div>
      )}
      {artwork.relatedBusinesses && artwork.relatedBusinesses.length > 0 && (
        <div>
          <h2>Related Businesses</h2>
          {artwork.relatedBusinesses.map((business, index) => (
            <p key={index}>{business.name}</p>
          ))}
        </div>
      )}

      <p><strong>Access:</strong> {artwork.access}</p>

      {artwork.categories && (
        <p><strong>Categories:</strong> {artwork.categories.join(', ')}</p> 
      )}

    </div>
  );
};

export default ArtworkDetails;
