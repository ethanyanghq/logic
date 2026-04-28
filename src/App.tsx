import { PhoneFrame } from "./components/layout";

export function App() {
  return (
    <PhoneFrame>
      <PlaceholderShellContent />
    </PhoneFrame>
  );
}

function PlaceholderShellContent() {
  const blocks = Array.from({ length: 6 }, (_, idx) => idx + 1);
  return (
    <div className="flex flex-col gap-6 px-6 py-6">
      <header className="flex flex-col gap-2">
        <p className="text-caption uppercase tracking-wider text-text-tertiary">
          App shell
        </p>
        <h1 className="text-h1 text-text-primary">Logic</h1>
        <p className="text-body text-text-secondary">
          T001 + T002 verification surface. Scroll to confirm sticky chrome and
          tokens render.
        </p>
      </header>

      <section className="flex flex-col gap-3">
        <p className="text-caption uppercase tracking-wider text-text-tertiary">
          Tokens
        </p>

        <div className="rounded-2xl border border-border-solar bg-brand-solar-muted p-4 shadow-active-card">
          <p className="text-h2 text-text-primary">Active card</p>
          <p className="text-body text-text-secondary">
            border.solar · brand.solar-muted · active-card glow
          </p>
        </div>

        <div className="rounded-2xl border border-border-neural bg-bg-surface p-4 shadow-neural-card">
          <p className="text-h2 text-text-primary">Neural card</p>
          <p className="text-body text-text-secondary">
            border.neural · bg.surface · neural-card glow
          </p>
        </div>

        <button
          type="button"
          className="self-start rounded-xl bg-brand-solar px-5 py-3 text-body text-text-inverse shadow-cta-solar"
        >
          Primary CTA
        </button>

        <div className="flex flex-col gap-2">
          <span className="font-mono text-mono text-brand-solar">2,480 XP</span>
          <span className="text-caption text-text-tertiary">
            Geist Mono · brand.solar
          </span>
        </div>

        <div className="rounded-2xl bg-bg-app bg-corona-glow p-6">
          <p className="text-display text-text-primary">Module Complete</p>
          <p className="text-body text-text-secondary">
            corona-glow gradient · display type
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <p className="text-caption uppercase tracking-wider text-text-tertiary">
          Surfaces
        </p>
        {blocks.map((n) => (
          <div
            key={n}
            className="flex h-20 items-center justify-between rounded-2xl border border-border-subtle bg-bg-surface px-5"
          >
            <span className="text-body text-text-primary">Card {n}</span>
            <span className="font-mono text-caption text-text-tertiary">
              {n.toString().padStart(2, "0")}
            </span>
          </div>
        ))}
      </section>
    </div>
  );
}
