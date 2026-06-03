import type { AvatarState } from "../app/components/AvatarDisplay";

/** Mapeia emoções retornadas pela API para estados do avatar. */
export function mapBackendEmotion(emotion?: string): AvatarState {
  switch (emotion?.toLowerCase()) {
    case "happy":
    case "excited":
      return "happy";
    case "thinking":
    case "confused":
      return "thinking";
    case "surprised":
      return "surprised";
    case "sad":
    case "calm":
    case "neutral":
    default:
      return "idle";
  }
}
