# Mindful Suite – Phase 0 Foundation

Phase 0 liefert die technische und gestalterische Grundlage für ein **frontend-only**, **mobile-first** Root-Portal mit echten Subfolder-Mini-Apps.

## Stack

- Vite + TypeScript (Multi-Page Build)
- Statisch deploybar (z. B. FTP/Shared Hosting)
- Keine Backend-, Login-, Datenbank- oder Paywall-Logik

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
├─ datenschutz/index.html
├─ nutzungsbedingungen/index.html
├─ medizinischer-disclaimer/index.html
├─ public/
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
```

## Development

```bash
npm install
npm run dev
npm run build
```
