import './styles/base.css';
import { createAmbientLayer, createShell, getShellStack } from './shared/layout';
<<<<<<< HEAD
import { loadModuleList, loadPortalContent, loadSentences } from './shared/content';
import { applyMotionPreference, applyTheme, getPreferences, savePreferences } from './shared/preferences';
import { registerServiceWorker } from './shared/pwa';
import { speak } from './shared/tts';
import {
  buildLegalFooter,
  buildModuleOverview,
  buildNeedSection,
  buildPortalHero,
  buildStoryTeaser,
  buildThemeAndVoiceCard,
  buildThemeSection,
  buildTrustSection
} from './shared/ui';
=======
import { loadModuleList, loadSentences } from './shared/content';
import { applyMotionPreference, applyTheme, getPreferences, savePreferences } from './shared/preferences';
import { registerServiceWorker } from './shared/pwa';
import { speak } from './shared/tts';
import { buildHeader, buildLegalFooter, buildMiniAppGrid, buildThemeAndVoiceCard } from './shared/ui';
>>>>>>> main

async function boot() {
  const prefs = getPreferences();
  applyTheme(prefs.theme);
  applyMotionPreference(prefs.reducedMotion);
  savePreferences({ lastEntry: '/' });

  document.body.append(createAmbientLayer());
  const shell = createShell();
  document.body.append(shell);

  const stack = getShellStack(shell);
<<<<<<< HEAD
  const [sentences, modules, portal] = await Promise.all([
    loadSentences('portal'),
    loadModuleList(),
    loadPortalContent()
  ]);

  document.title = portal.seo.title;
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute('content', portal.seo.description);
=======
  const sentences = await loadSentences('portal');
  const modules = await loadModuleList();
>>>>>>> main

  const intro = sentences.find((entry) => entry.active && entry.sentenceType === 'welcome');
  const transition = sentences.find((entry) => entry.active && entry.sentenceType === 'transition');

  stack.append(
<<<<<<< HEAD
    buildPortalHero(portal.hero),
    buildNeedSection(portal.needs),
    buildModuleOverview(modules),
    buildThemeSection(portal.themes),
    buildStoryTeaser(portal.storyTeaser),
    buildTrustSection(portal.trust),
    buildThemeAndVoiceCard()
  );

  const voiceButton = document.createElement('button');
  voiceButton.textContent = 'Portal-Intro vorlesen';
  voiceButton.addEventListener('click', () => {
    speak(`${intro?.textDe ?? ''} ${transition?.textDe ?? ''}`.trim());
  });

=======
    buildHeader(
      'Mindful Suite',
      intro?.textDe ?? 'Ein ruhiges, deutschsprachiges Portal für Entspannung, Schlafnähe und sanfte mentale Beruhigung.'
    ),
    buildThemeAndVoiceCard(),
    buildMiniAppGrid(modules)
  );

  const voiceButton = document.createElement('button');
  voiceButton.textContent = 'Sanfte Einführung vorlesen';
  voiceButton.addEventListener('click', () => {
    speak(`${intro?.textDe ?? ''} ${transition?.textDe ?? ''}`.trim());
  });
>>>>>>> main
  stack.append(voiceButton, buildLegalFooter());

  registerServiceWorker();
}

boot();
