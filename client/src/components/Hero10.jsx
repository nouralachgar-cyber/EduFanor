import { motion, useReducedMotion } from 'framer-motion'
import { useRef, useState } from 'react'

const IMAGES = [
  { src: '/1.png', alt: 'EduFanor first-aid learning' },
  { src: '/2.png', alt: 'EduFanor CPR training' },
  { src: '/3.png', alt: 'EduFanor emergency preparedness' },
]

const EASE = [0.22, 1, 0.36, 1]

function EcgLine({ className }) {
  return (
    <svg viewBox="0 0 320 72" fill="none" className={className} aria-hidden="true">
      <path
        d="M2 40h58l12-5 10 9 11-41 17 76 13-39h195"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function HeartMark({ className }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <path
        d="M32 54S10 41.5 10 25.5A12 12 0 0 1 32 18a12 12 0 0 1 22 7.5C54 41.5 32 54 32 54Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M17 33h8l4-8 6 16 4-8h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CrossMark({ className }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <rect x="24" y="8" width="16" height="48" rx="5" stroke="currentColor" strokeWidth="2" />
      <rect x="8" y="24" width="48" height="16" rx="5" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

export function Hero10({ id, isAr = false }) {
  const reduceMotion = useReducedMotion()
  const containerRef = useRef(null)
  const [parallax, setParallax] = useState({ x: 0, y: 0 })

  const description = isAr
    ? 'EduFanor منصة تعليمية تفاعلية مخصصة لرفع الوعي بالإسعافات الأولية والتعلم الاستجابة للطوارئ. نقدم دروسًا سهلة الوصول، وإرشادات عملية خطوة بخطوة، وتجارب تعلم تفاعلية تساعد الناس على فهم كيفية الاستجابة للطوارئ ودعم الآخرين أثناء انتظار خدمات الطوارئ المهنية.'
    : 'EduFanor is an interactive educational platform dedicated to first-aid awareness and emergency response learning. We provide accessible lessons, practical step-by-step guidance, and interactive learning experiences that help people understand how to respond to emergencies and support others while waiting for professional emergency services.'
  const supporting = isAr ? 'المعرفة هي الخطوة الأولى نحو إحداث فرق.' : 'Knowledge is the first step towards making a difference.'

  const fontClass = isAr ? 'font-arabic' : 'font-inter'
  const headingGradient = 'bg-gradient-to-r from-[#18122B] via-[#443C68] to-[#18122B] bg-clip-text text-transparent dark:from-[#F3F1F5] dark:via-[#F0D9FF] dark:to-[#BFA2DB]'
  const accentGradient = 'bg-gradient-to-r from-[#443C68] via-[#18122B] to-[#443C68] bg-clip-text text-transparent dark:from-[#F0D9FF] dark:via-[#BFA2DB] dark:to-[#F3F1F5]'
  const dir = isAr ? -1 : 1

  const reveal = (delay) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : delay, ease: EASE },
  })

  const handleMove = (e) => {
    if (reduceMotion) return
    if (typeof window !== 'undefined' && window.innerWidth < 768) return
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = (e.clientX - (rect.left + rect.width / 2)) / rect.width
    const y = (e.clientY - (rect.top + rect.height / 2)) / rect.height
    setParallax({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) })
  }
  const handleLeave = () => setParallax({ x: 0, y: 0 })

  const cards = [
    {
      image: IMAGES[0],
      position: 'top-[12%] start-[1%] w-[42%] sm:w-[35%] lg:w-[32%]',
      ratio: 'aspect-[682/1024]',
      rotate: -8,
      enterX: -55,
      delay: 0.12,
      float: 5.4,
      floatDelay: 0,
      px: -15,
      py: -10,
      z: 'z-10',
      shadow: 'shadow-[0_30px_75px_-32px_var(--palette-ink-soft)] dark:shadow-[0_30px_75px_-30px_var(--palette-lavender)]',
    },
    {
      image: IMAGES[2],
      position: 'top-[12%] end-[1%] w-[42%] sm:w-[35%] lg:w-[32%]',
      ratio: 'aspect-[736/1130]',
      rotate: 8,
      enterX: 55,
      delay: 0.22,
      float: 6,
      floatDelay: 0.5,
      px: 15,
      py: -10,
      z: 'z-10',
      shadow: 'shadow-[0_30px_75px_-32px_var(--palette-ink-soft)] dark:shadow-[0_30px_75px_-30px_var(--palette-lavender)]',
    },
    {
      image: IMAGES[1],
      position: 'top-[2%] start-0 end-0 mx-auto w-[48%] sm:w-[42%] lg:w-[38%]',
      ratio: 'aspect-[736/981]',
      rotate: 0,
      enterX: 0,
      delay: 0.32,
      float: 6.6,
      floatDelay: 0.25,
      px: 6,
      py: -6,
      z: 'z-20',
      shadow: 'shadow-[0_42px_95px_-32px_var(--palette-ink-soft)] dark:shadow-[0_42px_95px_-24px_var(--palette-lavender)]',
    },
  ]

  return (
    <section
      id={id}
      className="bg-canvas relative isolate w-full overflow-hidden py-24 transition-colors duration-500 sm:py-28 lg:py-32"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-48 start-[-10%] h-[34rem] w-[34rem] rounded-full bg-highlight/50 blur-[110px] dark:bg-primary/25" />
        <div className="absolute -bottom-56 end-[-10%] h-[38rem] w-[38rem] rounded-full bg-lavender/25 blur-[120px] dark:bg-highlight/25" />
        <div className="absolute start-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-lavender/20 dark:border-highlight/40" />

        <svg
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          fill="none"
          className="absolute inset-0 h-full w-full text-lavender/30 dark:text-highlight/50"
        >
          <path d="M-80 190C180 20 360 340 700 190s580-190 820 20" stroke="currentColor" strokeWidth="1.5" />
          <path d="M-60 780C240 620 420 900 760 760s560-120 760-250" stroke="currentColor" strokeWidth="1.2" />
          <path d="M-40 430C200 310 400 560 680 430s520-120 800 40" stroke="currentColor" strokeWidth="1" strokeDasharray="5 14" />
        </svg>

        <motion.div
          className="absolute start-[2%] top-[30%] w-32 text-lavender/45 dark:text-lavender/25 sm:w-52"
          animate={reduceMotion ? undefined : { y: [0, -14, 0], opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        >
          <EcgLine className="w-full" />
        </motion.div>
        <motion.div
          className="absolute end-[3%] top-[58%] w-28 text-lavender/40 dark:text-lavender/20 sm:w-44"
          animate={reduceMotion ? undefined : { y: [0, 12, 0], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
        >
          <EcgLine className="w-full" />
        </motion.div>
        <motion.div
          className="absolute end-[9%] top-[13%] text-lavender/40 dark:text-highlight/60"
          animate={reduceMotion ? undefined : { y: [0, -12, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <HeartMark className="h-10 w-10 sm:h-14 sm:w-14" />
        </motion.div>
        <motion.div
          className="absolute start-[10%] bottom-[8%] text-primary/45 dark:text-lavender/30"
          animate={reduceMotion ? undefined : { y: [0, 10, 0], rotate: [0, -8, 0] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
        >
          <CrossMark className="h-9 w-9 sm:h-12 sm:w-12" />
        </motion.div>
      </div>

      <div className="relative z-10 w-full text-center">
        <motion.div {...reveal(0)} className="mx-auto w-full">
          <span className="inline-flex items-center gap-3 rounded-full border border-line/70 bg-highlight/25 px-4 py-2 shadow-glass backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lavender opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className={`${fontClass} text-[0.68rem] font-extrabold uppercase tracking-[0.3em] text-ink-soft dark:text-lavender sm:text-xs`}>
              {isAr ? 'من نحن' : 'About EduFanor'}
            </span>
          </span>
        </motion.div>

        <motion.h2
          {...reveal(0.08)}
          className={`${fontClass} mt-8 font-extrabold leading-[1.12] tracking-tight text-ink ${isAr ? 'text-[clamp(2rem,6vw,4.75rem)]' : 'text-[clamp(2.5rem,7vw,5.5rem)]'}`}
        >
          {isAr ? (
            <>
              اكتشف <span className={headingGradient}>EduFanor</span>
            </>
          ) : (
            <>
              Discover <span className={headingGradient}>EduFanor</span>
            </>
          )}
          <span className={`${fontClass} mt-3 block font-bold leading-tight text-ink-soft ${isAr ? 'text-[clamp(1.35rem,4vw,2.5rem)]' : 'text-[clamp(1.4rem,4.2vw,2.85rem)]'}`}>
            {isAr ? (
              <>
                تعلم. استعد. <span className={accentGradient}>أنقذ الأرواح.</span>
              </>
            ) : (
              <>
                Learn. Prepare. <span className={accentGradient}>Save Lives.</span>
              </>
            )}
          </span>
        </motion.h2>

        <motion.p
          {...reveal(0.16)}
          className={`${fontClass} mx-auto mt-7 max-w-2xl text-[0.95rem] leading-[1.9] text-ink-muted sm:text-lg`}
        >
          {description}
        </motion.p>

        <motion.p
          {...reveal(0.24)}
          className={`${fontClass} mt-5 inline-flex items-center gap-2.5 text-sm font-semibold text-ink-soft dark:text-lavender sm:text-base`}
        >
          <span className="inline-block h-px w-8 bg-gradient-to-r from-lavender to-primary" aria-hidden="true" />
          {supporting}
          <span className="inline-block h-px w-8 bg-gradient-to-r from-primary to-lavender" aria-hidden="true" />
        </motion.p>
      </div>

      <div
        ref={containerRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="relative z-10 mx-auto mt-16 h-[340px] w-full max-w-6xl px-6 sm:mt-20 sm:h-[470px] sm:px-8 lg:h-[600px]"
      >
        <div className="relative mx-auto h-full w-full">
          <div className="pointer-events-none absolute start-1/2 top-[8%] h-[75%] w-[65%] -translate-x-1/2 rounded-full bg-highlight/35 blur-3xl dark:bg-highlight/20" aria-hidden="true" />

          {cards.map((card, index) => (
            <motion.div
              key={card.image.src}
              initial={
                reduceMotion
                  ? false
                  : { opacity: 0, x: card.enterX * dir, y: 34, scale: index === 2 ? 0.86 : 0.94, rotate: card.rotate * 2 }
              }
              whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: card.rotate }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: reduceMotion ? 0 : 0.9, delay: reduceMotion ? 0 : card.delay, ease: EASE }}
              whileHover={reduceMotion ? undefined : { scale: index === 2 ? 1.035 : 1.06, rotate: 0, zIndex: 40 }}
              className={`group absolute ${card.position} ${card.z}`}
            >
              <motion.div
                animate={reduceMotion ? undefined : { y: [0, index === 2 ? -12 : -8, 0] }}
                transition={{ duration: card.float, repeat: Infinity, ease: 'easeInOut', delay: card.floatDelay }}
                className="w-full"
              >
                <div
                  style={{ transform: `translate3d(${parallax.x * card.px}px, ${parallax.y * card.py}px, 0)` }}
                  className={`relative rounded-[1.6rem] border border-line/80 bg-gradient-to-br from-highlight/70 via-surface to-lavender/40 p-1.5 transition-[border-color,box-shadow] duration-500 group-hover:border-lavender/80 dark:border-highlight/60 dark:from-highlight/40 dark:via-surface dark:to-primary/40 ${card.shadow} sm:p-2`}
                >
                  <div className={`relative w-full overflow-hidden rounded-[1.2rem] bg-surface ${card.ratio}`}>
                    <img
                      src={card.image.src}
                      alt={card.image.alt}
                      loading="lazy"
                      className="h-full w-full object-contain object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                  <span className="pointer-events-none absolute inset-0 rounded-[1.6rem] bg-gradient-to-t from-highlight/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true" />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
