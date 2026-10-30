const fs = require('fs');

let content = fs.readFileSync('src/pages/PublicLandingPage.jsx', 'utf-8');

// Change 2: Update the tagline
// The exact string from the current file is: A little knowledge.{' '}<span className="text-[#F59E42]">The confidence to act.</span>
content = content.replace(
  "A little knowledge.{' '}<span className=\"text-[#F59E42]\">The confidence to act.</span>",
  "Learn <span className=\"text-[#F59E42]\">First Aid</span>.{' '}Be Ready to Help."
);

fs.writeFileSync('src/pages/PublicLandingPage.jsx', content);
console.log('Tagline updated');