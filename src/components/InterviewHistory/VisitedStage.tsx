import * as React from "react";
import {
  CheckFatIcon,
  CaretRightIcon,
  ClockClockwiseIcon,
} from "@phosphor-icons/react";
import { motion } from "motion/react";
import styles from "./InterviewHistory.module.scss";
import { VisitedInterviewStage } from "../../types";
import { formatTimeSpent } from "../../utils/timeUtils";
import { Interview } from "./Interview";

interface VisitedStageProps {
  stage: VisitedInterviewStage;
  isExpanded: boolean;
  onToggle: () => void;
}

export function VisitedStage({
  stage,
  isExpanded,
  onToggle,
}: VisitedStageProps) {
  const getStageStatus = (stage: VisitedInterviewStage) => {
    return stage.leftAtIso ? "completed" : "in_progress";
  };

  const getStatusIcon = (status: "completed" | "in_progress") => {
    switch (status) {
      case "completed":
        return <CheckFatIcon className={styles.statusIcon} weight="fill" />;
      default:
        return (
          <div className={`${styles.statusIcon} ${styles.rectangleIcon}`}></div>
        );
    }
  };

  const hasInterviews = stage.interviews.length > 0;
  const status = getStageStatus(stage);

  return (
    <div className={styles.stageGroup}>
      <div
        className={`${styles.stageHeader} ${
          status === "in_progress" ? styles.inProgressStage : ""
        } ${isExpanded ? styles.expanded : ""} ${
          !hasInterviews ? styles.notExpandable : ""
        }`}
        onClick={hasInterviews ? onToggle : undefined}
        role={hasInterviews ? "button" : undefined}
        tabIndex={hasInterviews ? 0 : undefined}
        onKeyDown={
          hasInterviews
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onToggle();
                }
              }
            : undefined
        }
      >
        <div className={styles.stageTitleContainer}>
          {getStatusIcon(status)}
          <div className={styles.stageTitle}>{stage.interviewStage.title}</div>
          {status === "in_progress" && (
            <div className={styles.currentTag}>Ongoing</div>
          )}
          <div className={styles.expandButton}>
            {hasInterviews && (
              <motion.div
                initial={{ rotate: isExpanded ? 90 : 0 }}
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 18,
                }}
              >
                <CaretRightIcon className={styles.expandIcon} weight="bold" />
              </motion.div>
            )}
          </div>
        </div>
        <div className={styles.stageRightContainer}>
          <div className={styles.stageInfo}>
            <div className={styles.interviewCount}>
              {stage.interviews.length === 0
                ? "No interviews"
                : `${stage.interviews.length} interview${
                    stage.interviews.length !== 1 ? "s" : ""
                  }`}
            </div>
            <div className={styles.separator}>•</div>
            <div className={styles.stageDates}>
              <ClockClockwiseIcon className={styles.clockIcon} weight="bold" />
              {formatTimeSpent(stage.enteredAtIso, stage.leftAtIso)}
            </div>
          </div>
        </div>
      </div>

      {stage.interviews.length > 0 && (
        <div
          className={`${styles.interviewsList} ${
            !isExpanded ? styles.collapsed : ""
          }`}
        >
          {stage.interviews.map((interview) => (
            <Interview key={interview.id} interview={interview} />
          ))}
        </div>
      )}
    </div>
  );
}
