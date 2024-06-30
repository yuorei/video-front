import { Video } from "@/app/model/video";
import Link from "next/link";
import Image from "next/image";
import { timeAgo } from "@/app/lib/time";

//  Videoの配列を受け取る
export default function AllVideo(data: { videos: Video[] }) {
  return (
    <main>
      <div className="space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.videos.map((video: Video) => (
            <Link href={`/video/${video.id}`} key={video.id}>
              <div className="bg-black rounded-lg shadow-md overflow-hidden">
                <Image
                  src={video.thumbnailImageURL}
                  alt={video.title}
                  // layout="responsive" があると widthとheightの値が使えない
                  width={500}
                  height={300}
                  layout="responsive" // 必要に応じてレイアウトを設定
                />
                <div className="p-4 flex items-center">
                  <Link href={`/channel/${video.uploader.id}`}>
                    <Image
                      src={video.uploader.profileImageURL} // 投稿者のアイコン画像のURL
                      alt="Uploader Icon"
                      width={40}
                      height={40}
                      className="rounded-full mr-4" // アイコンの丸みを調整
                    />
                  </Link>
                  <div>
                    <h3 className="text-white font-semibold text-lg break-words">
                      {video.title}
                    </h3>
                    <p className="text-gray-400 break-words">
                      {video.uploader.name}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {timeAgo(video.createdAt)}
                    </p>
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
