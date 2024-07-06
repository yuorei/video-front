"use client";
import HLSPlayer from "@/app/components/HLSPlayer";
import { useQuery } from "@apollo/client";
import AllVideoVertical from "@/app/components/all-video-vertical";
import Comments from "@/app/components/comment";
import LoadingPage from "@/app/components/loading";
import ErrorPage from "@/app/components/error";
import { Ad } from "@/app/components/HLSPlayer";
import VideoHeader from "./VideoHeader";
import React from "react";
import { graphql } from "@/app/gql";
import { useFragment } from "@/app/gql/fragment-masking";

const getVideosDocument = graphql(/* GraphQL */ `
  query GetVideo($id: ID!) {
    video(id: $id) {
      ...GetVideoFragment
    }
  }
`);

export const homePageVideosFragment = graphql(/* GraphQL */ `
  fragment GetVideoFragment on Video {
    id
    videoURL
    title
    thumbnailImageURL
    description
    Tags
    isPrivate
    isAdult
    isExternalCutout
    # ads {
    #     id
    #     title
    # }
    isAd
    createdAt
    updatedAt
    uploader {
      id
      name
      profileImageURL
    }
  }
`);

export default function VideoPage({ params }: { params: { id: string } }) {
  const { loading, error, data } = useQuery(getVideosDocument, {
    variables: { id: params.id },
  });
  const video = useFragment(homePageVideosFragment, data?.video);
  if (loading) return <LoadingPage />;
  if (error || !video)
    return <ErrorPage errorMessage={error?.message || "不明なエラー"} />;

  // Temporary advertisement data

  const ads: Ad[] = [
    {
      adURL:
        "https://video-storage.yuorei.com/video/output_video_4d30ee62-eb87-11ee-b465-0242ac110002.m3u8",
      adTiming: 0,
    },
    {
      adURL:
        "https://video-storage.yuorei.com/video/output_video_4d30ee62-eb87-11ee-b465-0242ac110002.m3u8",
      adTiming: 60,
    },
  ];

  return (
    <div className="flex items-start gap-4 xl:flex-row flex-col">
      <div className="bg-black shadow-lg rounded-lg overflow-hidden">
        <div className="bg-black rounded-lg overflow-hidden shadow-lg mx-auto">
          <HLSPlayer src={video.videoURL} ads={ads} />
        </div>
        <VideoHeader video={video} />
        <Comments videoID={params.id} />
      </div>
      <AllVideoVertical videoID={params.id} />
    </div>
  );
}
