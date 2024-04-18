import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import CustomLink from "./custom-link";
import { useEffect, useState } from "react";

export default function UploadVideoButton() {
  const [token, setToken] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      // localStorageからトークンを取得し、状態にセットします
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
      } else {
        console.log("token not found");
      }
    }
  }, []);

  return (
    // aダグだと、再レンダリングが発生するため、CustomLinkコンポーネントを使用します
    <CustomLink href={!token ? "/login" : "/video/upload"}>
      <div className="flex items-center p-2 rounded-lg hover:bg-gray-700 group">
        <img
          src="/upload_video.svg"
          alt="Login"
          className="w-6 h-6 rounded-full "
        />
        <span className="ml-2 text-white font-bold">アップロード</span>
      </div>
    </CustomLink>
  );
}
