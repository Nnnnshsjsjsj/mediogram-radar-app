export interface Lead {
  nct: string
  score: number
  tier: 'HOT' | 'WARM' | 'NORMAL'
  sponsor: string
  title: string
  status: string
  phase: string
  countries: string[]
  conditions: string[]
  posted: string
  summary: string
  email: string
  phone: string
  contact_name: string
  pi: string
  channel: string
  who: string
  angle: string
  opener: string
  url: string
  category: 'arrhythmia' | 'structural' | 'hf' | 'mcs' | 'devices'
}

export interface FundingItem {
  company: string
  amount: string
  what: string
  fit: string
  angle: string
  link: string
  source: string
}

export interface HistoryEntry {
  day: string
  new_leads: number
  hot: number
  funding: number
}

export const mockLeads: Lead[] = [
  {
    nct: 'NCT06128432',
    score: 94,
    tier: 'HOT',
    sponsor: 'Medtronic Cardiac Rhythm',
    title: 'CHAMPION-AF: Cryoablation versus Pulsed Field Ablation in Persistent Atrial Fibrillation — A Multinational RCT',
    status: 'Recruiting',
    phase: 'Phase III',
    countries: ['PL', 'CZ', 'HU', 'RO', 'DE'],
    conditions: ['Atrial Fibrillation', 'Arrhythmia/EP', 'Cardiac Ablation'],
    posted: '2025-06-14',
    summary: 'A 1,400-patient RCT comparing next-generation cryoablation to pulsed-field ablation across 28 European sites. Eastern European quota is 40% unfilled; sponsor is actively seeking experienced EP centres with high AF volume and GCP infrastructure.',
    email: 'clinicalops@medtronic.com',
    phone: '+1 763 514 4000',
    contact_name: 'Dr. Sarah Okonkwo',
    pi: 'Prof. Marek Jastrzębski',
    channel: 'ClinicalTrials.gov',
    who: 'Medtronic CRO liaison, Warsaw',
    angle: 'High-volume EP programme with established cryoablation + PFA suite and existing IRB approval for cardiac device trials.',
    opener: 'Dear Dr. Okonkwo — Mediogram supports two high-volume EP centres in Poland and Hungary that meet your recruitment quota criteria for CHAMPION-AF. Both sites have active IRB approvals and have enrolled in three Medtronic device studies in the past 24 months.',
    url: 'https://clinicaltrials.gov/study/NCT06128432',
    category: 'arrhythmia',
  },
  {
    nct: 'NCT06291042',
    score: 81,
    tier: 'WARM',
    sponsor: 'Edwards Lifesciences',
    title: 'TRILUMINATE Pivotal II: Transcatheter Tricuspid Repair in Functional Tricuspid Regurgitation',
    status: 'Recruiting',
    phase: 'Phase III',
    countries: ['PL', 'SK', 'AT', 'IT'],
    conditions: ['Tricuspid Regurgitation', 'Structural Heart', 'Transcatheter Valve'],
    posted: '2025-05-30',
    summary: 'Pivotal device trial for the CLASP IID system targeting severe functional TR. 12 EE sites planned, 4 confirmed. Sponsor prefers centres with existing TEER programmes and cardiac surgery backup.',
    email: '',
    phone: '',
    contact_name: '',
    pi: 'Prof. Adam Witkowski',
    channel: 'ClinicalTrials.gov',
    who: 'Edwards EU Clinical Affairs',
    angle: 'Structural heart programme with active TEER experience and cathlab availability for complex valve cases.',
    opener: 'The TRILUMINATE Pivotal II trial has four EE site slots open; our partners in Warsaw and Bratislava have TEER volume and surgical backup that match your site requirements.',
    url: 'https://clinicaltrials.gov/study/NCT06291042',
    category: 'structural',
  },
  {
    nct: 'NCT06044987',
    score: 67,
    tier: 'NORMAL',
    sponsor: 'Abbott Vascular',
    title: 'HFPEF-FLOW: Interatrial Shunt Device for Heart Failure with Preserved Ejection Fraction',
    status: 'Recruiting',
    phase: 'Phase II',
    countries: ['PL', 'CZ', 'RO'],
    conditions: ['Heart Failure', 'HFpEF', 'Interatrial Shunt'],
    posted: '2025-06-03',
    summary: 'Multi-centre study of the Occlutech IASD in 180 HFpEF patients across 14 European sites. Moderate EE quota with flexible enrolment timeline (24 months). Centres with HF clinics and echo-guided cathlab access preferred.',
    email: 'trialsupport@abbott.com',
    phone: '',
    contact_name: 'Thomas Reinhardt',
    pi: '',
    channel: 'ClinicalTrials.gov',
    who: 'Abbott EU Medical Affairs',
    angle: 'HF programme with established cathlab and HFpEF patient population.',
    opener: 'We have two HF centres in CE Europe with active HFpEF cohorts and echo-guided cathlab access that match HFPEF-FLOW site criteria.',
    url: 'https://clinicaltrials.gov/study/NCT06044987',
    category: 'hf',
  },
  {
    nct: 'NCT06187543',
    score: 88,
    tier: 'HOT',
    sponsor: 'Abiomed / Johnson & Johnson MedTech',
    title: 'SHIELD-CS: Impella CP vs IABP in Cardiogenic Shock Complicating Acute MI',
    status: 'Recruiting',
    phase: 'Phase III',
    countries: ['PL', 'HU', 'CZ', 'RO', 'RS'],
    conditions: ['Cardiogenic Shock', 'MCS', 'Impella'],
    posted: '2025-06-18',
    summary: 'Large-scale RCT comparing Impella CP to IABP in AMICS. 600 patients, 30 sites. Sponsor actively recruiting EE centres with existing Impella programmes and 24/7 cath coverage.',
    email: 'shield.trial@abiomed.com',
    phone: '+1 508 777 5410',
    contact_name: 'Dr. Maria Santos',
    pi: 'Prof. Janusz Bednarski',
    channel: 'ClinicalTrials.gov',
    who: 'Abiomed EU MCS team',
    angle: 'Established Impella programme with 24/7 cath lab, ICU integration, and existing MCS protocols.',
    opener: 'Mediogram partners with three EE centres that have current Impella CP programmes and 24/7 cath coverage — all meet SHIELD-CS enrolment criteria.',
    url: 'https://clinicaltrials.gov/study/NCT06187543',
    category: 'mcs',
  },
  {
    nct: 'NCT06032741',
    score: 59,
    tier: 'NORMAL',
    sponsor: 'Boston Scientific',
    title: 'WATCHMAN FLX Pro Registry: Real-World Left Atrial Appendage Occlusion',
    status: 'Recruiting',
    phase: 'Registry',
    countries: ['PL', 'CZ', 'HU'],
    conditions: ['Atrial Fibrillation', 'LAA Occlusion', 'Devices'],
    posted: '2025-05-21',
    summary: 'Post-market registry for WATCHMAN FLX Pro. 2,000 patients across 60 sites. Open enrolment, minimal exclusion criteria. Suitable for any centre currently implanting WATCHMAN devices.',
    email: '',
    phone: '',
    contact_name: '',
    pi: '',
    channel: 'ClinicalTrials.gov',
    who: 'BSci Registry Team',
    angle: 'Any centre with active WATCHMAN implant programme.',
    opener: 'We support five CE European centres currently implanting WATCHMAN FLX; all are eligible for the Pro Registry with minimal additional site setup.',
    url: 'https://clinicaltrials.gov/study/NCT06032741',
    category: 'devices',
  },
]

export const mockFunding: FundingItem[] = [
  {
    company: 'Shockwave Medical (acquired by J&J)',
    amount: '$230M',
    what: 'Series F for intravascular lithotripsy expansion into structural heart applications',
    fit: 'IVL is used in complex TAVI and PCI cases — EE centres with structural programmes are prime adoption sites',
    angle: 'Offer device trial support for IVL-facilitated TAVI studies being designed for 2026',
    link: 'https://example.com',
    source: 'MedCity News',
  },
  {
    company: 'Cardionomic',
    amount: '$45M',
    what: 'Series C for neuromodulation therapy in decompensated heart failure',
    fit: 'Active HFREF trial programme, early-stage device interest, CE Europe regulatory pathway',
    angle: 'Cardionomic is expanding EE sites — HF centres with neuromodulation interest',
    link: 'https://example.com',
    source: 'MassDevice',
  },
  {
    company: 'Anteris Technologies',
    amount: '$28M',
    what: 'Growth capital for DurAVR single-piece TAVI system Phase III launch',
    fit: 'TAVI-active centres with echo core lab infrastructure sought for EE expansion',
    angle: 'DurAVR EE sites are being contracted now — window before the Phase III locks enrollment',
    link: 'https://example.com',
    source: 'Fierce Biotech',
  },
]

export const mockHistory: HistoryEntry[] = Array.from({ length: 30 }, (_, i) => {
  const d = new Date('2025-06-07')
  d.setDate(d.getDate() - (29 - i))
  const isWeekend = d.getDay() === 0 || d.getDay() === 6
  const nl = isWeekend ? 0 : Math.floor(Math.random() * 18) + 2
  return {
    day: d.toISOString().slice(0, 10),
    new_leads: nl,
    hot: nl > 0 ? Math.floor(Math.random() * 3) : 0,
    funding: nl > 0 ? Math.floor(Math.random() * 2) : 0,
  }
})

export const mockCounts = {
  new_leads: 12,
  hot: 3,
  warm: 4,
  funding: 3,
}

export const lastSync = '2025-07-07T06:14:00Z'
