const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src', 'pages', 'PublicLandingPage.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// Find and replace the FirstAidHeroVisual function
// The function starts at "function FirstAidHeroVisual()" and ends before "/* ========================= "
const funcStartMarker = 'function FirstAidHeroVisual()';
const funcEndMarker = '/* =========================';

const funcStartIdx = content.indexOf(funcStartMarker);
if (funcStartIdx === -1) {
  console.error('Could not find FirstAidHeroVisual function');
  process.exit(1);
}

const funcEndIdx = content.indexOf(funcEndMarker);
if (funcEndIdx === -1) {
  console.error('Could not find end marker');
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
      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 lg:opacity-15 lg:hover:opacity-25 rounded-2xl lg:rounded-3xl" />
    </div>
  );
}`;

// Replace the function section
const newContent = content.substring(0, funcStartIdx) + newFunc + content.substring(funcEndIdx);
fs.writeFileSync(filePath, newContent);
console.log('FirstAidHeroVisual replaced successfully');