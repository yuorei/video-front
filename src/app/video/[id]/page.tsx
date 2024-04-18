import type { Metadata, ResolvingMetadata } from "next";
import { getVideo } from "./getVideo";
import React from "react";
import VideoPage from "./Video";

type Props = {
  params: { id: string };
  // searchParams: { [key: string]: string | string[] | undefined }
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;

  let video = await getVideo({ id });

  return {
    title: video?.title || "YuoVision",
    description: video?.description || "YuoVision",
    openGraph: {
      title: video?.title || "YuoVision",
      description: video?.description || "YuoVision",
      type: "website",
      url: `https://yuovision.yuorei.com/video/${id}`,
      images: [
        video?.thumbnailImageURL ||
          "https://yuovision.yuorei.com/opengraph-image.png",
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: video?.title || "YuoVision",
      description: video?.description || "YuoVision",
      site: "@yuovision",
      creator: "@yuorei71",
      images: [
        video?.thumbnailImageURL ||
          "https://yuovision.yuorei.com/opengraph-image.png",
      ],
    },
  };
}

export default function Page({ params }: { params: { id: string } }) {
  return (
    <>
      <VideoPage params={params} />
    </>
  );
}
