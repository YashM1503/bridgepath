import { useState } from "react";
import type { ChecklistItem } from "@/schemas/intake";
import { CheckSquare, Square, Calendar } from "lucide-react";

interface ChecklistPlanProps {
  items: ChecklistItem[];
}

const CATEGORY_COLORS: Record<string, string> = {
  banking: "hsl(215 65% 22%)",
  credit: "hsl(175 55% 35%)",
  transfer: "hsl(205 75% 48%)",
  documents: "hsl(210 50% 55%)",
  housing: "hsl(215 65% 30%)",
  safety: "hsl(0 65% 52%)",
};

const PRIORITY_LABELS: Record<string, string> = {
  critical: "Critical",
  high: "Important",
  medium: "Recommended",
};

export default function ChecklistPlan({ items: initialItems }: ChecklistPlanProps) {
  const [items, setItems] = useState(initialItems);

  function toggleItem(id: string) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  }

  const totalDone = items.filter((i) => i.done).length;
  const progress = Math.round((totalDone / items.length) * 100);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">30-Day Action Plan</h2>
        <span className="text-sm text-muted-foreground">{totalDone}/{items.length} done</span>
      </div>

      {/* Progress bar */}
      <div>
        <div className="score-bar mb-1">
          <div
            className="score-bar-fill"
            style={{ width: `${progress}%`, background: "hsl(var(--success))" }}
          />
        </div>
        <p className="text-xs text-muted-foreground">{progress}% complete</p>
      </div>

      {[1, 2, 3, 4].map((week) => {
        const weekItems = items.filter((i) => i.week === week);
        if (!weekItems.length) return null;
        const weekDone = weekItems.filter((i) => i.done).length;

        return (
          <div key={week} className="bp-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar size={14} style={{ color: "hsl(var(--primary))" }} />
                <h3 className="font-bold text-foreground">Week {week}</h3>
                <span className="text-xs text-muted-foreground">
                  Day {(week - 1) * 7 + 1}–{week * 7}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">{weekDone}/{weekItems.length}</span>
            </div>

            <div className="space-y-1">
              {weekItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className={`checklist-item w-full ${item.done ? "checked" : ""}`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {item.done ? (
                      <CheckSquare size={16} style={{ color: "hsl(var(--success))" }} />
                    ) : (
                      <Square size={16} className="text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className={`text-sm font-medium ${item.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {item.task}
                    </p>
                    {item.notes && !item.done && (
                      <p className="text-xs text-muted-foreground mt-0.5">{item.notes}</p>
                    )}
                  </div>
                  <div className="flex-shrink-0 flex gap-1">
                    <span
                      className="text-xs px-1.5 py-0.5 rounded font-medium"
                      style={{
                        background: `${CATEGORY_COLORS[item.category]}20`,
                        color: CATEGORY_COLORS[item.category],
                      }}
                    >
                      {item.category}
                    </span>
                    {item.priority === "critical" && (
                      <span className="text-xs px-1.5 py-0.5 rounded font-medium bg-destructive/10 text-destructive">
                        {PRIORITY_LABELS[item.priority]}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
