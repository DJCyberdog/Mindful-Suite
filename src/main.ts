import './styles/base.css';
import { createAmbientLayer, createShell, getShellStack } from './shared/layout';
import { loadModuleList, loadSentences } from './shared/content';
import { applyMotionPreference, applyTheme, getPreferences, savePreferences } from './shared/preferences';
import { registerServiceWorker } from './shared/pwa';
import { speak } from './shared/tts';
import { buildHeader, buildLegalFooter, buildMiniAppGrid, buildThemeAndVoiceCard } from './shared/ui';

async function boot() {
  const prefs = getPreferences();
  applyTheme(prefs.theme);
  applyMotionPreference(prefs.reducedMotion);
  savePreferences({ lastEntry: '/' });

  document.body.append(createAmbientLayer());
  const shell = createShell();
  document.body.append(shell);

  const stack = getShellStack(shell);
  const sentences = await loadSentences('portal');
  const modules = await loadModuleList();

  const intro = sentences.find((entry) => entry.active && entry.sentenceType === 'welcome');
  const transition = sentences.find((entry) => entry.active && entry.sentenceType === 'transition');

  stack.append(
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
  stack.append(voiceButton, buildLegalFooter());

  registerServiceWorker();
}

boot();
