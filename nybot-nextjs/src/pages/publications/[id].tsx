/* eslint-disable */
// @ts-nocheck

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { sanityClient } from '../../lib/sanity';
import { urlFor } from '../../lib/sanityImage';
import { PortableTextBlock } from '@sanity/types';
import Link from 'next/link';
import Image from 'next/image';

interface Image {
  asset: {
    _ref: string;
  };
  caption?: string;
}

interface Publication {
  _id: string;
  title: string;
  category?: string;
  description?: PortableTextBlock[];
  images?: Image[];
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
  dimensions?: string;
  editions?: number;
  year?: number;
  date?: string;
  start_date?: string;
  end_date?: string;
  pdfFile?: { asset: { url: string } };
  visibility?: string;
}

const PublicationDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [publication, setPublication] = useState<Publication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchPublication = async () => {
        try {
          const query = `*[_type == "publication" && _id == "${id}"][0]{
            _id,
            title,
            category,
            description,
            images,
            "relatedHappenings": relatedHappenings[]->{_id, name},
            "relatedArtists": relatedArtists[]->{_id, name},
            "relatedLocations": relatedLocations[]->{_id, city},
            "relatedInstitutions": relatedInstitutions[]->{_id, name},
            "relatedGalleries": relatedGalleries[]->{_id, name},
            "relatedBusinesses": relatedBusinesses[]->{_id, name},
            dimensions,
            editions,
            year,
            date,
            start_date,
            end_date,
            "pdfFile": pdfFile.asset->url,
            visibility
          }`;
          const data = await sanityClient.fetch<Publication>(query);
          console.log('Fetched Publication:', data); // Debugging log
          setPublication(data);
        } catch (err) {
          console.error("Failed to fetch publication:", err);
          setError("Failed to fetch publication");
        } finally {
          setLoading(false);
        }
      };

      fetchPublication();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!publication) {
    return <div>Publication not found</div>;
  }

  return (
    <div>
      <h1>{publication.title}</h1>
      {publication.category && <p>Category: {publication.category}</p>}
      {publication.year && <p>Year: {publication.year}</p>}
      {publication.dimensions && <p>Dimensions: {publication.dimensions}</p>}
      {publication.editions !== undefined && <p>Editions: {publication.editions}</p>}
      {publication.date && <p>Date: {new Date(publication.date).toLocaleDateString()}</p>}
      {publication.start_date && <p>Start Date: {publication.start_date}</p>}
      {publication.end_date && <p>End Date: {publication.end_date}</p>}
      {publication.visibility && <p>Visibility: {publication.visibility}</p>}
      
        <h2>About</h2>
        {publication?.description?.map((block, index) => {
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
              block.asset && (
                <Image
                  key={index}
                  src={urlFor(block).url()}
                  alt="Press image"
                  style={{ maxWidth: '500px', width: '100%' }}
                />
              )
            );
          }
          return null;
        })}
      {publication.images && (
        <div>
          <h2>Images</h2>
          {publication.images.map((image, index) => (
            <div key={index}>
              <img src={urlFor(image.asset).width(500).url()} alt={image.caption || 'Image'} style={{ maxWidth: '500px' }} />
              {image.caption && <p>{image.caption}</p>}
            </div>
          ))}
        </div>
      )}
     {publication.pdfFile && (
        <div>
          <h2>PDF File</h2>
          <a href={publication.pdfFile} target="_blank" rel="noopener noreferrer">
            View PDF
          </a>
        </div>
      )}
      {publication.relatedHappenings && publication.relatedHappenings.length > 0 && (
        <div>
          <h2>Related Happenings</h2>
          {publication.relatedHappenings.map((happening, index) => (
            <p key={index}>
              <Link href={`/happenings/${happening._id}`}>{happening.name}</Link>
            </p>
          ))}
        </div>
      )}
      {publication.relatedArtists && publication.relatedArtists.length > 0 && (
        <div>
          <h2>Related Artists</h2>
          {publication.relatedArtists.map((artist, index) => (
            <p key={index}>
              <Link href={`/artists/${artist._id}`}>{artist.name}</Link>
            </p>
          ))}
        </div>
      )}
      {publication.relatedLocations && publication.relatedLocations.length > 0 && (
        <div>
          <h2>Related Locations</h2>
          {publication.relatedLocations.map((location, index) => (
            <p key={index}>{location.city}</p>
          ))}
        </div>
      )}
      {publication.relatedInstitutions && publication.relatedInstitutions.length > 0 && (
        <div>
          <h2>Related Institutions</h2>
          {publication.relatedInstitutions.map((institution, index) => (
            <p key={index}>{institution.name}</p>
          ))}
        </div>
      )}
      {publication.relatedGalleries && publication.relatedGalleries.length > 0 && (
        <div>
          <h2>Related Galleries</h2>
          {publication.relatedGalleries.map((gallery, index) => (
            <p key={index}>{gallery.name}</p>
          ))}
        </div>
      )}
      {publication.relatedBusinesses && publication.relatedBusinesses.length > 0 && (
        <div>
          <h2>Related Businesses</h2>
          {publication.relatedBusinesses.map((business, index) => (
            <p key={index}>{business.name}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicationDetail;
