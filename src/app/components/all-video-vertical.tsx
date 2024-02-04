'use client'
import React, { useEffect, useState } from "react";
import { Video } from "@/app/model/video";
import Link from "next/link";
import Image from "next/image";
import { useQuery, gql } from "@apollo/client";
import { timeAgo } from "@/app/lib/time";

interface Props {
    videoID: string;
}

export default function AllVideoVertical({ videoID }: Props) {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1280);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 1280);
        };

        window.addEventListener('resize', handleResize);

        // コンポーネントのアンマウント時にイベントリスナーを削除
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const GET_VIDEOS_QUERY = gql`
  query GetVideos {
    videos {
      id
      videoURL
      title
      thumbnailImageURL
      createdAt
      uploader {
        id
        name
        profileImageURL
      }
    }
  }
`;

    const { loading, error, data } = useQuery(GET_VIDEOS_QUERY);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :</p>
    return (
        <main>
            <div className="space-y-2">
                <div className="grid grid-cols-1 gap-4">
                    {data.videos
                        .filter((video: Video) => video.id !== videoID)
                        .map((video: Video) => (
                            <Link href={`/video/${video.id}`} key={video.id}>
                                <div className="flex flex-col sm:flex-row bg-black rounded-lg shadow-md overflow-hidden">
                                    <div className="flex-none">
                                        <Image
                                            src={video.thumbnailImageURL}
                                            alt={video.title}
                                            width={168}
                                            height={94}
                                            className="block w-full h-auto"
                                        />
                                    </div>
                                    <div className="p-4 flex flex-col justify-between bg-black">
                                        <div>
                                            <h3 className="text-white font-semibold text-lg break-words">{video.title}</h3>
                                            <div className="flex items-center">
                                                {
                                                    isMobile && (
                                                        <Link href={`/user/${video.uploader.id}`}>
                                                            <Image
                                                                src={video.uploader.profileImageURL}
                                                                alt="Uploader Icon"
                                                                width={40}
                                                                height={40}
                                                                className="rounded-full mr-4"
                                                            />
                                                        </Link>
                                                    )
                                                }
                                                <div>
                                                    <p className="text-gray-400 break-words">{video.uploader.name}</p>
                                                    <p className="text-gray-400 text-sm">{timeAgo(video.createdAt)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                </div>
            </div>
        </main>
    );
}
