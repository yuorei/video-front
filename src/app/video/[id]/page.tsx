'use client';
import HLSPlayer from '@/app/components/HLSPlayer';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client';
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
  const { loading: videoLoading, error: videoError, data: videoData } = useQuery<GetVideoQueryData>(GET_VIDEO_QUERY, {
    variables: { id: params.id },
  });

  if (videoLoading) return <LoadingPage />;
  if (videoError || videoError || !videoData) return <ErrorPage errorMessage={videoError?.message || "不明なエラー"} />;

  // Temporary advertisement data
  const ads: Ad[] = [
    { adURL: "https://video-storage.yuorei.com/video/output_video_4d30ee62-eb87-11ee-b465-0242ac110002.m3u8", adTiming: 0 },
    { adURL: "https://video-storage.yuorei.com/video/output_video_4d30ee62-eb87-11ee-b465-0242ac110002.m3u8", adTiming: 60 },
  ];

  return (
    <div className="flex items-start gap-4 xl:flex-row flex-col">
      <div className="bg-black shadow-lg rounded-lg overflow-hidden">
        <div className="bg-black rounded-lg overflow-hidden shadow-lg mx-auto">
          <HLSPlayer src={videoData.video.videoURL} ads={ads} />
        </div>
        <VideoHeader video={videoData.video} />
        <Comments videoID={params.id} />
      </div>
      <AllVideoVertical videoID={params.id} />
    </div>
  );
};
