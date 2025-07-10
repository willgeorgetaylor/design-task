import * as React from "react";
import styles from "./InterviewHistory.module.scss";
import { ScheduledInterview } from "../../types";
import { Interviewer } from "./Interviewer";

interface InterviewProps {
  interview: ScheduledInterview;
}

export function Interview({ interview }: InterviewProps) {
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

  return (
    <div className={styles.interviewRow}>
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
        {interview.interviewers.map((interviewer, index) => (
          <Interviewer
            key={interviewer.id}
            interviewer={interviewer}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
