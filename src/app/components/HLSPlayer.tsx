"use client";
import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

export interface Ad {
  adURL: string;
  adTiming: number;
}

interface HLSPlayerProps {
  src: string; // 元の動画URL
  ads: Ad[]; // 広告情報の配列
}

const HLSPlayer: React.FC<HLSPlayerProps> = ({ src, ads }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1); // 初期音量は最大値である1としています
  const [isPiPSupported, setIsPiPSupported] = useState(false);
  const [isAltVideo, setIsAltVideo] = useState(false);
  const [isAdPlayed, setIsAdPlayed] = useState(false);
  const [currentTime2, setCurrentTime2] = useState(0);

  // クエリパラメーターから再生時間指定
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("t");
    if (t) {
      if (videoRef.current) {
        try {
          videoRef.current.currentTime = parseFloat(t);
        } catch (e) {
          console.log(e);
        }
      }
    }
  }, [src]);
  // 切り替えのロジック
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const switchVideo = () => {
        if (
          video.currentTime >= ads[currentTime2].adTiming &&
          !isAdPlayed &&
          !isAltVideo
        ) {
          setCurrentTime(videoRef.current?.currentTime as number);
          video.src = ads[currentTime2].adURL; // 広告動画をセット
          setIsAltVideo(true);
          video.play();
        }
      };

      const onAltVideoEnd = () => {
        if (isAltVideo) {
          video.src = src; // 元の動画に戻す
          video.currentTime = ads[currentTime2].adTiming; //広告挿入タイミングに戻す
          setIsAltVideo(false);
          video.play();
          setCurrentTime2(currentTime2 + 1);
          if (ads.length <= currentTime2 + 1) {
            setIsAdPlayed(true);
          }
        }
      };

      video.addEventListener("timeupdate", switchVideo);
      video.addEventListener("ended", onAltVideoEnd);

      return () => {
        video.removeEventListener("timeupdate", switchVideo);
        video.removeEventListener("ended", onAltVideoEnd);
      };
    }
  }, [src, ads, isAltVideo]);

  // HLSのセットアップ
  useEffect(() => {
    let hls: Hls;

    if (videoRef.current) {
      const video = videoRef.current;
      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(isAltVideo ? ads[currentTime2].adURL : src);
        hls.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // HLS support for platforms like Safari
        video.src = isAltVideo ? ads[currentTime2].adURL : src;
      }

      return () => {
        if (hls) {
          hls.destroy();
        }
      };
    }
  }, [src, ads, isAltVideo]);

  // 再生時間の取得
  useEffect(() => {
    const handleTimeUpdate = () => {
      setCurrentTime(videoRef.current?.currentTime as number);
    };

    const videoElement = videoRef.current;
    videoElement?.addEventListener("timeupdate", handleTimeUpdate);

    // クリーンアップ関数
    return () => {
      videoElement?.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [src]);

  // 再生位置の指定
  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(event.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  // PiP
  useEffect(() => {
    const video = videoRef.current;

    if (video && "pictureInPictureEnabled" in document) {
      setIsPiPSupported(true);
    } else {
      setIsPiPSupported(false);
    }
  }, [src]);

  // 再生ボタンのクリックハンドラ
  const handlePlayPause = () => {
    const video = videoRef.current;
    if (video) {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    }
  };

  // 倍速の変更ハンドラ
  const handlePlaybackRateChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newPlaybackRate = parseFloat(event.target.value);
    setPlaybackRate(newPlaybackRate);
    if (videoRef.current) {
      videoRef.current.playbackRate = newPlaybackRate;
    }
  };

  // 音量の変更ハンドラ
  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  // PiPモード
  const enterPiP = () => {
    if (videoRef.current) {
      videoRef.current.requestPictureInPicture();
    }
  };

  // フルスクリーン
  const enterFullscreen = () => {
    const video = videoRef.current;
    if (video) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      }
    }
  };

  const decimalPoint = 0;
  return (
    <div>
      <div className="relative">
        <video className="w-full" ref={videoRef} autoPlay />
        {isAltVideo ? (
          <p className="absolute top-0 left-0 bg-black text-white px-2 py-1">
            広告再生中
          </p>
        ) : null}
      </div>
      <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            onClick={handlePlayPause}
          >
            {/* TODO: SVGにする */}
            {videoRef.current?.paused ? "→" : "||"}
          </button>
          <p className="text-gray-600 ml-2">
            {currentTime.toFixed(decimalPoint)}/
            {videoRef.current?.duration.toFixed(decimalPoint)}
          </p>
        </div>
        {/* 音量設定 */}
        {/* <input
          type="range"
          className="mt-2 w-full md:w-2/3"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
        /> */}
        {!isAltVideo ? (
          <input
            type="range"
            className="mt-2 w-full"
            min="0"
            max={videoRef.current?.duration || 0}
            step="1"
            value={currentTime}
            onChange={handleTimeChange}
          />
        ) : null}
        {!isAltVideo ? (
          <div className="flex items-center mt-4 md:mt-0">
            <select
              className="selectbox-6 appearance-none min-w-230px h-11 px-4 py-1 border border-gray-300 rounded-full bg-white text-gray-700 font-normal text-sm cursor-pointer"
              value={playbackRate}
              onChange={handlePlaybackRateChange}
            >
              <option value={0.25}>0.25倍速</option>
              <option value={0.5}>0.5倍速</option>
              <option value={1}>標準</option>
              <option value={1.5}>1.5倍速</option>
              <option value={2}>2倍速</option>
              <option value={2.5}>2.5倍速</option>
              <option value={3}>3倍速</option>
            </select>
          </div>
        ) : null}
      </div>
      <div className="flex justify-center">
        {isPiPSupported && (
          <button
            className="mt-4 mr-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
            onClick={enterPiP}
          >
            PiP
          </button>
        )}
        {/* コンソールが有効になってしまう */}
        {/* <button className="px-4 py-2 bg-blue-500 text-white rounded-lg" onClick={enterFullscreen}>全画面</button> */}
      </div>
    </div>
  );
};
export default HLSPlayer;
