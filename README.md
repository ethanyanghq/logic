# Logic

Logic is a polished web prototype for a mobile-style logical reasoning learning app. It is designed for demos and experimentation: a user can go through onboarding, enter the home dashboard, answer a short reasoning module, and see a completion state with saved progress.

## Open and try it

This project runs locally in a browser.

1. Install [Node.js](https://nodejs.org/) if it is not already on your computer.
2. Download this repository and open a Terminal window.
3. Move into the project folder:

```bash
cd logic
```

4. Install the app dependencies:

```bash
npm install
```

5. Start the local app:

```bash
npm run dev
```

6. Open the localhost URL shown in Terminal, usually `http://localhost:5173`.

Once the app opens:
- Complete the short onboarding flow.
- Tap into the playable `Foundations` module.
- Answer questions and continue to the completion screen.
- Use the demo controls button in the top-right to load presets, reset the app, or toggle demo options.

Notes for non-technical users:
- Your progress is saved in the browser on that machine.
- If you want to start over, use `Demo controls` -> `Reset to first launch`.
- This is a prototype, so some modules are visible but intentionally not playable yet.

## Technical description

This repo contains a reduced-scope prototype built with `Vite`, `React 18`, `TypeScript`, `Tailwind CSS`, and `Zustand`.

Current implemented experience:
- First-run onboarding with goal selection and display name capture
- Home dashboard with XP, level, module cards, and progress surfaces
- One playable module: `Foundations`
- Question flow for text-based multiple choice reasoning prompts
- Module completion screen
- Demo preset and reset controls for stakeholder walkthroughs

Implementation notes:
- App entry lives in [src/App.tsx](/Users/ethanyang/Documents/GitHub/logic/src/App.tsx:1) and uses an internal screen-state router rather than URL routing.
- State lives in a single persisted Zustand store under `src/store/`, with progress saved to browser `localStorage`.
- Static learning content and demo presets live in `src/data/`.
- The app is intentionally framed as a phone-sized mobile UI inside the browser.
- The broader product spec lives in [PRD_Logic.md](/Users/ethanyang/Documents/GitHub/logic/PRD_Logic.md:1), while the reduced demo execution plan lives in [execution/README.md](/Users/ethanyang/Documents/GitHub/logic/execution/README.md:1).

Useful commands:

```bash
npm run dev
npm run build
npm run typecheck
```

## Limitations and next steps

Current limitations:
- Only the `Foundations` module is playable today.
- The question engine currently supports text multiple-choice questions only.
- There is no real backend, auth system, analytics pipeline, or syncing across devices.
- Progress is local to one browser because persistence is browser storage only.
- This repo reflects a narrowed demo slice, not the full original PRD scope.

Logical next steps:
- Add the remaining planned modules and expand the question bank.
- Introduce additional puzzle formats beyond text multiple choice.
- Add richer profile/progress views and daily challenge flows if those surfaces return to scope.
- Replace local-only persistence with a real backend if the prototype graduates into a product.
- Add a fuller automated test pass and demo deployment workflow.
