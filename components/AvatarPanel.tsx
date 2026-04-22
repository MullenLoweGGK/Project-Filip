"use client";

import { forwardRef } from "react";
import type { AppStatus } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";

interface AvatarPanelProps {
  status: AppStatus;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  // Last spoken text shown as subtitles in fullscreen
  subtitle?: string;
}

const AvatarPanel = forwardRef<HTMLVideoElement, AvatarPanelProps>(
  ({ status, isFullscreen, onToggleFullscreen, containerRef, subtitle }, ref) => {
    const isActive =
      status === "ready" ||
      status === "user-speaking" ||
      status === "avatar-speaking";

    return (
      <div
        ref={containerRef}
        className={`relative bg-zinc-950 overflow-hidden ${
          isFullscreen
            ? "w-full h-full"
            : "aspect-video w-full rounded-lg border border-zinc-700"
        }`}
      >
        {/* Avatar video — session.attach() writes directly here */}
        <video
          ref={ref}
          autoPlay
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isActive ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Idle placeholder — only shown in normal mode */}
        {!isActive && !isFullscreen && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 select-none">
            <svg
              className="w-14 h-14 text-zinc-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
            <span className="text-zinc-600 text-sm">Avatar stream will appear here</span>
          </div>
        )}

        {/* ── Fullscreen overlay ─────────────────────────────────────── */}
        {isFullscreen && (
          <div className="absolute inset-0 flex flex-col pointer-events-none">
            {/* Top bar — status + exit */}
            <div className="flex items-center justify-between px-6 py-5 pointer-events-auto">
              <StatusBadge status={status} />
              <button
                onClick={onToggleFullscreen}
                aria-label="Exit fullscreen"
                className="flex items-center gap-2 bg-black/50 hover:bg-black/70 text-white text-xs font-semibold px-3 py-2 rounded-lg backdrop-blur-sm transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5M15 15l5.25 5.25M9 15H4.5M9 15v4.5M9 15l-5.25 5.25" />
                </svg>
                Zatvoriť / ESC
              </button>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Subtitles — avatar live speech at the bottom */}
            <div className="px-8 pb-10 flex justify-center">
              <div
                className={`transition-all duration-300 ${
                  subtitle ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                }`}
              >
                {subtitle && (
                  <p className="inline-block bg-black/70 backdrop-blur-sm text-white text-xl sm:text-2xl leading-snug px-6 py-3 rounded-2xl max-w-3xl text-center">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Enter fullscreen button (visible when stream active) ─── */}
        {isActive && !isFullscreen && (
          <button
            onClick={onToggleFullscreen}
            aria-label="Enter fullscreen"
            className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white rounded-lg p-2 backdrop-blur-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

AvatarPanel.displayName = "AvatarPanel";
export { AvatarPanel };
