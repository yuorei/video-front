import type { Metadata, ResolvingMetadata } from 'next'
import { getVideo } from './getVideo'
 
type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}
 
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id

  let video =getVideo({params: {id}})

  return {
    title: video?.title || 'Yuovision',
    description: video?.description || 'Yuovision',
    openGraph: {
      images: [video?.thumbnailImageURL|| '/opengraph-image.jpg'],
    },
  }
}

export default function Page({ params, searchParams }: Props) {}