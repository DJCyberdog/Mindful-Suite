import './styles/base.css';
import { createAmbientLayer, createShell, getShellStack } from './shared/layout';
<<<<<<< HEAD
import { loadSentences, loadSheepDefaults, loadSheepFlows, loadSheepMeta, loadSoundscapes } from './shared/content';
import { applyMotionPreference, applyTheme, getPreferences, savePreferences } from './shared/preferences';
import { buildLegalFooter } from './shared/ui';
import { speak, stopSpeaking } from './shared/tts';
import { applySoundscape, stopSoundscape } from './shared/soundscape';
=======
import { loadSentences, loadSheepDefaults, loadSheepFlows, loadSheepMeta } from './shared/content';
import { applyMotionPreference, applyTheme, getPreferences, savePreferences } from './shared/preferences';
import { buildLegalFooter } from './shared/ui';
import { speak, stopSpeaking } from './shared/tts';
>>>>>>> main
import { createGuidancePicker } from './shared/breathing/guidance';
import type { SheepFlow } from './shared/types';

async function bootSchaefchen() {
<<<<<<< HEAD
  const [meta, defaults, flows, sentences, soundscapes] = await Promise.all([
    loadSheepMeta(),
    loadSheepDefaults(),
    loadSheepFlows(),
    loadSentences('schaefchen-guidance'),
    loadSoundscapes()
=======
  const [meta, defaults, flows, sentences] = await Promise.all([
    loadSheepMeta(),
    loadSheepDefaults(),
    loadSheepFlows(),
    loadSentences('schaefchen-guidance')
>>>>>>> main
  ]);

  const prefs = getPreferences();
  applyTheme(prefs.theme);
  applyMotionPreference(prefs.reducedMotion);

  const flowMap = new Map(flows.map((flow) => [flow.id, flow]));
  let selected = flowMap.get(prefs.lastSheepFlow ?? '') ?? flowMap.get(defaults.defaultFlowId) ?? flows[0];

  document.title = meta.title;
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute('content', meta.description);

  document.body.append(createAmbientLayer());
  const shell = createShell();
  document.body.append(shell);
  const stack = getShellStack(shell);
  stack.classList.add('sheep-shell');

  const pick = createGuidancePicker(sentences);

  const hero = document.createElement('header');
  hero.className = 'surface sheep-hero stack';
  hero.innerHTML = `<span class="kicker">${meta.kicker}</span><h1>${meta.title}</h1><p>${pick('intro')?.textDe ?? meta.description}</p>`;

  const ritual = document.createElement('section');
  ritual.className = 'surface sheep-ritual stack';

  const scene = document.createElement('div');
  scene.className = 'sheep-scene';
  const lane = document.createElement('div');
  lane.className = 'sheep-lane';
  scene.append(lane);

  const countText = document.createElement('h2');
  countText.textContent = 'Schaf 0';
  const guideText = document.createElement('p');
  guideText.textContent = pick('entry')?.textDe ?? 'Wir starten leise.';
  const progress = document.createElement('p');
  progress.className = 'kicker';
  progress.textContent = `0 / ${selected.targetCount}`;

  const actions = document.createElement('div');
  actions.className = 'row sheep-actions';
  const start = document.createElement('button');
  start.className = 'sheep-primary';
  start.textContent = meta.primaryAction;
  const stop = document.createElement('button');
  stop.className = 'button-secondary';
  stop.textContent = 'Sanft stoppen';
  actions.append(start, stop);

  ritual.append(scene, countText, guideText, progress, actions);

  const flowSelectWrap = buildFlowSelector(flows, selected);
  stack.append(hero, ritual, flowSelectWrap.root, buildBackLinks(), buildLegalFooter());

  let timer: number | undefined;
  let count = 0;

  const renderSheep = (number: number) => {
    const sheep = document.createElement('div');
    sheep.className = 'sheep-glyph';
    sheep.innerHTML = `<span class="sheep-body">◜◝</span><span class="sheep-head">•</span><span class="sheep-count">${number}</span>`;
    lane.append(sheep);
    window.setTimeout(() => sheep.remove(), selected.cadenceMs * 2);
  };

  const tick = () => {
    count += 1;
    countText.textContent = `Schaf ${count}`;
    progress.textContent = `${count} / ${selected.targetCount}`;
    renderSheep(count);

    if (count % selected.ttsEvery === 0) {
      const anchor = pick('count_anchor');
      if (anchor) {
        const text = anchor.textDe.replace('{count}', String(count));
        guideText.textContent = text;
        speak(text);
      }
    }

    if (count > 0 && count % 7 === 0) {
      const prompt = pick('drift_prompt') ?? pick('sleepy_transition');
      if (prompt) {
        guideText.textContent = prompt.textDe;
        speak(prompt.textDe);
      }
    }

    if (count > 0 && count % 11 === 0) {
      const reassurance = pick('reassurance');
      if (reassurance) {
        guideText.textContent = reassurance.textDe;
        speak(reassurance.textDe);
      }
    }

    if (count >= selected.targetCount) {
      finish();
    }
  };

  const startFlow = () => {
    clearTimer();
    count = 0;
    lane.innerHTML = '';
    start.textContent = 'Ritual läuft…';
    guideText.textContent = pick('entry')?.textDe ?? 'Wir zählen ruhig weiter.';
<<<<<<< HEAD
    const sc = soundscapes.find((s) => s.id === getPreferences().selectedSoundscape);
    applySoundscape(sc);
=======
>>>>>>> main
    speak(guideText.textContent);
    timer = window.setInterval(tick, selected.cadenceMs);
  };

  const finish = () => {
    clearTimer();
    start.textContent = 'Weiter zählen';
    const close = pick('close');
    if (close) {
      guideText.textContent = close.textDe;
      speak(close.textDe);
    }
  };

  const softStop = () => {
    clearTimer();
    start.textContent = meta.primaryAction;
    const transition = pick('sleepy_transition');
    if (transition) guideText.textContent = transition.textDe;
    stopSpeaking();
<<<<<<< HEAD
    stopSoundscape();
=======
>>>>>>> main
  };

  start.addEventListener('click', () => {
    if (timer) return;
    startFlow();
  });

  stop.addEventListener('click', softStop);

  flowSelectWrap.select.addEventListener('change', () => {
    const flow = flowMap.get(flowSelectWrap.select.value);
    if (!flow) return;
    selected = flow;
    savePreferences({ lastSheepFlow: selected.id, lastEntry: '/schaefchen/' });
    softStop();
    count = 0;
    lane.innerHTML = '';
    countText.textContent = 'Schaf 0';
    progress.textContent = `0 / ${selected.targetCount}`;
  });

  savePreferences({ lastSheepFlow: selected.id, lastEntry: '/schaefchen/' });

  function clearTimer() {
    if (timer) {
      window.clearInterval(timer);
      timer = undefined;
    }
  }
}

function buildFlowSelector(flows: SheepFlow[], selected: SheepFlow) {
  const root = document.createElement('section');
  root.className = 'surface sheep-flows stack';
  root.innerHTML = '<span class="kicker">Zählrhythmus</span><h2>Einfach und ruhig</h2>';

  const select = document.createElement('select');
  select.className = 'sheep-select';

  for (const flow of flows) {
    const option = document.createElement('option');
    option.value = flow.id;
    option.textContent = `${flow.label} · ${flow.targetCount} Schafe`;
    option.selected = flow.id === selected.id;
    select.append(option);
  }

  root.append(select);
  return { root, select };
}

function buildBackLinks() {
  const section = document.createElement('section');
  section.className = 'row';
  section.innerHTML = '<a class="button" href="/">Zum Portal</a><a class="link-muted" href="/quick-calm/">Schneller runterkommen</a>';
  return section;
}

bootSchaefchen();
