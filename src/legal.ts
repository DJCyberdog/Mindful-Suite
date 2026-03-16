import './styles/base.css';
import { createAmbientLayer, createShell, getShellStack } from './shared/layout';
<<<<<<< HEAD
import { loadLegalContent } from './shared/content';
import { applyMotionPreference, applyTheme, getPreferences } from './shared/preferences';
import { buildLegalFooter } from './shared/ui';

async function bootLegalPage() {
  const slug = document.body.dataset.legal;
  if (!slug) return;

  const content = await loadLegalContent(slug);
  if (!content) return;
=======
import { applyMotionPreference, applyTheme, getPreferences } from './shared/preferences';
import { buildLegalFooter } from './shared/ui';

function bootLegalPage() {
  const title = document.body.dataset.title;
  const text = document.body.dataset.text;

  if (!title || !text) return;
>>>>>>> main

  const prefs = getPreferences();
  applyTheme(prefs.theme);
  applyMotionPreference(prefs.reducedMotion);
<<<<<<< HEAD

  document.title = `${content.title} · Mindful Suite`;
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute('content', content.description);

=======
>>>>>>> main
  document.body.append(createAmbientLayer());
  const shell = createShell();
  document.body.append(shell);
  const stack = getShellStack(shell);

  const card = document.createElement('section');
  card.className = 'surface stack';
<<<<<<< HEAD
  card.innerHTML = `<span class="kicker">Vertrauen & Transparenz</span><h1>${content.title}</h1><p>${content.intro}</p><a class="button" href="/">Zum Portal</a>`;

  const list = document.createElement('ul');
  list.className = 'trust-list';
  for (const item of content.items) {
    const li = document.createElement('li');
    li.textContent = item;
    list.append(li);
  }

  card.append(list);
=======
  card.innerHTML = `<span class="kicker">Vertrauen & Transparenz</span><h1>${title}</h1><p>${text}</p><p>Diese Seite ist ein früher Platzhalter für Phase 0 und wird redaktionell erweitert.</p><a class="button" href="/">Zum Portal</a>`;

>>>>>>> main
  stack.append(card, buildLegalFooter());
}

bootLegalPage();
