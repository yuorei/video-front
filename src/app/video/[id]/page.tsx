'use client'
import React, { useEffect, useState } from "react";
import Image from "next/image";
import HLSPlayer from '@/app/components/HLSPlayer';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client';
import { GetVideoQueryData } from '@/app/model/video';
import { whenTimeAgo } from "@/app/lib/time";
import AllVideoVertical from "@/app/components/all-video-vertical";
import { GetUserResponse, GetUserVariables } from "@/app/model/user";
import CustomLink from "@/app/components/custom-link";

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

const SUBSCRIBE_CHANNEL = gql`
  mutation SubscribeChannel($channelID: ID!) {
    subscribeChannel(input: { channelID: $channelID }) {
      isSuccess
    }
  }
`;

const UNSUBSCRIBE_CHANNEL = gql`
  mutation UnSubscribeChannel($channelID: ID!) {
    unSubscribeChannel(input: { channelID: $channelID }) {
      isSuccess
    }
  }
`;

const GET_USER_BY_AUTH = gql`
  query GetUserByAuth {
    userByAuth {
      id
      name
      profileImageURL
      subscribechannelids
    }
  }
`;
export default function Video({ params }: { params: { id: string } }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1280);

  const [subscribeChannel] = useMutation(SUBSCRIBE_CHANNEL);
  const [unSubscribeChannel] = useMutation(UNSUBSCRIBE_CHANNEL);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleLogin = () => {
    window.location.href = '/login';
  };

  const { loading: videoLoading, error: videoError, data: videoData } = useQuery<GetVideoQueryData>(GET_VIDEO_QUERY, {
    variables: { id: params.id },
  });

  const { loading: userLoading, error: userError, data: userData, refetch: userRefetch } = useQuery(GET_USER_BY_AUTH);

  useEffect(() => {
    if (userData) {
      setIsSubscribed(userData.userByAuth?.subscribechannelids.includes(videoData?.video.uploader.id));
    }
  }, [userData]);

  const handleSubscriptionChange = async (channelID: string, subscribe: boolean) => {
    try {
      const response = subscribe
        ? await subscribeChannel({ variables: { channelID } })
        : await unSubscribeChannel({ variables: { channelID } });
      if (subscribe && response.data.subscribeChannel.isSuccess) {
        console.log("Subscribed successfully");
        setIsSubscribed(true);
        userRefetch(); // Optionally refetch user data
      } else if (!subscribe && response.data.unSubscribeChannel.isSuccess) {
        console.log("Unsubscribed successfully");
        setIsSubscribed(false);
        userRefetch(); // Optionally refetch user data
      }
    } catch (error) {
      console.error("Error in subscription change:", error);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1280);
    };

    window.addEventListener('resize', handleResize);

    // コンポーネントのアンマウント時にイベントリスナーを削除
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (videoLoading) return <p>Loading...</p>;
  if (videoError || videoError || !videoData) return <p>Error :</p>;

  return (
    <div className={isMobile ? "container flex flex-col" : " flex items-start gap-4"}>
      <div className="bg-black shadow-lg rounded-lg overflow-hidden">
        <div className="bg-black rounded-lg overflow-hidden shadow-lg mx-auto">
          <HLSPlayer src={videoData.video.videoURL} />
        </div>
        <div className="p-4">
          <h1 className="text-2xl font-bold">{videoData.video.title}</h1>
          <div className="flex items-center mt-4">
            <CustomLink href={`/channel/${videoData.video.uploader.id}`}>
              <Image src={videoData.video.uploader.profileImageURL} alt={videoData.video.uploader.name} className="w-10 h-10 rounded-full" width={100} height={100} />
            </CustomLink>
            <CustomLink href={`/channel/${videoData.video.uploader.id}`}>
              <div className="ml-2">
                <p className="text-lg">{videoData.video.uploader.name}</p>
              </div>
            </CustomLink>

            <div>
              {
                userData ?
                  (
                    <button
                      className={`${isSubscribed ? 'bg-red-500 hover:bg-red-700' : 'bg-blue-500 hover:bg-blue-700'
                        } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                      onClick={() => handleSubscriptionChange(videoData.video.uploader.id, !isSubscribed)}
                    >
                      {isSubscribed ? '登録済み' : 'チャンネル登録'}
                    </button>
                  )
                  :
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={handleLogin}
                  >
                    ログイン
                  </button>
              }
            </div>

          </div>
          <div className="bg-zinc-600 mt-2 rounded-lg p-4">
            <p className="text-sm text-white">{whenTimeAgo(videoData.video.createdAt)}</p>
            <p className="text-white">{videoData.video.description}</p>
          </div>
        </div>
      </div>
      <AllVideoVertical videoID={params.id} />
    </div>
  );
};
