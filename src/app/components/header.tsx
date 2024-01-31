'use client'
import { MainNav } from "./main-nav"
// import UserButton from "./user-button"
import UserRegisterButton from "./user-register"
import UploadVideo from "./upload-video"
import Login from "./login"
import { useCookies } from "react-cookie"

export default function Header() {
  const [cookies] = useCookies(["idToken"]);
  return (
    <header className="sticky flex justify-center border-b">
      <div className="flex items-center justify-between w-full h-16 px-4 mx-auto sm:px-6">
        <MainNav />
        <UploadVideo />
        <Login />
      </div>
    </header>
  )
}
