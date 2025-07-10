import * as React from "react";
import styles from "./CandidateProgress.module.scss";
import { InterviewProgress } from "../../types";
import { InterviewHistory } from "../InterviewHistory";
import { NextSteps } from "../NextSteps";
import { formatTimeSpent } from "../../utils/timeUtils";

export function CandidateProgress({ data }: { data: InterviewProgress }) {
  const getEarliestStageEntry = () => {
    if (data.visitedStages.length === 0) return null;

    const earliestStage = data.visitedStages.reduce((earliest, current) => {
      return new Date(current.enteredAtIso) < new Date(earliest.enteredAtIso)
        ? current
        : earliest;
    });

    return earliestStage.enteredAtIso;
  };

  const earliestEntry = getEarliestStageEntry();

  return (
    <div className={styles.container}>
      <div className={styles.firstColumn}>
        <div className={styles.titleContainer}>
          <h2>Interview Progress</h2>
          {earliestEntry && (
            <div className={styles.enteredLabel}>
              Entered {formatTimeSpent(earliestEntry, undefined, true)}
            </div>
          )}
        </div>
        <InterviewHistory
          visitedStages={data.visitedStages}
          upcomingStages={data.upcomingStages}
        />
      </div>

      <div className={styles.secondColumn}>
        <NextSteps
          nextAction={data.nextAction}
          urgencySignals={data.urgencySignals}
        />
      </div>
    </div>
  );
}
