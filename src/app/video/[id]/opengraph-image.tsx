import { ImageResponse } from 'next/og'
import { getVideo } from './getVideo'
import React from 'react'

export const contentType = 'image/png'

export const size = {
  width: 1200,
  height: 630,
};

export default async function og({ params }: { params: { id: string } }) {
  const id = params.id
  let video = await getVideo({ id })
  console.log("OGP動画取得",video)
  try {
    let imageResponse = new ImageResponse(
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
          <img src={video?.thumbnailImageURL || 'https://yuovision.yuorei.com/opengraph-image.jpg'} alt={video?.title} />
        </div>
      ),
      {
        ...size,
      }
    )
    console.log("OGP画像",imageResponse)
    return imageResponse

  } catch (error) {
    console.error("OGPエラー",error)
  }
}

export const runtime = 'nodejs'
