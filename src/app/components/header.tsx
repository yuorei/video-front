'use client'
import { MainNav } from "./main-nav"
import UploadVideo from "./upload-video"
import Login from "./login"

export default function Header() {
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
