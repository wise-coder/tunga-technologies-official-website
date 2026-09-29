"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number;
};

const BASE_BLUE = "#07396e";
const MAX_DEVICE_PIXEL_RATIO = 2;

// A lightweight, dependency-free particle mesh inspired by the requested
// Particle Drift treatment. The mesh uses white as its pointer interaction color.
export function HeroLandscape() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const hero = canvas.closest<HTMLElement>(".home-hero");
    const context = canvas.getContext("2d");
    if (!hero || !context) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: -Infinity, y: -Infinity };
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let animationFrame = 0;

    const createParticles = () => {
      const count = Math.min(165, Math.max(65, Math.round((width * height) / 14500)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const resize = () => {
      const bounds = hero.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      const pixelRatio = Math.min(window.devicePixelRatio || 1, MAX_DEVICE_PIXEL_RATIO);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      createParticles();
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      context.fillStyle = BASE_BLUE;
      context.fillRect(0, 0, width, height);

      for (const particle of particles) {
        if (!reducedMotion) {
          particle.x += particle.vx + Math.sin(frame * 0.005 + particle.phase) * 0.08;
          particle.y += particle.vy + Math.cos(frame * 0.004 + particle.phase) * 0.08;
          if (particle.x < -8) particle.x = width + 8;
          if (particle.x > width + 8) particle.x = -8;
          if (particle.y < -8) particle.y = height + 8;
          if (particle.y > height + 8) particle.y = -8;
        }
      }

      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index];
        const pointerDistance = Math.hypot(particle.x - pointer.x, particle.y - pointer.y);
        const highlight = Math.max(0, 1 - pointerDistance / 180);

        for (let nextIndex = index + 1; nextIndex < particles.length; nextIndex += 1) {
          const next = particles[nextIndex];
          const distance = Math.hypot(particle.x - next.x, particle.y - next.y);
          if (distance > 108) continue;

          const nextHighlight = Math.max(
            0,
            1 - Math.hypot(next.x - pointer.x, next.y - pointer.y) / 180,
          );
          const brightness = Math.max(highlight, nextHighlight);
          context.beginPath();
          context.moveTo(particle.x, particle.y);
          context.lineTo(next.x, next.y);
          context.strokeStyle = `rgba(255, 255, 255, ${0.055 + brightness * 0.28})`;
          context.lineWidth = 0.65 + brightness * 0.55;
          context.stroke();
        }

        context.beginPath();
        context.arc(particle.x, particle.y, 1.15 + highlight * 1.45, 0, Math.PI * 2);
        context.fillStyle = `rgba(255, 255, 255, ${0.34 + highlight * 0.66})`;
        context.fill();
      }
    };

    const animate = () => {
      frame += 1;
      draw();
      animationFrame = window.requestAnimationFrame(animate);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = hero.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
    };

    const handlePointerLeave = () => {
      pointer.x = -Infinity;
      pointer.y = -Infinity;
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(hero);
    hero.addEventListener("pointermove", handlePointerMove);
    hero.addEventListener("pointerleave", handlePointerLeave);
    resize();

    if (reducedMotion) {
      draw();
    } else {
      animate();
    }

    return () => {
      resizeObserver.disconnect();
      hero.removeEventListener("pointermove", handlePointerMove);
      hero.removeEventListener("pointerleave", handlePointerLeave);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className="hero-landscape hero-particle-drift" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
