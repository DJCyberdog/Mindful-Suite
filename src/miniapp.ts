import './styles/base.css';
import { createAmbientLayer, createShell, getShellStack } from './shared/layout';
import { loadSentences } from './shared/content';
import { applyMotionPreference, applyTheme, getPreferences, savePreferences } from './shared/preferences';
import { speak } from './shared/tts';
import { buildHeader, buildLegalFooter } from './shared/ui';

async function bootMiniApp() {
  const module = document.body.dataset.module;
  const title = document.body.dataset.title;
  const introText = document.body.dataset.intro;

  if (!module || !title || !introText) return;

  const prefs = getPreferences();
  applyTheme(prefs.theme);
  applyMotionPreference(prefs.reducedMotion);
  savePreferences({ lastEntry: `/${module}/` });

  document.body.append(createAmbientLayer());
  const shell = createShell();
  document.body.append(shell);
  const stack = getShellStack(shell);

  const sentences = await loadSentences(module);
  const guidance = sentences.find((sentence) => sentence.active)?.textDe ?? 'Diese Mini-App wird in der nächsten Phase ausgebaut.';

  stack.append(
    buildHeader(title, introText),
    buildFoundationCard(guidance),
    buildBackLinks(),
    buildLegalFooter()
  );
}

function buildFoundationCard(text: string) {
  const card = document.createElement('section');
  card.className = 'surface stack';
  card.innerHTML = `<h2>Phase-0-Shell</h2><p>${text}</p><p>Die UI-, Theme-, Content- und TTS-Fundamente sind bereits aktiv und werden hier später vertieft.</p>`;

  const button = document.createElement('button');
  button.textContent = 'Leise Guidance vorlesen';
  button.addEventListener('click', () => speak(text));
  card.append(button);

  return card;
}

function buildBackLinks() {
  const section = document.createElement('section');
  section.className = 'row';
  section.innerHTML = '<a class="button" href="/">Zurück zum Portal</a>';
  return section;
}

bootMiniApp();
