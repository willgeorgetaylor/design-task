import { CandidateProgress } from "./components/CandidateProgress";
import { CandidateHeader } from "./components/CandidateHeader";
import { Navbar } from "./components/Navbar";
import styles from "./App.module.scss";
import { generateInterviewProgress } from "./generate";

export function App() {
  const interviewProgress = generateInterviewProgress();
  return (
    <div className={styles.app}>
      <Navbar />
      <main className={styles.content}>
        <CandidateHeader />
        <CandidateProgress data={interviewProgress} />
      </main>
    </div>
  );
}
