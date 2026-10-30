const fs = require('fs');
let content = fs.readFileSync('src/pages/PublicLandingPage.jsx', 'utf8');

// Replace the navbar background classes
content = content.replace(
  'bg-[#0A1712]/90 text-[#FCFAF6] backdrop-blur-xl transition-shadow duration-300 {',
  'bg-[#0A1712]/80 backdrop-blur-xl transition-shadow duration-300 shadow-[0_12px_40px_-20px_rgba(0,0,0,0.6)] {'
);

// Fix the navbar nav items - change from rounded-full px-3.5 py-2 font-bold to font-display text-sm font-medium
content = content.replace(
  'className="rounded-full px-3.5 py-2 text-xs font-bold text-[#FCFAF6]/70 transition-colors hover:bg-white/5 hover:text-[#FFD09A]"',
  'className="font-display text-sm font-medium transition-colors text-[#FCFAF6]/80 hover:text-[#FFD09A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E42]/40"'
);

// Fix the language selector buttons - keep them but ensure they work
// Fix the login link - remove 'hidden' and update classes
content = content.replace(
  'className="hidden px-3 py-2 text-xs font-bold text-[#FCFAF6]/80 transition-colors hover:text-[#FFD09A] sm:inline-flex"',
  'className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#FCFAF6] transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"'
);

// Fix the register link - update classes
content = content.replace(
  'className="hidden items-center gap-2 rounded-full bg-[#F59E42] px-4 py-2.5 text-xs font-extrabold text-[#0A1712] shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#FFD09A] sm:inline-flex"',
  'className="inline-flex items-center gap-2 rounded-full bg-[#F59E42]/90 px-4 py-2.5 text-xs font-extrabold text-[#0A1712] shadow-sm transition-all hover:bg-[#F59E42]/95 hover:shadow-[0_0_10px_2px_rgba(245,158,66,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E42]/40"'
);

fs.writeFileSync('src/pages/PublicLandingPage.jsx', content, 'utf8');
console.log('Navbar changes applied');