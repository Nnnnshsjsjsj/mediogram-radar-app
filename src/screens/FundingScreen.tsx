import { useFeed } from '../data/store'

export default function FundingScreen() {
  const { feed } = useFeed()
  const funding = feed?.funding ?? []

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-4 pt-12 pb-4 flex-shrink-0">
        <h1 className="text-[#EAF1FB] text-2xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Funding
        </h1>
        <p className="font-mono text-[#8FA3C0] text-[11px] mt-0.5" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
          Medtech investment signals
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
        {funding.length === 0 ? (
          <div className="text-center pt-16">
            <p className="text-[#8FA3C0] font-mono text-[13px]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
              No funding news today
            </p>
          </div>
        ) : (
          funding.map((item, i) => (
            <div key={i} className="rounded-xl border border-[#1E2C46] bg-[#101B30] p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-[#EAF1FB] font-semibold text-[15px]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  {item.company}
                </p>
                {item.amount && (
                  <span className="font-mono text-[#00C2C7] text-[15px] font-semibold flex-shrink-0" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                    {item.amount}
                  </span>
                )}
              </div>

              {item.what && <p className="text-[#8FA3C0] text-[13px] mb-2">{item.what}</p>}

              {item.fit && (
                <div className="rounded-lg bg-[#070C16] p-3 border border-[#1E2C46] mb-3">
                  <p className="text-[#8FA3C0] text-[10px] font-mono uppercase tracking-widest mb-1" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                    Fit signal
                  </p>
                  <p className="text-[#EAF1FB] text-[13px]">{item.fit}</p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-[#8FA3C0] font-mono text-[11px]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                  {item.source}
                </span>
                {item.link && item.link !== '#' && (
                  <a href={item.link} target="_blank" rel="noreferrer"
                     className="text-[#00C2C7] text-[12px] font-mono hover:underline" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                    Read →
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
