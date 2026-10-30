import re

with open('src/pages/PublicLandingPage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Change 1: Remove the top badge
old_badge = "{isAr ? 'منصة التعليم الإسعافي الرقمي' : 'A digital first-aid academy'}\n            </span>"
new_badge = "</span>"
content = content.replace(old_badge, new_badge)

# Change 2: Update the tagline
old_tagline = """{isAr ? (
                <>
                  معرفة صغيرة…{' '}
                  <span className="text-[#F59E42]">وثقة تُحدث فرقاً.</span>
                </>
              ) : (
                <>
                  A little knowledge.{' '}
                  <span className="text-[#F59E42]">The confidence to act.</span>
                </>
              )}"""

new_tagline = """{isAr ? (
                <>
                  معرفة صغيرة…{' '}
                  <span className="text-[#F59E42]">وثقة تُحدث فرقاً.</span>
                </>
              ) : (
                <>
                  Learn <span className="text-[#F59E42]">First Aid</span>.{' '}Be Ready to Help.
                </>
              )}"""

content = content.replace(old_tagline, new_tagline)

# Change 3: Remove the bottom feature strip
old_features = """</motion.div>

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

      {/* Impact — real rotating 3D globe preserved and refined. */}"""

new_features = """</motion.div>
        </div>
      </section>

      {/* Impact — real rotating 3D globe preserved and refined. */}"""

content = content.replace(old_features, new_features)

with open('src/pages/PublicLandingPage.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Changes applied successfully")