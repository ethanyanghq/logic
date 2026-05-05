import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Button, ProgressBar, RadioOption, Skeleton } from "@/components/ui";
import type { RadioOptionState } from "@/components/ui";
import { cn } from "@/components/ui/cn";
import {
  usePrepareSoundEffects,
  useSoundEffects,
} from "@/hooks/useSoundEffects";
import {
  appStore,
  selectEffectiveMotionEnabled,
  selectQuestionProgress,
  useAppStore,
} from "@/store";
import type {
  AnsweredQuestionAttempt,
  QuestionProgress,
} from "@/store";
import type { QuestionRewardContext } from "@/lib/xp";
import type { LocalDateString } from "@/lib/dates";
import type {
  QuestionScreenProps,
  TextMultipleChoiceQuestion,
} from "./types";

type Stage =
  | "skeleton"
  | "prompt"
  | "selecting"
  | "submitting"
  | "revealed";

const SKELETON_MS = 200;
const PROMPT_MS = 240;
const OPTION_STAGGER_MS = 40;
const SUBMIT_DELAY_MS = 250;
const INCORRECT_REVEAL_DELAY_MS = 200;

const OPTION_LETTERS = ["A", "B", "C", "D"] as const;

function pickAttempt(
  progress: QuestionProgress | null,
  context: QuestionRewardContext,
  dailyDate: LocalDateString | null,
): AnsweredQuestionAttempt | null {
  if (!progress) return null;
  if (context === "module") return progress.moduleAttempt;
  if (context === "onboarding-sample") return progress.onboardingSampleAttempt;
  if (context === "onboarding-diagnostic") {
    return progress.onboardingDiagnosticAttempt;
  }
  return dailyDate ? progress.dailyAttempts[dailyDate] ?? null : null;
}

export function QuestionScreen(props: QuestionScreenProps) {
  const {
    question,
    context,
    moduleId = null,
    dailyDate = null,
    questionNumber,
    totalQuestions,
    moduleLabel,
    continueLabel = "Continue",
    onContinue,
    onExit,
  } = props;

  const motionEnabled = useAppStore(selectEffectiveMotionEnabled);
  const questionProgress = useAppStore(selectQuestionProgress(question.id));
  const setQuestionSelection = useAppStore((s) => s.setQuestionSelection);
  const clearQuestionSelection = useAppStore((s) => s.clearQuestionSelection);
  const submitQuestionAnswer = useAppStore((s) => s.submitQuestionAnswer);
  const playSound = useSoundEffects();
  const prepareSound = usePrepareSoundEffects();

  const persistedAttempt = useMemo(
    () => pickAttempt(questionProgress, context, dailyDate),
    [questionProgress, context, dailyDate],
  );
  const persistedDraftIndex =
    questionProgress?.draft && questionProgress.draft.context === context
      ? questionProgress.draft.selectedOptionIndex
      : null;

  const initialStage: Stage = persistedAttempt
    ? "revealed"
    : persistedDraftIndex !== null
      ? "selecting"
      : motionEnabled
        ? "skeleton"
        : "selecting";

  const [stage, setStage] = useState<Stage>(initialStage);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    persistedAttempt?.selectedOptionIndex ?? persistedDraftIndex,
  );
  const [revealCorrect, setRevealCorrect] = useState<boolean>(
    persistedAttempt ? true : false,
  );
  const [shakeKey, setShakeKey] = useState(0);
  const submittedRef = useRef(false);

  // Lifecycle: skeleton -> prompt -> selecting (with option stagger).
  useEffect(() => {
    if (stage !== "skeleton") return;
    if (!motionEnabled) {
      setStage("selecting");
      return;
    }
    const t = window.setTimeout(() => setStage("prompt"), SKELETON_MS);
    return () => window.clearTimeout(t);
  }, [stage, motionEnabled]);

  useEffect(() => {
    if (stage !== "prompt") return;
    const t = window.setTimeout(() => setStage("selecting"), PROMPT_MS);
    return () => window.clearTimeout(t);
  }, [stage]);

  // Mid-question selection: persist to draft so reload restores it.
  const handleSelect = useCallback(
    (index: number) => {
      if (stage !== "selecting") return;
      playSound("select");
      setSelectedIndex(index);
      setQuestionSelection({
        questionId: question.id,
        context,
        selectedOptionIndex: index,
        moduleId,
        localDate: dailyDate ?? null,
      });
    },
    [
      stage,
      playSound,
      question.id,
      context,
      moduleId,
      dailyDate,
      setQuestionSelection,
    ],
  );

  const handleSubmit = useCallback(() => {
    if (stage !== "selecting" || selectedIndex === null) return;
    if (submittedRef.current) return;
    submittedRef.current = true;
    prepareSound();
    playSound("submit");
    setStage("submitting");

    const finalize = () => {
      const result = submitQuestionAnswer({
        questionId: question.id,
        context,
        selectedOptionIndex: selectedIndex,
        correctIndex: question.correctIndex,
        moduleId,
        localDate: dailyDate ?? null,
      });
      if (result.isCorrect) {
        playSound("correct");
        setRevealCorrect(true);
      } else {
        playSound("incorrect");
        setRevealCorrect(false);
        setShakeKey((k) => k + 1);
        if (motionEnabled) {
          window.setTimeout(() => setRevealCorrect(true), INCORRECT_REVEAL_DELAY_MS);
        } else {
          setRevealCorrect(true);
        }
      }
      setStage("revealed");
    };

    if (motionEnabled) {
      window.setTimeout(finalize, SUBMIT_DELAY_MS);
    } else {
      finalize();
    }
  }, [
    stage,
    selectedIndex,
    submitQuestionAnswer,
    prepareSound,
    playSound,
    question.id,
    question.correctIndex,
    context,
    moduleId,
    dailyDate,
    motionEnabled,
  ]);

  // Clear empty drafts when leaving the screen so we don't litter persisted state.
  useEffect(() => {
    return () => {
      const latest = appStore.getState();
      const progress = latest.questionProgress[question.id];
      const answered = pickAttempt(progress ?? null, context, dailyDate);
      if (
        progress?.draft &&
        progress.draft.context === context &&
        progress.draft.selectedOptionIndex === null &&
        !answered
      ) {
        clearQuestionSelection(question.id, context);
      }
    };
  }, [question.id, context, dailyDate, clearQuestionSelection]);

  const submittedAttempt =
    stage === "revealed" ? persistedAttempt : null;
  const isCorrect = submittedAttempt?.isCorrect ?? false;
  const awardedXp = submittedAttempt?.awardedXp ?? 0;

  const optionState = (index: number): RadioOptionState => {
    if (stage !== "revealed") {
      return selectedIndex === index ? "selected" : "default";
    }
    if (revealCorrect && index === question.correctIndex) return "correct";
    if (selectedIndex === index) return isCorrect ? "correct" : "incorrect";
    return "default";
  };

  const handleContinue = () => {
    if (!submittedAttempt) return;
    onContinue?.({
      questionId: question.id,
      isCorrect: submittedAttempt.isCorrect,
      awardedXp: submittedAttempt.awardedXp,
    });
  };

  const showSkeleton = stage === "skeleton";
  const showPrompt = stage !== "skeleton";
  const showOptions = stage !== "skeleton" && stage !== "prompt";
  const submitDisabled =
    stage !== "selecting" || selectedIndex === null;
  const submitting = stage === "submitting";
  const optionsInteractive = stage === "selecting";

  const totalSteps = totalQuestions ?? 0;
  const stepNumber = questionNumber ?? 0;
  const progressValue =
    totalSteps > 0 && stepNumber > 0
      ? Math.min(1, stepNumber / totalSteps)
      : 0;

  return (
    <section
      className="relative flex h-full flex-col"
      aria-label="Question"
      data-stage={stage}
    >
      <ShakeKeyframes />
      <Header
        moduleLabel={moduleLabel ?? labelForContext(context)}
        stepNumber={stepNumber}
        totalSteps={totalSteps}
        progressValue={progressValue}
        onExit={onExit}
      />

      <div
        className={cn(
          "flex flex-1 flex-col gap-6 px-5 pb-4 pt-4",
        )}
      >
        {showSkeleton ? <PromptSkeleton /> : null}
        {showPrompt ? (
          <Prompt prompt={question.prompt} animate={motionEnabled} />
        ) : null}

        <div
          key={`shake-${shakeKey}`}
          className={cn(
            "flex flex-col gap-3",
            shakeKey > 0 &&
              !revealCorrect &&
              motionEnabled &&
              "animate-[question-shake_320ms_cubic-bezier(0.36,0.07,0.19,0.97)_both]",
          )}
        >
          {showSkeleton
            ? OPTION_LETTERS.map((letter) => (
                <OptionSkeleton key={letter} />
              ))
            : null}
          {showOptions
            ? question.options.map((label, index) => {
                const state = optionState(index);
                const animationDelay =
                  motionEnabled && stage === "selecting"
                    ? `${index * OPTION_STAGGER_MS}ms`
                    : "0ms";
                const style: CSSProperties | undefined = motionEnabled
                  ? {
                      animationDelay,
                      animationFillMode: "both",
                    }
                  : undefined;
                return (
                  <RadioOption
                    key={`${question.id}-${index}`}
                    marker={OPTION_LETTERS[index]}
                    label={label}
                    state={state}
                    onClick={() => handleSelect(index)}
                    disabled={submitting}
                    aria-disabled={!optionsInteractive || undefined}
                    tabIndex={optionsInteractive ? undefined : -1}
                    aria-label={`Option ${OPTION_LETTERS[index]}: ${label}`}
                    style={style}
                    className={cn(
                      !optionsInteractive &&
                        !submitting &&
                        "pointer-events-none",
                      motionEnabled &&
                        stage === "selecting" &&
                        "animate-[ui-fade-in_320ms_ease-out]",
                      state === "correct" &&
                        motionEnabled &&
                        "animate-[question-pulse_700ms_ease-out]",
                    )}
                  />
                );
              })
            : null}
        </div>

        {stage === "revealed" ? (
          <ResultBanner
            isCorrect={isCorrect}
            awardedXp={awardedXp}
            animate={motionEnabled}
          />
        ) : null}

        {stage === "revealed" ? (
          <ExplanationPanel
            text={question.explanation}
            animate={motionEnabled}
          />
        ) : null}
      </div>

      <Footer>
        {stage === "revealed" ? (
          <Button fullWidth size="lg" onClick={handleContinue}>
            {continueLabel}
          </Button>
        ) : (
          <Button
            fullWidth
            size="lg"
            onClick={handleSubmit}
            disabled={submitDisabled}
            aria-busy={submitting || undefined}
          >
            {submitting ? "Checking…" : "Submit"}
          </Button>
        )}
      </Footer>
    </section>
  );
}

function Header({
  moduleLabel,
  stepNumber,
  totalSteps,
  progressValue,
  onExit,
}: {
  moduleLabel: string;
  stepNumber: number;
  totalSteps: number;
  progressValue: number;
  onExit?: () => void;
}) {
  const showCount = stepNumber > 0 && totalSteps > 0;
  return (
    <header className="flex flex-col gap-3 px-5 pb-3 pt-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-caption uppercase tracking-wider text-text-tertiary">
            {moduleLabel}
          </span>
          {showCount ? (
            <span className="font-mono text-caption text-text-secondary">
              {stepNumber} / {totalSteps}
            </span>
          ) : null}
        </div>
        {onExit ? (
          <button
            type="button"
            onClick={onExit}
            aria-label="Exit question"
            className={cn(
              "inline-flex h-8 w-8 items-center justify-center rounded-full",
              "border border-border-subtle bg-bg-surface text-text-secondary",
              "transition duration-150 ease-out hover:border-border-strong hover:text-text-primary",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-solar",
              "focus-visible:ring-offset-2 focus-visible:ring-offset-bg-app",
            )}
          >
            <CloseGlyph />
          </button>
        ) : null}
      </div>
      <ProgressBar
        value={progressValue}
        ariaLabel="Module progress"
        height={4}
      />
    </header>
  );
}

function Prompt({ prompt, animate }: { prompt: string; animate: boolean }) {
  return (
    <h1
      className={cn(
        "text-h1 text-text-primary",
        animate && "animate-[question-prompt-in_320ms_ease-out]",
      )}
    >
      {prompt}
    </h1>
  );
}

function PromptSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton shape="line" width="80%" height={20} />
      <Skeleton shape="line" width="60%" height={20} />
    </div>
  );
}

function OptionSkeleton() {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-border-subtle bg-bg-surface p-4">
      <Skeleton shape="circle" width={32} height={32} />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton shape="line" width="70%" />
        <Skeleton shape="line" width="40%" />
      </div>
    </div>
  );
}

function ResultBanner({
  isCorrect,
  awardedXp,
  animate,
}: {
  isCorrect: boolean;
  awardedXp: number;
  animate: boolean;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex items-center justify-between gap-4 rounded-2xl border px-4 py-3",
        isCorrect
          ? "border-semantic-success bg-semantic-success-muted"
          : "border-semantic-error bg-semantic-error-muted",
        animate && "animate-[ui-fade-in_280ms_ease-out]",
      )}
    >
      <span className="text-body text-text-primary">
        {isCorrect ? "Correct" : "Not quite"}
      </span>
      <span className="font-mono text-body text-brand-solar">
        +{awardedXp} XP
      </span>
    </div>
  );
}

function ExplanationPanel({
  text,
  animate,
}: {
  text: string;
  animate: boolean;
}) {
  return (
    <aside
      className={cn(
        "flex flex-col gap-2 rounded-2xl border border-border-subtle bg-bg-surface p-4",
        animate && "animate-[question-explanation-in_360ms_ease-out]",
      )}
    >
      <span className="text-caption uppercase tracking-wider text-text-tertiary">
        Explanation
      </span>
      <p className="text-body text-text-secondary">{text}</p>
    </aside>
  );
}

function Footer({ children }: { children: React.ReactNode }) {
  return (
    <div className="sticky bottom-0 z-10 border-t border-border-subtle bg-bg-app/85 px-5 py-4 backdrop-blur">
      {children}
    </div>
  );
}

function CloseGlyph() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 6 18 18" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

function labelForContext(context: QuestionRewardContext): string {
  switch (context) {
    case "module":
      return "Question";
    case "daily":
      return "Daily challenge";
    case "onboarding-sample":
      return "Sample question";
    case "onboarding-diagnostic":
      return "Diagnostic";
    default:
      return "Question";
  }
}

function ShakeKeyframes() {
  return (
    <style>{`
      @keyframes question-shake {
        0% { transform: translateX(0); }
        20% { transform: translateX(-4px); }
        40% { transform: translateX(4px); }
        60% { transform: translateX(-3px); }
        80% { transform: translateX(3px); }
        100% { transform: translateX(0); }
      }
      @keyframes question-pulse {
        0% { box-shadow: 0 0 0 0 rgba(124,255,178,0.0); }
        40% { box-shadow: 0 0 0 6px rgba(124,255,178,0.18); }
        100% { box-shadow: 0 0 0 0 rgba(124,255,178,0.0); }
      }
      @keyframes question-prompt-in {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes question-explanation-in {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `}</style>
  );
}

export type { TextMultipleChoiceQuestion };
