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
} from "../../types";
import { formatTimeSpent } from "../../utils/timeUtils";

interface InterviewHistoryProps {
  visitedStages: VisitedInterviewStage[];
}

export function InterviewHistory({ visitedStages }: InterviewHistoryProps) {
  const [expandedStages, setExpandedStages] = React.useState<Set<string>>(
    new Set()
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

    return (
      <div key={stage.id} className={styles.stageGroup}>
        <div
          className={`${styles.stageHeader} ${
            isStageExpanded(stage.id) ? styles.expanded : ""
          } ${!hasInterviews ? styles.notExpandable : ""}`}
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
            <CheckFatIcon className={styles.statusIcon} weight="fill" />
            <div className={styles.stageTitle}>
              {stage.interviewStage.title}
            </div>
            <div className={styles.expandButton}>
              {hasInterviews && (
                <motion.div
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
              <div className={styles.stageDates}>
                <ClockClockwiseIcon
                  className={styles.clockIcon}
                  weight="bold"
                />
                {formatTimeSpent(stage.enteredAtIso, stage.leftAtIso)}
              </div>
              <div className={styles.separator}>•</div>
              <div className={styles.interviewCount}>
                {stage.interviews.length === 0
                  ? "No interviews"
                  : `${stage.interviews.length} interview${
                      stage.interviews.length !== 1 ? "s" : ""
                    }`}
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

  return (
    <div className={styles.visitedStages}>
      {visitedStages.length > 0 ? (
        visitedStages.map(renderVisitedStage)
      ) : (
        <div className={styles.emptyState}>
          No interview stages have been completed yet.
        </div>
      )}
    </div>
  );
}
