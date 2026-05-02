import type { ChangeEvent, FormEvent } from "react";
import { DemoControlsTrigger } from "@/components/demo";
import { Button, Card, Input, RadioOption, Tag } from "@/components/ui";
import {
  AVATAR_IDS,
  type UserGoal,
} from "@/lib/onboarding";
import { useAppStore } from "@/store";

export function OnboardingScreen() {
  const onboarding = useAppStore((state) => state.onboarding);
  const displayName = useAppStore((state) => state.profile.displayName ?? "");
  const selectedGoal = useAppStore((state) => state.profile.selectedGoal);
  const completeWelcomeStep = useAppStore((state) => state.completeWelcomeStep);
  const setOnboardingDisplayName = useAppStore(
    (state) => state.setOnboardingDisplayName,
  );
  const setOnboardingGoal = useAppStore((state) => state.setOnboardingGoal);
  const setOnboardingStage = useAppStore((state) => state.setOnboardingStage);
  const completeOnboardingProfile = useAppStore(
    (state) => state.completeOnboardingProfile,
  );

  const activeStep =
    onboarding.stage === "profile" ||
    onboarding.stage === "sample" ||
    onboarding.stage === "complete"
      ? "profile"
      : "goal";

  const trimmedDisplayName = displayName.trim();
  const canFinish = trimmedDisplayName.length > 0 && Boolean(selectedGoal);

  const handleGoalSelect = (goal: UserGoal) => {
    if (!onboarding.welcomeCompleted) {
      completeWelcomeStep();
    }

    setOnboardingGoal(goal);
  };

  const handleDisplayNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setOnboardingDisplayName(event.target.value.slice(0, 32));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canFinish) {
      return;
    }

    // Avatar selection is intentionally out of scope for T010; the backend
    // completion contract still requires one, so onboarding uses the default.
    completeOnboardingProfile({
      displayName: trimmedDisplayName,
      avatarId: AVATAR_IDS[0],
    });
  };

  return (
    <section
      aria-label="First-run personalization"
      className="flex min-h-full flex-col px-5 pb-8 pt-5"
    >
      <header className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-caption uppercase tracking-wider text-brand-solar">
            First run
          </span>
          <h1 className="text-h1 text-text-primary">Tune Logic to you</h1>
          <p className="max-w-[28rem] text-body text-text-secondary">
            Two quick choices, then straight into the learning loop.
          </p>
        </div>
        <DemoControlsTrigger variant="ghost" />
      </header>

      <div className="mt-6 flex items-center gap-3">
        <StepPill active={activeStep === "goal"} label="1 Goal" />
        <StepPill active={activeStep === "profile"} label="2 Name" />
      </div>

      {activeStep === "goal" ? (
        <GoalStep
          selectedGoal={selectedGoal}
          onSelectGoal={handleGoalSelect}
        />
      ) : (
        <ProfileStep
          displayName={displayName}
          selectedGoal={selectedGoal}
          canFinish={canFinish}
          onChangeDisplayName={handleDisplayNameChange}
          onBack={() => setOnboardingStage("goal")}
          onSubmit={handleSubmit}
        />
      )}
    </section>
  );
}

function GoalStep({
  selectedGoal,
  onSelectGoal,
}: {
  selectedGoal: UserGoal | null;
  onSelectGoal: (goal: UserGoal) => void;
}) {
  return (
    <div className="mt-6 flex flex-col gap-4">
      <Card variant="hero" className="overflow-hidden">
        <div className="flex flex-col gap-4 p-5">
          <Tag tone="solar">Pick your reason</Tag>
          <div className="flex flex-col gap-2">
            <h2 className="text-h2 text-text-primary">
              What should this run sharpen first?
            </h2>
            <p className="text-body text-text-secondary">
              Tap once and the next step opens immediately.
            </p>
          </div>
        </div>
      </Card>

      <div className="flex flex-col gap-3" role="radiogroup" aria-label="Goal">
        {GOAL_OPTIONS.map((goal, index) => (
          <RadioOption
            key={goal.value}
            marker={String(index + 1)}
            label={goal.label}
            description={goal.description}
            state={selectedGoal === goal.value ? "selected" : "default"}
            onClick={() => onSelectGoal(goal.value)}
          />
        ))}
      </div>
    </div>
  );
}

function ProfileStep({
  displayName,
  selectedGoal,
  canFinish,
  onChangeDisplayName,
  onBack,
  onSubmit,
}: {
  displayName: string;
  selectedGoal: UserGoal | null;
  canFinish: boolean;
  onChangeDisplayName: (event: ChangeEvent<HTMLInputElement>) => void;
  onBack: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form className="mt-6 flex flex-1 flex-col gap-4" onSubmit={onSubmit}>
      <Card variant="hero" className="overflow-hidden">
        <div className="flex flex-col gap-4 p-5">
          <div className="flex items-center gap-2">
            <Tag tone="neural">{goalLabel(selectedGoal)}</Tag>
            <Tag tone="neutral">Saved as you type</Tag>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-h2 text-text-primary">
              What should we call you?
            </h2>
            <p className="text-body text-text-secondary">
              This name shows up in your greeting and progress surfaces.
            </p>
          </div>
          <Input
            autoFocus
            label="Display name"
            placeholder="Enter your name"
            autoComplete="name"
            maxLength={32}
            value={displayName}
            onChange={onChangeDisplayName}
            hint="Reloading here should reopen this step with your saved name."
          />
        </div>
      </Card>

      <div className="mt-auto flex flex-col gap-3">
        <Button type="submit" size="lg" fullWidth disabled={!canFinish}>
          Continue to home
        </Button>
        <Button type="button" variant="ghost" fullWidth onClick={onBack}>
          Change goal
        </Button>
      </div>
    </form>
  );
}

function StepPill({ active, label }: { active: boolean; label: string }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-3 py-2 text-caption uppercase tracking-wider",
        active
          ? "border-border-solar bg-brand-solar-muted text-brand-solar"
          : "border-border-subtle bg-bg-surface text-text-tertiary",
      ].join(" ")}
    >
      {label}
    </span>
  );
}

function goalLabel(goal: UserGoal | null): string {
  return GOAL_OPTIONS.find((option) => option.value === goal)?.label ?? "Goal";
}

const GOAL_OPTIONS: readonly {
  value: UserGoal;
  label: string;
  description: string;
}[] = [
  {
    value: "lsat",
    label: "LSAT",
    description: "Tighten argument reading and flaw spotting.",
  },
  {
    value: "gre",
    label: "GRE",
    description: "Move faster through formal reasoning prompts.",
  },
  {
    value: "job-interviews",
    label: "Job interviews",
    description: "Stay precise when a case question gets ambiguous.",
  },
  {
    value: "general-reasoning",
    label: "General reasoning",
    description: "Sharpen the way you test claims and choices.",
  },
  {
    value: "just-curious",
    label: "Just curious",
    description: "Explore logic for the craft of thinking clearly.",
  },
] as const;
