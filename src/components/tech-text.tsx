"use client";

import { useEffect, useRef } from "react";

type TechTextProps = {
  text: string;
  className?: string;
  color?: string;
  accentColor?: string;
};

type Glyph = {
  char: string;
  x: number;
  width: number;
};

const rgba = (hex: string, opacity: number) => {
  const value = hex.replace("#", "");
  const normalized = value.length === 3
    ? value.split("").map((part) => part + part).join("")
    : value;
  const number = Number.parseInt(normalized.slice(0, 6), 16);
  const red = (number >> 16) & 255;
  const green = (number >> 8) & 255;
  const blue = number & 255;
  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
};

export function TechText({
  text,
  className = "",
  color = "#e3f0ff",
  accentColor = "#87bafa",
}: TechTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!container || !canvas || !context) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: -1000, y: -1000, active: false };
    let frame = 0;
    let width = 1;
    let height = 1;
    let dpr = 1;
    let glyphs: Glyph[] = [];
    let font = "";
    let baseline = 0;
    let animationStart = performance.now();

    const layout = () => {
      const styles = window.getComputedStyle(container);
      const size = Number.parseFloat(styles.fontSize) || 150;
      const weight = styles.fontWeight || "600";
      const family = styles.fontFamily || "sans-serif";
      font = `${weight} ${size}px ${family}`;
      context.font = font;
      (context as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing =
        styles.letterSpacing;
      context.textBaseline = "alphabetic";

      const metrics = context.measureText(text);
      const textWidth = metrics.width;
      const ascent = metrics.actualBoundingBoxAscent || size * 0.75;
      const descent = metrics.actualBoundingBoxDescent || size * 0.2;
      const startX = (width - textWidth) / 2;
      baseline = (height - (ascent + descent)) / 2 + ascent;
      let x = startX;
      glyphs = Array.from(text).map((char) => {
        const glyphWidth = context.measureText(char).width;
        const glyph = { char, x, width: glyphWidth };
        x += glyphWidth;
        return glyph;
      });
    };

    const resize = () => {
      width = Math.max(1, container.clientWidth);
      height = Math.max(1, container.clientHeight);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      layout();
    };

    const render = (now: number) => {
      frame = 0;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);
      context.font = font;
      context.textBaseline = "alphabetic";
      context.fillStyle = color;
      context.fillText(text, glyphs[0]?.x ?? width / 2, baseline);

      const sweepX = reducedMotion ? -1000 : ((Math.sin((now - animationStart) / 1900) + 1) / 2) * width;
      const focusX = pointer.active ? pointer.x : sweepX;
      const focusedIndex = glyphs.findIndex(
        (glyph) => focusX >= glyph.x - 8 && focusX <= glyph.x + glyph.width + 8,
      );
      const glyph = glyphs[focusedIndex];

      if (glyph && glyph.char.trim()) {
        const size = Number.parseFloat(window.getComputedStyle(container).fontSize) || 150;
        const top = baseline - size * 0.78;
        const boxHeight = size * 0.98;
        const boxX = glyph.x - 7;
        const boxWidth = glyph.width + 14;

        context.clearRect(boxX - 2, top - 22, boxWidth + 4, boxHeight + 30);
        context.save();
        context.beginPath();
        context.rect(boxX - 1, top - 1, boxWidth + 2, boxHeight + 2);
        context.clip();
        context.setLineDash([4, 3]);
        context.lineWidth = 1.5;
        context.strokeStyle = color;
        context.strokeText(glyph.char, glyph.x, baseline);
        context.restore();

        context.strokeStyle = rgba(accentColor, 0.85);
        context.lineWidth = 1;
        context.strokeRect(boxX + 0.5, top + 0.5, boxWidth, boxHeight);
        context.fillStyle = accentColor;
        for (const [x, y] of [[boxX, top], [boxX + boxWidth, top], [boxX, top + boxHeight], [boxX + boxWidth, top + boxHeight]]) {
          context.fillRect(x - 2, y - 2, 4, 4);
        }
        context.font = "10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
        context.fillStyle = rgba(accentColor, 0.9);
        context.fillText(`${glyph.char}  ${Math.round(glyph.width)} px`, boxX, top - 8);
      }

      if (!reducedMotion || pointer.active) frame = window.requestAnimationFrame(render);
    };

    const updatePointer = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
      if (!frame) frame = window.requestAnimationFrame(render);
    };
    const clearPointer = () => {
      pointer.active = false;
      if (!reducedMotion && !frame) frame = window.requestAnimationFrame(render);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(container);
    container.addEventListener("pointermove", updatePointer, { passive: true });
    container.addEventListener("pointerenter", updatePointer, { passive: true });
    container.addEventListener("pointerleave", clearPointer);
    resize();
    frame = window.requestAnimationFrame(render);

    return () => {
      observer.disconnect();
      container.removeEventListener("pointermove", updatePointer);
      container.removeEventListener("pointerenter", updatePointer);
      container.removeEventListener("pointerleave", clearPointer);
      window.cancelAnimationFrame(frame);
    };
  }, [accentColor, color, text]);

  return (
    <div ref={containerRef} className={`tech-text ${className}`.trim()} role="img" aria-label={text}>
      <canvas ref={canvasRef} className="tech-text-canvas" aria-hidden="true" />
    </div>
  );
}
