import './styles/base.css';
import { createAmbientLayer, createShell, getShellStack } from './shared/layout';
<<<<<<< HEAD
import { loadQuickCalmDefaults, loadQuickCalmMeta, loadQuickCalmSequences, loadSentences, loadSoundscapes } from './shared/content';
import { applyMotionPreference, applyTheme, getPreferences, savePreferences } from './shared/preferences';
import { buildLegalFooter } from './shared/ui';
import { speak, stopSpeaking } from './shared/tts';
import { applySoundscape, stopSoundscape } from './shared/soundscape';
=======
import { loadQuickCalmDefaults, loadQuickCalmMeta, loadQuickCalmSequences, loadSentences } from './shared/content';
import { applyMotionPreference, applyTheme, getPreferences, savePreferences } from './shared/preferences';
import { buildLegalFooter } from './shared/ui';
import { speak, stopSpeaking } from './shared/tts';
>>>>>>> main
import { createGuidancePicker } from './shared/breathing/guidance';
import type { QuickCalmSequence } from './shared/types';

type SessionStatus = 'idle' | 'running' | 'completed';

async function bootQuickCalm() {
<<<<<<< HEAD
  const [meta, defaults, sequences, sentences, soundscapes] = await Promise.all([
    loadQuickCalmMeta(),
    loadQuickCalmDefaults(),
    loadQuickCalmSequences(),
    loadSentences('quick-calm-guidance'),
    loadSoundscapes()
=======
  const [meta, defaults, sequences, sentences] = await Promise.all([
    loadQuickCalmMeta(),
    loadQuickCalmDefaults(),
    loadQuickCalmSequences(),
    loadSentences('quick-calm-guidance')
>>>>>>> main
  ]);

  const prefs = getPreferences();
  applyTheme(prefs.theme);
  applyMotionPreference(prefs.reducedMotion);

  const map = new Map(sequences.map((sequence) => [sequence.id, sequence]));
  const defaultSequence = map.get(defaults.defaultSequenceId) ?? sequences[0];
  let selected = map.get(prefs.lastQuickCalmSequence ?? '') ?? defaultSequence;

  document.title = meta.title;
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute('content', meta.description);

  document.body.append(createAmbientLayer());
  const shell = createShell();
  document.body.append(shell);
  const stack = getShellStack(shell);
  stack.classList.add('qc-shell');

  const picker = createGuidancePicker(sentences);

  const hero = document.createElement('header');
  hero.className = 'surface qc-hero stack';
  hero.innerHTML = `<span class="kicker">${meta.kicker}</span><h1>${meta.title}</h1><p>${picker('entry')?.textDe ?? meta.description}</p>`;

  const session = document.createElement('section');
  session.className = 'surface qc-session stack';

  const focus = document.createElement('div');
  focus.className = 'qc-focus';
  const pulse = document.createElement('div');
  pulse.className = 'qc-pulse';
  focus.append(pulse);

  const stepTitle = document.createElement('h2');
  stepTitle.textContent = selected.label;
  const guidance = document.createElement('p');
  guidance.textContent = 'Kurze Sequenz für einen schnellen ruhigen Moment.';
  const progress = document.createElement('p');
  progress.className = 'kicker';
  progress.textContent = `0 / ${selected.totalSeconds} Sekunden`;

  const actionRow = document.createElement('div');
  actionRow.className = 'row qc-actions';
  const start = document.createElement('button');
  start.className = 'qc-primary';
  start.textContent = meta.primaryAction;
  const end = document.createElement('button');
  end.className = 'button-secondary';
  end.textContent = 'Abbrechen';
  actionRow.append(start, end);

  session.append(focus, stepTitle, guidance, progress, actionRow);

  const sequencePicker = buildSequencePicker(sequences, selected);
  stack.append(hero, session, sequencePicker.root, buildBackToPortal(), buildLegalFooter());

  let status: SessionStatus = 'idle';
  let stepIndex = 0;
  let stepElapsed = 0;
  let totalElapsed = 0;
  let timer: number | undefined;

  const runTick = () => {
    const currentStep = selected.steps[stepIndex];
    stepElapsed += 1;
    totalElapsed += 1;
    progress.textContent = `${Math.min(totalElapsed, selected.totalSeconds)} / ${selected.totalSeconds} Sekunden`;
    pulse.style.setProperty('--qc-progress', String(stepElapsed / currentStep.durationSec));

    if (stepElapsed >= currentStep.durationSec) {
      stepIndex += 1;
      stepElapsed = 0;

      if (stepIndex >= selected.steps.length) {
        finish();
        return;
      }

      const next = selected.steps[stepIndex];
      stepTitle.textContent = next.label;
      const transition = picker('transition');
      if (transition && next.sentenceType !== 'close') speak(transition.textDe);
      const line = picker(next.sentenceType);
      if (line) {
        guidance.textContent = line.textDe;
        speak(line.textDe);
      }
    }
  };

  const startSession = () => {
    clearExisting();
    status = 'running';
    start.textContent = 'Läuft…';
    stepIndex = 0;
    stepElapsed = 0;
    totalElapsed = 0;
    pulse.classList.add('running');

    const first = selected.steps[0];
    stepTitle.textContent = first.label;
<<<<<<< HEAD
    const sc = soundscapes.find((s) => s.id === getPreferences().selectedSoundscape);
    applySoundscape(sc);
=======
>>>>>>> main
    const line = picker(first.sentenceType);
    if (line) {
      guidance.textContent = line.textDe;
      speak(line.textDe);
    }

    timer = window.setInterval(runTick, 1000);
  };

  const finish = () => {
    clearExisting();
    status = 'completed';
    pulse.classList.remove('running');
    start.textContent = 'Nochmal kurz beruhigen';
    stepTitle.textContent = 'Ruhiger Abschluss';
    const close = picker('close');
    guidance.textContent = close?.textDe ?? 'Du bist wieder etwas ruhiger.';
    if (close) speak(close.textDe);
    progress.textContent = `${selected.totalSeconds} / ${selected.totalSeconds} Sekunden`;
  };

  const reset = () => {
    clearExisting();
    status = 'idle';
    pulse.classList.remove('running');
    pulse.style.setProperty('--qc-progress', '0');
    start.textContent = meta.primaryAction;
    stepTitle.textContent = selected.label;
    guidance.textContent = 'Kurze Sequenz für einen schnellen ruhigen Moment.';
    progress.textContent = `0 / ${selected.totalSeconds} Sekunden`;
    stopSpeaking();
<<<<<<< HEAD
    stopSoundscape();
=======
>>>>>>> main
  };

  start.addEventListener('click', () => {
    if (status === 'running') return;
    startSession();
  });

  end.addEventListener('click', reset);

  sequencePicker.select.addEventListener('change', () => {
    const next = map.get(sequencePicker.select.value);
    if (!next) return;
    selected = next;
    savePreferences({ lastQuickCalmSequence: selected.id, lastEntry: '/quick-calm/' });
    reset();
  });

  savePreferences({ lastQuickCalmSequence: selected.id, lastEntry: '/quick-calm/' });

  function clearExisting() {
    if (timer) {
      window.clearInterval(timer);
      timer = undefined;
    }
  }
}

function buildSequencePicker(sequences: QuickCalmSequence[], selected: QuickCalmSequence) {
  const wrap = document.createElement('section');
  wrap.className = 'surface qc-sequences stack';
  wrap.innerHTML = '<span class="kicker">Schneller Modus</span><h2>Kurz und direkt</h2>';

  const select = document.createElement('select');
  select.className = 'qc-select';
  for (const sequence of sequences) {
    const option = document.createElement('option');
    option.value = sequence.id;
    option.textContent = sequence.label;
    option.selected = sequence.id === selected.id;
    select.append(option);
  }

  wrap.append(select);
  return { root: wrap, select };
}

function buildBackToPortal() {
  const section = document.createElement('section');
  section.className = 'row';
  section.innerHTML = '<a class="button" href="/">Zum Portal</a><a class="link-muted" href="/atmung/">Mehr Tiefe im Atemraum</a>';
  return section;
}

bootQuickCalm();
