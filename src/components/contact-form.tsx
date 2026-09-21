"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";
import { partnershipTypes } from "@/content/site";
import {
  contactTopics,
  validateEnquiry,
  type Enquiry,
  type EnquiryKind,
  type FieldErrors,
} from "@/lib/enquiry";

export function ContactForm({
  kind = "contact",
  available,
  initialTopic = "",
}: {
  kind?: EnquiryKind;
  available: boolean;
  initialTopic?: string;
}) {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const form = useRef<HTMLFormElement>(null);
  const result = useRef<HTMLDivElement>(null);
  const select = useRef<HTMLSelectElement>(null);
  const submitting = useRef(false);
  useEffect(() => {
    if (select.current) select.current.value = initialTopic;
  }, [initialTopic]);
  useEffect(() => {
    if (status === "success") result.current?.focus();
  }, [status]);
  const partnership = kind === "partnership";
  const options = partnership
    ? partnershipTypes.map((type) => type.title)
    : contactTopics;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const data = new FormData(event.currentTarget);
    const get = (key: string) => String(data.get(key) || "").trim();
    const enquiry: Enquiry = {
      kind,
      name: get("name"),
      organization: get("organization"),
      role: get("role"),
      email: get("email"),
      phone: get("phone"),
      topic: get("topic"),
      message: get("message"),
      consent: data.get("consent") === "on",
      website: get("website"),
    };
    const nextErrors = validateEnquiry(enquiry);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setStatus("idle");
      const first = Object.keys(nextErrors)[0];
      form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    submitting.current = true;
    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enquiry),
        signal: AbortSignal.timeout(15000),
      });
      const payload = await response.json();
      if (!response.ok) {
        if (payload.errors) setErrors(payload.errors);
        throw new Error(
          payload.message ||
            "Your message could not be sent. Please try again.",
        );
      }
      setStatus("success");
      form.current?.reset();
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error && error.name !== "TimeoutError"
          ? error.message
          : "The connection timed out. Please try again shortly.",
      );
    } finally {
      submitting.current = false;
    }
  }

  const errorFor = (key: keyof Enquiry) =>
    errors[key] ? (
      <p id={`${kind}-${key}-error`} className="field-error">
        {errors[key]}
      </p>
    ) : null;
  const input = (
    name: "name" | "organization" | "role" | "email" | "phone",
    label: string,
    autoComplete: string,
    optional = false,
    type = "text",
  ) => (
    <div className="field">
      <label htmlFor={`${kind}-${name}`}>
        {label}
        {optional && <span> (optional)</span>}
      </label>
      <input
        id={`${kind}-${name}`}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={!optional}
        maxLength={name === "phone" ? 40 : 200}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `${kind}-${name}-error` : undefined}
      />
      {errorFor(name)}
    </div>
  );

  if (status === "success")
    return (
      <div className="form-success" ref={result} tabIndex={-1} role="status">
        <CheckCircle2 size={38} strokeWidth={1.5} aria-hidden="true" />
        <h3>Thank you for reaching out.</h3>
        <p>
          Our team will review your message and respond through the contact
          details you provided.
        </p>
        <button
          className="button button-secondary"
          type="button"
          onClick={() => {
            setStatus("idle");
            setErrors({});
          }}
        >
          Send another message
          <ArrowRight size={17} aria-hidden="true" />
        </button>
      </div>
    );

  return (
    <form
      className="contact-form"
      ref={form}
      onSubmit={submit}
      noValidate
      aria-label={partnership ? "Partnership enquiry" : "Contact enquiry"}
      aria-busy={status === "loading"}
    >
      {!available && (
        <p className="form-unavailable">
          Online enquiries are not available yet. This form will accept messages
          once our contact channel and privacy notice are ready.
        </p>
      )}
      <div className="honeypot" aria-hidden="true">
        <label htmlFor={`${kind}-website`}>Leave this field empty</label>
        <input
          id={`${kind}-website`}
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <div className="form-grid">
        {input("name", "Name", "name")}
        {input("organization", "Organization", "organization", !partnership)}
        {partnership && input("role", "Role / title", "organization-title")}
        {input("email", "Email", "email", false, "email")}
        {input("phone", "Phone", "tel", true, "tel")}
        <div className={`field ${partnership ? "" : "field-wide"}`}>
          <label htmlFor={`${kind}-topic`}>
            {partnership ? "Partnership type" : "Topic"}
          </label>
          <select
            ref={select}
            id={`${kind}-topic`}
            name="topic"
            required
            defaultValue={initialTopic}
            aria-invalid={Boolean(errors.topic)}
            aria-describedby={errors.topic ? `${kind}-topic-error` : undefined}
          >
            <option value="">
              Select {partnership ? "a partnership type" : "a topic"}
            </option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errorFor("topic")}
        </div>
        <div className="field field-wide">
          <label htmlFor={`${kind}-message`}>
            {partnership ? "What would you like to explore?" : "Message"}
          </label>
          <textarea
            id={`${kind}-message`}
            name="message"
            rows={5}
            required
            minLength={20}
            maxLength={5000}
            placeholder={
              partnership
                ? "Tell us about the challenge, your organization and how we could work together."
                : "Tell us a little about what you have in mind."
            }
            aria-invalid={Boolean(errors.message)}
            aria-describedby={
              errors.message ? `${kind}-message-error` : undefined
            }
          />
          {errorFor("message")}
        </div>
      </div>
      <label className="form-consent" htmlFor={`${kind}-consent`}>
        <input
          type="checkbox"
          name="consent"
          id={`${kind}-consent`}
          required
          aria-invalid={Boolean(errors.consent)}
          aria-describedby={
            errors.consent ? `${kind}-consent-error` : undefined
          }
        />
        <span>
          I agree that Tunga Technologies may use these details to respond to my
          enquiry, as described in the{" "}
          <Link href="/privacy">privacy notice</Link>.
        </span>
      </label>
      {errorFor("consent")}
      <button
        type="submit"
        className="button button-primary form-submit"
        disabled={status === "loading"}
      >
        {status === "loading" ? (
          <>
            <LoaderCircle size={18} aria-hidden="true" />
            Sending your message…
          </>
        ) : (
          <>
            Send {partnership ? "enquiry" : "message"}
            <ArrowRight size={18} aria-hidden="true" />
          </>
        )}
      </button>
      {status === "error" && (
        <div className="form-status form-status-error" role="alert">
          {message}
        </div>
      )}
    </form>
  );
}
