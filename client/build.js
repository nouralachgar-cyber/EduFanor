import { build } from 'vite';

build({
  configFile: 'C:\\Users\\SKIZO-NEBRAS-MEXICY\\Desktop\\EduFanor\\client\\vite.config.js',
  root: 'C:\\Users\\SKIZO-NEBRAS-MEXICY\\Desktop\\EduFanor\\client',
}).then(() => {
  console.log('Build succeeded!');
  process.exit(0);
}).catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});