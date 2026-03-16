import './styles/base.css';
import { createAmbientLayer, createShell, getShellStack } from './shared/layout';
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

async function boot() {
  const prefs = getPreferences();
  applyTheme(prefs.theme);
  applyMotionPreference(prefs.reducedMotion);
  savePreferences({ lastEntry: '/' });

  document.body.append(createAmbientLayer());
  const shell = createShell();
  document.body.append(shell);

  const stack = getShellStack(shell);
  const [sentences, modules, portal] = await Promise.all([
    loadSentences('portal'),
    loadModuleList(),
    loadPortalContent()
  ]);

  document.title = portal.seo.title;
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute('content', portal.seo.description);

  const intro = sentences.find((entry) => entry.active && entry.sentenceType === 'welcome');
  const transition = sentences.find((entry) => entry.active && entry.sentenceType === 'transition');

  stack.append(
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

  stack.append(voiceButton, buildLegalFooter());

  registerServiceWorker();
}

boot();
