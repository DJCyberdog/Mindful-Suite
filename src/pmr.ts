import './styles/base.css';
import { createAmbientLayer, createShell, getShellStack } from './shared/layout';
import { loadPmrDefaults, loadPmrMeta, loadPmrSessions, loadPmrZones, loadSentences, loadSoundscapes } from './shared/content';
import { applyMotionPreference, applyTheme, getPreferences, savePreferences } from './shared/preferences';
import { buildLegalFooter } from './shared/ui';
import { createGuidancePicker } from './shared/breathing/guidance';
import { speak, stopSpeaking } from './shared/tts';
import { applySoundscape, stopSoundscape } from './shared/soundscape';
import type { PmrSession, PmrZone, SentenceType } from './shared/types';

type StepKey = 'tense' | 'hold' | 'release' | 'notice' | 'transition';

interface RuntimeStep {
  type: StepKey;
  zone?: PmrZone;
  durationSec: number;
}

async function bootPmr() {
  const [meta, defaults, sessions, zones, sentences, soundscapes] = await Promise.all([
    loadPmrMeta(),
    loadPmrDefaults(),
    loadPmrSessions(),
    loadPmrZones(),
    loadSentences('pmr-guidance'),
    loadSoundscapes()
  ]);

  const prefs = getPreferences();
  applyTheme(prefs.theme);
  applyMotionPreference(prefs.reducedMotion);

  const sessionMap = new Map(sessions.map((s) => [s.id, s]));
  let selected = sessionMap.get(prefs.lastPmrSession ?? '') ?? sessionMap.get(defaults.defaultSessionId) ?? sessions[0];

  document.title = meta.title;
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute('content', meta.description);

  document.body.append(createAmbientLayer());
  const shell = createShell();
  document.body.append(shell);
  const stack = getShellStack(shell);
  stack.classList.add('pmr-shell');

  const pick = createGuidancePicker(sentences);
  const zoneMap = new Map(zones.map((z) => [z.id, z]));

  const header = document.createElement('header');
  header.className = 'surface pmr-hero stack';
  header.innerHTML = `<span class="kicker">${meta.kicker}</span><h1>${meta.title}</h1><p>${pick('intro')?.textDe ?? meta.description}</p>`;

  const sessionCard = document.createElement('section');
  sessionCard.className = 'surface pmr-session stack';

  const focus = document.createElement('div');
  focus.className = 'pmr-focus';
  const focusRing = document.createElement('div');
  focusRing.className = 'pmr-focus-ring';
  focus.append(focusRing);

  const zoneText = document.createElement('h2');
  const phaseText = document.createElement('p');
  const progress = document.createElement('p');
  progress.className = 'kicker';
  const guidance = document.createElement('p');

  const actions = document.createElement('div');
  actions.className = 'row pmr-actions';
  const start = document.createElement('button');
  start.className = 'pmr-primary';
  start.textContent = meta.primaryAction;
  const pause = document.createElement('button');
  pause.className = 'button-secondary';
  pause.textContent = 'Pause';
  const stop = document.createElement('button');
  stop.className = 'button-secondary';
  stop.textContent = 'Stop';
  actions.append(start, pause, stop);

  sessionCard.append(focus, zoneText, phaseText, guidance, progress, actions);

  const selectWrap = buildSessionSelector(sessions, selected);
  stack.append(header, sessionCard, selectWrap.root, buildBackLinks(), buildLegalFooter());

  let steps = buildSteps(selected, zoneMap);
  let timer: number | undefined;
  let stepIndex = 0;
  let stepElapsed = 0;
  let running = false;
  let paused = false;

  resetTexts();

  const advanceTick = () => {
    const current = steps[stepIndex];
    stepElapsed += 1;
    focusRing.style.setProperty('--pmr-progress', String(stepElapsed / current.durationSec));

    if (stepElapsed >= current.durationSec) {
      stepIndex += 1;
      stepElapsed = 0;
      if (stepIndex >= steps.length) {
        finishSession();
        return;
      }
      enterStep(steps[stepIndex]);
    }

    progress.textContent = `${Math.min(stepIndex + 1, steps.length)} / ${steps.length} Schritte`;
  };

  function enterStep(step: RuntimeStep) {
    zoneText.textContent = step.zone?.label ?? 'Übergang';
    phaseText.textContent = phaseLabel(step.type);
    focusRing.setAttribute('data-step', step.type);

    let sentenceType: SentenceType = 'transition';
    if (step.type === 'tense') sentenceType = 'tense';
    if (step.type === 'hold') sentenceType = 'hold';
    if (step.type === 'release') sentenceType = 'release';
    if (step.type === 'notice') sentenceType = 'notice';

    const line = pick(sentenceType);
    if (line) {
      guidance.textContent = fillZone(line.textDe, step.zone?.label);
      speak(guidance.textContent);
    }

    if ((stepIndex + 1) % 8 === 0) {
      const reassurance = pick('reassurance');
      if (reassurance) {
        guidance.textContent = reassurance.textDe;
        speak(reassurance.textDe);
      }
    }
  }

  function startSession() {
    clearTimer();
    steps = buildSteps(selected, zoneMap);
    stepIndex = 0;
    stepElapsed = 0;
    running = true;
    paused = false;
    start.textContent = 'Session läuft…';
    pause.textContent = 'Pause';

    const prep = pick('preparation');
    if (prep) {
      guidance.textContent = prep.textDe;
      speak(prep.textDe);
    }
    const sc = soundscapes.find((s) => s.id === getPreferences().selectedSoundscape);
    applySoundscape(sc);

    enterStep(steps[0]);
    progress.textContent = `1 / ${steps.length} Schritte`;
    timer = window.setInterval(advanceTick, 1000);
  }

  function pauseSession() {
    if (!running) return;
    if (!paused) {
      paused = true;
      pause.textContent = 'Weiter';
      clearTimer();
      const line = pick('reassurance');
      if (line) guidance.textContent = line.textDe;
      return;
    }

    paused = false;
    pause.textContent = 'Pause';
    timer = window.setInterval(advanceTick, 1000);
  }

  function stopSession() {
    clearTimer();
    running = false;
    paused = false;
    stopSpeaking();
    stopSoundscape();
    start.textContent = meta.primaryAction;
    pause.textContent = 'Pause';
    resetTexts();
  }

  function finishSession() {
    clearTimer();
    running = false;
    paused = false;
    start.textContent = 'Erneut starten';
    pause.textContent = 'Pause';
    zoneText.textContent = 'Ruhiger Abschluss';

    const outro = pick('outro');
    const aftercare = pick('aftercare');
    guidance.textContent = `${outro?.textDe ?? ''} ${aftercare?.textDe ?? ''}`.trim();
    if (guidance.textContent) speak(guidance.textContent);

    phaseText.textContent = 'Nachspüren & zurückkommen';
    progress.textContent = `${steps.length} / ${steps.length} Schritte`;
    focusRing.setAttribute('data-step', 'notice');
  }

  start.addEventListener('click', () => {
    if (running) return;
    startSession();
  });

  pause.addEventListener('click', pauseSession);
  stop.addEventListener('click', stopSession);

  selectWrap.select.addEventListener('change', () => {
    const next = sessionMap.get(selectWrap.select.value);
    if (!next) return;
    selected = next;
    savePreferences({ lastPmrSession: selected.id, lastEntry: '/pmr/' });
    stopSession();
  });

  savePreferences({ lastPmrSession: selected.id, lastEntry: '/pmr/' });

  function resetTexts() {
    zoneText.textContent = selected.label;
    phaseText.textContent = 'Bereit für eine strukturierte Entspannungssession';
    guidance.textContent = pick('preparation')?.textDe ?? 'Wir gehen ruhig Zone für Zone.';
    progress.textContent = `0 / ${buildSteps(selected, zoneMap).length} Schritte`;
    focusRing.style.setProperty('--pmr-progress', '0');
    focusRing.setAttribute('data-step', 'transition');
  }

  function clearTimer() {
    if (timer) {
      window.clearInterval(timer);
      timer = undefined;
    }
  }
}

function buildSteps(session: PmrSession, zoneMap: Map<string, PmrZone>): RuntimeStep[] {
  const steps: RuntimeStep[] = [];

  for (const zoneId of session.zoneOrder) {
    const zone = zoneMap.get(zoneId);
    if (!zone) continue;

    steps.push(
      { type: 'tense', zone, durationSec: session.timing.tenseSec },
      { type: 'hold', zone, durationSec: session.timing.holdSec },
      { type: 'release', zone, durationSec: session.timing.releaseSec },
      { type: 'notice', zone, durationSec: session.timing.noticeSec },
      { type: 'transition', durationSec: session.timing.transitionSec }
    );
  }

  return steps;
}

function fillZone(template: string, zoneLabel?: string) {
  return template.replace('{zone}', zoneLabel ?? 'diesem Bereich');
}

function phaseLabel(type: StepKey) {
  if (type === 'tense') return 'Anspannen';
  if (type === 'hold') return 'Halten';
  if (type === 'release') return 'Loslassen';
  if (type === 'notice') return 'Nachspüren';
  return 'Übergang';
}

function buildSessionSelector(sessions: PmrSession[], selected: PmrSession) {
  const root = document.createElement('section');
  root.className = 'surface pmr-sessions stack';
  root.innerHTML = '<span class="kicker">Sessionmodus</span><h2>Klare PMR-Struktur</h2>';

  const select = document.createElement('select');
  select.className = 'pmr-select';
  for (const session of sessions) {
    const option = document.createElement('option');
    option.value = session.id;
    option.textContent = session.label;
    option.selected = session.id === selected.id;
    select.append(option);
  }

  root.append(select);
  return { root, select };
}

function buildBackLinks() {
  const section = document.createElement('section');
  section.className = 'row';
  section.innerHTML = '<a class="button" href="/">Zum Portal</a><a class="link-muted" href="/bodyscan/">Später: Bodyscan</a>';
  return section;
}

bootPmr();
