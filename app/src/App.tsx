import { useState } from 'react'
import RadarScreen from './screens/RadarScreen'
import FundingScreen from './screens/FundingScreen'
import TrendsScreen from './screens/TrendsScreen'
import DigestScreen from './screens/DigestScreen'
import { FeedProvider, useFeed } from './data/store'

type Tab = 'radar' | 'funding' | 'trends' | 'digest'

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  {
    id: 'radar',
    label: 'Radar',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
        <line x1="12" y1="2" x2="12" y2="6" />
      </svg>
    ),
  },
  {
    id: 'funding',
    label: 'Funding',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
  },
  {
    id: 'trends',
    label: 'Trends',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
        <line x1="2" y1="20" x2="22" y2="20" />
      </svg>
    ),
  },
  {
    id: 'digest',
    label: 'Digest',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="12" y2="17" />
      </svg>
    ),
  },
]

function Shell() {
  const [tab, setTab] = useState<Tab>('radar')
  const { loading } = useFeed()

  const screens: Record<Tab, React.ReactNode> = {
    radar: <RadarScreen />,
    funding: <FundingScreen />,
    trends: <TrendsScreen />,
    digest: <DigestScreen />,
  }

  return (
    // Full-bleed on phones; a centered phone-width column on desktop.
    <div className="min-h-[100dvh] w-full flex justify-center bg-[#040810]">
      <div
        className="relative flex flex-col w-full max-w-[440px] bg-[#070C16]
                   h-[100dvh] md:h-[92dvh] md:max-h-[920px] md:my-auto
                   md:rounded-[40px] md:shadow-[0_0_0_1px_#1E2C46,0_32px_80px_rgba(0,0,0,0.7)]
                   overflow-hidden"
      >
        <div className="flex-1 min-h-0 overflow-hidden">
          {loading ? <LoadingView /> : screens[tab]}
        </div>

        {/* Bottom tab bar */}
        <nav
          className="flex-shrink-0 flex items-stretch border-t border-[#1E2C46] bg-[#101B30]"
          style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
        >
          {TABS.map((t) => {
            const active = tab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                aria-current={active ? 'page' : undefined}
                className="flex-1 flex flex-col items-center gap-0.5 pt-3 transition-colors focus-visible:outline-2 focus-visible:outline-[#00C2C7]"
                style={{ color: active ? '#00C2C7' : '#8FA3C0' }}
              >
                {t.icon}
                <span className="text-[10px] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {t.label}
                </span>
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

function LoadingView() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-4">
      <svg width="72" height="72" viewBox="0 0 72 72" className="sweep-line">
        <circle cx="36" cy="36" r="34" fill="none" stroke="#1E2C46" strokeWidth="1" />
        <circle cx="36" cy="36" r="22" fill="none" stroke="#1E2C46" strokeWidth="1" />
        <line x1="36" y1="36" x2="36" y2="2" stroke="#00C2C7" strokeWidth="1.5" />
      </svg>
      <p className="font-mono text-[12px] text-[#8FA3C0]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
        Scanning feed…
      </p>
    </div>
  )
}

export default function App() {
  return (
    <FeedProvider>
      <Shell />
    </FeedProvider>
  )
}
