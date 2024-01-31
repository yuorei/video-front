'use client'
// components/HLSPlayer.tsx
import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface HLSPlayerProps {
  src: string;
}

const HLSPlayer: React.FC<HLSPlayerProps> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

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

  return <video ref={videoRef} controls />;
};

export default HLSPlayer;
