import './styles/base.css';
import { createAmbientLayer, createShell, getShellStack } from './shared/layout';
import { loadBreathingDefaults, loadBreathingMeta, loadBreathingPatterns, loadSentences } from './shared/content';
import { applyMotionPreference, applyTheme, getPreferences, savePreferences } from './shared/preferences';
import { discoverVoices, savePreferredVoice, speak, stopSpeaking } from './shared/tts';
import { buildLegalFooter } from './shared/ui';
import { BreathingEngine, type BreathPhase } from './shared/breathing/engine';
import { createGuidancePicker } from './shared/breathing/guidance';
import type { BreathingPattern, SentenceType, ThemeName } from './shared/types';

async function bootAtmung() {
  const [meta, patterns, defaults, sentences] = await Promise.all([
    loadBreathingMeta(),
    loadBreathingPatterns(),
    loadBreathingDefaults(),
    loadSentences('atmung-breathing')
  ]);

  const prefs = getPreferences();
  applyTheme(prefs.theme);
  applyMotionPreference(prefs.reducedMotion);

  const patternMap = new Map(patterns.map((entry) => [entry.id, entry]));
  const defaultPattern = patternMap.get(defaults.defaultPatternId) ?? patterns[0];
  const currentPattern = patternMap.get(prefs.lastBreathingPattern ?? '') ?? defaultPattern;
  let selectedPattern: BreathingPattern = currentPattern;
  let selectedCycles = prefs.lastBreathingCycles ?? currentPattern.cyclesDefault ?? defaults.defaultCycles;

  document.title = meta.title;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.setAttribute('content', meta.description);

  document.body.append(createAmbientLayer());
  const shell = createShell();
  document.body.append(shell);
  const stack = getShellStack(shell);
  stack.classList.add('breath-shell');

  const picker = createGuidancePicker(sentences);

  const header = document.createElement('header');
  header.className = 'surface breath-hero stack';
  header.innerHTML = `<span class="kicker">Atemraum</span><h1>${meta.title}</h1><p>${meta.description}</p>`;

  const focus = document.createElement('section');
  focus.className = 'surface breath-session stack';
  focus.innerHTML = `<span class="kicker">${meta.sessionLabel}</span>`;

  const orbWrap = document.createElement('div');
  orbWrap.className = 'breath-orb-wrap';
  const orb = document.createElement('div');
  orb.className = 'breath-orb';
  orbWrap.append(orb);

  const phaseText = document.createElement('h2');
  phaseText.textContent = '4-7-8 bereit';
  const subText = document.createElement('p');
  subText.textContent = selectedPattern.description;

  const cycleInfo = document.createElement('p');
  cycleInfo.className = 'kicker';
  cycleInfo.textContent = `Zyklen: 0 / ${selectedCycles}`;

  const actionRow = document.createElement('div');
  actionRow.className = 'row';
  const primary = document.createElement('button');
  primary.textContent = 'Session starten';
  const stop = document.createElement('button');
  stop.textContent = 'Stop';
  stop.className = 'button-secondary';

  actionRow.append(primary, stop);

  focus.append(orbWrap, phaseText, subText, cycleInfo, actionRow);

  const controls = buildControls(patterns, selectedPattern, selectedCycles);

  stack.append(header, focus, controls.root, buildBackToPortal(), buildLegalFooter());

  const engine = new BreathingEngine(selectedPattern, selectedCycles, {
    onTick: (snapshot) => {
      renderOrb(orb, snapshot.phase, snapshot.phaseElapsedMs / snapshot.phaseDurationMs);
      cycleInfo.textContent = `Zyklen: ${snapshot.cycle} / ${snapshot.totalCycles}`;
    },
    onPhaseChange: (snapshot) => {
      renderOrb(orb, snapshot.phase, 0);
      cycleInfo.textContent = `Zyklen: ${snapshot.cycle} / ${snapshot.totalCycles}`;
      const cueType = mapPhaseToSentence(snapshot.phase);
      const sentence = picker(cueType);
      phaseText.textContent = labelForPhase(snapshot.phase, selectedPattern);
      if (sentence) {
        subText.textContent = sentence.textDe;
        speak(sentence.textDe);
      }
      if (snapshot.cycle > 1 && snapshot.phase === 'inhale') {
        const transition = picker('transition');
        if (transition) {
          subText.textContent = transition.textDe;
          speak(transition.textDe);
        }
        if (snapshot.cycle % 2 === 0) {
          const reassurance = picker('reassurance');
          if (reassurance) {
            subText.textContent = reassurance.textDe;
            speak(reassurance.textDe);
          }
        }
      }
    },
    onComplete: () => {
      primary.textContent = 'Erneut starten';
      const close = picker('close');
      if (close) {
        phaseText.textContent = 'Ruhiger Abschluss';
        subText.textContent = close.textDe;
        speak(close.textDe);
      }
      renderOrb(orb, 'exhale', 1);
    }
  });

  const intro = picker('intro');
  const prep = picker('preparation');
  if (intro) subText.textContent = intro.textDe;

  primary.addEventListener('click', () => {
    const status = engine.getStatus();
    if (status === 'idle' || status === 'completed') {
      engine.setPattern(selectedPattern, selectedCycles);
      const text = `${intro?.textDe ?? ''} ${prep?.textDe ?? ''}`.trim();
      if (text) speak(text);
      engine.start();
      primary.textContent = 'Pausieren';
      return;
    }

    if (status === 'running') {
      engine.pause();
      primary.textContent = 'Fortsetzen';
      return;
    }

    engine.resume();
    primary.textContent = 'Pausieren';
  });

  stop.addEventListener('click', () => {
    engine.stop();
    stopSpeaking();
    primary.textContent = 'Session starten';
    phaseText.textContent = `${selectedPattern.label} bereit`;
    subText.textContent = selectedPattern.description;
    cycleInfo.textContent = `Zyklen: 0 / ${selectedCycles}`;
    renderOrb(orb, 'exhale', 1);
  });

  controls.patternSelect.addEventListener('change', () => {
    const next = patternMap.get(controls.patternSelect.value);
    if (!next) return;
    selectedPattern = next;
    selectedCycles = next.cyclesDefault;
    controls.cycleInput.value = String(selectedCycles);
    savePreferences({ lastBreathingPattern: selectedPattern.id, lastBreathingCycles: selectedCycles, lastEntry: '/atmung/' });
    engine.setPattern(selectedPattern, selectedCycles);
    phaseText.textContent = `${selectedPattern.label} bereit`;
    subText.textContent = selectedPattern.description;
    cycleInfo.textContent = `Zyklen: 0 / ${selectedCycles}`;
  });

  controls.cycleInput.addEventListener('change', () => {
    selectedCycles = Math.min(12, Math.max(2, Number(controls.cycleInput.value) || selectedPattern.cyclesDefault));
    controls.cycleInput.value = String(selectedCycles);
    savePreferences({ lastBreathingCycles: selectedCycles, lastBreathingPattern: selectedPattern.id });
    engine.setPattern(selectedPattern, selectedCycles);
    cycleInfo.textContent = `Zyklen: 0 / ${selectedCycles}`;
  });

  controls.themeSelect.addEventListener('change', () => {
    const merged = savePreferences({ theme: controls.themeSelect.value as ThemeName });
    applyTheme(merged.theme);
  });

  controls.motionToggle.addEventListener('change', () => {
    const merged = savePreferences({ reducedMotion: controls.motionToggle.checked });
    applyMotionPreference(merged.reducedMotion);
  });

  controls.ttsToggle.addEventListener('change', () => {
    savePreferences({ ttsEnabled: controls.ttsToggle.checked });
  });

  controls.volume.addEventListener('input', () => {
    savePreferences({ voiceVolume: Number(controls.volume.value) });
  });

  controls.voiceSelect.addEventListener('change', () => savePreferredVoice(controls.voiceSelect.value));

  savePreferences({
    lastEntry: '/atmung/',
    lastBreathingPattern: selectedPattern.id,
    lastBreathingCycles: selectedCycles
  });
}

function buildControls(patterns: BreathingPattern[], selectedPattern: BreathingPattern, selectedCycles: number) {
  const prefs = getPreferences();
  const root = document.createElement('section');
  root.className = 'surface breath-controls stack';
  root.innerHTML = '<h2>Ruhige Session-Einstellungen</h2>';

  const patternSelect = document.createElement('select');
  for (const pattern of patterns) {
    const option = document.createElement('option');
    option.value = pattern.id;
    option.textContent = `${pattern.label} (${pattern.inhale}-${pattern.hold}-${pattern.exhale})`;
    option.selected = pattern.id === selectedPattern.id;
    patternSelect.append(option);
  }

  const cycleInput = document.createElement('input');
  cycleInput.type = 'number';
  cycleInput.min = '2';
  cycleInput.max = '12';
  cycleInput.value = String(selectedCycles);

  const themeSelect = document.createElement('select');
  for (const theme of ['nachtblau', 'waldmoos', 'sandruhe', 'morgennebel', 'sternenhimmel']) {
    const option = document.createElement('option');
    option.value = theme;
    option.textContent = theme;
    option.selected = theme === prefs.theme;
    themeSelect.append(option);
  }

  const ttsToggle = document.createElement('input');
  ttsToggle.type = 'checkbox';
  ttsToggle.checked = prefs.ttsEnabled;

  const motionToggle = document.createElement('input');
  motionToggle.type = 'checkbox';
  motionToggle.checked = prefs.reducedMotion;

  const volume = document.createElement('input');
  volume.type = 'range';
  volume.min = '0';
  volume.max = '1';
  volume.step = '0.05';
  volume.value = String(prefs.voiceVolume);

  const voiceSelect = document.createElement('select');
  for (const voice of discoverVoices().filter((entry) => entry.lang.toLowerCase().startsWith('de'))) {
    const option = document.createElement('option');
    option.value = voice.name;
    option.textContent = `${voice.name} (${voice.lang})`;
    option.selected = voice.name === prefs.preferredVoice;
    voiceSelect.append(option);
  }

  root.append(
    controlLine('Atemmuster', patternSelect),
    controlLine('Zyklen', cycleInput),
    controlLine('Theme', themeSelect),
    controlLine('TTS aktiv', ttsToggle),
    controlLine('Reduced Motion', motionToggle),
    controlLine('Stimm-Lautstärke', volume),
    controlLine('Stimme', voiceSelect)
  );

  return { root, patternSelect, cycleInput, themeSelect, ttsToggle, motionToggle, volume, voiceSelect };
}

function controlLine(label: string, control: HTMLElement) {
  const line = document.createElement('label');
  line.className = 'stack';
  line.innerHTML = `<span class="kicker">${label}</span>`;
  line.append(control);
  return line;
}

function buildBackToPortal() {
  const section = document.createElement('section');
  section.className = 'row';
  section.innerHTML = '<a class="button" href="/">Zurück zum Portal</a>';
  return section;
}

function mapPhaseToSentence(phase: BreathPhase): SentenceType {
  if (phase === 'inhale') return 'inhale_cue';
  if (phase === 'hold') return 'hold_cue';
  return 'exhale_cue';
}

function labelForPhase(phase: BreathPhase, pattern: BreathingPattern) {
  if (phase === 'inhale') return `Einatmen · ${pattern.inhale}s`;
  if (phase === 'hold') return `Halten · ${pattern.hold}s`;
  return `Ausatmen · ${pattern.exhale}s`;
}

function renderOrb(orb: HTMLElement, phase: BreathPhase, progress: number) {
  const clamped = Math.min(1, Math.max(0, progress));
  let scale = 0.78;

  if (phase === 'inhale') scale = 0.78 + clamped * 0.4;
  if (phase === 'hold') scale = 1.18 - Math.sin(clamped * Math.PI) * 0.02;
  if (phase === 'exhale') scale = 1.18 - clamped * 0.4;

  orb.style.setProperty('--orb-scale', String(scale));
  orb.setAttribute('data-phase', phase);
}

bootAtmung();
