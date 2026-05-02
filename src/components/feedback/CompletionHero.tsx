import { Card, ProgressRing, Tag } from "@/components/ui";

type CompletionHeroProps = {
  moduleTitle: string;
  correctCount: number;
  totalQuestions: number;
};

export function CompletionHero({
  moduleTitle,
  correctCount,
  totalQuestions,
}: CompletionHeroProps) {
  return (
    <Card variant="hero" className="overflow-hidden">
      <div className="flex items-center justify-between gap-5 p-5">
        <div className="flex flex-1 flex-col gap-3">
          <Tag tone="success">Module complete</Tag>
          <div className="flex flex-col gap-2">
            <h1 className="text-h1 text-text-primary">{moduleTitle} complete</h1>
            <p className="text-body text-text-secondary">
              You cleared the full run. The logic loop is closed and ready to
              replay from home.
            </p>
          </div>
          <span className="text-caption uppercase tracking-wider text-text-tertiary">
            {correctCount}/{totalQuestions} correct answers
          </span>
        </div>

        <ProgressRing
          value={1}
          size={92}
          stroke={9}
          tone="success"
          ariaLabel="Module completion progress"
        >
          <span className="font-mono text-body text-semantic-success">100%</span>
        </ProgressRing>
      </div>
    </Card>
  );
}
