import { Button } from "./ui/button"
import CustomLink from "./custom-link"

export default function Login() {
    return (
        <CustomLink href="/login">
            <Button variant="ghost" className="bg-black border border-white text-white font-bold py-2 px-4 rounded">
                ログイン
            </Button>
        </CustomLink>
    )
}
