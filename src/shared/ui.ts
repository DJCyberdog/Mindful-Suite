import { applyMotionPreference, applyTheme, getPreferences, savePreferences } from './preferences';
import { discoverVoices, savePreferredVoice } from './tts';

export function buildHeader(title: string, text: string) {
  const card = document.createElement('section');
  card.className = 'surface stack';
  card.innerHTML = `<span class="kicker">Mindful Suite</span><h1>${title}</h1><p>${text}</p>`;
  return card;
}

export function buildThemeAndVoiceCard() {
  const prefs = getPreferences();
  const card = document.createElement('section');
  card.className = 'surface stack';

  const themeSelect = document.createElement('select');
  for (const theme of ['nachtblau', 'waldmoos', 'sandruhe', 'morgennebel', 'sternenhimmel']) {
    const option = document.createElement('option');
    option.value = theme;
    option.textContent = theme;
    option.selected = prefs.theme === theme;
    themeSelect.append(option);
  }
  themeSelect.addEventListener('change', () => {
    const merged = savePreferences({ theme: themeSelect.value as typeof prefs.theme });
    applyTheme(merged.theme);
  });


  const motionToggle = document.createElement('input');
  motionToggle.type = 'checkbox';
  motionToggle.checked = prefs.reducedMotion;
  motionToggle.addEventListener('change', () => {
    const merged = savePreferences({ reducedMotion: motionToggle.checked });
    applyMotionPreference(merged.reducedMotion);
  });

  const volume = document.createElement('input');
  volume.type = 'range';
  volume.min = '0';
  volume.max = '1';
  volume.step = '0.05';
  volume.value = String(prefs.voiceVolume);
  volume.addEventListener('input', () => {
    savePreferences({ voiceVolume: Number(volume.value) });
  });

  const voiceSelect = document.createElement('select');
  for (const voice of discoverVoices().filter((entry) => entry.lang.toLowerCase().startsWith('de'))) {
    const option = document.createElement('option');
    option.value = voice.name;
    option.textContent = `${voice.name} (${voice.lang})`;
    option.selected = voice.name === prefs.preferredVoice;
    voiceSelect.append(option);
  }
  voiceSelect.addEventListener('change', () => {
    savePreferredVoice(voiceSelect.value);
  });

  card.append(
    Object.assign(document.createElement('h2'), { textContent: 'Deine ruhigen Grundeinstellungen' }),
    buildLabeledControl('Farbwelt', themeSelect),
    buildLabeledControl('TTS-Stimme', voiceSelect),
    buildLabeledControl('Reduzierte Bewegung', motionToggle),
    buildLabeledControl('Sprachlautstärke', volume)
  );

  return card;
}

function buildLabeledControl(labelText: string, control: HTMLElement) {
  const row = document.createElement('label');
  row.className = 'stack';
  row.innerHTML = `<span class="kicker">${labelText}</span>`;
  row.append(control);
  return row;
}

export function buildMiniAppGrid(items: Array<{ title: string; route: string; teaser: string }>) {
  const section = document.createElement('section');
  section.className = 'surface stack';
  section.innerHTML = '<h2>Deine ruhigen Räume</h2><p>Jeder Bereich lebt in einem eigenen Unterordner und bleibt bewusst fokussiert.</p>';

  const grid = document.createElement('div');
  grid.className = 'grid mod-grid';

  for (const item of items) {
    const card = document.createElement('a');
    card.href = item.route;
    card.className = 'surface stack';
    card.innerHTML = `<span class="kicker">${item.route}</span><h3>${item.title}</h3><p>${item.teaser}</p><span class="link-muted">Raum öffnen →</span>`;
    grid.append(card);
  }

  section.append(grid);
  return section;
}

export function buildLegalFooter() {
  const footer = document.createElement('footer');
  footer.className = 'row';
  footer.innerHTML = `
    <a class="link-muted" href="/impressum/">Impressum</a>
    <a class="link-muted" href="/datenschutz/">Datenschutz</a>
    <a class="link-muted" href="/nutzungsbedingungen/">Nutzungsbedingungen</a>
    <a class="link-muted" href="/medizinischer-disclaimer/">Medizinischer Disclaimer</a>
  `;
  return footer;
}
