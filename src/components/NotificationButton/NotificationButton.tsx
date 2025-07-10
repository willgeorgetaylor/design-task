import styles from "./NotificationButton.module.scss";
import bellAnimation from "../../assets/animations/bell.json";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { useRef, useState } from "react";

export function NotificationButton() {
  const animationRef = useRef<LottieRefCurrentProps>(null);

  return (
    <button
      className={styles.notificationButton}
      onMouseEnter={() => animationRef.current?.goToAndPlay(0)}
    >
      <Lottie
        style={{ width: 18, height: 18 }}
        className={styles.bellAnimation}
        animationData={bellAnimation}
        loop={false}
        autoplay={false}
        lottieRef={animationRef}
      />
      Notifications
    </button>
  );
}
