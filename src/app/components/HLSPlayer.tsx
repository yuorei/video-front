'use client'
import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

interface HLSPlayerProps {
  src: string;
}

const HLSPlayer: React.FC<HLSPlayerProps> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    let hls: Hls;

    if (videoRef.current) {
      const video = videoRef.current;

      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // HLS support for platforms like Safari
        video.src = src;
      }

      return () => {
        if (hls) {
          hls.destroy();
        }
      };
    }
  }, [src]);

  // 再生時間の取得
  useEffect(() => {
    const handleTimeUpdate = () => {
      setCurrentTime(videoRef.current?.currentTime as number);
    };

    const videoElement = videoRef.current;
    videoElement?.addEventListener('timeupdate', handleTimeUpdate);

    // クリーンアップ関数
    return () => {
      videoElement?.removeEventListener('timeupdate', handleTimeUpdate);
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

  const decimalPoint = 0;
  return (
    <div>
      <video className="w-full" ref={videoRef} controls autoPlay />
      {/* <p>現在の再生時間: {currentTime.toFixed(decimalPoint)} 秒</p> */}
      {/* <input
        type="range"
        min="0"
        max={videoRef.current?.duration || 0}
        step="1"
        value={currentTime}
        onChange={handleTimeChange}
      /> */}
    </div>

  )
};

export default HLSPlayer;
