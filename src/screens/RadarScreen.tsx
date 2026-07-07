import { useEffect, useRef, useState } from 'react'
import RadarSweep from '../components/RadarSweep'
import LeadCard from '../components/LeadCard'
import { useFeed } from '../data/store'
import type { Lead } from '../data/feed'

type Filter = 'All' | 'Hot' | 'Warm' | Lead['category']

const CHIPS: Filter[] = ['All', 'Hot', 'Warm', 'arrhythmia', 'structural', 'hf', 'mcs', 'devices']
const CHIP_LABELS: Record<string, string> = {
  All: 'All', Hot: 'Hot', Warm: 'Warm',
  arrhythmia: 'Arrhythmia/EP', structural: 'Structural Heart',
  hf: 'Heart Failure', mcs: 'MCS', devices: 'Devices',
}

const SWEEP_PREF_KEY = 'radar:sweepExpanded'

function fmtSync(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString('en-GB', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }) + ' UTC'
}

export default function RadarScreen() {
  const { feed, refresh, refreshing } = useFeed()
  const [filter, setFilter] = useState<Filter>('All')
  const [highlighted, setHighlighted] = useState<string | null>(null)
  const [sweepExpanded, setSweepExpanded] = useState(() => {
    try {
      const saved = localStorage.getItem(SWEEP_PREF_KEY)
      return saved === null ? true : saved === '1'
    } catch {
      return true
    }
  })
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    try { localStorage.setItem(SWEEP_PREF_KEY, sweepExpanded ? '1' : '0') } catch { /* ignore */ }
  }, [sweepExpanded])

  const leads = feed?.leads ?? []
  const counts = feed?.counts ?? { new_leads: 0, hot: 0, warm: 0, funding: 0 }

  const filtered = leads
    .filter((l) => {
      if (filter === 'All') return true
      if (filter === 'Hot') return l.tier === 'HOT'
      if (filter === 'Warm') return l.tier === 'WARM'
      return l.category === filter
    })
    .sort((a, b) => b.score - a.score)

  const handleBlipTap = (nct: string) => {
    setHighlighted(nct)
    setTimeout(() => setHighlighted(null), 2000)
    cardRefs.current[nct]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const noLeadsToday = counts.new_leads === 0

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between px-4 pt-12 pb-3 flex-shrink-0">
        <div>
          <h1 className="text-[#EAF1FB] text-2xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Radar
          </h1>
          <p className="font-mono text-[#8FA3C0] text-[11px]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
            {feed ? fmtSync(feed.updated) : '—'}{feed?.isMock ? ' · sample' : ''}
          </p>
        </div>
        <button
          onClick={refresh}
          className="w-9 h-9 rounded-full border border-[#1E2C46] flex items-center justify-center hover:border-[#00C2C7] transition-colors focus-visible:outline-2 focus-visible:outline-[#00C2C7]"
          aria-label="Refresh feed"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8FA3C0" strokeWidth="2"
               className={refreshing ? 'animate-spin' : ''}>
            <path d="M21 2v6h-6" /><path d="M3 12a9 9 0 0115-6.7L21 8" />
            <path d="M3 22v-6h6" /><path d="M21 12a9 9 0 01-15 6.7L3 16" />
          </svg>
        </button>
      </div>

      <div className="flex items-center justify-between px-4 pb-3 flex-shrink-0">
        <div className="flex gap-4 font-mono text-[13px]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
          <span className="text-[#EAF1FB]">{counts.new_leads} NEW</span>
          <span className="text-[#FF4D5E] hot-breathe">{counts.hot} HOT</span>
          <span className="text-[#F5A742]">{counts.warm} WARM</span>
        </div>
        <button
          onClick={() => setSweepExpanded((v) => !v)}
          className="flex items-center gap-1 font-mono text-[11px] text-[#8FA3C0] hover:text-[#00C2C7] transition-colors"
          style={{ fontFamily: 'IBM Plex Mono, monospace' }}
          aria-expanded={sweepExpanded}
        >
          {sweepExpanded ? 'Hide sweep' : 'Show sweep'}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
               className={`transition-transform ${sweepExpanded ? '' : 'rotate-180'}`}>
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      </div>

      {sweepExpanded && (
        <div className="px-4 pb-3 flex-shrink-0 animate-[fade-slide-up_0.25s_ease-out]">
          <RadarSweep leads={leads} onBlipTap={handleBlipTap} />
        </div>
      )}

      <div className="flex gap-2 px-4 pb-3 overflow-x-auto flex-shrink-0">
        {CHIPS.map((chip) => (
          <button
            key={chip}
            onClick={() => setFilter(chip)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full border text-[12px] transition-all ${
              filter === chip
                ? 'border-[#00C2C7] bg-[#00C2C7]/15 text-[#00C2C7]'
                : 'border-[#1E2C46] bg-[#101B30] text-[#8FA3C0]'
            }`}
          >
            {CHIP_LABELS[chip]}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {noLeadsToday ? (
          <div className="text-center pt-10">
            <p className="text-[#EAF1FB] text-[15px] mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Quiet day
            </p>
            <p className="text-[#8FA3C0] font-mono text-[12px]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
              0 new leads — the radar is still running
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center pt-12">
            <p className="text-[#8FA3C0] font-mono text-[13px]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
              No leads match this filter
            </p>
          </div>
        ) : (
          filtered.map((lead, i) => (
            <div
              key={lead.nct}
              ref={(el) => { cardRefs.current[lead.nct] = el }}
              style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
              className="animate-[fade-slide-up_0.4s_ease-out_both]"
            >
              <LeadCard lead={lead} highlighted={highlighted === lead.nct} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
