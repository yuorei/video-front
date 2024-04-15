import Image from 'next/image';
import { GetVideoQueryData } from '@/app/model/video';
import CustomLink from '@/app/components/custom-link';
import { whenTimeAgo } from '@/app/lib/time';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client';
import { useState, useEffect } from 'react';
import LoadingPage from '@/app/components/loading';

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

interface VideoHeaderProps {
  video: GetVideoQueryData['video'];
}

export default function VideoHeader({ video }: VideoHeaderProps) {
  const [subscribeChannel] = useMutation(SUBSCRIBE_CHANNEL);
  const [unSubscribeChannel] = useMutation(UNSUBSCRIBE_CHANNEL);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { loading: userLoading, error: userError, data: userData, refetch: userRefetch } = useQuery(GET_USER_BY_AUTH);

  useEffect(() => {
    if (userData) {
      setIsSubscribed(userData.userByAuth?.subscribechannelids.includes(video?.uploader.id));
    }
  }, [userData]);

  const handleLogin = () => {
    window.location.href = '/login';
  };

  const handleSubscriptionChange = async (channelID: string, subscribe: boolean) => {
    try {
      const response = subscribe
        ? await subscribeChannel({ variables: { channelID } })
        : await unSubscribeChannel({ variables: { channelID } });
      if (subscribe && response.data.subscribeChannel.isSuccess) {
        console.log("Subscribed successfully");
        setIsSubscribed(true);
        userRefetch();
      } else if (!subscribe && response.data.unSubscribeChannel.isSuccess) {
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
          <Image src={video.uploader.profileImageURL} alt={video.uploader.name} className="w-10 h-10 rounded-full" width={100} height={100} />
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
                  ? 'bg-red-500 hover:bg-red-700'
                  : 'bg-blue-500 hover:bg-blue-700'
              } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
              onClick={() => handleSubscriptionChange(video.uploader.id, !isSubscribed)}
            >
              {isSubscribed ? '登録済み' : 'チャンネル登録'}
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
        <p className="text-sm text-white">{whenTimeAgo(video.createdAt)}</p>
        <p className="text-white">{video.description}</p>
      </div>
    </div>
  );
}
