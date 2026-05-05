import { useEffect, useMemo, useState } from "react";
import { PhoneFrame } from "./components/layout";
import { Card, Skeleton } from "./components/ui";
import type {
  DemoPresetDefinition,
  DemoPresetTarget,
} from "./data/presets";
import {
  PLAYABLE_MODULE,
  PLAYABLE_MODULE_ID,
  PLAYABLE_MODULE_QUESTIONS,
  getModuleById,
  getQuestionById,
  getQuestionsForModule,
} from "./data/content";
import type { ModuleId } from "./lib/modules";
import { useSoundEffects } from "./hooks/useSoundEffects";
import { CompletionScreen } from "./screens/completion";
import { HomeScreen } from "./screens/home";
import { OnboardingScreen } from "./screens/onboarding";
import { QuestionScreen } from "./screens/question";
import {
  selectHasCompletedProfile,
  selectHasHydrated,
  selectShouldStartInOnboarding,
  type AppStoreState,
  type QuestionId,
  useAppStore,
} from "./store";

type AppRoute =
  | { screen: "onboarding" }
  | { screen: "home" }
  | { screen: "question"; moduleId: ModuleId; questionId: QuestionId }
  | { screen: "completion"; moduleId: ModuleId; awardedXp: number };

export function App() {
  const hasHydrated = useAppStore(selectHasHydrated);
  const hasCompletedProfile = useAppStore(selectHasCompletedProfile);
  const shouldStartInOnboarding = useAppStore(selectShouldStartInOnboarding);
  const completeModule = useAppStore((state) => state.completeModule);
  const questionProgress = useAppStore((state) => state.questionProgress);
  const playSound = useSoundEffects();

  const [route, setRoute] = useState<AppRoute>({ screen: "home" });
  const [routeRevision, setRouteRevision] = useState(0);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (shouldStartInOnboarding) {
      setRoute({ screen: "onboarding" });
      return;
    }

    setRoute((currentRoute) =>
      currentRoute.screen === "question" || currentRoute.screen === "completion"
        ? currentRoute
        : { screen: "home" },
    );
  }, [hasHydrated, shouldStartInOnboarding]);

  const activeQuestion = useMemo(
    () =>
      route.screen === "question" ? getQuestionById(route.questionId) : null,
    [route],
  );

  const activeCompletionModule = useMemo(
    () =>
      route.screen === "completion" ? getModuleById(route.moduleId) : null,
    [route],
  );

  const handleOpenFoundations = (_moduleId: ModuleId) => {
    const questionId = getLaunchQuestionId(questionProgress, PLAYABLE_MODULE_ID);
    if (!questionId) {
      return;
    }

    setRoute({
      screen: "question",
      moduleId: PLAYABLE_MODULE_ID,
      questionId,
    });
  };

  const handleContinueQuestion = ({ questionId }: { questionId: QuestionId }) => {
    if (route.screen !== "question") {
      return;
    }

    const nextQuestionId = getNextQuestionId(route.moduleId, questionId);
    if (nextQuestionId) {
      setRoute({
        screen: "question",
        moduleId: route.moduleId,
        questionId: nextQuestionId,
      });
      return;
    }

    const completionResult = completeModule({ moduleId: route.moduleId });
    playSound("complete");
    setRoute({
      screen: "completion",
      moduleId: route.moduleId,
      awardedXp: completionResult?.awardedXp ?? 0,
    });
  };

  const handleSelectPreset = (preset: DemoPresetDefinition) => {
    setRouteRevision((currentRevision) => currentRevision + 1);
    setRoute(routeFromPresetTarget(preset.target));
  };

  return (
    <PhoneFrame onSelectPreset={handleSelectPreset}>
      {!hasHydrated ? <LoadingScreen /> : null}

      {hasHydrated && route.screen === "onboarding" ? <OnboardingScreen /> : null}

      {hasHydrated && route.screen === "home" ? (
        <HomeScreen onOpenModule={handleOpenFoundations} />
      ) : null}

      {hasHydrated && route.screen === "question" && activeQuestion ? (
        <QuestionScreen
          key={`${routeRevision}:${route.moduleId}:${route.questionId}`}
          question={activeQuestion}
          context="module"
          moduleId={route.moduleId}
          questionNumber={getQuestionNumber(activeQuestion.id)}
          totalQuestions={getQuestionsForModule(route.moduleId).length}
          moduleLabel={getModuleById(route.moduleId)?.title ?? PLAYABLE_MODULE.title}
          continueLabel={
            isLastQuestionInModule(route.moduleId, activeQuestion.id)
              ? "See completion"
              : "Continue"
          }
          onContinue={handleContinueQuestion}
          onExit={() => setRoute({ screen: "home" })}
        />
      ) : null}

      {hasHydrated &&
      route.screen === "completion" &&
      activeCompletionModule &&
      hasCompletedProfile ? (
        <CompletionScreen
          moduleId={route.moduleId}
          awardedXp={route.awardedXp}
          onReturnHome={() => setRoute({ screen: "home" })}
        />
      ) : null}
    </PhoneFrame>
  );
}

function LoadingScreen() {
  return (
    <section
      aria-label="Loading app"
      className="flex min-h-full flex-col gap-6 px-5 pb-8 pt-5"
    >
      <Card variant="hero" className="overflow-hidden">
        <div className="flex flex-col gap-4 p-5">
          <Skeleton className="h-4 w-24 rounded-full" />
          <Skeleton className="h-10 w-56 rounded-2xl" />
          <Skeleton className="h-4 w-full rounded-full" />
          <Skeleton className="h-4 w-3/4 rounded-full" />
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
      </div>

      <div className="flex flex-col gap-3">
        <Skeleton className="h-36 rounded-2xl" />
        <Skeleton className="h-36 rounded-2xl" />
      </div>
    </section>
  );
}

function getLaunchQuestionId(
  questionProgress: AppStoreState["questionProgress"],
  moduleId: ModuleId,
): QuestionId | null {
  const moduleQuestions = getQuestionsForModule(moduleId);
  const draftQuestion = moduleQuestions.find((question) => {
    const progress = questionProgress[question.id];
    return (
      progress?.draft?.context === "module" &&
      progress.draft.moduleId === moduleId &&
      !progress.moduleAttempt
    );
  });

  if (draftQuestion) {
    return draftQuestion.id;
  }

  const unansweredQuestion = moduleQuestions.find(
    (question) => !questionProgress[question.id]?.moduleAttempt,
  );

  if (unansweredQuestion) {
    return unansweredQuestion.id;
  }

  return moduleQuestions[0]?.id ?? null;
}

function getNextQuestionId(
  moduleId: ModuleId,
  currentQuestionId: QuestionId,
): QuestionId | null {
  const moduleQuestions = getQuestionsForModule(moduleId);
  const currentIndex = moduleQuestions.findIndex(
    (question) => question.id === currentQuestionId,
  );

  if (currentIndex < 0) {
    return null;
  }

  return moduleQuestions[currentIndex + 1]?.id ?? null;
}

function isLastQuestionInModule(
  moduleId: ModuleId,
  questionId: QuestionId,
): boolean {
  const moduleQuestions = getQuestionsForModule(moduleId);
  return moduleQuestions[moduleQuestions.length - 1]?.id === questionId;
}

function getQuestionNumber(questionId: QuestionId): number {
  const questionIndex = PLAYABLE_MODULE_QUESTIONS.findIndex(
    (question) => question.id === questionId,
  );

  return questionIndex >= 0 ? questionIndex + 1 : 1;
}

function routeFromPresetTarget(target: DemoPresetTarget): AppRoute {
  switch (target.screen) {
    case "onboarding":
      return { screen: "onboarding" };
    case "home":
      return { screen: "home" };
    case "question":
      return {
        screen: "question",
        moduleId: target.moduleId,
        questionId: target.questionId,
      };
    case "completion":
      return {
        screen: "completion",
        moduleId: target.moduleId,
        awardedXp: 0,
      };
  }

  throw new Error(`Unsupported preset target: ${JSON.stringify(target)}`);
}
