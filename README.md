# Mindful Suite – Portal Foundation (Phase 0 + Phase 1)

Mindful Suite ist ein **frontend-only**, **mobile-first** Root-Portal mit fokussierten Mini-Apps in Unterordnern.

## Stack

- Vite + TypeScript (Multi-Page Build)
- Statisch deploybar (z. B. FTP/Shared Hosting)
- Keine Backend-, Login-, Datenbank- oder Paywall-Logik

## Struktur (relevant)

```text
/
├─ index.html
├─ atmung/index.html
├─ quick-calm/index.html
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
│     ├─ portal-home.json          # Root-Portal Content (Phase 1)
│     ├─ legal-pages.json          # Legal/Trust Content
│     ├─ modules/modules.json
│     └─ sentences/*.json
├─ src/
│  ├─ main.ts                      # Root-Portal orchestration
│  ├─ miniapp.ts                   # Mini-App shells
│  ├─ legal.ts                     # Legal rendering
│  ├─ styles/{tokens.css,base.css}
│  └─ shared/
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
