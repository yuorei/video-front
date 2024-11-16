"use client";
import React, { useState, useEffect } from "react";
import HLSPlayer from "@/app/components/HLSPlayer";
import { useQuery } from "@apollo/client";
import AllVideoVertical from "@/app/components/all-video-vertical";
import Comments from "@/app/components/comment";
import LoadingPage from "@/app/components/loading";
import ErrorPage from "@/app/components/error";
import { Ad } from "@/app/components/HLSPlayer";
import VideoHeader from "./VideoHeader";
import { useFragment } from "@/app/gql/fragment-masking";
import { graphql } from "@/app/gql";

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
    watchCount
    uploader {
      id
      name
      profileImageURL
    }
  }
`);

const adVideoDocument = graphql(/* GraphQL */ `
  query AdVideo($input: AdVideoInput!) {
    adVideo(input: $input) {
      adID
      adURL
      title
      description
      thumbnailURL
      videoURL
    }
  }
`);

export default function VideoPage({ params }: { params: { id: string } }) {
  const {
    loading: adLoading,
    error: adError,
    data: adDatas,
  } = useQuery(adVideoDocument, {
    variables: {
      // TODO: 本来はクライアントIDを取得する
      input: {
        city: "",
        clientID: "",
        country: "",
        hostname: "",
        ipAddress: "",
        language: "",
        location: "",
        networkDownlink: "",
        networkEffectiveType: "",
        org: "",
        pageTitle: "",
        platform: "",
        postal: "",
        referrer: "",
        region: "",
        timezone: "",
        url: "",
        userAgent: "",
        userID: "",
        videoID: params.id,
      },
    },
  });

  const { loading, error, data } = useQuery(getVideosDocument, {
    variables: { id: params.id },
  });
  const video = useFragment(homePageVideosFragment, data?.video);
  if (loading) return <LoadingPage />;
  if (error || !video)
    return <ErrorPage errorMessage={error?.message || "不明なエラー"} />;

  const ads: Ad[] = [];
  if (adDatas) {
    let count = 0;
    for (const adData of adDatas.adVideo) {
      ads.push({
        adVideoURL: adData.videoURL,
        adURL: adData.adURL,
        adTiming: 300 * count,
        adDescription: adData.description,
        adTitle: adData.title,
      });
      count++;
    }
  }

  return (
    <div className="flex items-start gap-4 xl:flex-row flex-col">
      <div className="bg-black shadow-lg rounded-lg overflow-hidden">
        <div className="bg-black rounded-lg overflow-hidden shadow-lg mx-auto">
          <HLSPlayer src={video.videoURL} ads={ads} video={video} />
        </div>
        <VideoHeader video={video} />
        <Comments videoID={params.id} />
      </div>
      <AllVideoVertical videoID={params.id} />
    </div>
  );
}
