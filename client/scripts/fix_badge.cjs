const fs = require('fs');
let content = fs.readFileSync('src/pages/PublicLandingPage.jsx', 'utf-8');

// Remove the top badge "A digital first-aid academy"
content = content.replace(
  'A digital first-aid academy',
  ''
);

fs.writeFileSync('src/pages/PublicLandingPage.jsx', content);
console.log('Top badge removed');