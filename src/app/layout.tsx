import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Footer from "@/app/components/footer"
import Header from "@/app/components/header"
import { WithApolloProvider } from "./providers/WithApolloProvider";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "YuoVision",
  description:
    `YuoVisionは、動画の視聴とアップロードが可能な動画配信プラットフォームです。
    あなたの動画をアップロードして、世界中の人々と共有しましょう。新しい発見をYuoVisionでシェアし、一緒に新しい世界を探求しましょう。`,
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "YuoVision",
    images: [
      {
        url: "https://yuovision.yuorei.com",
        width: 1200,
        height: 630,
        alt: "YuoVision",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YuoVision',
    description: 'YuoVisionは、動画の視聴とアップロードが可能な動画配信プラットフォームです。',
    site: '@yuovision',
    creator: '@yuorei71',
  },
}

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WithApolloProvider>
          <div className="flex flex-col justify-between w-full h-full min-h-screen">
            <Header />
            <main className="flex-auto  w-full px-10 py-4 mx-auto sm:px-6 md:py-6">
              {children}
            </main>
            <Footer />
          </div>
        </WithApolloProvider>
      </body>
    </html>
  )
}

