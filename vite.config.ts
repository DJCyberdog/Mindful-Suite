import { defineConfig } from 'vite';
import { resolve } from 'node:path';

const pages = {
  main: resolve(__dirname, 'index.html'),
  atmung: resolve(__dirname, 'atmung/index.html'),
  quickCalm: resolve(__dirname, 'quick-calm/index.html'),
  schaefchen: resolve(__dirname, 'schaefchen/index.html'),
  pmr: resolve(__dirname, 'pmr/index.html'),
  bodyscan: resolve(__dirname, 'bodyscan/index.html'),
  autogenesTraining: resolve(__dirname, 'autogenes-training/index.html'),
  fokusAtmung: resolve(__dirname, 'fokus-atmung/index.html'),
  geschichten: resolve(__dirname, 'geschichten/index.html'),

  storyWaldpfad: resolve(__dirname, 'geschichten/waldpfad-der-abendruhe/index.html'),
  storySternenatelier: resolve(__dirname, 'geschichten/lichter-im-sternenatelier/index.html'),
  storyMorgennebelzimmer: resolve(__dirname, 'geschichten/ein-zimmer-voller-morgennebel/index.html'),
  storyStilleFahrt: resolve(__dirname, 'geschichten/stille-fahrt-durch-die-vorstadt/index.html'),
  storyUferkapitel: resolve(__dirname, 'geschichten/das-ruhige-uferkapitel/index.html'),
  impressum: resolve(__dirname, 'impressum/index.html'),
  datenschutz: resolve(__dirname, 'datenschutz/index.html'),
  nutzungsbedingungen: resolve(__dirname, 'nutzungsbedingungen/index.html'),
  medizinischerDisclaimer: resolve(__dirname, 'medizinischer-disclaimer/index.html')
};

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: pages
    }
  }
});
