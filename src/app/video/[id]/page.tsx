'use client'
import React, { useEffect, useState } from "react";
import HLSPlayer from '@/app/components/HLSPlayer';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client';
import { GetVideoQueryData } from '@/app/model/video';
import AllVideoVertical from "@/app/components/all-video-vertical";
import Comments from "@/app/components/comment";
import LoadingPage from "@/app/components/loading";
import ErrorPage from "@/app/components/error";
import { Ad } from "@/app/components/HLSPlayer";
import VideoHeader from './VideoHeader';

const GET_VIDEO_QUERY = gql`
  query GetVideo($id: ID!) {
    video(id: $id) {
      videoURL
      title
      description
      createdAt
      uploader {
        id
        name
        profileImageURL
      }
    }
  }
`;

export default function Video({ params }: { params: { id: string } }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1280);

  const handleLogin = () => {
    window.location.href = '/login';
  };

  const { loading: videoLoading, error: videoError, data: videoData } = useQuery<GetVideoQueryData>(GET_VIDEO_QUERY, {
    variables: { id: params.id },
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1280);
    };

    window.addEventListener('resize', handleResize);

    // コンポーネントのアンマウント時にイベントリスナーを削除
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (videoLoading) return <LoadingPage />;
  if (videoError || videoError || !videoData) return <ErrorPage errorMessage={videoError?.message || "不明なエラー"} />;

  // 仮の広告データ
  const ads: Ad[] = [
    { adURL: "https://video-storage.yuorei.com/video/output_video_4d30ee62-eb87-11ee-b465-0242ac110002.m3u8", adTiming: 0 },
    { adURL: "https://video-storage.yuorei.com/video/output_video_4d30ee62-eb87-11ee-b465-0242ac110002.m3u8", adTiming: 60 },
  ];

  return (
    <div className={isMobile ? "container flex flex-col" : " flex items-start gap-4"}>
      <div className="bg-black shadow-lg rounded-lg overflow-hidden">
        <div className="bg-black rounded-lg overflow-hidden shadow-lg mx-auto">
          <HLSPlayer src={videoData.video.videoURL} ads={ads} />
        </div>
        <VideoHeader
        video={videoData.video}
      />
                <Comments videoID={params.id} />
      </div>
      <AllVideoVertical videoID={params.id} />
    </div>
  );
};
