import { useEffect, useRef, useState } from 'react'
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, ReferenceDot } from 'recharts'
import { useFeed } from '../data/store'

export default function TrendsScreen() {
  const { feed } = useFeed()
  const history = feed?.history ?? []

  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.3 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const hotDots = history.filter((d) => d.hot > 0)
  const thisWeek = history.slice(-7).reduce((s, d) => s + d.new_leads, 0)
  const hotWeek = history.slice(-7).reduce((s, d) => s + d.hot, 0)
  const fundingMonth = history.reduce((s, d) => s + d.funding, 0)

  const hasData = history.length > 0

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-4 pt-12 pb-4 flex-shrink-0">
        <h1 className="text-[#EAF1FB] text-2xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Trends
        </h1>
        <p className="font-mono text-[#8FA3C0] text-[11px] mt-0.5" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
          {history.length}-day lead history
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {!hasData ? (
          <div className="text-center pt-16">
            <p className="text-[#8FA3C0] font-mono text-[13px]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
              No history yet — stats build up over the first few bot runs
            </p>
          </div>
        ) : (
          <>
            <div ref={sectionRef} className="rounded-xl border border-[#1E2C46] bg-[#101B30] p-4 mb-4">
              <p className="font-mono text-[#8FA3C0] text-[11px] mb-3 uppercase tracking-widest" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                Daily new leads
              </p>
              <div className="h-[140px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={history} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
                    <XAxis dataKey="day" tickFormatter={(v: string) => String(v).slice(5)}
                           tick={{ fill: '#8FA3C0', fontSize: 9, fontFamily: 'IBM Plex Mono, monospace' }}
                           axisLine={false} tickLine={false} interval={Math.max(0, Math.floor(history.length / 5))} />
                    <Tooltip
                      contentStyle={{ background: '#101B30', border: '1px solid #1E2C46', borderRadius: 8, fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#EAF1FB' }}
                      labelStyle={{ color: '#8FA3C0' }} cursor={{ stroke: '#1E2C46' }} />
                    <Line type="monotone" dataKey="new_leads" stroke="#00C2C7" strokeWidth={1.5} dot={false}
                          isAnimationActive={visible} animationDuration={800} animationEasing="ease-out" />
                    {hotDots.map((d) => (
                      <ReferenceDot key={d.day} x={d.day} y={d.new_leads} r={4} fill="#FF4D5E" stroke="none" />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: 'LEADS\nTHIS WEEK', value: String(thisWeek) },
                { label: 'HOT\nTHIS WEEK', value: String(hotWeek), accent: true },
                { label: 'FUNDING\nTHIS MONTH', value: String(fundingMonth) },
              ].map(({ label, value, accent }) => (
                <div key={label} className="rounded-xl border border-[#1E2C46] bg-[#101B30] p-3 text-center">
                  <p className={`font-mono text-2xl font-semibold mb-1 ${accent ? 'text-[#FF4D5E]' : 'text-[#00C2C7]'}`} style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                    {value}
                  </p>
                  <p className="font-mono text-[9px] text-[#8FA3C0] whitespace-pre-line leading-tight" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>

            {hotDots.length > 0 && (
              <div className="rounded-xl border border-[#1E2C46] bg-[#101B30] p-4">
                <p className="font-mono text-[#8FA3C0] text-[11px] mb-3 uppercase tracking-widest" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                  HOT lead days
                </p>
                {hotDots.slice(-8).reverse().map((d) => (
                  <div key={d.day} className="flex items-center justify-between py-2 border-b border-[#1E2C46] last:border-0">
                    <span className="font-mono text-[#8FA3C0] text-[12px]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>{d.day}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[#EAF1FB] text-[12px]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>{d.new_leads} leads</span>
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D5E] hot-breathe" />
                        <span className="font-mono text-[#FF4D5E] text-[11px]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>{d.hot} HOT</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
