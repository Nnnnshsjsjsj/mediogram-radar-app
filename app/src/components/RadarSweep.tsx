import { useEffect, useRef } from 'react'
import type { Lead } from '../data/mockData'

const CATEGORY_ANGLE: Record<Lead['category'], number> = {
  arrhythmia: 45,
  structural: 120,
  hf: 200,
  mcs: 270,
  devices: 330,
}

const TIER_COLOR: Record<Lead['tier'], string> = {
  HOT: '#FF4D5E',
  WARM: '#F5A742',
  NORMAL: '#00C2C7',
}

interface Props {
  leads: Lead[]
  onBlipTap: (nct: string) => void
}

export default function RadarSweep({ leads, onBlipTap }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const angleRef = useRef(0)
  const rafRef = useRef<number>(0)
  const blipOpacities = useRef<Record<string, number>>(
    Object.fromEntries(leads.map((l) => [l.nct, 0]))
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const SIZE = canvas.width
    const CX = SIZE / 2
    const CY = SIZE / 2
    const R = SIZE / 2 - 8

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Stagger blip-in by score (highest first)
    const sorted = [...leads].sort((a, b) => b.score - a.score)
    sorted.forEach((lead, i) => {
      setTimeout(
        () => {
          blipOpacities.current[lead.nct] = 1
        },
        prefersReduced ? 0 : i * 40
      )
    })

    let last = performance.now()

    const draw = (now: number) => {
      const dt = now - last
      last = now
      ctx.clearRect(0, 0, SIZE, SIZE)

      // Rings
      const ringCount = 4
      for (let i = 1; i <= ringCount; i++) {
        const r = (R * i) / ringCount
        ctx.beginPath()
        ctx.arc(CX, CY, r, 0, Math.PI * 2)
        ctx.strokeStyle = '#1E2C46'
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Cross hairs
      ctx.strokeStyle = '#1E2C46'
      ctx.lineWidth = 0.5
      ctx.beginPath()
      ctx.moveTo(CX, CY - R)
      ctx.lineTo(CX, CY + R)
      ctx.moveTo(CX - R, CY)
      ctx.lineTo(CX + R, CY)
      ctx.stroke()

      if (!prefersReduced) {
        angleRef.current = (angleRef.current + (dt / 6000) * 360) % 360
      }

      const sweepRad = (angleRef.current - 90) * (Math.PI / 180)

      // Sweep gradient trailing glow
      if (!prefersReduced) {
        // Draw trail arc manually
        const trailSpan = Math.PI / 3
        for (let i = 0; i <= 20; i++) {
          const t = i / 20
          const a = sweepRad - t * trailSpan
          ctx.beginPath()
          ctx.moveTo(CX, CY)
          ctx.arc(CX, CY, R, a, a + (trailSpan / 20), false)
          ctx.closePath()
          ctx.fillStyle = `rgba(0, 194, 199, ${(1 - t) * 0.12})`
          ctx.fill()
        }
      }

      // Sweep line
      const sweepX = CX + Math.cos(sweepRad) * R
      const sweepY = CY + Math.sin(sweepRad) * R
      const lineGrad = ctx.createLinearGradient(CX, CY, sweepX, sweepY)
      lineGrad.addColorStop(0, 'rgba(0,194,199,0)')
      lineGrad.addColorStop(1, 'rgba(0,194,199,0.9)')
      ctx.beginPath()
      ctx.moveTo(CX, CY)
      ctx.lineTo(sweepX, sweepY)
      ctx.strokeStyle = lineGrad
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Blips
      leads.forEach((lead) => {
        const opacity = blipOpacities.current[lead.nct]
        if (opacity === 0) return
        const angleDeg = CATEGORY_ANGLE[lead.category]
        const angleRad = (angleDeg - 90) * (Math.PI / 180)
        const dist = 0.25 + (lead.score / 100) * 0.65
        const bx = CX + Math.cos(angleRad) * R * dist
        const by = CY + Math.sin(angleRad) * R * dist
        const radius = 2 + (lead.score / 100) * 6

        // Glow
        const glow = ctx.createRadialGradient(bx, by, 0, bx, by, radius * 3)
        glow.addColorStop(0, TIER_COLOR[lead.tier] + '60')
        glow.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(bx, by, radius * 3, 0, Math.PI * 2)
        ctx.fillStyle = glow
        ctx.fill()

        // Dot
        ctx.beginPath()
        ctx.arc(bx, by, radius, 0, Math.PI * 2)
        ctx.fillStyle = TIER_COLOR[lead.tier]
        ctx.globalAlpha = opacity
        ctx.fill()
        ctx.globalAlpha = 1
      })

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafRef.current)
  }, [leads])

  const handleCanvasTap = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const scale = canvas.width / rect.width
    const mx = (e.clientX - rect.left) * scale
    const my = (e.clientY - rect.top) * scale
    const SIZE = canvas.width
    const CX = SIZE / 2
    const CY = SIZE / 2
    const R = SIZE / 2 - 8

    for (const lead of leads) {
      const angleDeg = CATEGORY_ANGLE[lead.category]
      const angleRad = (angleDeg - 90) * (Math.PI / 180)
      const dist = 0.25 + (lead.score / 100) * 0.65
      const bx = CX + Math.cos(angleRad) * R * dist
      const by = CY + Math.sin(angleRad) * R * dist
      const radius = (2 + (lead.score / 100) * 6) + 8
      if (Math.hypot(mx - bx, my - by) < radius) {
        onBlipTap(lead.nct)
        return
      }
    }
  }

  return (
    <canvas
      ref={canvasRef}
      width={320}
      height={320}
      className="w-full max-w-[320px] mx-auto cursor-pointer"
      onClick={handleCanvasTap}
    />
  )
}
