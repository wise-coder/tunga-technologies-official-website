"use client";

import { useRef } from "react";
import { Plus } from "lucide-react";

const DURATION = 340;
const EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

// A native <details> disclosure whose answer slides open and closed.
// The element stays a real <details>, so keyboard and screen reader behaviour is unchanged.
export function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const details = useRef<HTMLDetailsElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const animation = useRef<Animation | null>(null);

  function toggle(event: React.MouseEvent) {
    const item = details.current;
    const panel = content.current;
    if (!item || !panel) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    event.preventDefault();

    const opening = !item.open || item.classList.contains("is-closing");
    // A closed <details> still lays out its content, so start from zero when closed.
    const from = item.open ? panel.getBoundingClientRect().height : 0;
    animation.current?.cancel();

    if (opening) {
      item.classList.remove("is-closing");
      item.open = true;
    } else {
      item.classList.add("is-closing");
    }
    const to = opening ? panel.scrollHeight : 0;
    const running = panel.animate(
      [
        { height: `${from}px`, opacity: opening ? 0.4 : 1 },
        { height: `${to}px`, opacity: opening ? 1 : 0 },
      ],
      { duration: DURATION, easing: EASING },
    );
    animation.current = running;
    running.onfinish = () => {
      animation.current = null;
      if (!opening) {
        item.open = false;
        item.classList.remove("is-closing");
      }
    };
  }

  return (
    <details ref={details}>
      <summary onClick={toggle}>
        {question}
        <Plus size={19} aria-hidden="true" />
      </summary>
      <div className="faq-answer" ref={content}>
        <p>{answer}</p>
      </div>
    </details>
  );
}
