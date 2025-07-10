import styles from "./ProfileButton.module.scss";
import abhikAvatar from "../../assets/abhik.jpeg";
import { CaretDown } from "@phosphor-icons/react";
import { motion } from "motion/react";

export function ProfileButton() {
  return (
    <motion.button
      className={styles.profileButton}
      whileHover="hover"
      initial="initial"
    >
      <div className={styles.avatarContainer}>
        <motion.div
          className={styles.avatarCircle}
          variants={{
            initial: { scale: 0.8, opacity: 0.2 },
            hover: { scale: 1, opacity: 1 },
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 24,
          }}
        />
        <img
          src={abhikAvatar}
          alt="Profile"
          className={styles.avatar}
          draggable={false}
        />
      </div>
      <div className={styles.name}>Abhik Pramanik</div>
      <motion.div
        variants={{
          initial: { color: "var(--colorNeutral600)" },
          hover: { color: "var(--colorPrimary600)" },
        }}
        transition={{ duration: 0.2 }}
      >
        <CaretDown size={12} className={styles.downArrow} weight="bold" />
      </motion.div>
    </motion.button>
  );
}
