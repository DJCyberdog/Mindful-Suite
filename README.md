<<<<<<< HEAD
# Mindful Suite – Phase 0/1/2/3/4/5/6/7 Foundation

Mindful Suite ist ein **frontend-only**, **mobile-first** Root-Portal mit fokussierten Mini-Apps in Unterordnern.
=======
# Mindful Suite – Phase 0 Foundation

Phase 0 liefert die technische und gestalterische Grundlage für ein **frontend-only**, **mobile-first** Root-Portal mit echten Subfolder-Mini-Apps.
>>>>>>> main

## Stack

- Vite + TypeScript (Multi-Page Build)
- Statisch deploybar (z. B. FTP/Shared Hosting)
- Keine Backend-, Login-, Datenbank- oder Paywall-Logik

<<<<<<< HEAD
## Struktur (relevant)

```text
/
├─ index.html
├─ atmung/index.html               # Phase 2: reale Breathing-Mini-App
├─ quick-calm/index.html           # Phase 3: Sofort-Modul Quick Calm
├─ schaefchen/index.html           # Phase 4: Sleep-Ritual Schäfchenzählen
├─ pmr/index.html                  # Phase 5: PMR Körper-Relaxationsmodul
├─ bodyscan/index.html             # Phase 6: Weicher Body-Scan Raum
├─ autogenes-training/index.html
├─ fokus-atmung/index.html
├─ geschichten/index.html
├─ impressum/index.html
=======
## Projektstruktur

```text
/
├─ index.html                      # Root-Portal /
├─ atmung/index.html               # Mini-App-Einstiege
├─ quick-calm/index.html
├─ schaefchen/index.html
├─ pmr/index.html
├─ bodyscan/index.html
├─ autogenes-training/index.html
├─ fokus-atmung/index.html
├─ geschichten/index.html
├─ impressum/index.html            # Legal placeholders
>>>>>>> main
├─ datenschutz/index.html
├─ nutzungsbedingungen/index.html
├─ medizinischer-disclaimer/index.html
├─ public/
<<<<<<< HEAD
│  ├─ manifest.webmanifest
│  ├─ sw.js
│  ├─ icons/
│  └─ content/
│     ├─ portal-home.json
│     ├─ legal-pages.json
│     ├─ breathing/
│     │  ├─ patterns.json          # 4-7-8 default + vorbereitete Patterns
│     │  ├─ defaults.json
│     │  └─ meta.json
│     ├─ quick-calm/
│     │  ├─ meta.json
│     │  ├─ defaults.json
│     │  └─ sequences.json
│     ├─ schaefchen/
│     │  ├─ meta.json
│     │  ├─ defaults.json
│     │  └─ flows.json
│     ├─ pmr/
│     │  ├─ meta.json
│     │  ├─ defaults.json
│     │  ├─ zones.json
│     │  └─ sessions.json
│     ├─ bodyscan/
│     │  ├─ meta.json
│     │  ├─ defaults.json
│     │  ├─ regions.json
│     │  └─ sessions.json
│     ├─ modules/modules.json
│     ├─ soundscapes.json          # Phase 7 ambient soundscape support
│     └─ sentences/
│        ├─ atmung-breathing.json  # sentence-library für Atem-Guidance
│        └─ *.json
├─ src/
│  ├─ main.ts                      # Root-Portal orchestration
│  ├─ atmung.ts                    # Phase 2 Breath-App UI/Session
│  ├─ quick-calm.ts                # Phase 3 Sofort-Beruhigungsmodul
│  ├─ schaefchen.ts                # Phase 4 Sleep-Ritualmodul
│  ├─ pmr.ts                       # Phase 5 PMR Sessionmodul
│  ├─ bodyscan.ts                  # Phase 6 weicher Body-Scan
│  ├─ miniapp.ts                   # Shells für andere Module
│  ├─ legal.ts
│  ├─ styles/{tokens.css,base.css}
│  └─ shared/
│     ├─ breathing/
│     │  ├─ engine.ts              # wiederverwendbarer Breathing core
│     │  └─ guidance.ts            # sentence variation / anti-repetition
│     ├─ content.ts
│     ├─ soundscape.ts
│     ├─ preferences.ts
│     ├─ tts.ts
│     ├─ layout.ts
│     ├─ ui.ts
│     └─ types.ts
└─ vite.config.ts
=======
│  ├─ manifest.webmanifest         # PWA manifest
│  ├─ sw.js                        # Service worker basis caching
│  └─ icons/
├─ src/
│  ├─ main.ts                      # Root-Portal boot
│  ├─ miniapp.ts                   # Shared mini-app shell boot
│  ├─ legal.ts                     # Shared legal shell boot
│  ├─ styles/
│  │  ├─ tokens.css                # Design token + theme worlds
│  │  └─ base.css                  # Base typography/layout primitives
│  ├─ shared/
│  │  ├─ types.ts
│  │  ├─ preferences.ts            # Local-first persistence
│  │  ├─ tts.ts                    # TTS-first foundation
│  │  ├─ content.ts                # File-based content loading
│  │  ├─ pwa.ts                    # SW registration
│  │  ├─ layout.ts                 # Layout primitives
│  │  └─ ui.ts                     # Reusable UI primitives
│  └─ content/
│     ├─ modules/modules.json      # Module hub data
│     └─ sentences/*.json          # Sentence-library seed files
└─ vite.config.ts                  # Multi-page input mapping
>>>>>>> main
```

## Development

```bash
npm install
npm run dev
npm run build
```
