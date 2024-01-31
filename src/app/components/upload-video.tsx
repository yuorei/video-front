import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import CustomLink from "./custom-link"
import Image from "next/image"
import { useCookies } from "react-cookie"

export default function UploadVideoButton() {
    const [cookies] = useCookies(["idToken"]);
    return (
        <CustomLink href={!cookies.idToken ? "/login" : "/video/upload"}>
            <Button variant="ghost" className="p-0">
                <Image src="/logo.png" alt="Home" width="32" height="32" />
            </Button>
        </CustomLink>
    )
}