import { rand, randAvatar, randFullName } from "@ngneat/falso";
import {
  Interview,
  InterviewProgress,
  InterviewStage,
  ScheduledInterview,
  VisitedInterviewStage,
  NextAction,
  UrgencySignal,
} from "./types";
import { v4 as uuid } from "uuid";
import { DateTime } from "luxon";
import {
  INTERVIEW_TITLES,
  NEXT_STAGE_INDEX,
  ORDERED_INTERVIEW_PLAN,
  VISITED_STAGES,
} from "./data";
import uniqueRandomArray from "unique-random-array";

export function generateInterviewProgress(): InterviewProgress {
  const randomInterviewTitle = uniqueRandomArray(INTERVIEW_TITLES);
  const visitedStages = [];
  var lastDate: DateTime | undefined;

  for (var i = VISITED_STAGES.length - 1; i >= 0; i--) {
    const interviewStage = VISITED_STAGES[i];

    const [visitedStage, enteredAt] = generateVisitedStage(
      interviewStage,
      lastDate
    );
    lastDate = enteredAt;

    visitedStages.push(visitedStage);
  }

  // Generate upcoming stages from the remaining stages in the interview plan
  const upcomingStages = [];
  for (let i = NEXT_STAGE_INDEX; i < ORDERED_INTERVIEW_PLAN.length; i++) {
    const interviewStage = ORDERED_INTERVIEW_PLAN[i];

    // Only add interview schedules to the immediate next stage
    const isImmediateNext = i === NEXT_STAGE_INDEX;

    upcomingStages.push({
      interviewStage,
      interviewSchedule: isImmediateNext
        ? [
            generateInterview(randomInterviewTitle()),
            generateInterview(randomInterviewTitle()),
            generateInterview(randomInterviewTitle()),
          ]
        : [],
    });
  }

  const reversedVisitedStages = visitedStages.reverse();

  // Infer next action and urgency signals
  const nextAction = inferNextAction(reversedVisitedStages, upcomingStages);
  const urgencySignals = generateUrgencySignals(
    reversedVisitedStages,
    upcomingStages
  );

  return {
    visitedStages: reversedVisitedStages,
    upcomingStages,
    nextAction,
    urgencySignals,
  };
}

function inferNextAction(
  visitedStages: VisitedInterviewStage[],
  upcomingStages: {
    interviewStage: InterviewStage;
    interviewSchedule?: Interview[];
  }[]
): NextAction {
  const eligibleActions: NextAction[] = [];

  // Get the most recent stage with interviews
  const currentStage = visitedStages[visitedStages.length - 1];

  // If we have a current stage with interviews, check feedback and RSVP status
  if (currentStage && currentStage.interviews.length > 0) {
    const recentInterviews = currentStage.interviews;

    // Check for unsubmitted feedback
    const hasUnsubmittedFeedback = recentInterviews.some((interview) =>
      interview.interviewers.some(
        (interviewer) => interviewer.score === "unsubmitted"
      )
    );

    if (hasUnsubmittedFeedback) {
      eligibleActions.push(NextAction.PING_FOR_FEEDBACK);
    }

    // Check for declined RSVPs in recent interviews
    const hasDeclinedRsvp = recentInterviews.some((interview) =>
      interview.interviewers.some(
        (interviewer) => interviewer.rsvpStatus === "declined"
      )
    );

    if (hasDeclinedRsvp) {
      eligibleActions.push(NextAction.FOLLOW_UP_RESCHEDULE);
    }
  }

  // Check if there are interviews to schedule in the next stage
  const nextStage = upcomingStages[0];
  if (nextStage?.interviewSchedule && nextStage.interviewSchedule.length > 0) {
    eligibleActions.push(NextAction.SCHEDULE_INTERVIEW);
  }

  // If no current stage or no interviews in current stage, schedule interview
  if (!currentStage || currentStage.interviews.length === 0) {
    eligibleActions.push(NextAction.SCHEDULE_INTERVIEW);
  }

  // If we have a current stage with all feedback submitted and no declined RSVPs, can make decision
  if (currentStage && currentStage.interviews.length > 0) {
    const recentInterviews = currentStage.interviews;
    const hasUnsubmittedFeedback = recentInterviews.some((interview) =>
      interview.interviewers.some(
        (interviewer) => interviewer.score === "unsubmitted"
      )
    );
    const hasDeclinedRsvp = recentInterviews.some((interview) =>
      interview.interviewers.some(
        (interviewer) => interviewer.rsvpStatus === "declined"
      )
    );

    if (!hasUnsubmittedFeedback && !hasDeclinedRsvp) {
      eligibleActions.push(NextAction.MAKE_DECISION);
    }
  }

  // If no eligible actions, default to scheduling interview
  if (eligibleActions.length === 0) {
    return NextAction.SCHEDULE_INTERVIEW;
  }

  // Randomly select from eligible actions
  return rand(eligibleActions);
}

function generateUrgencySignals(
  visitedStages: VisitedInterviewStage[],
  upcomingStages: {
    interviewStage: InterviewStage;
    interviewSchedule?: Interview[];
  }[]
): UrgencySignal[] {
  const signalsByType = {
    days_in_stage: [
      "Candidate has been in stage for 8 days",
      "Candidate has been in stage for 12 days",
      "Candidate inquiry about timeline received",
    ],
    strong_feedback: [
      "Strong positive feedback",
      "Hiring manager requested expedited process",
      "Multiple interviewers recommend advancing immediately",
    ],
    upcoming_interview_issues: [
      "Upcoming interviews have declined RSVPs - needs immediate attention",
      "Interview room conflict detected for next week",
    ],
  };

  // Randomly decide how many signals to show (0-3, max one per type)
  const signalCount = rand([0, 1, 1, 1, 2, 2, 3]);

  if (signalCount === 0) {
    return [];
  }

  // Get all available types and randomly select which types to include
  const availableTypes = Object.keys(signalsByType) as Array<
    keyof typeof signalsByType
  >;
  const selectedTypes = [];
  const typesToChooseFrom = [...availableTypes];

  for (let i = 0; i < signalCount && typesToChooseFrom.length > 0; i++) {
    const randomTypeIndex = Math.floor(
      Math.random() * typesToChooseFrom.length
    );
    selectedTypes.push(typesToChooseFrom.splice(randomTypeIndex, 1)[0]);
  }

  // For each selected type, randomly pick one message
  const selectedSignals = selectedTypes.map((type) => {
    const messages = signalsByType[type];
    const randomMessage = rand(messages) as string;
    return {
      type: type as
        | "days_in_stage"
        | "strong_feedback"
        | "upcoming_interview_issues",
      message: randomMessage,
    };
  });

  return selectedSignals;
}

const RANDOM_RSVP_STATUS = uniqueRandomArray([
  "accepted",
  "tentative",
  "declined",
]);
const RANDOM_SCORE = uniqueRandomArray([1, 2, 3, 4, "unsubmitted"]);

export function generateVisitedStage(
  interviewStage: InterviewStage,
  leftAt?: DateTime
): [VisitedInterviewStage, DateTime] {
  const enteredAtDaysAgo = rand([3, 5, 7, 14]);
  const enteredAt = (leftAt != null ? leftAt : DateTime.now()).minus({
    days: enteredAtDaysAgo,
  });

  let nextInterviewStart = (
    leftAt != null
      ? leftAt.minus({ days: 1 })
      : DateTime.now().plus({ days: 2 })
  )
    .startOf("day")
    .set({ hour: 10 });
  const interviewCount = leftAt != null ? rand([0, 1]) : 4;
  const randomInterviewTitle = uniqueRandomArray(INTERVIEW_TITLES);
  const interviews: ScheduledInterview[] = [];

  for (var i = 0; i < interviewCount; i++) {
    const interviewLength = rand([30, 45, 60, 90]);
    const interviewerCount = rand([1, 2]);

    const start = nextInterviewStart;
    const end = start.plus({ minutes: interviewLength });

    const interviewers = [];
    for (var j = 0; j < interviewerCount; j++) {
      interviewers.push({
        id: uuid(),
        user: {
          id: uuid(),
          name: randFullName(),
          profilePhotoUrl: randAvatar(),
        },
        rsvpStatus: leftAt != null ? "accepted" : RANDOM_RSVP_STATUS(),
        score: leftAt != null ? RANDOM_SCORE() : "unsubmitted",
      });
    }

    interviews.push({
      id: uuid(),
      interview: generateInterview(randomInterviewTitle()),
      startIso: start.toISO(),
      endIso: end.toISO(),
      interviewers,
    });
    nextInterviewStart = end;
  }

  return [
    {
      id: uuid(),
      interviewStage,
      enteredAtIso: enteredAt.toISO(),
      leftAtIso: leftAt && leftAt.toISO(),
      interviews,
    },
    enteredAt,
  ];
}

export function generateInterview(title: string): Interview {
  return {
    id: uuid(),
    title,
  };
}
