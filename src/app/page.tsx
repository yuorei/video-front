"use client";
import AllVideo from "@/app/components/all-video";
import ErrorPage from "./components/error";
import LoadingPage from "./components/loading";

import { useQuery } from "@apollo/client";
import { useFragment } from "@/app//gql/fragment-masking";

import HLSBillBoard from "@/app/components/HLSBillBoard";
import { graphql } from "@/app/gql";

const getVideosDocument = graphql(/* GraphQL */ `
  query GetVideos {
    videos {
      ...VideoFragment
    }
  }
`);

const homePageVideosFragment = graphql(/* GraphQL */ `
  fragment VideoFragment on Video {
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

export default function Index() {
  const { loading, error, data } = useQuery(getVideosDocument);
  const videos = useFragment(homePageVideosFragment, data?.videos);
  if (loading) return <LoadingPage />;
  if (error) return <ErrorPage errorMessage={error.message} />;
  if (!videos || videos.length == 0) return <ErrorPage errorMessage="データが見つかりませんでした" />;

  const num = getRandomArbitrary(0, videos.length);

  return (
    <div className="max-w-full">
      <HLSBillBoard billBoardVideo={videos[num]} />
      <div className="pt-8 px-10">
        <AllVideo videos={videos} />
      </div>
    </div>
  );
}

function getRandomArbitrary(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}
