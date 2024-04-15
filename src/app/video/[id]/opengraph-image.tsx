import { ImageResponse } from 'next/og'
import { getVideo } from './getVideo'

export const contentType = 'image/png'

export const size = {
    width: 1200,
    height: 630,
  };

export default async function og({ params }: { params: { id: string } }) {

const id = params.id
let video =getVideo({params: {id}})

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 88,
          background: '#fff',
          color: '#000',
        }}
      >
        <img src={video?.thumbnailImageURL ||'/opengraph-image.jpg'} alt={video?.title} />
      </div>
    ),
    {
        ...size,
    }
  )
}

export const runtime = 'edge'