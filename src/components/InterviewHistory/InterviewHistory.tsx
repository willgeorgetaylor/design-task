import * as React from "react";
import styles from "./InterviewHistory.module.scss";
import { VisitedInterviewStage, InterviewProgress } from "../../types";
import { VisitedStage } from "./VisitedStage";
import { UpcomingStage } from "./UpcomingStage";

interface InterviewHistoryProps {
  visitedStages: VisitedInterviewStage[];
  upcomingStages?: InterviewProgress["upcomingStages"];
}

export function InterviewHistory({
  visitedStages,
  upcomingStages,
}: InterviewHistoryProps) {
  const [expandedStages, setExpandedStages] = React.useState<Set<string>>(
    () => {
      // Initialize with in_progress stages expanded
      const initialExpanded = new Set<string>();
      visitedStages.forEach((stage) => {
        if (!stage.leftAtIso && stage.interviews.length > 0) {
          initialExpanded.add(stage.id);
        }
      });
      return initialExpanded;
    }
  );

  const toggleStage = (stageId: string) => {
    setExpandedStages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(stageId)) {
        newSet.delete(stageId);
      } else {
        newSet.add(stageId);
      }
      return newSet;
    });
  };

  const isStageExpanded = (stageId: string) => expandedStages.has(stageId);

  const renderUpcomingStages = () => {
    if (!upcomingStages || upcomingStages.length === 0) return null;

    return upcomingStages.map((upcomingStage, index) => (
      <UpcomingStage
        key={upcomingStage.interviewStage.id}
        upcomingStage={upcomingStage}
        index={index}
        isExpanded={isStageExpanded(upcomingStage.interviewStage.id)}
        onToggle={() => toggleStage(upcomingStage.interviewStage.id)}
      />
    ));
  };

  return (
    <div className={styles.visitedStages}>
      {visitedStages.length > 0 ? (
        visitedStages.map((stage) => (
          <VisitedStage
            key={stage.id}
            stage={stage}
            isExpanded={isStageExpanded(stage.id)}
            onToggle={() => toggleStage(stage.id)}
          />
        ))
      ) : (
        <div className={styles.emptyState}>
          No interview stages have been completed yet.
        </div>
      )}
      {renderUpcomingStages()}
    </div>
  );
}
