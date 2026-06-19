import type { ReactNode } from 'react'

interface PhoneFrameProps {
  children: ReactNode
}

export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="flex min-h-full items-center justify-center bg-[#c8c8cd] p-6">
      {/* Device bezel */}
      <div
        className="relative flex h-[852px] w-[430px] flex-col overflow-hidden rounded-[3.25rem] bg-[#1c1c1e] p-[3px] shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
        role="region"
        aria-label="Kamvala mobile app"
      >
        {/* Screen */}
        <div className="phone-screen relative flex h-full w-full flex-col overflow-hidden rounded-[3rem] bg-kamvala-gray">
          {/* Dynamic Island */}
          <div
            className="pointer-events-none absolute left-1/2 top-[10px] z-40 h-[30px] w-[118px] -translate-x-1/2 rounded-full bg-black"
            aria-hidden="true"
          />

          {/* Status bar */}
          <div className="relative z-30 flex h-[50px] shrink-0 items-end justify-between px-7 pb-[6px]">
            <span className="text-[15px] font-semibold tracking-tight text-kamvala-text">9:41</span>
            <div className="flex items-center gap-[5px] text-kamvala-text" aria-hidden="true">
              <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor">
                <rect x="0" y="4" width="3" height="8" rx="1" opacity="0.35" />
                <rect x="5" y="2.5" width="3" height="9.5" rx="1" opacity="0.55" />
                <rect x="10" y="0" width="3" height="12" rx="1" />
              </svg>
              <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
                <path d="M8 2.4C5.6 2.4 3.4 3.3 1.8 5l-.8-.9C2.8 1.8 5.3.5 8 .5s5.2 1.3 7 3.6l-.8.9C12.6 3.3 10.4 2.4 8 2.4zm0 2.8c-1.4 0-2.7.5-3.7 1.5L3.5 5.8C4.8 4.5 6.3 3.8 8 3.8s3.2.7 4.5 2l-.8.9C10.7 5.7 9.4 5.2 8 5.2zm0 2.6c-.8 0-1.4.3-2 0.8L8 12l2-3.4c-.6-.5-1.2-.8-2-.8z" />
              </svg>
              <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
                <rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke="currentColor" opacity="0.35" />
                <rect x="2" y="2" width="16" height="8" rx="2" fill="currentColor" />
                <path d="M23.5 4.5v3a1.5 1.5 0 000-3z" fill="currentColor" opacity="0.4" />
              </svg>
            </div>
          </div>

          {/* App content */}
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            {children}
          </div>

          {/* Home indicator */}
          <div
            className="pointer-events-none absolute bottom-[6px] left-1/2 z-40 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-black/25"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  )
}
