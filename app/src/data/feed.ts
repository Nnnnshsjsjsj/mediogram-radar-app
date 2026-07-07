// Real feed layer for the Mediogram Lead Radar app.
//
// The bot writes out/latest.json and out/stats.json into this repo. This module
// fetches them (base-path aware, so it works under /<repo>/ on GitHub Pages),
// normalizes the shape, and derives the `category` the radar sweep needs — the
// bot does NOT emit `category`, so we infer it from conditions + title.
//
// If the fetch fails (e.g. running locally with no feed yet), we fall back to
// the bundled sample data so the UI still renders instead of showing a blank.

import {
  mockLeads,
  mockFunding,
  mockHistory,
  mockCounts,
  lastSync as mockSync,
} from './mockData'
import type { Lead, FundingItem, HistoryEntry } from './mockData'

export type { Lead, FundingItem, HistoryEntry }

export interface Feed {
  updated: string
  leads: Lead[]
  funding: FundingItem[]
  counts: { new_leads: number; hot: number; warm: number; funding: number }
  history: HistoryEntry[]
  stale: boolean
  isMock: boolean
}

// Base-path aware URLs. import.meta.env.BASE_URL is "/" locally and
// "/<repo>/" on GitHub Pages (set via vite `base`), so these resolve correctly
// in both places without hardcoding the repo name.
const BASE = import.meta.env.BASE_URL
const LATEST_URL = `${BASE}out/latest.json`
const STATS_URL = `${BASE}out/stats.json`

const STALE_HOURS = 36

// ---- category derivation (bot has no `category` field) --------------------
type Category = Lead['category']

const CATEGORY_RULES: { cat: Category; terms: string[] }[] = [
  // order matters — first match wins
  {
    cat: 'mcs',
    terms: ['mechanical circulatory', 'ventricular assist', 'lvad', 'impella',
            'cardiogenic shock', 'iabp', 'ecmo'],
  },
  {
    cat: 'arrhythmia',
    terms: ['atrial fibrillation', 'atrial flutter', 'ventricular tachycardia',
            'supraventricular', 'arrhythmia', 'ablation', 'pulsed field', 'pfa',
            'cryoablation', 'pulmonary vein', 'electrophysiology', 'mapping',
            'pacemaker', 'defibrillator', 'icd', 'resynchronization', 'crt',
            'bradycardia', 'electroanatomic'],
  },
  {
    cat: 'structural',
    terms: ['aortic valve', 'mitral', 'tricuspid', 'mitraclip', 'triclip',
            'tavr', 'tavi', 'transcatheter valve', 'transcatheter aortic',
            'transcatheter mitral', 'left atrial appendage', 'laa',
            'appendage occlusion', 'septal occluder', 'interatrial shunt',
            'regurgitation'],
  },
  {
    cat: 'hf',
    terms: ['heart failure', 'hfpef', 'hfref', 'cardiomyopathy',
            'myocardial regeneration', 'ejection fraction'],
  },
]

export function deriveCategory(lead: Partial<Lead>): Category {
  const hay = [lead.title, ...(lead.conditions ?? [])]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  for (const { cat, terms } of CATEGORY_RULES) {
    if (terms.some((t) => hay.includes(t))) return cat
  }
  return 'devices' // fallback bucket
}

// The bot may emit tier as "HOT"/"WARM"/"" (or missing). Normalize.
function normalizeTier(t: unknown): Lead['tier'] {
  const s = String(t ?? '').toUpperCase()
  if (s === 'HOT') return 'HOT'
  if (s === 'WARM') return 'WARM'
  return 'NORMAL'
}

function normalizeLead(raw: Record<string, unknown>): Lead {
  const conditions = Array.isArray(raw.conditions) ? (raw.conditions as string[]) : []
  const countries = Array.isArray(raw.countries) ? (raw.countries as string[]) : []
  const base: Partial<Lead> = {
    nct: String(raw.nct ?? ''),
    score: Number(raw.score ?? 0),
    tier: normalizeTier(raw.tier),
    sponsor: String(raw.sponsor ?? 'Unknown sponsor'),
    title: String(raw.title ?? ''),
    status: String(raw.status ?? ''),
    phase: String(raw.phase ?? 'NA'),
    countries,
    conditions,
    posted: String(raw.posted ?? raw.first_posted ?? ''),
    summary: String(raw.summary ?? ''),
    email: String(raw.email ?? ''),
    phone: String(raw.phone ?? ''),
    contact_name: String(raw.contact_name ?? ''),
    pi: String(raw.pi ?? ''),
    channel: String(raw.channel ?? ''),
    who: String(raw.who ?? ''),
    angle: String(raw.angle ?? ''),
    opener: String(raw.opener ?? ''),
    url: String(raw.url ?? (raw.nct ? `https://clinicaltrials.gov/study/${raw.nct}` : '#')),
  }
  return { ...(base as Lead), category: deriveCategory(base) }
}

function normalizeFunding(raw: Record<string, unknown>): FundingItem {
  return {
    company: String(raw.company ?? raw.title ?? 'Unknown'),
    amount: String(raw.amount ?? ''),
    what: String(raw.what ?? ''),
    fit: String(raw.fit ?? ''),
    angle: String(raw.angle ?? ''),
    link: String(raw.link ?? '#'),
    source: String(raw.source ?? ''),
  }
}

function isStale(updated: string): boolean {
  const t = new Date(updated).getTime()
  if (Number.isNaN(t)) return true
  return (Date.now() - t) / 3_600_000 > STALE_HOURS
}

const mockFeed: Feed = {
  updated: mockSync,
  leads: mockLeads,
  funding: mockFunding,
  counts: mockCounts,
  history: mockHistory,
  stale: false,
  isMock: true,
}

export async function fetchFeed(signal?: AbortSignal): Promise<Feed> {
  try {
    const [latestRes, statsRes] = await Promise.all([
      fetch(LATEST_URL, { cache: 'no-store', signal }),
      fetch(STATS_URL, { cache: 'no-store', signal }).catch(() => null),
    ])
    if (!latestRes.ok) throw new Error(`latest.json ${latestRes.status}`)

    const latest = await latestRes.json()
    const stats = statsRes && statsRes.ok ? await statsRes.json() : { history: [] }

    const leads = (Array.isArray(latest.leads) ? latest.leads : [])
      .map(normalizeLead)
      .sort((a: Lead, b: Lead) => b.score - a.score)
    const funding = (Array.isArray(latest.funding) ? latest.funding : []).map(normalizeFunding)
    const history: HistoryEntry[] = Array.isArray(stats.history) ? stats.history : []

    const counts = latest.counts ?? {
      new_leads: leads.length,
      hot: leads.filter((l: Lead) => l.tier === 'HOT').length,
      warm: leads.filter((l: Lead) => l.tier === 'WARM').length,
      funding: funding.length,
    }
    const updated = String(latest.updated ?? new Date().toISOString())

    return { updated, leads, funding, counts, history, stale: isStale(updated), isMock: false }
  } catch (err) {
    if ((err as Error)?.name === 'AbortError') throw err
    // No feed reachable (local dev, first deploy, or fetch blocked) — use sample.
    console.warn('[radar] feed fetch failed, using sample data:', err)
    return mockFeed
  }
}
