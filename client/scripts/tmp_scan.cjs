const fs = require('fs');
const lines = fs.readFileSync('C:/Users/pc/Desktop/EduFanor/client/src/pages/PublicLandingPage.jsx','utf8').split(String.fromCharCode(10));
for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  const keys = ['<section','</section','<main>','</main>','<header','</header','Hero','heroRef','id="home"','Impact','our-impact','our-mission','why-choose-us','id="courses"','id="about"'];
  for (const k of keys) { if (l.includes(k)) { console.log((i+1) + ': ' + l); break; } }
}
