import type { FlowId } from "./conversationFlows";
import { getFlowLabel } from "./conversationFlows";
import styles from "./UpiChatApp.module.css";

interface QuickSuggestionsProps {
  label: string;
  suggestions: string[];
  flowId?: FlowId | null;
  onPick: (text: string) => void;
  onShowRoots?: () => void;
  disabled?: boolean;
}

export function QuickSuggestions({
  label,
  suggestions,
  flowId,
  onPick,
  onShowRoots,
  disabled,
}: QuickSuggestionsProps) {
  if (!suggestions.length) return null;

  return (
    <div className={styles.quickWrap}>
      <div className={styles.quickHeader}>
        <p className={styles.quickLabel} id="quick-suggestions-label">
          {label}
          {flowId ? (
            <span className={styles.quickFlowTag}>
              {" "}
              · {getFlowLabel(flowId)}
            </span>
          ) : null}
        </p>
        {onShowRoots ? (
          <button
            type="button"
            className={styles.quickBackLink}
            onClick={onShowRoots}
            disabled={disabled}
          >
            Ver todas
          </button>
        ) : null}
      </div>
      <div
        className={styles.quickGrid}
        role="group"
        aria-labelledby="quick-suggestions-label"
      >
        {suggestions.map((q) => (
          <button
            key={q}
            type="button"
            className={styles.quickBtn}
            onClick={() => onPick(q)}
            disabled={disabled}
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
