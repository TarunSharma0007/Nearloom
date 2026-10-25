import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

interface StrengthResult {
  score: number;       // 0-4
  label: string;
  color: string;
  feedback: string[];
}

function evaluateStrength(password: string): StrengthResult {
  const feedback: string[] = [];
  let score = 0;

  if (!password) {
    return { score: 0, label: "", color: "", feedback: [] };
  }

  // Length checks
  if (password.length >= 8) score += 1;
  else feedback.push("Use at least 8 characters");

  if (password.length >= 12) score += 1;

  // Character variety
  if (/[A-Z]/.test(password)) score += 0.5;
  else feedback.push("Add an uppercase letter");

  if (/[a-z]/.test(password)) score += 0.25;

  if (/[0-9]/.test(password)) score += 0.5;
  else feedback.push("Add a number");

  if (/[^A-Za-z0-9]/.test(password)) score += 0.75;
  else feedback.push("Add a special character (!@#$%)");

  // Penalty for common patterns
  const commonPatterns = ["password", "123456", "qwerty", "abc123", "letmein", "welcome"];
  if (commonPatterns.some((p) => password.toLowerCase().includes(p))) {
    score = Math.max(0, score - 2);
    feedback.push("Avoid common password patterns");
  }

  // Penalty for repeated characters
  if (/(.)\1{2,}/.test(password)) {
    score = Math.max(0, score - 0.5);
    feedback.push("Avoid repeated characters");
  }

  // Normalize score to 0-4
  const normalizedScore = Math.min(4, Math.max(0, Math.round(score)));

  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = [
    "",
    "strength-weak",
    "strength-fair",
    "strength-good",
    "strength-strong",
  ];

  return {
    score: normalizedScore,
    label: labels[normalizedScore],
    color: colors[normalizedScore],
    feedback: feedback.slice(0, 2), // Show max 2 tips
  };
}

export function PasswordStrength({ password, className }: PasswordStrengthProps) {
  const strength = useMemo(() => evaluateStrength(password), [password]);

  if (!password) return null;

  return (
    <div className={cn("space-y-2", className)}>
      {/* Strength bar */}
      <div className="flex items-center gap-3">
        <div className="flex flex-1 gap-1.5">
          {[1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-all duration-500",
                level <= strength.score ? strength.color : "bg-foreground/10"
              )}
            />
          ))}
        </div>
        {strength.label && (
          <span
            className={cn(
              "text-[10px] font-bold uppercase tracking-wider transition-colors",
              strength.score <= 1 && "text-destructive",
              strength.score === 2 && "text-amber-500",
              strength.score === 3 && "text-emerald-500",
              strength.score === 4 && "text-emerald-600 dark:text-emerald-400"
            )}
          >
            {strength.label}
          </span>
        )}
      </div>

      {/* Feedback tips */}
      {strength.feedback.length > 0 && (
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {strength.feedback.map((tip) => (
            <span
              key={tip}
              className="text-[11px] text-muted-foreground"
            >
              • {tip}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
