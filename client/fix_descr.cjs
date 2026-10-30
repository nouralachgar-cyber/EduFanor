const fs = require('fs');
let content = fs.readFileSync('src/pages/PublicLandingPage.jsx', 'utf8');

// Replace the description paragraph class
content = content.replace(
  "className=\"mx-auto mt-5 max-w-xl text-sm leading-relaxed text-[#FCFAF6]/70 sm:text-base\"",
  "className=\"mx-auto max-w-xl mt-4 text-sm leading-relaxed text-[#FCFAF6]/70\""
);

fs.writeFileSync('src/pages/PublicLandingPage.jsx', content, 'utf8');
console.log('Description paragraph fixed');
console.log('Lines changed:', (content.match(/mx-auto mt-5 max-w-xl/g) || []).length, '->', (content.match(/mx-auto max-w-xl mt-4/g) || []).length);