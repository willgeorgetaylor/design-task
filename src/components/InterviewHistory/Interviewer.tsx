import * as React from "react";
import {
  CheckIcon,
  QuestionMarkIcon,
  XIcon,
  MinusIcon,
} from "@phosphor-icons/react";
import styles from "./InterviewHistory.module.scss";
import { Interviewer as InterviewerType } from "../../types";

interface InterviewerProps {
  interviewer: InterviewerType;
  index: number;
}

export function Interviewer({ interviewer, index }: InterviewerProps) {
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

  return (
    <div className={styles.interviewer}>
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
}
