const fs = require('fs');
let content = fs.readFileSync('src/pages/PublicLandingPage.jsx', 'utf-8');

// Update the tagline from "A little knowledge. The confidence to act." to "Learn First Aid. Be Ready to Help."
content = content.replace(
  'A little knowledge. The confidence to act.',
  'Learn <span className="text-[#F59E42]">First Aid</span>. Be Ready to Help.'
);

fs.writeFileSync('src/pages/PublicLandingPage.jsx', content);
console.log('Tagline updated');