import { useFeed } from '../data/store'

function fmt(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString('en-GB', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }) + ' UTC'
}

export default function DigestScreen() {
  const { feed, refresh, refreshing } = useFeed()

  const stale = feed?.stale ?? false
  const counts = feed?.counts ?? { new_leads: 0, hot: 0, warm: 0, funding: 0 }
  const hotLeads = (feed?.leads ?? []).filter((l) => l.tier === 'HOT')

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-4 pt-12 pb-4 flex-shrink-0">
        <h1 className="text-[#EAF1FB] text-2xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Digest
        </h1>
        <p className="font-mono text-[#8FA3C0] text-[11px] mt-0.5" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
          Feed status &amp; daily summary
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
        {/* Sync / health */}
        <div className={`rounded-xl border p-4 ${stale ? 'border-[#FF4D5E]' : 'border-[#1E2C46]'} bg-[#101B30]`}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#8FA3C0]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
              Last sync
            </span>
            <span className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${stale ? 'bg-[#FF4D5E]' : 'bg-[#00C2C7]'}`} />
              <span className={`font-mono text-[10px] ${stale ? 'text-[#FF4D5E]' : 'text-[#00C2C7]'}`} style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                {stale ? 'STALE' : 'LIVE'}
              </span>
            </span>
          </div>
          <p className="font-mono text-[#EAF1FB] text-[13px]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
            {feed ? fmt(feed.updated) : '—'}
          </p>
          {feed?.isMock && (
            <p className="text-[#F5A742] text-[12px] mt-2">
              Showing sample data — the live feed (out/latest.json) could not be reached.
            </p>
          )}
          {stale && !feed?.isMock && (
            <p className="text-[#FF4D5E] text-[12px] mt-2">
              Feed is more than 36h old — the bot may not have run, or the Pages deploy didn&apos;t fire. Check the Actions tab.
            </p>
          )}
          <button
            onClick={refresh}
            className="mt-3 font-mono text-[12px] text-[#00C2C7] hover:underline" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
            {refreshing ? 'Refreshing…' : 'Refresh now →'}
          </button>
        </div>

        {/* Today's summary (generated from live feed) */}
        <div className="rounded-xl border border-[#1E2C46] bg-[#101B30] p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#8FA3C0] mb-3" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
            Summary
          </p>
          <p className="text-[#EAF1FB] text-[14px] leading-relaxed mb-3">
            {counts.new_leads} new cardiovascular device {counts.new_leads === 1 ? 'lead' : 'leads'}
            {' · '}{counts.hot} HOT · {counts.warm} WARM · {counts.funding} funding {counts.funding === 1 ? 'signal' : 'signals'}.
          </p>

          {hotLeads.length > 0 && (
            <>
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#FF4D5E] mb-2" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                HOT leads
              </p>
              <div className="space-y-2">
                {hotLeads.map((l) => (
                  <a key={l.nct} href={l.url} target="_blank" rel="noreferrer" className="block">
                    <p className="text-[#EAF1FB] text-[13px] leading-snug">
                      <span className="font-mono text-[#8FA3C0]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>{l.nct}</span>
                      {' — '}{l.sponsor}{' '}
                      <span className="font-mono text-[#00C2C7]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>({l.score})</span>
                    </p>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
