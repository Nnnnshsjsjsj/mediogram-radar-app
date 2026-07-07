import { useState } from 'react'
import type { Lead } from '../data/mockData'

const TIER_DOT_CLASS: Record<Lead['tier'], string> = {
  HOT: 'bg-[#FF4D5E]',
  WARM: 'bg-[#F5A742]',
  NORMAL: 'bg-[#00C2C7]',
}
const TIER_TEXT_CLASS: Record<Lead['tier'], string> = {
  HOT: 'text-[#FF4D5E]',
  WARM: 'text-[#F5A742]',
  NORMAL: 'text-[#00C2C7]',
}

interface Props {
  lead: Lead
  highlighted: boolean
  initiallyExpanded?: boolean
}

export default function LeadCard({ lead, highlighted, initiallyExpanded = false }: Props) {
  const [expanded, setExpanded] = useState(initiallyExpanded)
  const [copied, setCopied] = useState(false)

  const copyOpener = () => {
    navigator.clipboard.writeText(lead.opener).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div
      className={`rounded-xl border transition-all duration-[220ms] mb-3 overflow-hidden ${
        highlighted
          ? 'border-[#00C2C7] shadow-[0_0_16px_rgba(0,194,199,0.25)]'
          : 'border-[#1E2C46]'
      } bg-[#101B30]`}
    >
      <button
        className="w-full text-left p-4 focus:outline-none"
        onClick={() => setExpanded((e) => !e)}
      >
        {/* Top row: tier + score */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full flex-shrink-0 ${TIER_DOT_CLASS[lead.tier]} ${lead.tier === 'HOT' ? 'hot-breathe' : ''}`}
            />
            <span
              className={`font-mono text-[10px] font-semibold tracking-widest ${TIER_TEXT_CLASS[lead.tier]}`}
            >
              {lead.tier}
            </span>
          </div>
          <span className="font-mono text-[#00C2C7] text-sm font-semibold">{lead.score}</span>
        </div>

        {/* Sponsor */}
        <p
          className="font-display text-[#EAF1FB] font-medium text-[15px] leading-snug mb-1"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          {lead.sponsor}
        </p>

        {/* Title */}
        <p className="text-[#8FA3C0] text-[13px] leading-snug line-clamp-2 mb-2">{lead.title}</p>

        {/* Phase / status / date */}
        <p
          className="font-mono text-[11px] text-[#8FA3C0]"
          style={{ fontFamily: 'IBM Plex Mono, monospace' }}
        >
          {lead.phase} · {lead.status} · {lead.posted}
        </p>

        {/* Countries */}
        <div className="flex flex-wrap gap-1 mt-2">
          {lead.countries.map((c) => (
            <span
              key={c}
              className="font-mono text-[10px] px-1.5 py-0.5 rounded border border-[#1E2C46] text-[#8FA3C0]"
              style={{ fontFamily: 'IBM Plex Mono, monospace' }}
            >
              {c}
            </span>
          ))}
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-[#1E2C46] pt-4 space-y-3 text-[13px] animate-[fade-slide-up_0.25s_ease-out]">
          {/* NCT */}
          <p
            className="font-mono text-[#8FA3C0] text-[11px]"
            style={{ fontFamily: 'IBM Plex Mono, monospace' }}
          >
            {lead.nct}
          </p>

          {/* Summary */}
          <p className="text-[#EAF1FB] leading-relaxed">{lead.summary}</p>

          {/* Conditions */}
          <div className="flex flex-wrap gap-1">
            {lead.conditions.map((c) => (
              <span
                key={c}
                className="text-[11px] px-2 py-0.5 rounded-full border border-[#1E2C46] text-[#8FA3C0]"
              >
                {c}
              </span>
            ))}
          </div>

          {/* Contact info */}
          {lead.contact_name || lead.email || lead.phone ? (
            <div className="space-y-1">
              {lead.contact_name && (
                <p className="text-[#EAF1FB]">
                  <span className="text-[#8FA3C0]">Contact:</span> {lead.contact_name}
                </p>
              )}
              {lead.pi && (
                <p className="text-[#EAF1FB]">
                  <span className="text-[#8FA3C0]">PI:</span> {lead.pi}
                </p>
              )}
              {lead.email && (
                <p>
                  <a href={`mailto:${lead.email}`} className="text-[#00C2C7] underline">
                    {lead.email}
                  </a>
                </p>
              )}
              {lead.phone && (
                <p className="font-mono text-[#EAF1FB] text-[12px]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                  {lead.phone}
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[#8FA3C0]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>No direct contact found — </span>
              <a href={lead.url} target="_blank" rel="noreferrer" className="text-[#00C2C7] underline">
                view trial listing
              </a>
            </div>
          )}

          {/* Fit angle */}
          <div className="rounded-lg bg-[#070C16] p-3 border border-[#1E2C46]">
            <p className="text-[#8FA3C0] text-[11px] mb-1 uppercase tracking-widest font-mono" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>Fit angle</p>
            <p className="text-[#EAF1FB]">{lead.angle}</p>
          </div>

          {/* Opener */}
          <div className="rounded-lg bg-[#070C16] p-3 border border-[#1E2C46]">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[#8FA3C0] text-[11px] uppercase tracking-widest font-mono" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>Outreach opener</p>
              <button
                onClick={copyOpener}
                className="text-[#8FA3C0] hover:text-[#00C2C7] transition-colors"
                aria-label="Copy opener"
              >
                {copied ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00C2C7" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-[#EAF1FB] leading-relaxed italic">{lead.opener}</p>
          </div>

          <a
            href={lead.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-[#00C2C7] text-[12px] font-mono hover:underline"
            style={{ fontFamily: 'IBM Plex Mono, monospace' }}
          >
            View on ClinicalTrials.gov
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>
      )}
    </div>
  )
}
