import { motion, useReducedMotion } from 'framer-motion'
import { useState, useRef } from 'react'

const IMAGES = [
  { src: '/1.png', alt: 'EduFanor first-aid learning' },
  { src: '/2.png', alt: 'EduFanor CPR training' },
  { src: '/3.png', alt: 'EduFanor emergency preparedness' },
]

export function Hero10({ id, isAr = false }) {
  const reduceMotion = useReducedMotion()
  const containerRef = useRef(null)
  const [parallax, setParallax] = useState({ x: 0, y: 0 })

  const heading = isAr ? 'اكتشف EduFanor' : 'Discover EduFanor'
  const highlight = isAr ? 'تعلم. استعد. أنقذ الأرواح.' : 'Learn. Prepare. Save Lives.'
  const description = isAr
    ? 'EduFanor منصة تعليمية تفاعلية مخصصة لرفع الوعي بالإسعافات الأولية والتعلم الاستجابة للطوارئ. نقدم دروسًا سهلة الوصول، وإرشادات عملية خطوة بخطوة، وتجارب تعلم تفاعلية تساعد الناس على فهم كيفية الاستجابة للطوارئ ودعم الآخرين أثناء انتظار خدمات الطوارئ المهنية.'
    : 'EduFanor is an interactive educational platform dedicated to first-aid awareness and emergency response learning. We provide accessible lessons, practical step-by-step guidance, and interactive learning experiences that help people understand how to respond to emergencies and support others while waiting for professional emergency services.'
  const supporting = isAr ? 'المعرفة هي الخطوة الأولى نحو إحداث فرق.' : 'Knowledge is the first step towards making a difference.'

  const handleMove = (e) => {
    if (reduceMotion) return
    if (typeof window !== 'undefined' && window.innerWidth < 768) return
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const x = (e.clientX - cx) / rect.width
    const y = (e.clientY - cy) / rect.height
    setParallax({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) })
  }
  const handleLeave = () => setParallax({ x: 0, y: 0 })

  const left = IMAGES[0]
  const center = IMAGES[1]
  const right = IMAGES[2]

  const cardBase = 'overflow-hidden rounded-3xl border border-line bg-card shadow-[0_30px_80px_-40px_rgba(32,53,98,0.45)] transition-shadow duration-300 hover:shadow-lift'

  return (
    <section id={id} className="bg-surface relative isolate w-full overflow-hidden py-20 transition-colors duration-500 md:py-28">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-24 start-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#3E588F]/10 blur-3xl" />
        <div className="absolute bottom-0 end-0 h-64 w-64 rounded-full bg-[#C0C5CD]/20 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl"
        >
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#3E588F] dark:text-[#C0C5CD]">
            {isAr ? 'من نحن' : 'About EduFanor'}
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl md:text-5xl">
            {heading}
            <br />
            <span className="text-[#3E588F] dark:text-[#C0C5CD]">{highlight}</span>
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-ink-muted sm:text-base">{description}</p>
          <p className="mt-4 font-display text-base italic text-ink sm:text-lg">{supporting}</p>
        </motion.div>

        <div
          ref={containerRef}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          className="relative mx-auto mt-14 h-[420px] w-full max-w-4xl sm:h-[480px] md:h-[540px]"
        >
          {/* Left card */}
          <motion.div
            initial={{ opacity: 0, x: isAr ? 80 : -80, y: 24, rotate: isAr ? 6 : -6 }}
            whileInView={{ opacity: 1, x: 0, y: 0, rotate: isAr ? 6 : -6 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            animate={reduceMotion ? undefined : { y: [0, -6, 0], transition: { duration: 5.2, repeat: Infinity, ease: 'easeInOut' } }}
            whileHover={reduceMotion ? undefined : { scale: 1.05, zIndex: 30 }}
            style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
            className="absolute top-10 start-0 z-10 w-[46%] sm:w-[44%] md:w-[42%]"
          >
            <div style={{ transform: `translate(${parallax.x * -18}px, ${parallax.y * -12}px)` }} className={cardBase}>
              <div className="relative aspect-[3/4] w-full">
                <img src={left.src} alt={left.alt} loading="lazy" className="h-full w-full object-cover" />
              </div>
            </div>
          </motion.div>

          {/* Right card */}
          <motion.div
            initial={{ opacity: 0, x: isAr ? -80 : 80, y: 24, rotate: isAr ? -6 : 6 }}
            whileInView={{ opacity: 1, x: 0, y: 0, rotate: isAr ? -6 : 6 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            animate={reduceMotion ? undefined : { y: [0, -8, 0], transition: { duration: 5.8, repeat: Infinity, ease: 'easeInOut', delay: 0.6 } }}
            whileHover={reduceMotion ? undefined : { scale: 1.05, zIndex: 30 }}
            style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
            className="absolute top-10 end-0 z-10 w-[46%] sm:w-[44%] md:w-[42%]"
          >
            <div style={{ transform: `translate(${parallax.x * 18}px, ${parallax.y * -10}px)` }} className={cardBase}>
              <div className="relative aspect-[3/4] w-full">
                <img src={right.src} alt={right.alt} loading="lazy" className="h-full w-full object-cover" />
              </div>
            </div>
          </motion.div>

          {/* Center card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            animate={reduceMotion ? undefined : { y: [0, -10, 0], transition: { duration: 6.4, repeat: Infinity, ease: 'easeInOut', delay: 0.3 } }}
            whileHover={reduceMotion ? undefined : { scale: 1.03 }}
            style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
            className="absolute left-1/2 top-0 z-20 w-[46%] -translate-x-1/2 sm:w-[44%] md:w-[42%]"
          >
            <div
              style={{ transform: `translate(${parallax.x * 6}px, ${parallax.y * -6}px)` }}
              className="overflow-hidden rounded-3xl border border-line bg-card shadow-[0_40px_100px_-40px_rgba(32,53,98,0.55)] transition-shadow duration-300 hover:shadow-lift"
            >
              <div className="relative aspect-[3/4] w-full">
                <img src={center.src} alt={center.alt} loading="lazy" className="h-full w-full object-cover" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
