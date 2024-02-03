import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import CustomLink from "./custom-link";
import { useEffect, useState } from "react";

export default function UploadVideoButton() {
    const [token, setToken] = useState("");

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // localStorageからトークンを取得し、状態にセットします
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                setToken(storedToken);
            } else {
                console.log("token not found");
            }
        }
    }, []);

    return (
        <CustomLink href={!token ? "/login" : "/video/upload"}>
            <Button variant="ghost" className="bg-black border border-white text-white font-bold py-2 px-4 rounded">
                動画アップロード
            </Button>
        </CustomLink>
    );
}
