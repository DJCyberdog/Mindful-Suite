import './styles/base.css';
import { createAmbientLayer, createShell, getShellStack } from './shared/layout';
import {
  loadSentences,
  loadStoryCategories,
  loadStoryHubMeta,
  loadStorySummaries,
  loadStoryWorld
} from './shared/content';
import { applyMotionPreference, applyTheme, getPreferences, savePreferences } from './shared/preferences';
import { createGuidancePicker } from './shared/breathing/guidance';
import { speakWithOptions, stopSpeaking } from './shared/tts';
import { buildLegalFooter } from './shared/ui';
import type { StorySummary, StoryWorld } from './shared/types';

async function bootStories() {
  const storyId = document.body.dataset.storyId;
  const prefs = getPreferences();
  applyTheme(prefs.theme);
  applyMotionPreference(prefs.reducedMotion);
  savePreferences({ lastEntry: storyId ? `/geschichten/${document.body.dataset.storySlug ?? ''}/` : '/geschichten/' });

  document.body.append(createAmbientLayer());
  const shell = createShell();
  document.body.append(shell);
  const stack = getShellStack(shell);
  stack.classList.add('story-shell');

  if (storyId) {
    await renderStoryPage(stack, storyId);
    return;
  }

  await renderStoryHub(stack);
}

async function renderStoryHub(stack: HTMLElement) {
  const [meta, categories, stories, sentences] = await Promise.all([
    loadStoryHubMeta(),
    loadStoryCategories(),
    loadStorySummaries(),
    loadSentences('geschichten')
  ]);

  document.title = meta.seo.title;
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute('content', meta.seo.description);

  const pick = createGuidancePicker(sentences);

  const hero = document.createElement('header');
  hero.className = 'surface story-hero stack';
  hero.innerHTML = `<span class="kicker">${meta.kicker}</span><h1>${meta.title}</h1><p>${meta.intro}</p>`;

  const ttsBtn = document.createElement('button');
  ttsBtn.textContent = 'Geschichtenraum vorlesen';
  ttsBtn.addEventListener('click', () => {
    const welcome = pick('welcome')?.textDe ?? meta.intro;
    const transition = pick('transition')?.textDe ?? meta.categoryIntro;
    speakWithOptions(`${welcome} ${transition}`, { rate: 0.93 });
  });
  hero.append(ttsBtn);

  const categorySection = document.createElement('section');
  categorySection.className = 'surface stack';
  categorySection.innerHTML = `<div class="section-head"><span class="kicker">Kategorien</span><h2>Ruhige Erzählzugänge</h2><p>${meta.categoryIntro}</p></div>`;

  const catList = document.createElement('div');
  catList.className = 'story-category-list';
  for (const category of categories) {
    const item = document.createElement('article');
    item.className = 'story-category-item stack';
    item.innerHTML = `<h3>${category.name}</h3><p>${category.description}</p>`;
    catList.append(item);
  }
  categorySection.append(catList);

  const storiesSection = document.createElement('section');
  storiesSection.className = 'surface stack';
  storiesSection.innerHTML = '<div class="section-head"><span class="kicker">Story-Welten</span><h2>Vollständige ruhige Erzählräume</h2></div>';

  const storyGrid = document.createElement('div');
  storyGrid.className = 'story-world-grid';
  for (const story of stories) {
    storyGrid.append(buildStoryCard(story, categories.find((c) => c.id === story.categoryId)?.name ?? 'Geschichte'));
  }
  storiesSection.append(storyGrid);

  stack.append(hero, categorySection, storiesSection, buildStoryBackLinks(), buildLegalFooter());
}

function buildStoryCard(story: StorySummary, categoryLabel: string) {
  const card = document.createElement('article');
  card.className = 'story-card stack';

  const heading = document.createElement('div');
  heading.className = 'stack';
  heading.innerHTML = `<span class="kicker">${categoryLabel} · ca. ${story.durationMin} Minuten</span><h3>${story.title}</h3><p>${story.teaser}</p>`;

  const actions = document.createElement('div');
  actions.className = 'row';

  const open = document.createElement('a');
  open.className = 'button';
  open.href = `/geschichten/${story.slug}/`;
  open.textContent = 'Story öffnen';

  const world = document.createElement('span');
  world.className = 'link-muted';
  world.textContent = `Welt: ${story.world}`;

  actions.append(open, world);
  card.append(heading, actions);
  return card;
}

async function renderStoryPage(stack: HTMLElement, storyId: string) {
  const [story, stories, categories, sentences] = await Promise.all([
    loadStoryWorld(storyId),
    loadStorySummaries(),
    loadStoryCategories(),
    loadSentences('geschichten')
  ]);

  if (!story) {
    const fallback = document.createElement('section');
    fallback.className = 'surface stack';
    fallback.innerHTML = '<h1>Geschichte nicht gefunden</h1><p>Diese Story konnte nicht geladen werden.</p><a class="button" href="/geschichten/">Zum Story-Hub</a>';
    stack.append(fallback, buildLegalFooter());
    return;
  }

  const summary = stories.find((s) => s.id === story.id);
  const categoryName = categories.find((c) => c.id === story.categoryId)?.name ?? 'Geschichte';

  document.title = `${story.title} · Mindful Suite Geschichten`;
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute('content', story.entryDescription);

  const pick = createGuidancePicker(sentences);

  const hero = document.createElement('header');
  hero.className = 'surface story-reader-hero stack';
  hero.innerHTML = `<span class="kicker">${categoryName} · ${summary?.durationMin ?? 9} Minuten</span><h1>${story.title}</h1><p>${story.entryDescription}</p>`;

  const controls = document.createElement('section');
  controls.className = 'surface stack';
  controls.innerHTML = '<span class="kicker">Hören & Lesen</span>';

  const progress = document.createElement('p');
  progress.className = 'kicker';

  const line = document.createElement('p');
  line.className = 'story-live-line';

  const row = document.createElement('div');
  row.className = 'row';
  const play = document.createElement('button');
  play.textContent = 'Story anhören';
  const pause = document.createElement('button');
  pause.className = 'button-secondary';
  pause.textContent = 'Pause';
  const next = document.createElement('button');
  next.className = 'button-secondary';
  next.textContent = 'Nächster Abschnitt';
  const stop = document.createElement('button');
  stop.className = 'button-secondary';
  stop.textContent = 'Stop';

  row.append(play, pause, next, stop);
  controls.append(progress, line, row);

  const article = document.createElement('article');
  article.className = 'surface story-article stack';
  article.innerHTML = `<h2>${story.entryTitle}</h2>`;

  const segmentNodes = story.segments.map((segment, index) => {
    const p = document.createElement('p');
    p.className = 'story-segment';
    p.dataset.segment = segment.id;
    p.innerHTML = `<span class="kicker">Abschnitt ${index + 1}</span>${segment.text}`;
    article.append(p);
    return p;
  });

  const endCard = document.createElement('section');
  endCard.className = 'surface soft stack';
  endCard.innerHTML = `<h2>Sanfter Abschluss</h2><p>${story.endingNote}</p><p>${pick('close')?.textDe ?? ''}</p>`;

  stack.append(hero, controls, article, endCard, buildStoryBackLinks(), buildLegalFooter());

  setupStoryPlayer({
    story,
    play,
    pause,
    next,
    stop,
    progress,
    line,
    segmentNodes
  });
}

function setupStoryPlayer(config: {
  story: StoryWorld;
  play: HTMLButtonElement;
  pause: HTMLButtonElement;
  next: HTMLButtonElement;
  stop: HTMLButtonElement;
  progress: HTMLElement;
  line: HTMLElement;
  segmentNodes: HTMLParagraphElement[];
}) {
  const { story, play, pause, next, stop, progress, line, segmentNodes } = config;
  let index = 0;
  let running = false;
  let paused = false;

  const render = () => {
    progress.textContent = `${Math.min(index + 1, story.segments.length)} / ${story.segments.length} Segmente`;
    line.textContent = story.segments[index]?.text ?? story.endingNote;
    segmentNodes.forEach((node, i) => node.classList.toggle('is-active', i === index));
  };

  const speakCurrent = () => {
    const segment = story.segments[index];
    if (!segment) {
      running = false;
      paused = false;
      play.textContent = 'Erneut anhören';
      line.textContent = story.endingNote;
      return;
    }

    render();
    speakWithOptions(segment.text, {
      cancelCurrent: true,
      rate: 0.92,
      onEnd: () => {
        if (!running || paused) return;
        index += 1;
        speakCurrent();
      }
    });
  };

  play.addEventListener('click', () => {
    if (!running) {
      running = true;
      paused = false;
      play.textContent = 'Läuft…';
      speakCurrent();
      return;
    }

    if (paused) {
      paused = false;
      speakWithOptions(story.segments[index].text, {
        cancelCurrent: false,
        rate: 0.92,
        onEnd: () => {
          if (!running || paused) return;
          index += 1;
          speakCurrent();
        }
      });
      play.textContent = 'Läuft…';
    }
  });

  pause.addEventListener('click', () => {
    if (!running) return;
    paused = !paused;
    if (paused) {
      window.speechSynthesis.pause();
      pause.textContent = 'Weiter';
      play.textContent = 'Fortsetzen';
    } else {
      window.speechSynthesis.resume();
      pause.textContent = 'Pause';
      play.textContent = 'Läuft…';
    }
  });

  next.addEventListener('click', () => {
    if (index < story.segments.length - 1) index += 1;
    render();
    if (running && !paused) speakCurrent();
  });

  stop.addEventListener('click', () => {
    running = false;
    paused = false;
    index = 0;
    stopSpeaking();
    play.textContent = 'Story anhören';
    pause.textContent = 'Pause';
    render();
  });

  render();
}

function buildStoryBackLinks() {
  const section = document.createElement('section');
  section.className = 'row';
  section.innerHTML = '<a class="button" href="/">Zum Portal</a><a class="button-secondary" href="/geschichten/">Zum Story-Hub</a>';
  return section;
}

bootStories();
