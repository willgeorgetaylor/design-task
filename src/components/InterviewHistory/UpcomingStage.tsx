import * as React from "react";
import { CaretRightIcon } from "@phosphor-icons/react";
import { motion } from "motion/react";
import styles from "./InterviewHistory.module.scss";
import { InterviewProgress } from "../../types";

interface UpcomingStageProps {
  upcomingStage: InterviewProgress["upcomingStages"][0];
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

export function UpcomingStage({
  upcomingStage,
  index,
  isExpanded,
  onToggle,
}: UpcomingStageProps) {
  const hasSchedule =
    upcomingStage.interviewSchedule &&
    upcomingStage.interviewSchedule.length > 0;
  const isImmediateNext = index === 0;
  const isFutureStage = index > 0;

  return (
    <div className={styles.stageGroup}>
      <div
        className={`${styles.stageHeader} ${
          isFutureStage ? styles.futureStage : styles.upcomingStage
        } ${isExpanded ? styles.expanded : ""} ${
          !hasSchedule ? styles.notExpandable : ""
        }`}
        onClick={hasSchedule ? onToggle : undefined}
        role={hasSchedule ? "button" : undefined}
        tabIndex={hasSchedule ? 0 : undefined}
        onKeyDown={
          hasSchedule
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
          {isFutureStage ? (
            <div
              className={`${styles.statusIcon} ${styles.rectangleIcon}`}
            ></div>
          ) : (
            <div
              className={`${styles.statusIcon} ${styles.rectangleIcon}`}
            ></div>
          )}
          <div className={styles.stageTitle}>
            {upcomingStage.interviewStage.title}
          </div>
          {isImmediateNext && (
            <div className={styles.upcomingTag}>Upcoming</div>
          )}
          <div className={styles.expandButton}>
            {hasSchedule && (
              <motion.div
                animate={{
                  rotate: isExpanded ? 90 : 0,
                }}
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
            {(hasSchedule || isImmediateNext) && (
              <div className={styles.interviewCount}>
                {!hasSchedule
                  ? "No interviews scheduled"
                  : `${upcomingStage.interviewSchedule.length} interview${
                      upcomingStage.interviewSchedule.length !== 1 ? "s" : ""
                    } to schedule`}
              </div>
            )}
          </div>
        </div>
      </div>

      {hasSchedule && (
        <div
          className={`${styles.upcomingInterviewsList} ${
            !isExpanded ? styles.collapsed : ""
          }`}
        >
          {upcomingStage.interviewSchedule.map((interview) => (
            <div key={interview.id} className={styles.upcomingInterviewRow}>
              <div className={styles.interviewTitle}>{interview.title}</div>
              <button className={styles.scheduleButton}>Schedule</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
