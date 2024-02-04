import CustomLink from "./custom-link"

export default function Footer() {
  return (
    <footer className="flex flex-col justify-center w-full px-4 mx-0 my-4 space-y-1 text-sm md:max-w-3xl md:my-12 md:mx-auto sm:px-6 md:h-5 md:items-center md:space-y-0 md:space-x-4 md:flex-row">
      <CustomLink href="https://yuorei.com">ユオレイ</CustomLink>
      <CustomLink href="https://twitter.com/yuorei71">
        @yuorei71
      </CustomLink>
      <CustomLink href="https://github.com/yuorei/video-server">
        Source on GitHub
      </CustomLink>
      <CustomLink href="/policy">Policy</CustomLink>
      <CustomLink href="/help">Help</CustomLink>
    </footer>
  )
}
