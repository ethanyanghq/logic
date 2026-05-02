import { CompletionHero } from "@/components/feedback";
import { Button, Card, StatTile, Tag } from "@/components/ui";
import { getModuleById, getQuestionsForModule } from "@/data/content";
import type { ModuleId } from "@/lib/modules";
import { selectLevel, selectXp, useAppStore } from "@/store";

export type CompletionScreenProps = {
  moduleId: ModuleId;
  awardedXp: number;
  onReturnHome?: () => void;
};

export function CompletionScreen({
  moduleId,
  awardedXp,
  onReturnHome,
}: CompletionScreenProps) {
  const xp = useAppStore(selectXp);
  const level = useAppStore(selectLevel);
  const moduleProgress = useAppStore((state) => state.moduleProgress[moduleId]);

  const module = getModuleById(moduleId);
  if (!module) {
    return null;
  }

  const questions = getQuestionsForModule(moduleId);
  const totalQuestions = questions.length;
  const correctCount = Math.min(
    moduleProgress?.correctQuestionIds.length ?? 0,
    totalQuestions,
  );

  return (
    <section
      aria-label="Module completion"
      className="flex min-h-full flex-col px-5 pb-8 pt-5"
    >
      <CompletionHero
        moduleTitle={module.title}
        correctCount={correctCount}
        totalQuestions={totalQuestions}
      />

      <div className="mt-6 grid grid-cols-2 gap-3">
        <StatTile
          label="Completion bonus"
          value={`+${awardedXp}`}
          caption="Awarded for finishing the module"
          tone="solar"
        />
        <StatTile
          label="Total XP"
          value={xp}
          caption={`Now at level ${level}`}
          tone="neural"
        />
      </div>

      <Card className="mt-6">
        <div className="flex flex-col gap-3 p-5">
          <div className="flex items-center gap-2">
            <Tag tone="neutral">Next step</Tag>
            <Tag tone="success">Home launchpad</Tag>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-h2 text-text-primary">Return with a clean state</h2>
            <p className="text-body text-text-secondary">
              Home now reflects this completion and keeps the three preview-only
              modules visible for breadth. You can review Foundations from there
              without losing progress.
            </p>
          </div>
        </div>
      </Card>

      <div className="mt-auto pt-6">
        <Button size="lg" fullWidth onClick={onReturnHome}>
          Back to home
        </Button>
      </div>
    </section>
  );
}
