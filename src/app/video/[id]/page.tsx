import type { Metadata, ResolvingMetadata } from 'next'
import { getVideo } from './getVideo'
import React from 'react'
import VideoPage  from './Video';

type Props = {
  params: { id: string }
  // searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id

  let video = await getVideo({id})

  return {
    title: video?.title || 'YuoVision',
    description: video?.description || 'YuoVision',
    // openGraph: {
    //   images: [video?.thumbnailImageURL|| '/opengraph-image.jpg'],
    // },
    twitter: {
      card: 'summary_large_image',
      title: video?.title || 'YuoVision',
      description: video?.description || 'YuoVision',
      site: '@yuovision',
      creator: '@yuorei71',
      // images: [video?.thumbnailImageURL|| '/opengraph-image.jpg'],
    },
  }
}

export default function Page({ params }: { params: { id: string } }) {
  return (
    <>
      <VideoPage params={params} />
    </>
  );
};
