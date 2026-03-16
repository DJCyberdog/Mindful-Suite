import './styles/base.css';
import { createAmbientLayer, createShell, getShellStack } from './shared/layout';
import {
  loadBodyScanDefaults,
  loadBodyScanMeta,
  loadBodyScanRegions,
  loadBodyScanSessions,
  loadSentences
} from './shared/content';
import { applyMotionPreference, applyTheme, getPreferences, savePreferences } from './shared/preferences';
import { buildLegalFooter } from './shared/ui';
import { createGuidancePicker } from './shared/breathing/guidance';
import { speak, stopSpeaking } from './shared/tts';
import type { BodyScanRegion, BodyScanSession, SentenceType } from './shared/types';

type ScanPhase = 'arrival' | 'settling' | 'awareness' | 'transition';
interface ScanStep { phase: ScanPhase; region?: BodyScanRegion; durationSec: number }

async function bootBodyScan() {
  const [meta, defaults, sessions, regions, sentences] = await Promise.all([
    loadBodyScanMeta(),
    loadBodyScanDefaults(),
    loadBodyScanSessions(),
    loadBodyScanRegions(),
    loadSentences('bodyscan-guidance')
  ]);

  const prefs = getPreferences();
  applyTheme(prefs.theme);
  applyMotionPreference(prefs.reducedMotion);

  const sessionMap = new Map(sessions.map((s) => [s.id, s]));
  let selected = sessionMap.get(prefs.lastBodyScanSession ?? '') ?? sessionMap.get(defaults.defaultSessionId) ?? sessions[0];
  const regionMap = new Map(regions.map((r) => [r.id, r]));
  const pick = createGuidancePicker(sentences);

  document.title = meta.title;
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute('content', meta.description);

  document.body.append(createAmbientLayer());
  const shell = createShell();
  document.body.append(shell);
  const stack = getShellStack(shell);
  stack.classList.add('bodyscan-shell');

  const hero = document.createElement('header');
  hero.className = 'surface bodyscan-hero stack';
  hero.innerHTML = `<span class="kicker">${meta.kicker}</span><h1>${meta.title}</h1><p>${pick('intro')?.textDe ?? meta.description}</p>`;

  const sessionCard = document.createElement('section');
  sessionCard.className = 'surface bodyscan-session stack';

  const visual = document.createElement('div');
  visual.className = 'bodyscan-visual';
  const glow = document.createElement('div');
  glow.className = 'bodyscan-glow';
  visual.append(glow);

  const regionText = document.createElement('h2');
  const phaseText = document.createElement('p');
  const guidance = document.createElement('p');
  const progress = document.createElement('p');
  progress.className = 'kicker';

  const actions = document.createElement('div');
  actions.className = 'row bodyscan-actions';
  const start = document.createElement('button');
  start.className = 'bodyscan-primary';
  start.textContent = meta.primaryAction;
  const pause = document.createElement('button');
  pause.className = 'button-secondary';
  pause.textContent = 'Pause';
  const stop = document.createElement('button');
  stop.className = 'button-secondary';
  stop.textContent = 'Stop';
  actions.append(start, pause, stop);

  sessionCard.append(visual, regionText, phaseText, guidance, progress, actions);

  const selector = buildSessionSelector(sessions, selected);
  stack.append(hero, sessionCard, selector.root, buildBackLinks(), buildLegalFooter());

  let steps = buildSteps(selected, regionMap);
  let stepIndex = 0;
  let stepElapsed = 0;
  let timer: number | undefined;
  let running = false;
  let paused = false;

  resetView();

  function runTick() {
    const current = steps[stepIndex];
    stepElapsed += 1;
    glow.style.setProperty('--bs-progress', String(stepElapsed / current.durationSec));

    if (stepElapsed >= current.durationSec) {
      stepIndex += 1;
      stepElapsed = 0;
      if (stepIndex >= steps.length) return finishSession();
      enterStep(steps[stepIndex]);
    }

    progress.textContent = `${Math.min(stepIndex + 1, steps.length)} / ${steps.length} Impulse`;
  }

  function enterStep(step: ScanStep) {
    regionText.textContent = step.region?.label ?? 'Sanfter Übergang';
    phaseText.textContent = phaseLabel(step.phase);
    glow.setAttribute('data-phase', step.phase);

    let sentenceType: SentenceType = 'transition';
    if (step.phase === 'arrival') sentenceType = 'arrival';
    if (step.phase === 'settling') sentenceType = 'settling';
    if (step.phase === 'awareness') sentenceType = 'awareness';

    const line = pick(sentenceType);
    if (line) {
      guidance.textContent = withRegion(line.textDe, step.region?.label);
      speak(guidance.textContent);
    }

    if ((stepIndex + 1) % 9 === 0) {
      const reass = pick('reassurance');
      if (reass) {
        guidance.textContent = reass.textDe;
        speak(reass.textDe);
      }
    }
  }

  function startSession() {
    clearTimer();
    steps = buildSteps(selected, regionMap);
    stepIndex = 0;
    stepElapsed = 0;
    running = true;
    paused = false;
    start.textContent = 'Body-Scan läuft…';
    pause.textContent = 'Pause';

    const settling = pick('settling');
    if (settling) {
      guidance.textContent = settling.textDe;
      speak(settling.textDe);
    }

    enterStep(steps[0]);
    progress.textContent = `1 / ${steps.length} Impulse`;
    timer = window.setInterval(runTick, 1000);
  }

  function pauseSession() {
    if (!running) return;
    if (!paused) {
      paused = true;
      pause.textContent = 'Weiter';
      clearTimer();
      return;
    }

    paused = false;
    pause.textContent = 'Pause';
    timer = window.setInterval(runTick, 1000);
  }

  function stopSession() {
    clearTimer();
    running = false;
    paused = false;
    stopSpeaking();
    start.textContent = meta.primaryAction;
    pause.textContent = 'Pause';
    resetView();
  }

  function finishSession() {
    clearTimer();
    running = false;
    paused = false;
    start.textContent = 'Erneut gleiten';
    pause.textContent = 'Pause';
    regionText.textContent = 'Leiser Ausklang';
    phaseText.textContent = 'Ruhe halten';
    const drift = pick('drifting_close');
    const outro = pick('outro');
    guidance.textContent = `${drift?.textDe ?? ''} ${outro?.textDe ?? ''}`.trim();
    if (guidance.textContent) speak(guidance.textContent);
    progress.textContent = `${steps.length} / ${steps.length} Impulse`;
    glow.setAttribute('data-phase', 'awareness');
  }

  start.addEventListener('click', () => { if (!running) startSession(); });
  pause.addEventListener('click', pauseSession);
  stop.addEventListener('click', stopSession);

  selector.select.addEventListener('change', () => {
    const next = sessionMap.get(selector.select.value);
    if (!next) return;
    selected = next;
    savePreferences({ lastBodyScanSession: selected.id, lastEntry: '/bodyscan/' });
    stopSession();
  });

  savePreferences({ lastBodyScanSession: selected.id, lastEntry: '/bodyscan/' });

  function resetView() {
    regionText.textContent = selected.label;
    phaseText.textContent = 'Weich ankommen und ruhig durch den Körper gleiten';
    guidance.textContent = pick('arrival')?.textDe ?? 'Lass die Aufmerksamkeit ruhig ankommen.';
    progress.textContent = `0 / ${buildSteps(selected, regionMap).length} Impulse`;
    glow.style.setProperty('--bs-progress', '0');
    glow.setAttribute('data-phase', 'transition');
  }

  function clearTimer() {
    if (timer) {
      window.clearInterval(timer);
      timer = undefined;
    }
  }
}

function buildSteps(session: BodyScanSession, regionMap: Map<string, BodyScanRegion>): ScanStep[] {
  const steps: ScanStep[] = [];
  for (const regionId of session.regionOrder) {
    const region = regionMap.get(regionId);
    if (!region) continue;

    steps.push(
      { phase: 'arrival', region, durationSec: session.timing.arrivalSec },
      { phase: 'settling', region, durationSec: session.timing.settlingSec },
      { phase: 'awareness', region, durationSec: session.timing.awarenessSec },
      { phase: 'transition', durationSec: session.timing.transitionSec }
    );
  }
  return steps;
}

function withRegion(text: string, region?: string) {
  return text.replace('{region}', region ?? 'diesem Bereich');
}

function phaseLabel(phase: ScanPhase) {
  if (phase === 'arrival') return 'Ankommen';
  if (phase === 'settling') return 'Weich werden';
  if (phase === 'awareness') return 'Wahrnehmen';
  return 'Weitergleiten';
}

function buildSessionSelector(sessions: BodyScanSession[], selected: BodyScanSession) {
  const root = document.createElement('section');
  root.className = 'surface bodyscan-sessions stack';
  root.innerHTML = '<span class="kicker">Body-Scan Modus</span><h2>Fließende Session</h2>';
  const select = document.createElement('select');
  select.className = 'bodyscan-select';

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
  section.innerHTML = '<a class="button" href="/">Zum Portal</a><a class="link-muted" href="/pmr/">Strukturierter: PMR</a>';
  return section;
}

bootBodyScan();
