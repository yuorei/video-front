"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Hls from "hls.js";
import {
  Play,
  Pause,
  Volume2,
  PictureInPicture,
  FastForward,
  Maximize,
  Camera,
  Scissors,
} from "lucide-react";
import { GetVideoFragmentFragment } from "@/app/gql/graphql";
import { useMutation, useLazyQuery } from "@apollo/client";
import { graphql } from "@/app/gql";

export interface Ad {
  adURL: string;
  adTiming: number;
}

interface HLSPlayerProps {
  src: string;
  ads: Ad[];
  video: GetVideoFragmentFragment;
}

const incrementWatchCountDocument = graphql(/* GraphQL */ `
  mutation IncrementWatchCount($input: IncrementWatchCountInput!) {
    IncrementWatchCount(input: $input) {
      watchCount
    }
  }
`);

const watchCountAdVideoDocument = graphql(`
  mutation WatchCountAdVideo($input: WatchCountAdVideoInput!) {
    watchCountAdVideo(input: $input) {
      success
    }
  }
`);

const trimVideoDocument = graphql(/* GraphQL */ `
  query CutVideo($input: CutVideoInput!) {
    cutVideo(input: $input) {
      cutVideoURL
    }
  }
`);

const useTrimVideo = (videoId: string) => {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [trimVideo, { loading, error, data }] = useLazyQuery(trimVideoDocument);

  useEffect(() => {
    if (startTime !== null && endTime !== null) {
      trimVideo({
        variables: {
          input: {
            VideoID: videoId,
            StartTime: Math.ceil(startTime),
            EndTime: Math.ceil(endTime),
          },
        },
      });
    }
  }, [startTime, endTime, trimVideo, videoId]);

  useEffect(() => {
    if (loading) console.log("Loading...");
    if (error) alert("トリミングに失敗しました: " + error);
    if (data && data.cutVideo && data.cutVideo.cutVideoURL) {
      const a = document.createElement("a");
      a.href = data.cutVideo.cutVideoURL;
      a.download = "trimmed-video.mp4";
      a.click();
    }
  }, [loading, error, data]);

  const handleTrim = useCallback((start: number, end: number) => {
    setStartTime(start);
    setEndTime(end);
  }, []);

  return handleTrim;
};

const HLSPlayer: React.FC<HLSPlayerProps> = ({
  src,
  ads,
  video: videoInfo,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isPiPSupported, setIsPiPSupported] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAltVideo, setIsAltVideo] = useState(false);
  const [isAdPlayed, setIsAdPlayed] = useState(false);
  const [currentTime2, setCurrentTime2] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isCounted, setIsCounted] = useState(false);
  const [IncrementWatchCount] = useMutation(incrementWatchCountDocument);
  const [watchCountAdVideo] = useMutation(watchCountAdVideoDocument);
  const [showTrimModal, setShowTrimModal] = useState(false);
  const [trimStart, setTrimStart] = useState("0");
  const [trimEnd, setTrimEnd] = useState("0");

  // const handleTrim = (startTime: number, endTime: number) => {
  //   useTrimVideo(video.id, startTime, endTime);
  // };
  const handleTrim = useTrimVideo(videoInfo.id);

  const handleTrimButtonClick = () => {
    setTrimStart("0");
    setTrimEnd(videoRef.current?.currentTime.toFixed(2) ?? "0");
    setShowTrimModal(true);
  };

  const handleTrimConfirm = () => {
    handleTrim(parseFloat(trimStart), parseFloat(trimEnd));
    setShowTrimModal(false);
  };

  useEffect(() => {
    if (!isCounted && videoInfo) {
      try {
        if (localStorage.getItem("clientID") === null) {
          localStorage.setItem(
            "clientID",
            "client" + "_" + crypto.randomUUID()
          );
        }
        IncrementWatchCount({
          variables: {
            input: {
              VideoID: videoInfo.id,
              UserID: localStorage.getItem("clientID") as string,
            },
          },
        });

        setIsCounted(true);
      } catch (e) {
        console.log(e);
      }
    }
  }, [isCounted, videoInfo, IncrementWatchCount, videoInfo.id]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const hideControls = () => {
      timer = setTimeout(() => {
        setShowControls(false);
      }, 3000); // 3秒後にコントロールを非表示
    };

    const showControlsOnMove = () => {
      setShowControls(true);
      clearTimeout(timer);
      hideControls();
    };

    if (containerRef.current) {
      containerRef.current.addEventListener("mousemove", showControlsOnMove);
      containerRef.current.addEventListener("touchstart", showControlsOnMove);
    }

    hideControls();

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener(
          "mousemove",
          showControlsOnMove
        );
        containerRef.current.removeEventListener(
          "touchstart",
          showControlsOnMove
        );
      }
      clearTimeout(timer);
    };
  }, []);

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
    if (ads.length === 0) return;
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

      const getClientIP = async (): Promise<string> => {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        return data.ip;
      };

      const onAltVideoEnd = async () => {
        if (isAltVideo) {
          try {
            if (localStorage.getItem("clientID") === null) {
              localStorage.setItem(
                "clientID",
                "client" + "_" + crypto.randomUUID()
              );
            }

            const clientIP = await getClientIP();

            watchCountAdVideo({
              variables: {
                input: {
                  adID: ads[currentTime2].adURL,
                  city: "",
                  clientID: localStorage.getItem("clientID") as string,
                  country: "",
                  description: videoInfo.description || "",
                  hostname: window.location.hostname,
                  ipAddress: clientIP,
                  language: navigator.language,
                  location: "",
                  networkDownlink: "",
                  networkEffectiveType: "",
                  org: "",
                  pageTitle: document.title,
                  platform: navigator.platform,
                  postal: "",
                  referrer: document.referrer,
                  region: "",
                  tags: (videoInfo.Tags as string[]) || [],
                  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                  title: document.title,
                  url: window.location.href,
                  userAgent: navigator.userAgent,
                  userID: "",
                  videoID: videoInfo.id,
                },
              },
            });

            setIsCounted(true);
          } catch (e) {
            console.log(e);
          }
          // }
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
        // HLS support for platforms
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
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const captureScreenshot = () => {
    const video = videoRef.current;
    if (video) {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas
        .getContext("2d")
        ?.drawImage(video, 0, 0, canvas.width, canvas.height);

      const screenshot = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = screenshot;
      link.download = "screenshot.png";
      link.click();
    }
  };

  return (
    <div
      ref={containerRef}
      className="max-w-4xl mx-auto bg-gray-900 rounded-lg overflow-hidden shadow-xl relative"
    >
      <div className="relative">
        <video
          className="w-full aspect-video cursor-pointer"
          ref={videoRef}
          autoPlay
          onClick={handlePlayPause}
          onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
        />
        {isAltVideo && (
          <div className="absolute top-0 left-0 bg-red-500 text-white px-2 py-1 m-2 rounded-md text-sm font-semibold">
            広告再生中
          </div>
        )}
        {showControls && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            {!isAltVideo && (
              <div className="flex items-center space-x-2 mb-2">
                <input
                  type="range"
                  className="w-full h-1 accent-blue-500 appearance-none bg-gray-300 rounded-full overflow-hidden"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={(e) => {
                    const newTime = parseFloat(e.target.value);
                    setCurrentTime(newTime);
                    if (videoRef.current)
                      videoRef.current.currentTime = newTime;
                  }}
                  style={{
                    background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${
                      (currentTime / duration) * 100
                    }%, #D1D5DB ${
                      (currentTime / duration) * 100
                    }%, #D1D5DB 100%)`,
                  }}
                />
                <div className="text-white text-sm font-mono whitespace-nowrap">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  className="text-white hover:text-blue-400 transition-colors"
                  onClick={handlePlayPause}
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <Volume2 size={20} className="text-white" />
                <input
                  type="range"
                  className="w-24 accent-blue-500"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => {
                    const newVolume = parseFloat(e.target.value);
                    setVolume(newVolume);
                    if (videoRef.current) videoRef.current.volume = newVolume;
                  }}
                />
              </div>
              <div className="flex items-center space-x-4">
                {!isAltVideo && (
                  <select
                    className="bg-transparent text-white text-sm border border-white rounded px-2 py-1"
                    value={playbackRate}
                    onChange={(e) => {
                      const newRate = parseFloat(e.target.value);
                      setPlaybackRate(newRate);
                      if (videoRef.current)
                        videoRef.current.playbackRate = newRate;
                    }}
                  >
                    {[0.25, 0.5, 1, 1.5, 2, 2.5, 3].map((rate) => (
                      <option key={rate} value={rate} className="text-black">
                        {rate}x
                      </option>
                    ))}
                  </select>
                )}
                <button
                  className="text-white hover:text-blue-400 transition-colors"
                  onClick={captureScreenshot}
                  title="スクリーンショットを撮る"
                >
                  <Camera size={20} />
                </button>
                <button
                  className="text-white hover:text-blue-400 transition-colors"
                  onClick={handleTrimButtonClick}
                  title="動画をトリミング"
                >
                  <Scissors size={20} />
                </button>
                {showTrimModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                      <h2 className="text-xl font-bold mb-4">
                        動画をトリミング
                      </h2>
                      <div className="mb-4">
                        <label
                          htmlFor="trimStart"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          開始時間
                        </label>
                        <input
                          id="trimStart"
                          type="number"
                          value={trimStart}
                          onChange={(e) => setTrimStart(e.target.value)}
                          className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="trimEnd"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          終了時間
                        </label>
                        <input
                          id="trimEnd"
                          type="number"
                          value={trimEnd}
                          onChange={(e) => setTrimEnd(e.target.value)}
                          className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setShowTrimModal(false)}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                          キャンセル
                        </button>
                        <button
                          onClick={handleTrimConfirm}
                          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          トリミングを実行
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {isPiPSupported && (
                  <button
                    className="text-white hover:text-blue-400 transition-colors"
                    onClick={() => videoRef.current?.requestPictureInPicture()}
                    title="ピクチャーインピクチャー"
                  >
                    <PictureInPicture size={20} />
                  </button>
                )}
                <button
                  className="text-white hover:text-blue-400 transition-colors"
                  onClick={toggleFullscreen}
                  title="全画面表示"
                >
                  <Maximize size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HLSPlayer;
