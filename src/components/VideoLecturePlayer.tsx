import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Radio, CheckCircle2, Clock } from 'lucide-react';
import type { Chapter, Language, VideoProgressEntry } from '../types/education';
import { LIVE_CLASSES } from '../data/syllabusData';

interface VideoLecturePlayerProps {
  chapter: Chapter;
  language: Language;
  savedProgress?: VideoProgressEntry;
  onProgressUpdate: (chapterId: string, watchedSeconds: number, totalSeconds: number) => void;
}

export const VideoLecturePlayer: React.FC<VideoLecturePlayerProps> = ({
  chapter,
  language,
  savedProgress,
  onProgressUpdate
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [quality, setQuality] = useState<'360p' | '720p' | '1080p'>('720p');
  const [speed, setSpeed] = useState<number>(1);
  const [currentTime, setCurrentTime] = useState<number>(savedProgress?.watchedSeconds || 0);
  const [duration, setDuration] = useState<number>(chapter.videoDurationMin * 60);
  const [videoError, setVideoError] = useState(false);
  const [activeLiveId, setActiveLiveId] = useState<string | null>(null);
  const isHi = language === 'hi';

  useEffect(() => {
    setVideoError(false);
    setIsPlaying(false);
    setCurrentTime(savedProgress?.watchedSeconds || 0);
    setDuration(savedProgress?.totalSeconds || chapter.videoDurationMin * 60);
  }, [chapter.id]);

  // Simulated fallback timer when external sample mp4 is blocked in sandboxed environments
  useEffect(() => {
    if (!videoError || !isPlaying) return;
    const interval = window.setInterval(() => {
      setCurrentTime((prev) => {
        const next = Math.min(duration, prev + speed);
        onProgressUpdate(chapter.id, next, duration);
        return next;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [videoError, isPlaying, speed, duration, chapter.id, onProgressUpdate]);

  const togglePlay = () => {
    if (videoError) {
      setIsPlaying((prev) => !prev);
      return;
    }
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) {
      vid.play().then(() => setIsPlaying(true)).catch(() => setVideoError(true));
    } else {
      vid.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (seconds: number) => {
    setCurrentTime(seconds);
    if (videoRef.current && !videoError) {
      videoRef.current.currentTime = seconds;
    }
    onProgressUpdate(chapter.id, seconds, duration);
  };

  const handleSpeedChange = (nextSpeed: number) => {
    setSpeed(nextSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = nextSpeed;
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const progressPct = duration > 0 ? Math.min(100, Math.round((currentTime / duration) * 100)) : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="relative bg-slate-950 aspect-video w-full flex items-center justify-center">
          {!videoError ? (
            <video
              ref={videoRef}
              src={chapter.videoUrl}
              muted={isMuted}
              playsInline
              onLoadedMetadata={(e) => {
                const vid = e.currentTarget;
                if (vid.duration && Number.isFinite(vid.duration)) {
                  setDuration(Math.round(vid.duration));
                }
                if (savedProgress && savedProgress.watchedSeconds > 5 && savedProgress.watchedSeconds < vid.duration) {
                  vid.currentTime = savedProgress.watchedSeconds;
                }
              }}
              onTimeUpdate={(e) => {
                const t = Math.floor(e.currentTarget.currentTime);
                setCurrentTime(t);
                if (t % 5 === 0) {
                  onProgressUpdate(chapter.id, t, duration);
                }
              }}
              onError={() => setVideoError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
              <p className="text-xs font-medium text-blue-300 mb-2">
                {chapter.board} · {quality} · {speed}x
              </p>
              <h4 className="text-lg sm:text-xl font-semibold max-w-xl text-balance">
                {isHi ? chapter.videoTitleHi : chapter.videoTitleEn}
              </h4>
              <p className="text-sm text-slate-300 mt-2 max-w-lg">
                {isHi
                  ? 'इंटरैक्टिव लेक्चर प्लेयर सक्रिय है — नीचे टॉपिक टाइमस्टैम्प पर क्लिक करें या प्ले दबाएं।'
                  : 'Interactive lecture storyboard mode active — press Play or jump to any topic timestamp below.'}
              </p>
              <div className="mt-5 w-full max-w-md bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-left">
                <p className="text-xs text-blue-300 font-medium">
                  {isHi ? 'मुख्य बिंदु' : 'Board Key Concept'}
                </p>
                <p className="text-xs text-slate-200 mt-1 font-mono-tabular">
                  {chapter.keyFormulas[0] || (isHi ? chapter.summaryHi.slice(0, 90) : chapter.summaryEn.slice(0, 90))}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Custom Player Controls */}
        <div className="p-4 border-t border-slate-200 bg-white space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={duration}
              value={currentTime}
              onChange={(e) => handleSeek(Number(e.target.value))}
              aria-label="Seek video lecture"
              className="w-full accent-blue-700 cursor-pointer"
            />
            <span className="text-xs font-mono-tabular text-slate-600 whitespace-nowrap shrink-0">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={togglePlay}
                className="inline-flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-xl bg-blue-700 text-white text-sm font-medium hover:bg-blue-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? (isHi ? 'रोकें' : 'Pause') : (isHi ? 'चलाएं' : 'Play')}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsMuted((m) => !m)}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
                className="p-2.5 min-h-[44px] min-w-[44px] rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <span className="text-xs text-slate-500 tabular-nums ml-1">
                {progressPct}% {isHi ? 'देखा गया' : 'watched'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                {(['360p', '720p', '1080p'] as const).map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setQuality(q)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      quality === q ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                {[1, 1.25, 1.5, 2].map((sp) => (
                  <button
                    key={sp}
                    type="button"
                    onClick={() => handleSpeedChange(sp)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      speed === sp ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {sp}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Topic-wise Video Timestamps */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <h4 className="text-sm font-semibold text-slate-900 mb-3">
          {isHi ? 'विषय-वार वीडियो अध्याय (Topic Timestamps)' : 'Topic-Wise Video Segments'}
        </h4>
        <div className="divide-y divide-slate-100">
          {chapter.videoTopics.map((topic) => (
            <button
              key={topic.timeLabel}
              type="button"
              onClick={() => handleSeek(topic.seconds)}
              className="w-full py-3 flex items-center justify-between text-left hover:bg-blue-50/50 px-2 rounded-lg transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-blue-700 shrink-0" />
                <span className="text-sm font-medium text-slate-800">
                  {isHi ? topic.titleHi : topic.titleEn}
                </span>
              </div>
              <span className="text-xs font-mono-tabular text-blue-700 font-medium">
                {topic.timeLabel}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Live Classes Schedule */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <h4 className="text-sm font-semibold text-slate-900 mb-3">
          {isHi ? 'लाइव क्लासेस शेड्यूल' : 'Live Classes'}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {LIVE_CLASSES.map((live) => {
            const joined = activeLiveId === live.id;
            return (
              <div key={live.id} className="border border-slate-200 rounded-xl p-4 flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Radio className={`w-3.5 h-3.5 ${live.isLiveNow ? 'text-blue-700' : 'text-slate-400'}`} />
                    <span>{live.scheduleTime}</span>
                    <span aria-hidden="true">·</span>
                    <span>{live.teacher}</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 mt-1">
                    {isHi ? live.titleHi : live.titleEn}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveLiveId(joined ? null : live.id)}
                  className={`px-3 py-2 min-h-[44px] rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center justify-center gap-1.5 ${
                    joined
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  {joined && <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>
                    {joined
                      ? (isHi ? 'लाइव रूम में जुड़े हुए हैं' : 'Joined Live Classroom')
                      : live.isLiveNow
                        ? (isHi ? 'लाइव क्लास जॉइन करें' : 'Join Live Class')
                        : (isHi ? 'रिमाइंडर सेट करें' : 'Set Reminder')}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
