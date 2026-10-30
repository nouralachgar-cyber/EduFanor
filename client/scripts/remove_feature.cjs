const fs = require('fs');
let content = fs.readFileSync('src/pages/PublicLandingPage.jsx', 'utf-8');

// Find and remove the feature strip at the bottom of the hero section
// It's the motion.div with grid-cols-1 gap-3 border-t at the bottom of the hero

// First, find the start of the feature strip motion.div
const featureStart = content.indexOf('className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-3 border-t border-white/10 pt-6 sm:grid-cols-3"');
if (featureStart === -1) {
  console.log('Feature strip start not found');
  process.exit(1);
}

// Find the opening motion.div before it
const motionDivStart = content.lastIndexOf('{...heroReveal(0.34)}', featureStart);
if (motionDivStart === -1) {
  console.log('heroReveal not found');
  process.exit(1);
}

// Now find where the feature strip content starts (the {[)
// And where it ends (the closing of the map + JSX)
let searchFrom = motionDivStart;
const openingTag = '{...heroReveal(0.34)} className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-3 border-t border-white/10 pt-6 sm:grid-cols-3"';
const openingTagIdx = content.indexOf(openingTag, searchFrom);
if (openingTagIdx === -1) {
  console.log('Opening tag not found after heroReveal');
  process.exit(1);
}

// Find the end of the feature strip - the closing of the motion.div
let i = openingTagIdx + openingTag.length;
let depth = 0;
let inMap = true;
while (i < content.length && inMap) {
  const ch = content[i];
  if (ch === '{') depth++;
  if (ch === '}') {
    depth--;
    if (depth === -1) {
      // Found the closing brace of the motion.div props
      inMap = false;
    }
  }
  i++;
}

// Now find the actual </motion.div> closing tag
const closingDiv = content.indexOf('</motion.div>', i);
if (closingDiv === -1) {
  console.log('Closing motion.div not found');
  process.exit(1);
}

// The full block to remove is from motion.div opening to </motion.div> closing
const blockToRemove = content.substring(motionDivStart, closingDiv + '</motion.div>'.length);

console.log('Feature strip block length:', blockToRemove.length);
console.log('First 100 chars:', blockToRemove.substring(0, 100));

// Now remove it
const newContent = content.replace(blockToRemove, '');
fs.writeFileSync('src/pages/PublicLandingPage.jsx', newContent);
console.log('Feature strip removed successfully');