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
  const [agreed, setAgreed] = useState<boolean>(false);
  const [agreeError, setAgreeError] = useState<boolean>(false);
  const field = stepMotion(motion, 210);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const valid = EMAIL.test(email.trim());
    if (!valid || !agreed) {
      setError(!valid);
      setAgreeError(!agreed);
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
        sub="No spam, ever. Unsubscribe with one click at any time."
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
        <label className="mt-4 flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={agreed}
            aria-invalid={agreeError}
            aria-describedby={agreeError ? "quiz-agree-error" : undefined}
            onChange={(event) => {
              setAgreed(event.target.checked);
              setAgreeError(false);
            }}
            className="peer sr-only"
          />
          <span
            aria-hidden
            className={`mt-px flex size-[22px] shrink-0 items-center justify-center rounded-md border transition-colors duration-150 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-near-black ${
              agreed ? "border-dark bg-dark" : agreeError ? "border-red-500 bg-white" : "border-light-grey-3 bg-white"
            }`}
          >
            {agreed && (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7.5L5.8 10.2L11 4.2" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
          <span className="text-sm leading-[22px] tracking-[-0.28px] text-near-black">
            {/* TODO(lift): replace with translation key */}
            I’ve read and agree to the{" "}
            <a
              href="https://every-foods.com/en/spielregeln"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              Terms and Conditions
            </a>{" "}
            and want to receive emails from Every
          </span>
        </label>
        {agreeError && (
          <p id="quiz-agree-error" role="alert" className="mt-2 mb-0 text-sm leading-[18px] tracking-[-0.28px] text-red-500">
            {/* TODO(lift): replace with translation key */}
            Please tick the box to continue.
          </p>
        )}
      </div>
    </form>
  );
}
