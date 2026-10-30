const fs = require('fs');
const path = require('path');
const filePath = path.join(process.cwd(), 'src', 'pages', 'PublicLandingPage.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// Find the FirstAidHeroVisual function and replace its body
// The function starts at "function FirstAidHeroVisual({ isAr }) {" and ends at "}"
// We'll replace the entire function

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

// Find the function start
const funcStart = content.indexOf('function FirstAidHeroVisual({ isAr }) {');
if (funcStart === -1) {
  console.error('Could not find FirstAidHeroVisual function start');
  process.exit(1);
}

// Find where the function ends (the closing })
let depth = 0;
let i = funcStart;
while (i < content.length) {
  if (content[i] === '{') depth++;
  if (content[i] === '}') { depth--; if (depth === 0) break; }
  i++;
}
const funcEnd = i + 1;

// Replace
const newContent = content.substring(0, funcStart) + newFunc + content.substring(funcEnd);
fs.writeFileSync(filePath, newContent);
console.log('FirstAidHeroVisual function replaced successfully');