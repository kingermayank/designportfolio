"use client";

import { TextLoop } from "@/components/core/text-loop";
import { CURRENTLY_ABOUT } from "@/lib/currentlyStatus";

type CurrentlyStatusProps = {
  className?: string;
};

const LOOP_VARIANTS = {
  initial: {
    y: 20,
    rotateX: 90,
    opacity: 0,
    filter: "blur(4px)",
  },
  animate: {
    y: 0,
    rotateX: 0,
    opacity: 1,
    filter: "blur(0px)",
  },
  exit: {
    y: -20,
    rotateX: -90,
    opacity: 0,
    filter: "blur(4px)",
  },
};

export default function CurrentlyStatus({
  className = "aboutCurrently",
}: CurrentlyStatusProps) {
  return (
    <p className={className}>
      Currently{" "}
      <TextLoop
        className="workCurrentlyLoop"
        interval={3}
        transition={{
          type: "spring",
          stiffness: 900,
          damping: 80,
          mass: 10,
        }}
        variants={LOOP_VARIANTS}
      >
        {CURRENTLY_ABOUT.map((phrase) => (
          <span key={phrase}>{phrase}</span>
        ))}
      </TextLoop>
    </p>
  );
}
