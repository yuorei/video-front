import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import CustomLink from "./custom-link";
import Image from "next/image";
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
            <Button variant="ghost" className="p-0">
                <Image src="/logo.png" alt="Home" width="32" height="32" />
            </Button>
        </CustomLink>
    );
}
