import { useMemo } from "react";
import { DemoControlsTrigger } from "@/components/demo";
import {
  Avatar,
  Button,
  Card,
  ProgressBar,
  Skeleton,
  StatTile,
  Tag,
} from "@/components/ui";
import { type ModuleId } from "@/lib/modules";
import {
  type AppStoreState,
  selectHasCompletedProfile,
  selectHasHydrated,
  selectLevel,
  selectRecommendedStartingModuleId,
  selectXp,
  useAppStore,
} from "@/store";
import {
  buildHomeScreenModel,
  type HomeModuleCardModel,
  type HomeStoreSnapshot,
} from "./home-model";

export type HomeScreenProps = {
  snapshot?: HomeStoreSnapshot;
  onOpenModule?: (moduleId: ModuleId) => void;
  now?: Date | number | string;
};

export function HomeScreen({ snapshot, onOpenModule, now }: HomeScreenProps) {
  const liveSnapshot = useLiveHomeSnapshot();
  const previewSelectorState = snapshot ? toPreviewSelectorState(snapshot) : null;
  const hasHydrated = useAppStore(selectHasHydrated);
  const hasCompletedProfile = useAppStore(selectHasCompletedProfile);
  const xp = useAppStore(selectXp);
  const level = useAppStore(selectLevel);
  const recommendedModuleId = useAppStore(selectRecommendedStartingModuleId);

  const resolvedSnapshot = snapshot ?? liveSnapshot;
  const resolvedHydration = snapshot ? true : hasHydrated;
  const resolvedHasCompletedProfile = previewSelectorState
    ? selectHasCompletedProfile(previewSelectorState)
    : hasCompletedProfile;
  const resolvedXp = previewSelectorState ? selectXp(previewSelectorState) : xp;
  const resolvedLevel = previewSelectorState
    ? selectLevel(previewSelectorState)
    : level;
  const resolvedRecommendedModuleId = previewSelectorState
    ? selectRecommendedStartingModuleId(previewSelectorState)
    : recommendedModuleId;

  const model = useMemo(
    () =>
      buildHomeScreenModel({
        snapshot: resolvedSnapshot,
        hasCompletedProfile: resolvedHasCompletedProfile,
        recommendedModuleId: resolvedRecommendedModuleId,
        xp: resolvedXp,
        level: resolvedLevel,
        now,
      }),
    [
      resolvedSnapshot,
      resolvedHasCompletedProfile,
      resolvedRecommendedModuleId,
      resolvedXp,
      resolvedLevel,
      now,
    ],
  );

  if (!resolvedHydration) {
    return <HomeScreenSkeleton />;
  }

  const handleStartFoundations = () => {
    onOpenModule?.(model.playableModule.id);
  };

  return (
    <section
      aria-label="Home dashboard"
      className="flex min-h-full flex-col px-5 pb-8 pt-5"
    >
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar
            size="lg"
            shape={resolvedSnapshot.profile.avatarId ?? undefined}
            initials={model.profileName?.slice(0, 2)}
            alt={model.profileName ? `${model.profileName} avatar` : "Avatar"}
            className="bg-bg-surface-3"
          />
          <div className="flex flex-col gap-1">
            <span className="text-caption uppercase tracking-wider text-text-tertiary">
              {model.dateLabel}
            </span>
            <h1 className="text-h1 text-text-primary">{model.greetingLabel}</h1>
          </div>
        </div>
        <DemoControlsTrigger variant="ghost" />
      </header>

      <Card variant="hero" className="mt-6 overflow-hidden">
        <div className="flex flex-col gap-4 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <Tag tone={model.heroBadgeTone}>{model.heroBadgeLabel}</Tag>
              <div className="flex flex-col gap-1">
                <h2 className="text-h2 text-text-primary">{model.heroTitle}</h2>
                <p className="text-body text-text-secondary">
                  {model.heroDetail}
                </p>
              </div>
            </div>
            <FoundationsGlyph />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-caption uppercase tracking-wider text-text-tertiary">
                Foundations progress
              </span>
              <span className="font-mono text-caption text-brand-neural">
                {model.heroProgressLabel}
              </span>
            </div>
            <ProgressBar
              value={model.heroProgressValue}
              tone={model.playableModule.completed ? "success" : "neural"}
              ariaLabel="Foundations progress"
            />
          </div>

          <div className="flex justify-start">
            <Button
              size="lg"
              onClick={handleStartFoundations}
              disabled={!onOpenModule}
            >
              {model.heroCtaLabel}
            </Button>
          </div>
        </div>
      </Card>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <StatTile
          label="XP"
          value={model.xpValueLabel}
          caption={model.xpCaption}
          tone="solar"
        />
        <StatTile
          label="Level"
          value={model.levelValueLabel}
          caption={model.levelCaption}
          tone="neural"
        />
      </div>

      <section className="mt-8 flex flex-col gap-4" aria-labelledby="home-modules">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-caption uppercase tracking-wider text-text-tertiary">
              Learning path
            </span>
            <h2 id="home-modules" className="text-h2 text-text-primary">
              Modules
            </h2>
          </div>
          <Tag tone="neural">{model.levelValueLabel}</Tag>
        </div>

        <ModuleCard module={model.playableModule} onOpenModule={onOpenModule} />
        {model.previewModules.map((module) => (
          <ModuleCard key={module.id} module={module} />
        ))}
      </section>
    </section>
  );
}

function useLiveHomeSnapshot(): HomeStoreSnapshot {
  const profile = useAppStore((state) => state.profile);
  const progress = useAppStore((state) => state.progress);
  const moduleProgress = useAppStore((state) => state.moduleProgress);

  return useMemo(
    () => ({ profile, progress, moduleProgress }),
    [profile, progress, moduleProgress],
  );
}

function ModuleCard({
  module,
  onOpenModule,
}: {
  module: HomeModuleCardModel;
  onOpenModule?: (moduleId: ModuleId) => void;
}) {
  const isInteractive = module.isPlayable && Boolean(onOpenModule);

  return (
    <Card
      variant={
        module.isPlayable && module.isRecommended
          ? "selected"
          : isInteractive
            ? "interactive"
            : "default"
      }
      asButton={isInteractive}
      onClick={
        isInteractive && onOpenModule
          ? () => onOpenModule(module.id)
          : undefined
      }
      aria-disabled={module.isPreview ? true : undefined}
      className="overflow-hidden text-left"
    >
      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Tag
                tone={
                  module.isPreview
                    ? "neutral"
                    : module.completed
                      ? "success"
                      : module.isRecommended
                        ? "solar"
                        : "neural"
                }
              >
                {module.badgeLabel}
              </Tag>
              <Tag tone="neutral">{module.difficulty}</Tag>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-h2 text-text-primary">{module.title}</h3>
              <p className="text-body text-text-secondary">{module.subtitle}</p>
            </div>
          </div>
          <ModuleGlyph moduleId={module.id} />
        </div>

        {module.isPlayable ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-caption uppercase tracking-wider text-text-tertiary">
                Progress
              </span>
              <span className="font-mono text-caption text-brand-neural">
                {module.answeredCount}/{module.totalQuestions}
              </span>
            </div>
            <ProgressBar
              value={module.progressValue}
              tone={module.completed ? "success" : "neural"}
              ariaLabel={`${module.title} progress`}
            />
          </div>
        ) : null}
      </div>
    </Card>
  );
}

function HomeScreenSkeleton() {
  return (
    <section
      aria-label="Home dashboard loading"
      className="flex min-h-full flex-col px-5 pb-8 pt-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton shape="circle" width={48} height={48} />
          <div className="flex w-48 flex-col gap-2">
            <Skeleton shape="line" width="55%" />
            <Skeleton shape="line" width="85%" height={20} />
          </div>
        </div>
        <Skeleton shape="circle" width={40} height={40} />
      </div>

      <Skeleton height={196} className="mt-6 rounded-3xl" />

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Skeleton height={104} className="rounded-2xl" />
        <Skeleton height={104} className="rounded-2xl" />
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <Skeleton shape="line" width="38%" />
        <Skeleton height={172} className="rounded-3xl" />
        <Skeleton height={156} className="rounded-3xl" />
        <Skeleton height={156} className="rounded-3xl" />
        <Skeleton height={156} className="rounded-3xl" />
      </div>
    </section>
  );
}

function toPreviewSelectorState(snapshot: HomeStoreSnapshot): AppStoreState {
  return snapshot as AppStoreState;
}

function FoundationsGlyph() {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      aria-hidden
      className="shrink-0 text-brand-solar"
    >
      <circle
        cx="28"
        cy="28"
        r="22"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.3"
      />
      <rect
        x="14"
        y="14"
        width="28"
        height="28"
        rx="9"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.5"
      />
      <path
        d="M19 34l9-13 9 13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ModuleGlyph({ moduleId }: { moduleId: ModuleId }) {
  if (moduleId === "foundations") {
    return (
      <svg
        width="44"
        height="44"
        viewBox="0 0 44 44"
        fill="none"
        aria-hidden
        className="shrink-0 text-brand-solar"
      >
        <rect
          x="9"
          y="9"
          width="26"
          height="26"
          rx="8"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.35"
        />
        <path
          d="M15 27l7-10 7 10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (moduleId === "conditional-reasoning") {
    return (
      <svg
        width="44"
        height="44"
        viewBox="0 0 44 44"
        fill="none"
        aria-hidden
        className="shrink-0 text-brand-neural"
      >
        <path
          d="M14 14h10c4 0 6 2 6 6s-2 6-6 6h-4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M24 10l8 10-8 10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.6"
        />
      </svg>
    );
  }

  if (moduleId === "logical-fallacies") {
    return (
      <svg
        width="44"
        height="44"
        viewBox="0 0 44 44"
        fill="none"
        aria-hidden
        className="shrink-0 text-text-secondary"
      >
        <path
          d="M13 13h18v18H13z"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.35"
        />
        <path
          d="M16 16l12 12M28 16L16 28"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
      aria-hidden
      className="shrink-0 text-text-secondary"
    >
      <circle
        cx="22"
        cy="22"
        r="13"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.35"
      />
      <path
        d="M16 22h12M22 16v12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
