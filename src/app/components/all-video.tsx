import { Video } from "@/app/model/video";
import Link from "next/link";
import Image from "next/image";
import { useQuery, gql } from "@apollo/client";
import { timeAgo } from "@/app/lib/time";

export default function AllVideo() {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.videos.map((video: Video) => ( // index は不要になります
            <Link href={`/video/${video.id}`} key={video.id}> {/* key プロパティを追加 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <Image
                  src={video.thumbnailImageURL}
                  alt={video.title}
                  width={500} // 画像の幅を設定
                  height={300} // 画像の高さを設定
                  layout="responsive" // 必要に応じてレイアウトを設定
                />
                <div className="p-4 flex items-center">
                  <Link href={`/user/${video.uploader.id}`}>
                    <Image
                      src={""} // 投稿者のアイコン画像のURL
                      alt="Uploader Icon"
                      width={40} // アイコンの幅を設定
                      height={40} // アイコンの高さを設定
                      className="rounded-full mr-4" // アイコンの丸みを調整
                    />
                  </Link>
                  <div>
                    <h3 className="font-semibold text-lg break-words">{video.title}</h3>
                    <p className="text-gray-600 break-words">{video.uploader.name}</p>
                    <p className="text-gray-500 text-sm">{timeAgo(video.createdAt)}</p>
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
