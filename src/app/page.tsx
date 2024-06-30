"use client";
import AllVideo from "@/app/components/all-video";
import ErrorPage from "./components/error";
import LoadingPage from "./components/loading";

import { GetVideosQueryData } from "@/app/model/video";
import { useQuery, gql } from "@apollo/client";
import HLSBillBoard from "@/app/components/HLSBillBoard";

const GET_VIDEOS_QUERY = gql`
  query GetVideos {
    videos {
      id
      videoURL
      title
      thumbnailImageURL
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

export default function Index() {
  const { loading, error, data } =
    useQuery<GetVideosQueryData>(GET_VIDEOS_QUERY);
  if (loading) return <LoadingPage />;
  if (error) return <ErrorPage errorMessage={error.message} />;
  if (!data) return <ErrorPage errorMessage="データが見つかりませんでした" />;

  const num = getRandomArbitrary(0, data.videos.length);
  return (
    <div className="max-w-full">
      <HLSBillBoard billBoardVideo={data.videos[num]} />
      <div className="pt-8 px-10">
        <AllVideo videos={data.videos} />
      </div>
    </div>
  );
}

function getRandomArbitrary(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}
