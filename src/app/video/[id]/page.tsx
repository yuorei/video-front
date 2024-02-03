'use client'
import React, { useEffect, useState } from "react";
import Image from "next/image";
import HLSPlayer from '@/app/components/HLSPlayer';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client';
import { GetVideoQueryData } from '@/app/model/video';
import { whenTimeAgo } from "@/app/lib/time";
import AllVideoVertical from "@/app/components/all-video-vertical";

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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1280);
    };

    window.addEventListener('resize', handleResize);

    // コンポーネントのアンマウント時にイベントリスナーを削除
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { loading, error, data } = useQuery<GetVideoQueryData>(GET_VIDEO_QUERY, {
    variables: { id: params.id },
  });

  if (loading) return <p>Loading...</p>;
  if (error || !data) return <p>Error :</p>;

  return (
    <div className={isMobile ? "container flex flex-col" : " flex items-start gap-4"}>
      <div className="bg-black shadow-lg rounded-lg overflow-hidden">
        <div className="bg-black rounded-lg overflow-hidden shadow-lg mx-auto">
          <HLSPlayer src={data.video.videoURL} />
        </div>
        <div className="p-4">
          <h1 className="text-2xl font-bold">{data.video.title}</h1>
          <div className="flex items-center mt-4">
            <Image src={data.video.uploader.profileImageURL} alt={data.video.uploader.name} className="w-10 h-10 rounded-full" width={100} height={100} />
            <div className="ml-2">
              <p className="text-lg">{data.video.uploader.name}</p>
            </div>
          </div>
          <div className="bg-zinc-600 mt-2 rounded-lg p-4">
            <p className="text-sm text-white">{whenTimeAgo(data.video.createdAt)}</p>
            <p className="text-white">{data.video.description}</p>
          </div>
        </div>
      </div>
      <AllVideoVertical />
    </div>
  );
};
