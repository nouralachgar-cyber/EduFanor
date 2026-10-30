const fs = require('fs');

let content = fs.readFileSync('src/pages/PublicLandingPage.jsx', 'utf-8');

// ========== Change 1: Remove the top badge ==========
// Original lines 506-507: {isAr ? 'منصة التعليم الإسعافي الرقمي' : 'A digital first-aid academy'}</span>
// We need to remove these lines but keep the span structure intact
// The outer span structure is: <span className="..."> (line 501)
//   <span className="relative flex h-1.5 w-1.5"> (line 502)
//     ... inner spans ...
//   </span> (line 505) - closes inner span
// {isAr ? '...' : '...'} (line 506) - badge text - REMOVE
// </span> (line 507) - closes outer span - also REMOVE, but we need to close the outer span differently

// Actually, looking at the structure, removing lines 506-507 leaves the outer <span> unclosed.
// The fix is to remove the badge text but keep the outer </span> on line 507.
// But my earlier edit attempt removed both lines 506-507 and the build passed, which means
// the edit tool's oldString/newString handled it somehow.

// Let me try: remove the badge text and the space before </span>, but keep the </span>
// The old string includes the badge AND the </span> that follows it
// If I just remove the badge text portion, keeping the </span>, the structure should be fine

// Actually, from the earlier successful edit: removing "{isAr ? '...' : '...'}\n            </span>" and replacing with just "</span>" worked
// Let me use that approach

content = content.replace(
  "{isAr ? 'منصة التعليم الإسعافي الرقمي' : 'A digital first-aid academy'}\n            </span>",
  '</span>'
);

// ========== Change 2: Update the tagline ==========
// Change "A little knowledge. The confidence to act." to "Learn First Aid. Be Ready to Help."
// with orange accent on "First Aid"
content = content.replace(
  "A little knowledge.{' '}<span className=\"text-[#F59E42]\">The confidence to act.</span>",
  "Learn <span className=\"text-[#F59E42]\">First Aid</span>.{' '}Be Ready to Help."
);

// ========== Change 3: Remove the bottom feature strip ==========
// Remove lines 571-604: the feature grid with BookOpen, GlobeIcon, Compass icons
content = content.replace(
  `</motion.div>

          <motion.div
            {...heroReveal(0.34)}
            className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-3 border-t border-white/10 pt-6 sm:grid-cols-3"
          >
            {[
              {
                icon: BookOpen,
                title: isAr ? 'دروس واضحة' : 'Clear lessons',
                text: isAr ? 'خطوات عملية مبسطة' : 'Practical, structured steps',
              },
              {
                icon: GlobeIcon,
                title: isAr ? 'عربي وإنجليزي' : 'Arabic & English',
                text: isAr ? 'تعلم بلغتك بسلاسة' : 'Learn in your language',
              },
              {
                icon: Compass,
                title: isAr ? 'تقدمك محفوظ' : 'Tracked progress',
                text: isAr ? 'تابع كل خطوة تنجزها' : 'Follow every milestone',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex items-center gap-3 text-start">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#FFD09A]">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-xs font-extrabold text-[#FCFAF6]">{item.title}</span>
                    <span className="block text-[10px] font-medium text-[#FCFAF6]/55">{item.text}</span>
                  </span>
                </div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Impact — real rotating 3D globe preserved and refined. */}`
);

// Re-insert the closing tags properly after the feature strip removal
// The structure should be: </motion.div> (CTA buttons close) then </div> (outer close) then </section>
content = content.replace(
  `</motion.div>\n        </div>\n      </section>`,
  `</motion.div>\n        </div>\n      </section>`
);

// ========== Change 4: Add 3D FirstAidKit3D component with two-column layout ==========
// Replace the outer div and add the 3D kit
const oldOuterDiv = `<div className="relative z-10 mx-auto w-full max-w-6xl">
          <motion.div {...heroReveal(0)} className="flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#FFD09A]/25 bg-[#0A1712]/55 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#FFD09A] backdrop-blur-md">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F59E42] opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#F59E42]" />
              </span>
              {isAr ? 'منصة التعليم الإسعافي الرقمي' : 'A digital first-aid academy'}
            </span>
          </motion.div>

          <motion.h1
            {...heroReveal(0.08)}
            className="mt-6 text-center text-[#FCFAF6]"
            style={{
              fontFamily: "'Anton', 'Tajawal', sans-serif",
              fontSize: 'clamp(3.6rem, 13vw, 10.5rem)',
              lineHeight: 0.86,
              letterSpacing: '-0.02em',
            }}
          >
            EDUFANOR
          </motion.h1>

          <motion.div {...heroReveal(0.16)} className="mx-auto mt-7 max-w-3xl text-center">
            <p
              className="text-[#FCFAF6]"
              style={{
                fontFamily: isAr ? "'Tajawal', sans-serif" : "'Instrument Serif', serif",
                fontSize: 'clamp(1.55rem, 3.4vw, 2.9rem)',
                lineHeight: 1.2,
                fontStyle: isAr ? 'normal' : 'italic',
                fontWeight: isAr ? 700 : 400,
              }}
            >
              {isAr ? (
                <>
                  معرفة صغيرة…{' '}
                  <span className="text-[#F59E42]">وثقة تُحدث فرقاً.</span>
                </>
              ) : (
                <>
                  A little knowledge.{' '}
                  <span className="text-[#F59E42]">The confidence to act.</span>
                </>
              )}
            </p>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-[#FCFAF6]/70 sm:text-base">
              {isAr
                ? 'تعلّم الخطوات الإسعافية الأساسية عبر دروس واضحة وتجارب تفاعلية، واكتسب الاستعداد للتصرف بثقة عند وقوع الطوارئ.'
                : 'Learn essential first-aid steps through clear lessons and interactive practice, and build the readiness to respond calmly when it matters.'}
            </p>

            <motion.div {...heroReveal(0.24)} className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#F59E42] px-7 py-4 text-xs font-extrabold uppercase tracking-wider text-[#0A1712] shadow-[0_20px_60px_-22px_rgba(245,158,66,0.85)] transition-all hover:-translate-y-0.5 hover:bg-[#FFD09A] sm:w-auto"
              >
                <span>{isAr ? 'ابدأ الآن مجاناً' : 'Get started free'}</span>
                {isAr ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
              </Link>
              <a
                href="#our-impact"
                className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-[#FCFAF6]/20 bg-[#0A1712]/40 px-7 py-4 text-xs font-extrabold uppercase tracking-wider text-[#FCFAF6] backdrop-blur-md transition-all hover:border-[#FFD09A]/50 hover:bg-[#0A1712]/70 sm:w-auto"
              >
                <span>{isAr ? 'اكتشف أثرنا' : 'Explore our impact'}</span>
                <ChevronDown className="h-4 w-4 text-[#FFD09A]" />
              </a>
            </motion.div>
          </div>`;

const newOuterDiv = `<div className="relative z-10 mx-auto w-full max-w-6xl lg:flex lg:items-center gap-8">
          {/* Text column on left */}
          <div className="w-full lg:w-1/2">
            <motion.div {...heroReveal(0)} className="flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#FFD09A]/25 bg-[#0A1712]/55 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#FFD09A] backdrop-blur-md">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F59E42] opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#F59E42]" />
                </span>
              </span>
            </motion.div>

            <motion.h1
              {...heroReveal(0.08)}
              className="mt-6 text-center text-[isAr(#FCFAF6)_#101A15] text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight md:text-center"
              style={{
                fontFamily: "'Anton', 'Tajawal', sans-serif",
                fontSize: 'clamp(3.6rem, 13vw, 10.5rem)',
                lineHeight: 0.86,
                letterSpacing: '-0.02em',
              }}
            >
              EDUFANOR
            </motion.h1>

            <motion.div {...heroReveal(0.16)} className="mx-auto mt-5 max-w-3xl text-center">
              <p
                className="text-[#FCFAF6] mt-3 text-base md:text-lg leading-relaxed"
                style={{
                  fontFamily: isAr ? "'Tajawal', sans-serif" : "'Instrument Serif', serif",
                  fontSize: 'clamp(1.55rem, 3.4vw, 2.9rem)',
                  lineHeight: 1.2,
                  fontStyle: isAr ? 'normal' : 'italic',
                  fontWeight: isAr ? 700 : 400,
                }}
              >
                {isAr ? (
                  <>
                    معرفة صغيرة…{' '}
                    <span className="text-[#F59E42]">وثقة تُحدث فرقاً.</span>
                  </>
                ) : (
                  <>
                    A little knowledge.{' '}
                    <span className="text-[#F59E42]">The confidence to act.</span>
                  </>
                )}
              </p>
            </motion.div>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-[#FCFAF6]/70 sm:text-base">
              {isAr
                ? 'تعلّم الخطوات الإسعافية الأساسية عبر دروس واضحة وتجارب تفاعلية، واكتسب الاستعداد للتصرف بثقة عند وقوع الطوارئ.'
                : 'Learn essential first-aid steps through clear lessons and interactive practice, and build the readiness to respond calmly when it matters.'}
            </p>

            <motion.div {...heroReveal(0.24)} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-full bg-[#F59E42] px-7 py-4 text-xs font-extrabold uppercase tracking-wider text-[#0A1712] shadow-[0_20px_60px_-22px_rgba(245,158,66,0.85)] transition-all hover:-translate-y-0.5 hover:bg-[#FFD09A] sm:w-auto"
              >
                <span>{isAr ? 'ابدأ الآن مجاناً' : 'Get started free'}</span>
                {isAr ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
              </Link>
              <a
                href="#our-impact"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-full border border-[#FCFAF6]/20 bg-[#0A1712]/40 px-7 py-4 text-xs font-extrabold uppercase tracking-wider text-[#FCFAF6] backdrop-blur-md transition-all hover:border-[#FFD09A]/50 hover:bg-[#0A1712]/70 sm:w-auto"
              >
                <span>{isAr ? 'اكتشف أثرنا' : 'Explore our impact'}</span>
                <ChevronDown className="h-4 w-4 text-[#FFD09A]" />
              </a>
            </motion.div>
          </div>

          {/* 3D First-Aid Kit on right (desktop only) */}
          <div className="w-full lg:w-1/2 lg:order-2">
            <FirstAidKit3D className="w-full rotate-6 md:-rotate-6 lg:-rotate-6" />
          </div>
</div>`;

content = content.replace(oldOuterDiv, newOuterDiv);

// ========== Change 5: Add FirstAidKit3D import ==========
content = content.replace(
  "import { useTheme } from '../context/ThemeContext';",
  `import { useTheme } from '../context/ThemeContext';\nimport FirstAidKit3D from '../components/ui/FirstAidKit3D';`
);

fs.writeFileSync('src/pages/PublicLandingPage.jsx', content);
console.log('All changes applied successfully');