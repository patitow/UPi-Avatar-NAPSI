import { motion } from "motion/react";

export type AvatarState =
  | "idle"
  | "thinking"
  | "talking"
  | "happy"
  | "surprised";

interface AvatarDisplayProps {
  state: AvatarState;
  isLoginScreen?: boolean;
}

const stateToAsset = {
  idle: "/assets/static_sprites/showing_computer_idle.png",
  thinking: "/assets/animated_sprites/thinking.gif",
  talking: "/assets/animated_sprites/waving.gif",
  happy: "/assets/animated_sprites/celebrating.gif",
  surprised: "/assets/animated_sprites/unsure.gif",
  investigating: "/assets/animated_sprites/investigating.gif",
};

export function AvatarDisplay({ state, isLoginScreen }: AvatarDisplayProps) {
  const assetUrl = stateToAsset[state] || stateToAsset.idle;

  return (
    <div className={`relative ${isLoginScreen ? "w-full h-full" : ""}`}>
      {/* Glow effect */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full blur-3xl opacity-30`}
        animate={{
          scale:
            state === "thinking"
              ? [1, 1.2, 1]
              : state === "talking" || isLoginScreen
                ? [1, 1.1, 1]
                : 1,
          opacity: state === "idle" ? 0.3 : 0.5,
        }}
        transition={{
          duration: state === "thinking" ? 2 : state === "talking" ? 0.8 : 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Avatar Container with Masking for Login */}
      <motion.div
        animate={{
          y: state === "idle" || isLoginScreen ? [0, -8, 0] : 0,
          rotate: state === "thinking" ? [0, -5, 5, -5, 0] : 0,
        }}
        transition={{
          duration: state === "idle" || isLoginScreen ? 3 : 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`relative ${isLoginScreen ? "w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-white shadow-inner border-4 border-white" : ""}`}
      >
        <img
          src={assetUrl}
          key={assetUrl} // Force re-render for GIFs
          alt="UPi"
          className={`${isLoginScreen ? "w-full h-full object-cover scale-[1.05] translate-y-1" : "w-full h-full object-contain"} drop-shadow-2xl relative z-10`}
        />
      </motion.div>

      {/* Status Indicator */}
      {state !== "idle" && !isLoginScreen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-4 py-1.5 rounded-full shadow-lg"
        >
          <span className="text-xs text-slate-600">
            {state === "thinking" ? "Pensando..." : "Digitando..."}
          </span>
        </motion.div>
      )}
    </div>
  );
}
