import { applyMotionPreference, applyTheme, getPreferences, savePreferences } from './preferences';
import { discoverVoices, savePreferredVoice } from './tts';
import type { ModuleMeta, PortalContent, ThemeName } from './types';

const THEME_PREVIEW: Record<ThemeName, string> = {
  nachtblau: 'radial-gradient(circle at 30% 20%, #3b548f 0, transparent 50%), #0b1020',
  waldmoos: 'radial-gradient(circle at 30% 20%, #3f654e 0, transparent 50%), #101812',
  sandruhe: 'radial-gradient(circle at 30% 20%, #8d6647 0, transparent 50%), #281d15',
  morgennebel: 'radial-gradient(circle at 30% 20%, #6c83a1 0, transparent 50%), #1f2733',
  sternenhimmel: 'radial-gradient(circle at 30% 20%, #5660b2 0, transparent 50%), #080914'
};

export function buildHeader(title: string, text: string) {
  const card = document.createElement('section');
  card.className = 'surface stack';
  card.innerHTML = `<span class="kicker">Mindful Suite</span><h1>${title}</h1><p>${text}</p>`;
  return card;
}

export function buildPortalHero(content: PortalContent['hero']) {
  const section = document.createElement('header');
  section.className = 'surface portal-hero stack';
  section.innerHTML = `<span class="kicker">${content.kicker}</span><h1>${content.title}</h1><p>${content.lede}</p><p>${content.subline}</p>`;
  return section;
}

export function buildNeedSection(needs: PortalContent['needs']) {
  const section = document.createElement('section');
  section.className = 'surface stack';
  section.innerHTML = '<div class="section-head"><span class="kicker">Orientierung nach Bedürfnis</span><h2>Wähle den sanftesten nächsten Schritt.</h2></div>';

  const list = document.createElement('div');
  list.className = 'need-list';

  for (const need of needs) {
    const item = document.createElement('a');
    item.href = `${need.route}?from=portal`;
    item.className = 'need-item';
    item.innerHTML = `<h3>${need.title}</h3><p>${need.text}</p><span class="link-muted">Ruhig öffnen →</span>`;
    list.append(item);
  }

  section.append(list);
  return section;
}

export function buildModuleOverview(items: ModuleMeta[]) {
  const section = document.createElement('section');
  section.className = 'surface stack';
  section.innerHTML = '<div class="section-head"><span class="kicker">Calm Suite</span><h2>Alle Räume auf einen Blick</h2><p>Jeder Bereich lebt in einem eigenen Unterordner und bleibt bewusst fokussiert.</p></div>';

  const list = document.createElement('div');
  list.className = 'module-list';

  for (const item of items) {
    const row = document.createElement('a');
    row.href = item.route;
    row.className = 'module-item';
    row.innerHTML = `<h3>${item.title}</h3><p>${item.teaser}</p><span class="link-muted">${item.route}</span>`;
    list.append(row);
  }

  section.append(list);
  return section;
}

export function buildThemeSection(themes: PortalContent['themes']) {
  const section = document.createElement('section');
  section.className = 'surface stack';
  section.innerHTML = '<div class="section-head"><span class="kicker">Farbwelten</span><h2>Wähle die Stimmung, die heute gut trägt.</h2></div>';

  const list = document.createElement('div');
  list.className = 'theme-list';

  for (const theme of themes) {
    const card = document.createElement('div');
    card.className = 'theme-item';

    const text = document.createElement('div');
    text.className = 'stack';
    text.innerHTML = `<h3>${theme.name}</h3><p>${theme.text}</p>`;

    const actions = document.createElement('div');
    actions.className = 'stack';
    const dot = document.createElement('span');
    dot.className = 'theme-pill';
    dot.style.background = THEME_PREVIEW[theme.key];

    const button = document.createElement('button');
    button.textContent = 'Aktivieren';
    button.addEventListener('click', () => {
      const merged = savePreferences({ theme: theme.key });
      applyTheme(merged.theme);
    });

    actions.append(dot, button);
    card.append(text, actions);
    list.append(card);
  }

  section.append(list);
  return section;
}

export function buildStoryTeaser(story: PortalContent['storyTeaser']) {
  const section = document.createElement('section');
  section.className = 'surface soft story-teaser';
  section.innerHTML = `<span class="kicker">Abendgeschichten</span><h2>${story.title}</h2><p>${story.text}</p><a class="button" href="${story.route}">Zum Geschichtenraum</a>`;
  return section;
}

export function buildTrustSection(trust: PortalContent['trust']) {
  const section = document.createElement('section');
  section.className = 'surface stack';
  section.innerHTML = `<div class="section-head"><span class="kicker">Transparenz</span><h2>${trust.title}</h2><p>${trust.text}</p></div>`;

  const list = document.createElement('ul');
  list.className = 'trust-list';
  for (const item of trust.items) {
    const li = document.createElement('li');
    li.textContent = item;
    list.append(li);
  }

  const legal = document.createElement('nav');
  legal.className = 'legal-grid';
  legal.setAttribute('aria-label', 'Rechtliche Seiten');
  legal.innerHTML = `
    <a class="link-muted" href="/impressum/">Impressum</a>
    <a class="link-muted" href="/datenschutz/">Datenschutz</a>
    <a class="link-muted" href="/nutzungsbedingungen/">Nutzungsbedingungen</a>
    <a class="link-muted" href="/medizinischer-disclaimer/">Medizinischer Disclaimer</a>
  `;

  section.append(list, legal);
  return section;
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
    const merged = savePreferences({ theme: themeSelect.value as ThemeName });
    applyTheme(merged.theme);
  });

  const motionToggle = document.createElement('input');
  motionToggle.type = 'checkbox';
  motionToggle.checked = prefs.reducedMotion;
  motionToggle.addEventListener('change', () => {
    const merged = savePreferences({ reducedMotion: motionToggle.checked });
    applyMotionPreference(merged.reducedMotion);
  });

  const ttsToggle = document.createElement('input');
  ttsToggle.type = 'checkbox';
  ttsToggle.checked = prefs.ttsEnabled;
  ttsToggle.addEventListener('change', () => {
    savePreferences({ ttsEnabled: ttsToggle.checked });
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

  const ambientToggle = document.createElement('input');
  ambientToggle.type = 'checkbox';
  ambientToggle.checked = prefs.soundscapeEnabled;
  ambientToggle.addEventListener('change', () => {
    savePreferences({ soundscapeEnabled: ambientToggle.checked });
  });

  const ambientSelect = document.createElement('select');
  for (const entry of [
    ['none', 'Kein Soundscape'],
    ['night_hush', 'Nachtflimmern'],
    ['forest_soft', 'Waldruhe'],
    ['mist_air', 'Morgennebel']
  ]) {
    const option = document.createElement('option');
    option.value = entry[0];
    option.textContent = entry[1];
    option.selected = prefs.selectedSoundscape === entry[0];
    ambientSelect.append(option);
  }
  ambientSelect.addEventListener('change', () => {
    savePreferences({ selectedSoundscape: ambientSelect.value });
  });

  const ambientVolume = document.createElement('input');
  ambientVolume.type = 'range';
  ambientVolume.min = '0';
  ambientVolume.max = '1';
  ambientVolume.step = '0.05';
  ambientVolume.value = String(prefs.ambientVolume);
  ambientVolume.addEventListener('input', () => {
    savePreferences({ ambientVolume: Number(ambientVolume.value) });
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
    buildLabeledControl('TTS aktiv', ttsToggle),
    buildLabeledControl('TTS-Stimme', voiceSelect),
    buildLabeledControl('Sprachlautstärke', volume),
    buildLabeledControl('Soundscape aktiv', ambientToggle),
    buildLabeledControl('Soundscape', ambientSelect),
    buildLabeledControl('Ambient-Lautstärke', ambientVolume),
    buildLabeledControl('Reduzierte Bewegung', motionToggle)
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
