# Mindful Suite – Phase 0/1/2/3 Foundation

Mindful Suite ist ein **frontend-only**, **mobile-first** Root-Portal mit fokussierten Mini-Apps in Unterordnern.

## Stack

- Vite + TypeScript (Multi-Page Build)
- Statisch deploybar (z. B. FTP/Shared Hosting)
- Keine Backend-, Login-, Datenbank- oder Paywall-Logik

## Struktur (relevant)

```text
/
├─ index.html
├─ atmung/index.html               # Phase 2: reale Breathing-Mini-App
├─ quick-calm/index.html           # Phase 3: Sofort-Modul Quick Calm
├─ schaefchen/index.html
├─ pmr/index.html
├─ bodyscan/index.html
├─ autogenes-training/index.html
├─ fokus-atmung/index.html
├─ geschichten/index.html
├─ impressum/index.html
├─ datenschutz/index.html
├─ nutzungsbedingungen/index.html
├─ medizinischer-disclaimer/index.html
├─ public/
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
│     ├─ modules/modules.json
│     └─ sentences/
│        ├─ atmung-breathing.json  # sentence-library für Atem-Guidance
│        └─ *.json
├─ src/
│  ├─ main.ts                      # Root-Portal orchestration
│  ├─ atmung.ts                    # Phase 2 Breath-App UI/Session
│  ├─ quick-calm.ts                # Phase 3 Sofort-Beruhigungsmodul
│  ├─ miniapp.ts                   # Shells für andere Module
│  ├─ legal.ts
│  ├─ styles/{tokens.css,base.css}
│  └─ shared/
│     ├─ breathing/
│     │  ├─ engine.ts              # wiederverwendbarer Breathing core
│     │  └─ guidance.ts            # sentence variation / anti-repetition
│     ├─ content.ts
│     ├─ preferences.ts
│     ├─ tts.ts
│     ├─ layout.ts
│     ├─ ui.ts
│     └─ types.ts
└─ vite.config.ts
```

## Development

```bash
npm install
npm run dev
npm run build
```
