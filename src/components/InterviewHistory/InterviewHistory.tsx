import * as React from "react";
import {
  CheckFatIcon,
  CaretRightIcon,
  QuestionMarkIcon,
  XIcon,
  CheckIcon,
  MinusIcon,
  ClockClockwiseIcon,
} from "@phosphor-icons/react";
import { motion } from "motion/react";
import styles from "./InterviewHistory.module.scss";
import {
  VisitedInterviewStage,
  ScheduledInterview,
  Interviewer,
  InterviewProgress,
} from "../../types";
import { formatTimeSpent } from "../../utils/timeUtils";

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

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (startIso: string, endIso: string) => {
    const start = new Date(startIso);
    const end = new Date(endIso);
    return `${start.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })} - ${end.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })}`;
  };

  const getRsvpStatusClass = (status?: string) => {
    switch (status) {
      case "accepted":
        return styles.accepted;
      case "tentative":
        return styles.tentative;
      case "declined":
        return styles.declined;
      default:
        return styles.noResponse;
    }
  };

  const getScoreClass = (score?: number | string) => {
    if (score === "unsubmitted" || score === undefined) {
      return styles.unsubmitted;
    }
    return styles[`score${score}`];
  };

  const getRsvpIcon = (status?: string) => {
    switch (status) {
      case "accepted":
        return <CheckIcon weight="bold" />;
      case "tentative":
        return <QuestionMarkIcon weight="bold" />;
      case "declined":
        return <XIcon weight="bold" />;
      default:
        return <MinusIcon weight="bold" />;
    }
  };

  const renderInterviewer = (interviewer: Interviewer, index: number) => (
    <div key={interviewer.id} className={styles.interviewer}>
      <div className={styles.avatarContainer}>
        <img
          src={interviewer.user.profilePhotoUrl}
          alt={interviewer.user.name}
          className={styles.interviewerAvatar}
        />
        <div
          className={`${styles.rsvpIndicator} ${getRsvpStatusClass(
            interviewer.rsvpStatus
          )}`}
        >
          {getRsvpIcon(interviewer.rsvpStatus)}
        </div>
      </div>
      <div className={styles.interviewerInfo}>
        <p className={styles.interviewerName}>{interviewer.user.name}</p>
        <span
          className={`${styles.rsvpStatus} ${getRsvpStatusClass(
            interviewer.rsvpStatus
          )}`}
        >
          {interviewer.rsvpStatus || "No response"}
        </span>
      </div>
      <div className={`${styles.score} ${getScoreClass(interviewer.score)}`}>
        {interviewer.score === "unsubmitted" ? "—" : interviewer.score}
      </div>
    </div>
  );

  const renderInterview = (interview: ScheduledInterview) => (
    <div key={interview.id} className={styles.interviewRow}>
      <div>
        <div className={styles.interviewTitle}>{interview.interview.title}</div>
      </div>

      <div className={styles.interviewDateTime}>
        <p className={styles.interviewDate}>{formatDate(interview.startIso)}</p>
        <p className={styles.interviewTime}>
          {formatTime(interview.startIso, interview.endIso)}
        </p>
      </div>

      <div className={styles.interviewers}>
        {interview.interviewers.map(renderInterviewer)}
      </div>
    </div>
  );

  const renderVisitedStage = (stage: VisitedInterviewStage) => {
    const hasInterviews = stage.interviews.length > 0;
    const status = getStageStatus(stage);

    return (
      <div key={stage.id} className={styles.stageGroup}>
        <div
          className={`${styles.stageHeader} ${
            status === "in_progress" ? styles.inProgressStage : ""
          } ${isStageExpanded(stage.id) ? styles.expanded : ""} ${
            !hasInterviews ? styles.notExpandable : ""
          }`}
          onClick={hasInterviews ? () => toggleStage(stage.id) : undefined}
          role={hasInterviews ? "button" : undefined}
          tabIndex={hasInterviews ? 0 : undefined}
          onKeyDown={
            hasInterviews
              ? (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleStage(stage.id);
                  }
                }
              : undefined
          }
        >
          <div className={styles.stageTitleContainer}>
            {getStatusIcon(status)}
            <div className={styles.stageTitle}>
              {stage.interviewStage.title}
            </div>
            {status === "in_progress" && (
              <div className={styles.currentTag}>Ongoing</div>
            )}
            <div className={styles.expandButton}>
              {hasInterviews && (
                <motion.div
                  initial={{ rotate: isStageExpanded(stage.id) ? 90 : 0 }}
                  animate={{ rotate: isStageExpanded(stage.id) ? 90 : 0 }}
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
                <ClockClockwiseIcon
                  className={styles.clockIcon}
                  weight="bold"
                />
                {formatTimeSpent(stage.enteredAtIso, stage.leftAtIso)}
              </div>
            </div>
          </div>
        </div>

        {stage.interviews.length > 0 && (
          <div
            className={`${styles.interviewsList} ${
              !isStageExpanded(stage.id) ? styles.collapsed : ""
            }`}
          >
            {stage.interviews.map(renderInterview)}
          </div>
        )}
      </div>
    );
  };

  const renderUpcomingStage = (
    upcomingStage: InterviewProgress["upcomingStages"][0],
    index: number
  ) => {
    const hasSchedule =
      upcomingStage.interviewSchedule &&
      upcomingStage.interviewSchedule.length > 0;
    const isImmediateNext = index === 0;
    const isFutureStage = index > 0;

    return (
      <div key={upcomingStage.interviewStage.id} className={styles.stageGroup}>
        <div
          className={`${styles.stageHeader} ${
            isFutureStage ? styles.futureStage : styles.upcomingStage
          } ${
            isStageExpanded(upcomingStage.interviewStage.id)
              ? styles.expanded
              : ""
          } ${!hasSchedule ? styles.notExpandable : ""}`}
          onClick={
            hasSchedule
              ? () => toggleStage(upcomingStage.interviewStage.id)
              : undefined
          }
          role={hasSchedule ? "button" : undefined}
          tabIndex={hasSchedule ? 0 : undefined}
          onKeyDown={
            hasSchedule
              ? (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleStage(upcomingStage.interviewStage.id);
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
                    rotate: isStageExpanded(upcomingStage.interviewStage.id)
                      ? 90
                      : 0,
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
              !isStageExpanded(upcomingStage.interviewStage.id)
                ? styles.collapsed
                : ""
            }`}
          >
            {upcomingStage.interviewSchedule.map((interview) => (
              <div key={interview.id} className={styles.upcomingInterviewRow}>
                <div className={styles.interviewTitle}>{interview.title}</div>
                <div className={styles.upcomingLabel}>To be scheduled</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderUpcomingStages = () => {
    if (!upcomingStages || upcomingStages.length === 0) return null;

    return upcomingStages.map(renderUpcomingStage);
  };

  return (
    <div className={styles.visitedStages}>
      {visitedStages.length > 0 ? (
        visitedStages.map(renderVisitedStage)
      ) : (
        <div className={styles.emptyState}>
          No interview stages have been completed yet.
        </div>
      )}
      {renderUpcomingStages()}
    </div>
  );
}
