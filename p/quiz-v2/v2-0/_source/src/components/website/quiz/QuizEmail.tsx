"use client";

import { useState } from "react";
import { stepMotion } from "@/lib/step-motion";
import { QuizHeading } from "./QuizHeading";
import type { StepMotion } from "./types";

type Props = {
  motion: StepMotion;
  /** On with an address or without one: either way the box comes next */
  onNext: () => void;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * The last question, in the quiz's own voice: how to reach them. Its two buttons are in the footer like every
 * other step's: "See my routine" submits this form (by its id), and "Skip" goes on without it.
 */
export function QuizEmail({ motion, onNext }: Props) {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const field = stepMotion(motion, 210);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!EMAIL.test(email.trim())) {
      setError(true);
      return;
    }
    // TODO(lift): fake — nothing is saved; production adds the address to the customer
    onNext();
  };

  return (
    <form id="quiz-email" noValidate onSubmit={submit} className="flex flex-col">
      {/* TODO(lift): replace with translation keys */}
      <QuizHeading
        title="Lastly, how can we reach you?"
        sub="We’ll only email you about Every. Unsubscribe any time."
        motion={motion}
      />
      <div className={`mt-[26px] ${field.className}`} style={field.style}>
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          aria-label="Email address"
          aria-invalid={error}
          aria-describedby={error ? "quiz-email-error" : undefined}
          placeholder="Your email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setError(false);
          }}
          className={`h-14 w-full rounded-2xl border bg-white px-4 text-[15px] tracking-[-0.3px] text-near-black outline-none placeholder:text-light-text ${
            error ? "border-red-500 ring-1 ring-red-500" : "border-light-grey focus:border-near-black"
          }`}
        />
        {error && (
          <p id="quiz-email-error" role="alert" className="mt-2 mb-0 text-sm leading-[18px] tracking-[-0.28px] text-red-500">
            {/* TODO(lift): replace with translation key */}
            That doesn’t look quite right. Could you check it?
          </p>
        )}
      </div>
    </form>
  );
}
