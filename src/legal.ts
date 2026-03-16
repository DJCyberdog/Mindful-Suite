import './styles/base.css';
import { createAmbientLayer, createShell, getShellStack } from './shared/layout';
import { applyMotionPreference, applyTheme, getPreferences } from './shared/preferences';
import { buildLegalFooter } from './shared/ui';

function bootLegalPage() {
  const title = document.body.dataset.title;
  const text = document.body.dataset.text;

  if (!title || !text) return;

  const prefs = getPreferences();
  applyTheme(prefs.theme);
  applyMotionPreference(prefs.reducedMotion);
  document.body.append(createAmbientLayer());
  const shell = createShell();
  document.body.append(shell);
  const stack = getShellStack(shell);

  const card = document.createElement('section');
  card.className = 'surface stack';
  card.innerHTML = `<span class="kicker">Vertrauen & Transparenz</span><h1>${title}</h1><p>${text}</p><p>Diese Seite ist ein früher Platzhalter für Phase 0 und wird redaktionell erweitert.</p><a class="button" href="/">Zum Portal</a>`;

  stack.append(card, buildLegalFooter());
}

bootLegalPage();
