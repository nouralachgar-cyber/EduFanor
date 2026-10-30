const fs = require('fs');
const path = require('path');
const filePath = path.join(process.cwd(), 'src', 'pages', 'PublicLandingPage.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// The FirstAidHeroVisual function has become duplicated.
// We need to: 
// 1. Keep the new function at the top (lines 42-56)
// 2. Remove the old duplicate body (lines 57-96)

// Find the position after the new function's closing
// The new function is: function FirstAidHeroVisual({ isAr }) { ... };}
const newFuncEndMarker = '});\\n  };\\n}';
const funcEndIdx = content.indexOf('};\\n}');  // Find the first closing }

if (funcEndIdx === -1) {
  console.error('Could not find function end');
  process.exit(1);
}

// Actually, let me find the old body and remove it
// The old body has telltale signs: rotate-[-2deg], bg-[#D69A59], etc.
// Let me just remove lines 57-96 area by finding the pattern

// Find the position after "  );\\n" which ends the new function
const afterNewFunc = content.indexOf('});\\n  };\\n}');
if (afterNewFunc === -1) {
  console.error('Could not find new function end');
  process.exit(1);
}

// The old body starts right after
const oldBodyStart = afterNewFunc;

// Find where the old body ends - it ends before the next major section
// Look for the /* ========================= marker or the next function
const nextSection = content.indexOf('/* =========================');
if (nextSection === -1) {
  console.error('Could not find section marker');
  process.exit(1);
}

// Replace: keep everything up to after the new function, then skip to the section marker
const newContent = content.substring(0, afterNewFunc) + content.substring(nextSection);
fs.writeFileSync(filePath, newContent);
console.log('Fixed duplicate FirstAidHeroVisual function');
"