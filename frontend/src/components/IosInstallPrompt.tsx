"use client";

import { useEffect, useState } from "react";
import { Share, X } from "lucide-react";


export default function IosInstallPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const isIos =
      /iphone|ipad|ipod/i.test(window.navigator.userAgent) &&
      !(window.navigator as Navigator & { standalone?: boolean }).standalone;

    const isSafari =
      /safari/i.test(window.navigator.userAgent) &&
      !/crios|fxios|edgios|opios/i.test(window.navigator.userAgent);

    const dismissed = localStorage.getItem("ios-pwa-dismissed");

    if (isIos && isSafari && !dismissed) {
      const timer = setTimeout(() => {
        setShow(true);
      }, 1800);

      return () => clearTimeout(timer);
    }
  }, []);

  function dismiss() {
    localStorage.setItem("ios-pwa-dismissed", "true");
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed inset-x-4 bottom-5 z-[100] sm:inset-x-auto sm:right-6 sm:w-[380px]">
      <div className="relative overflow-hidden rounded-3xl bg-[#102d2b] p-5 text-white shadow-2xl ring-1 ring-white/10">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="absolute right-4 top-4 grid size-8 place-items-center rounded-full bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"
        >
          <X className="size-4" />
        </button>

        <div className="pr-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ffd34b]">
            Fresh Oil 2026
          </p>

          <h3 className="mt-2 text-xl font-bold tracking-tight">
            Keep Fresh Oil with you
          </h3>

          <p className="mt-2 text-sm leading-6 text-white/70">
            Add this site to your iPhone home screen for quick access to the
            conference, programme and updates.
          </p>
        </div>

        <div className="mt-5 rounded-2xl bg-white/10 p-4">
          <div className="flex items-start gap-3">
            <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-[#1855df]">
              <Share className="size-4" />
            </div>

            <div className="text-sm leading-6 text-white/80">
              <p>
                Tap <strong className="text-white">Share</strong> in Safari,
                then choose{" "}
                <strong className="text-white">Add to Home Screen</strong>.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={dismiss}
          className="mt-4 w-full rounded-full bg-[#ffd34b] px-5 py-3 text-sm font-bold text-[#102d2b] transition hover:bg-white"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
