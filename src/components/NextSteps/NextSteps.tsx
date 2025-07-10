import * as React from "react";
import styles from "./NextSteps.module.scss";
import { NextAction, UrgencySignal } from "../../types";
import {
  Clock,
  ClockIcon,
  CrossIcon,
  Star,
  StarIcon,
  Warning,
  XIcon,
} from "@phosphor-icons/react";

interface NextStepsProps {
  nextAction: NextAction;
  urgencySignals: UrgencySignal[];
}

export function NextSteps({ nextAction, urgencySignals }: NextStepsProps) {
  const getNextActionLabel = (action: NextAction): string => {
    switch (action) {
      case NextAction.SCHEDULE_INTERVIEW:
        return "Schedule Interview";
      case NextAction.FOLLOW_UP_RESCHEDULE:
        return "Reschedule";
      case NextAction.PING_FOR_FEEDBACK:
        return "Collect Feedback";
      case NextAction.MAKE_DECISION:
        return "Submit Response";
      default:
        return "Review Progress";
    }
  };

  const getNextActionDescription = (action: NextAction): string => {
    switch (action) {
      case NextAction.SCHEDULE_INTERVIEW:
        return "Schedule the next interview with available team members.";
      case NextAction.FOLLOW_UP_RESCHEDULE:
        return "Contact interviewers who declined and reschedule interviews.";
      case NextAction.PING_FOR_FEEDBACK:
        return "Follow up with interviewers to submit their feedback.";
      case NextAction.MAKE_DECISION:
        return "Review feedback and decide on moving to the next stage.";
      default:
        return "Review the candidate's current progress.";
    }
  };

  const getUrgencyIcon = (type: UrgencySignal["type"]) => {
    switch (type) {
      case "strong_feedback":
        return (
          <StarIcon size={16} weight="bold" color="var(--colorWarning600)" />
        );
      case "upcoming_interview_issues":
        return (
          <XIcon size={16} weight="bold" color="var(--colorNegative600)" />
        );
      default:
        return (
          <ClockIcon size={16} weight="bold" color="var(--colorNeutral700)" />
        );
    }
  };

  return (
    <div className={styles.nextStepsContainer}>
      <h2 className={styles.title}>Next Step</h2>

      <div className={styles.nextActionContainer}>
        <h3 className={styles.nextActionTitle}>
          {getNextActionLabel(nextAction)}
        </h3>
        <p className={styles.nextActionDescription}>
          {getNextActionDescription(nextAction)}
        </p>
        <button className={styles.nextActionButton}>
          {getNextActionLabel(nextAction)}
        </button>
      </div>

      {urgencySignals.length > 0 && (
        <div className={styles.urgencyContainer}>
          <div className={styles.urgencyTitleContainer}>
            <h4 className={styles.urgencyTitle}>Take action soon</h4>
            <div className={styles.urgencyDot}></div>
          </div>
          <ul className={styles.urgencyList}>
            {urgencySignals.map((signal, index) => (
              <li key={index} className={styles.urgencyItem}>
                <div className={styles.urgencyContent}>
                  <div className={styles.urgencyIcon}>
                    {getUrgencyIcon(signal.type)}
                  </div>
                  <span className={styles.urgencyMessage}>
                    {signal.message}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
