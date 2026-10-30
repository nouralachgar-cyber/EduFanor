const fs = require('fs');
let content = fs.readFileSync('src/pages/PublicLandingPage.jsx', 'utf-8');

// Read the current function to understand exact format
const idx = content.indexOf('function FirstAidHeroVisual()');
if (idx === -1) {
  console.log('FirstAidHeroVisual function not found');
  process.exit(1);
}

// Find the opening brace position
let depth = 0;
let i = idx;
let inFunc = false;
while (i < content.length) {
  const ch = content[i];
  if (ch === '{') { depth++; inFunc = true; }
  if (ch === '}') { depth--; if (depth === 0 && inFunc) break; }
  i++;
}
const funcEnd = i + 1;

// The function spans from idx to funcEnd
// Let's just replace the entire function by finding it
// We need to find the NEXT function or section after it
const nextSectionIdx = content.indexOf('/* =========================', idx);
if (nextSectionIdx === -1) {
  console.log('Could not find next section');
  process.exit(1);
}

// New FirstAidHeroVisual function
const newFunc = `function FirstAidHeroVisual({ isAr }) {
  return (
    <div className="relative w-full lg:w-[420px] rounded-2xl lg:rounded-3xl lg:shadow-2xl lg:shadow-[#0A1712]/20 overflow-hidden transition-transform duration-700 lg:hover:scale-105">
      <img
        src="/hero1.png"
        alt="Cinematic first-aid rescue scene - first responder helping injured person"
        className="w-full h-[420px] object-cover object-top transition-transform duration-500 ease-out"
        loading="lazy"
        decoding="async"
      />
      {/* Subtle glowing border on hover — the image "breathes" within the composition */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 lg:opacity-15 lg:hover:opacity-25 rounded-2xl lg:rounded-3xl"
      />
    </div>
  );
}`;

// Replace the function
const newContent = content.replace(content.substring(idx, nextSectionIdx), newFunc);
fs.writeFileSync('src/pages/PublicLandingPage.jsx', newContent);
console.log('FirstAidHeroVisual replaced successfully');
"