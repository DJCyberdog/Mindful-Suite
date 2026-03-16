import './styles/base.css';
import { createAmbientLayer, createShell, getShellStack } from './shared/layout';
import { loadLegalContent } from './shared/content';
import { applyMotionPreference, applyTheme, getPreferences } from './shared/preferences';
import { buildLegalFooter } from './shared/ui';

async function bootLegalPage() {
  const slug = document.body.dataset.legal;
  if (!slug) return;

  const content = await loadLegalContent(slug);
  if (!content) return;

  const prefs = getPreferences();
  applyTheme(prefs.theme);
  applyMotionPreference(prefs.reducedMotion);

  document.title = `${content.title} · Mindful Suite`;
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute('content', content.description);

  document.body.append(createAmbientLayer());
  const shell = createShell();
  document.body.append(shell);
  const stack = getShellStack(shell);

  const card = document.createElement('section');
  card.className = 'surface stack';
  card.innerHTML = `<span class="kicker">Vertrauen & Transparenz</span><h1>${content.title}</h1><p>${content.intro}</p><a class="button" href="/">Zum Portal</a>`;

  const list = document.createElement('ul');
  list.className = 'trust-list';
  for (const item of content.items) {
    const li = document.createElement('li');
    li.textContent = item;
    list.append(li);
  }

  card.append(list);
  stack.append(card, buildLegalFooter());
}

bootLegalPage();
