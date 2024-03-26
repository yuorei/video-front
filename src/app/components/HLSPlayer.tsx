import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

interface HLSPlayerProps {
  src: string; // 元の動画URL
  altSrc: string; // 別の動画URL
  switchTime: number; // 切り替える時間（秒）
}

const HLSPlayer: React.FC<HLSPlayerProps> = ({ src, altSrc, switchTime }) => {
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
    const t = params.get('t');
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
        if (video.currentTime >= switchTime && !isAltVideo && !isAdPlayed) {
          setCurrentTime(videoRef.current?.currentTime as number);
          video.src = altSrc; // 広告動画をセット
          video.play();
          setIsAltVideo(true);
        }
      };

      const onAltVideoEnd = () => {
        if (isAltVideo) {
          video.src = src; // 元の動画に戻す
          video.currentTime = switchTime; //広告挿入タイミングに戻す
          setIsAdPlayed(true);
          video.play();
          setIsAltVideo(false);
          setCurrentTime2(currentTime2 + 1)
        }
      };

      video.addEventListener('timeupdate', switchVideo);
      video.addEventListener('ended', onAltVideoEnd);

      return () => {
        video.removeEventListener('timeupdate', switchVideo);
        video.removeEventListener('ended', onAltVideoEnd);
      };
    }
  }, [src, altSrc, switchTime, isAltVideo]);

  // HLSのセットアップ
  useEffect(() => {
    let hls: Hls;

    if (videoRef.current) {
      const video = videoRef.current;

      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(isAltVideo ? altSrc : src);
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // HLS support for platforms like Safari
        video.src = isAltVideo ? altSrc : src;
      }

      return () => {
        if (hls) {
          hls.destroy();
        }
      };
    }
  }, [src, altSrc, isAltVideo]);

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

  // PiP
  useEffect(() => {
    const video = videoRef.current;

    if (video && 'pictureInPictureEnabled' in document) {
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
  const handlePlaybackRateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
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
      {/* <button onClick={handlePlayPause}>{videoRef.current?.paused ? '再生' : '一時停止'}</button>
      <select value={playbackRate} onChange={handlePlaybackRateChange}>
        <option value={1}>通常</option>
        <option value={1.5}>1.5倍速</option>
        <option value={2}>2倍速</option>
      </select>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleVolumeChange}
      />
      {isPiPSupported && (
        <button onClick={enterPiP}>PiPモードに切り替える</button>
      )}
       <button onClick={enterFullscreen}>全画面表示に切り替える</button> */}
    </div>
  );
};

export default HLSPlayer;
