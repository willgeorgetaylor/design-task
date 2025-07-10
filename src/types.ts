/** An interview stage in an interview plan */
export interface InterviewStage {
  id: string;
  title: string;
}

/** An interview that can be scheduled */
export interface Interview {
  id: string;
  title: string;
}

/** A user */
export interface User {
  id: string;
  name: string;
  profilePhotoUrl: string;
}

/**
 * Historical score given by an interviewer
 */
export interface Interviewer {
  id: string;
  user: User;
  /** The user's RSVP status from their calendar. Undefined if no response yet. */
  rsvpStatus?: "accepted" | "tenative" | "declined";
  score?: 1 | 2 | 3 | 4 | "unsubmitted";
}

/** An interview that already happened */
export interface ScheduledInterview {
  id: string;
  interview: Interview;
  startIso: string;
  endIso: string;
  interviewers: Interviewer[];
}

/** An interview stage that was visted by a candidate */
export interface VisitedInterviewStage {
  id: string;
  interviewStage: InterviewStage;
  enteredAtIso: string;
  leftAtIso?: string;
  interviews: ScheduledInterview[];
}

/** What the recruiter needs to do next to move the candidate forward */
export enum NextAction {
  SCHEDULE_INTERVIEW = "schedule_interview",
  FOLLOW_UP_RESCHEDULE = "follow_up_reschedule",
  PING_FOR_FEEDBACK = "ping_for_feedback",
  MAKE_DECISION = "make_decision",
}

/** Signals that indicate urgency for taking the next action */
export interface UrgencySignal {
  type: "days_in_stage" | "strong_feedback" | "upcoming_interview_issues";
  message: string;
}

export interface InterviewProgress {
  /** Interview stages that the candidate has been through */
  visitedStages: VisitedInterviewStage[];
  /** The upcoming stages the candidate is expected to move through */
  upcomingStages: {
    interviewStage: InterviewStage;
    /** Potential interview schedules that need to be scheduled. Can be empty. */
    interviewSchedule?: Interview[];
  }[];
  /** What the recruiter needs to do next */
  nextAction: NextAction;
  /** Signals indicating urgency for the next action */
  urgencySignals: UrgencySignal[];
}
