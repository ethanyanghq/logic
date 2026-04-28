import { useState } from "react";
import { DemoControlsTrigger } from "./components/demo";
import { PhoneFrame } from "./components/layout";
import {
  Avatar,
  Badge,
  BottomSheet,
  Button,
  Card,
  IconButton,
  Input,
  Modal,
  ProgressBar,
  ProgressRing,
  RadioOption,
  Skeleton,
  StatTile,
  Tag,
  TextArea,
  Toast,
} from "./components/ui";

export function App() {
  return (
    <PhoneFrame>
      <HomeHeader />
      <PrimitiveGallery />
    </PhoneFrame>
  );
}

function HomeHeader() {
  return (
    <header className="flex items-start justify-between gap-4 px-5 pb-2 pt-5">
      <div className="flex flex-col gap-1">
        <span className="text-caption uppercase tracking-wider text-text-tertiary">
          Home
        </span>
        <h1 className="text-h1 text-text-primary">Welcome back</h1>
        <p className="text-body text-text-secondary">
          Demo controls live in the gear · ⌘/Ctrl + Shift + R also opens them.
        </p>
      </div>
      <DemoControlsTrigger variant="ghost" />
    </header>
  );
}

function PrimitiveGallery() {
  const [selectedOption, setSelectedOption] = useState<number | null>(1);
  const [reveal, setReveal] = useState<"idle" | "correct" | "incorrect">("idle");
  const [modalOpen, setModalOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [name, setName] = useState("Eclipse");

  const optionState = (idx: number) => {
    if (reveal === "idle") {
      return idx === selectedOption ? "selected" : "default";
    }
    if (idx === 1) return "correct";
    if (idx === selectedOption && reveal === "incorrect") return "incorrect";
    return "default";
  };

  return (
    <div className="flex flex-col gap-8 px-5 py-6">
      <Section
        eyebrow="T003"
        title="UI primitives"
        subtitle="Eclipse Glass primitive set with hover, press, focus, and disabled states."
      />


      <Section eyebrow="Buttons" title="Variants & sizes">
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" size="sm">
            Primary sm
          </Button>
          <Button variant="primary">Primary md</Button>
          <Button variant="primary" size="lg">
            Primary lg
          </Button>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>
        <div className="flex gap-3">
          <IconButton
            variant="default"
            label="Settings"
            icon={<GearIcon />}
          />
          <IconButton variant="solar" label="Add" icon={<PlusIcon />} />
          <IconButton variant="ghost" label="Mute" icon={<SpeakerIcon />} />
        </div>
      </Section>

      <Section eyebrow="Cards" title="Surfaces">
        <Card>
          <div className="flex flex-col gap-1 p-4">
            <span className="text-caption uppercase tracking-wider text-text-tertiary">
              default
            </span>
            <span className="text-h2">Foundations</span>
            <span className="text-body text-text-secondary">
              Syllogisms · Beginner
            </span>
          </div>
        </Card>
        <Card variant="interactive" asButton>
          <div className="flex flex-col gap-1 p-4">
            <span className="text-caption uppercase tracking-wider text-text-tertiary">
              interactive
            </span>
            <span className="text-h2">Conditional Reasoning</span>
            <span className="text-body text-text-secondary">
              If/then logic · Intermediate
            </span>
          </div>
        </Card>
        <Card variant="selected" asButton>
          <div className="flex flex-col gap-1 p-4">
            <span className="text-caption uppercase tracking-wider text-brand-solar">
              selected
            </span>
            <span className="text-h2">Visual Patterns</span>
            <span className="text-body text-text-secondary">
              Matrix puzzles · Advanced
            </span>
          </div>
        </Card>
        <Card variant="hero">
          <div className="flex items-center justify-between gap-4 p-4">
            <div className="flex flex-col gap-1">
              <span className="text-caption uppercase tracking-wider text-brand-solar">
                hero
              </span>
              <span className="text-h2">Today's challenge</span>
              <span className="text-body text-text-secondary">
                +50 XP · 1 question
              </span>
            </div>
            <Button size="sm">Start</Button>
          </div>
        </Card>
      </Section>

      <Section eyebrow="Progress" title="Rings, bars, tiles">
        <div className="flex items-center gap-5">
          <ProgressRing value={0.62} size={88} stroke={8} tone="solar">
            <span className="font-mono text-h2 tabular-nums">62%</span>
          </ProgressRing>
          <ProgressRing value={0.34} size={64} tone="neural" />
          <ProgressRing value={0.92} size={64} tone="success" />
        </div>
        <div className="flex flex-col gap-3">
          <ProgressBar value={0.62} ariaLabel="Module progress" />
          <ProgressBar value={0.4} tone="neural" />
          <ProgressBar value={0.85} tone="success" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <StatTile label="XP" value="2,480" tone="solar" caption="Level 13" />
          <StatTile
            label="Streak"
            value="14d"
            tone="solar"
            caption="Longest 21d"
          />
          <StatTile label="Accuracy" value="86%" tone="neural" />
          <StatTile label="Modules" value="3 / 4" />
        </div>
      </Section>

      <Section eyebrow="Question" title="RadioOption states">
        <div className="flex flex-col gap-3">
          {OPTIONS.map((opt, idx) => (
            <RadioOption
              key={opt.label}
              marker={String.fromCharCode(65 + idx)}
              label={opt.label}
              description={opt.description}
              state={optionState(idx)}
              onClick={() => {
                if (reveal !== "idle") return;
                setSelectedOption(idx);
              }}
            />
          ))}
        </div>
        <div className="flex gap-3">
          {reveal === "idle" ? (
            <>
              <Button
                onClick={() =>
                  setReveal(selectedOption === 1 ? "correct" : "incorrect")
                }
                disabled={selectedOption === null}
              >
                Submit
              </Button>
              <Button variant="secondary" onClick={() => setSelectedOption(null)}>
                Clear
              </Button>
            </>
          ) : (
            <Button
              onClick={() => {
                setReveal("idle");
                setSelectedOption(null);
              }}
            >
              Continue
            </Button>
          )}
        </div>
      </Section>

      <Section eyebrow="Forms" title="Inputs">
        <Input
          label="Display name"
          placeholder="Enter a name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          hint="Up to 20 characters"
        />
        <TextArea
          label="Notes"
          placeholder="Optional reflection"
          hint="Visible only to you"
        />
      </Section>

      <Section eyebrow="Identity" title="Tags, badges, avatars">
        <div className="flex flex-wrap gap-2">
          <Tag>Beginner</Tag>
          <Tag tone="solar">Active</Tag>
          <Tag tone="neural">Visual</Tag>
          <Tag tone="success">Correct</Tag>
          <Tag tone="warning">At risk</Tag>
          <Tag tone="error">Incorrect</Tag>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Badge icon={<FlameIcon />} label="Streak 7" earned />
          <Badge icon={<TargetIcon />} label="100% Mod" earned={false} />
          <Badge icon={<StarIcon />} label="Daily 5" earned />
        </div>
        <div className="flex items-center gap-3">
          <Avatar shape="prism" />
          <Avatar shape="ring" />
          <Avatar shape="hex" />
          <Avatar shape="orbit" />
          <Avatar shape="grid" />
          <Avatar shape="wave" />
          <Avatar initials="EY" size="lg" />
        </div>
      </Section>

      <Section eyebrow="Loading" title="Skeletons">
        <div className="flex items-center gap-3">
          <Skeleton shape="circle" width={48} height={48} />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton shape="line" width="60%" />
            <Skeleton shape="line" width="40%" />
          </div>
        </div>
        <Skeleton height={120} />
      </Section>

      <Section eyebrow="Overlays" title="Modal, sheet, toast">
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => setModalOpen(true)}>
            Open modal
          </Button>
          <Button variant="secondary" onClick={() => setSheetOpen(true)}>
            Open sheet
          </Button>
          <Button variant="secondary" onClick={() => setToastOpen(true)}>
            Show toast
          </Button>
        </div>
      </Section>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Reset progress?"
        description="This will erase all progress and return to the welcome screen."
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-semantic-error text-text-inverse shadow-none hover:brightness-110"
              onClick={() => setModalOpen(false)}
            >
              Reset
            </Button>
          </>
        }
      />

      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Demo controls"
        description="Skip to a preset state or reset for a fresh demo."
      >
        <div className="flex flex-col gap-2">
          <Button
            variant="secondary"
            fullWidth
            onClick={() => setSheetOpen(false)}
          >
            Fresh user
          </Button>
          <Button
            variant="secondary"
            fullWidth
            onClick={() => setSheetOpen(false)}
          >
            Mid-Foundations
          </Button>
          <Button
            variant="secondary"
            fullWidth
            onClick={() => setSheetOpen(false)}
          >
            Power user
          </Button>
        </div>
      </BottomSheet>

      <Toast
        open={toastOpen}
        onClose={() => setToastOpen(false)}
        tone="success"
        icon={<SparkIcon />}
        title="Streak day 7 unlocked"
        description="Solar corona badge added to your collection."
        duration={3200}
      />
    </div>
  );
}

const OPTIONS = [
  { label: "All philosophers are mortal.", description: "Universal affirmative" },
  { label: "Socrates is mortal.", description: "Conclusion follows" },
  { label: "Some mortals are philosophers.", description: "Particular affirmative" },
  { label: "No mortals are philosophers.", description: "Universal negative" },
];

function Section({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <header className="flex flex-col gap-1">
        <span className="text-caption uppercase tracking-wider text-text-tertiary">
          {eyebrow}
        </span>
        <h2 className="text-h2 text-text-primary">{title}</h2>
        {subtitle ? (
          <p className="text-body text-text-secondary">{subtitle}</p>
        ) : null}
      </header>
      {children ? <div className="flex flex-col gap-3">{children}</div> : null}
    </section>
  );
}

function GearIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9 1.7 1.7 0 0 0 4.3 7.2l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function SpeakerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M11 5 6 9H3v6h3l5 4z" />
      <path d="M16 9a4 4 0 0 1 0 6" />
    </svg>
  );
}

function FlameIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" aria-hidden>
      <path d="M12 3c1 3 4 5 4 9a4 4 0 0 1-8 0c0-2 1-3 1-5 2 1 3 0 3-4Z" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" aria-hidden>
      <path d="m12 3 2.6 5.6 6.1.6-4.6 4.2 1.3 6.1L12 16.8 6.6 19.5l1.3-6.1L3.3 9.2l6.1-.6Z" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
    </svg>
  );
}
