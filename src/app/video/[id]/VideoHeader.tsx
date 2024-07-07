"use client";
import Image from "next/image";
import CustomLink from "@/app/components/custom-link";
import { whenTimeAgo } from "@/app/lib/time";

import { useQuery, useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
import LoadingPage from "@/app/components/loading";
import { graphql } from "@/app/gql";
import { GetVideoFragmentFragment } from "@/app/gql/graphql";

const SUBSCRIBE_CHANNEL = graphql(/* GraphQL */ `
  mutation SubscribeChannel($channelID: ID!) {
    subscribeChannel(input: { channelID: $channelID }) {
      isSuccess
    }
  }
`);

const UNSUBSCRIBE_CHANNEL = graphql(/* GraphQL */ `
  mutation UnSubscribeChannel($channelID: ID!) {
    unSubscribeChannel(input: { channelID: $channelID }) {
      isSuccess
    }
  }
`);

const GET_USER_BY_AUTH = graphql(/* GraphQL */ `
  query GetUserByAuth {
    userByAuth {
      id
      name
      profileImageURL
      subscribechannelids
    }
  }
`);

interface VideoHeaderProps {
  video: GetVideoFragmentFragment;
}

export default function VideoHeader({ video }: VideoHeaderProps) {
  const [subscribeChannel] = useMutation(SUBSCRIBE_CHANNEL);
  const [unSubscribeChannel] = useMutation(UNSUBSCRIBE_CHANNEL);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const {
    loading: userLoading,
    error: userError,
    data: userData,
    refetch: userRefetch,
  } = useQuery(GET_USER_BY_AUTH);

  useEffect(() => {
    if (userData) {
      setIsSubscribed(
        userData.userByAuth?.subscribechannelids.includes(video?.uploader.id)
      );
    }
  }, [userData]);

  const handleLogin = () => {
    window.location.href = "/login";
  };

  const handleSubscriptionChange = async (
    channelID: string,
    subscribe: boolean
  ) => {
    try {
      const response = subscribe
        ? await subscribeChannel({ variables: { channelID } })
        : await unSubscribeChannel({ variables: { channelID } });
      if (subscribe && response.data) {
        console.log("Subscribed successfully");
        setIsSubscribed(true);
        userRefetch();
      } else if (!subscribe && response.data) {
        console.log("Unsubscribed successfully");
        setIsSubscribed(false);
        userRefetch();
      }
    } catch (error) {
      console.error("Error in subscription change:", error);
    }
  };

  if (userLoading) return <LoadingPage />;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{video.title}</h1>
      <div className="flex items-center mt-4">
        <CustomLink href={`/channel/${video.uploader.id}`}>
          <Image
            src={video.uploader.profileImageURL}
            alt={video.uploader.name}
            className="w-10 h-10 rounded-full"
            width={100}
            height={100}
          />
        </CustomLink>
        <CustomLink href={`/channel/${video.uploader.id}`}>
          <div className="ml-2">
            <p className="text-lg">{video.uploader.name}</p>
          </div>
        </CustomLink>
        <div>
          {userData ? (
            <button
              className={`${
                isSubscribed
                  ? "bg-red-500 hover:bg-red-700"
                  : "bg-blue-500 hover:bg-blue-700"
              } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
              onClick={() =>
                handleSubscriptionChange(video.uploader.id, !isSubscribed)
              }
            >
              {isSubscribed ? "登録済み" : "チャンネル登録"}
            </button>
          ) : (
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleLogin}
            >
              ログイン
            </button>
          )}
        </div>
      </div>
      <div className="bg-zinc-600 mt-2 rounded-lg p-4">
        <div className="flex items-center gap-4">
          <p className="text-sm text-white">{video.watchCount} 回視聴</p>
          <p className="text-sm text-white">{whenTimeAgo(video.createdAt)}</p>
        </div>
        <p className="text-white">{video.description}</p>
      </div>
    </div>
  );
}
