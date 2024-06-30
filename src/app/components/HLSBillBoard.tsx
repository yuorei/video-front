"use client";
import React, { useEffect, useRef } from "react";
import Hls from "hls.js";
import { Video } from "@/app/model/video";
import { AiOutlineInfoCircle } from "react-icons/ai";
import BillBoardPlayButton from "./BillBoardPlayButton";


interface HLSPlayerProps {
  billBoardVideo: Video;
}

const HLSBillBoard: React.FC<HLSPlayerProps> = ({ billBoardVideo }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let hls: Hls;

    if (videoRef.current) {
      const video = videoRef.current;

      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(billBoardVideo.videoURL);
        hls.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // HLS support for platforms like Safari
        video.src = billBoardVideo.videoURL;
      }

      return () => {
        if (hls) {
          hls.destroy();
        }
      };
    }
  }, [billBoardVideo.videoURL]);

  return (
    <div className="relative h-[56.25vw]">
      <video
        className="
            w-full
            h-[56.25vw]
            object-cover
            brightness-[60%]
        "
        ref={videoRef}
        autoPlay
        muted
        loop
        controls={false}
        poster={billBoardVideo.thumbnailImageURL}
      />
      <div className="absolute top-[30%] md:top-[40%] ml-4 md:ml-16">
        <p
          className="
        text-white
        text-1xl
        md:text-5xl
        h-full
        w-[50%]
        lg:text-6xl
        font-bold
        drop-shadow-xl
      "
        >
          {billBoardVideo.title}
        </p>
        <p
          className="
            text-white
            text-[8px]
            md:text-lg
            mt-3
            md:mt-8
            w-[90%]
            md:w-[80%]
            lg:w-[50%]
            drop-shadow-xl
        "
        >
          {/* TODO: 英語の文字列が長すぎるとよこに飛び出てしまう */}
          {billBoardVideo.description}
        </p>
        <div className="flex flex-row items-center mt-3 md:mt-4 gap-3">
        <BillBoardPlayButton movieId={billBoardVideo.id} />
          <button
            className="
            bg-white
            text-white
            bg-opacity-30
            rounded-md
            py-1 md:py-2
            px-2 md:px-4
            w-auto
            text-xs lg:text-lg
            font-semibold
            flex
            flex-row
            items-center
            hover:bg-opacity-20
            transition
        "
          >
            <AiOutlineInfoCircle className="mr-1" />
            詳細
          </button>
        </div>
      </div>
    </div>
  );
};

export default HLSBillBoard;
