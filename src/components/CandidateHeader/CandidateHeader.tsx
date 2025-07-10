import styles from "./CandidateHeader.module.scss";
import willAvatar from "../../assets/will.jpeg";
import { CaretLeftIcon } from "@phosphor-icons/react";

export function CandidateHeader() {
  return (
    <div className={styles.candidateHeader}>
      <div className={styles.breadcrumb}>
        <a href="#" className={styles.breadcrumbLink}>
          <CaretLeftIcon
            size={12}
            className={styles.breadcrumbIcon}
            weight="bold"
          />
          Back to Candidates
        </a>
      </div>
      <div className={styles.candidateInfo}>
        <img
          src={willAvatar}
          alt="Will Taylor"
          className={styles.avatar}
          draggable={false}
        />
        <h1 className={styles.candidateName}>Will Taylor</h1>
      </div>
    </div>
  );
}
