"use client";

import { useEffect, useRef } from "react";
import { Mesh, Program, Renderer, Texture, Triangle } from "ogl";

type WarpTextProps = {
  text: string;
  className?: string;
  color?: string;
};

const vertex = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const fragment = `
precision highp float;
uniform sampler2D uText;
uniform vec2 uPointer;
uniform float uActive;
uniform float uTime;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  vec2 pointerDelta = uv - uPointer;
  float distanceToPointer = length(vec2(pointerDelta.x * 1.8, pointerDelta.y));
  float influence = smoothstep(0.42, 0.0, distanceToPointer) * uActive;
  vec2 direction = normalize(pointerDelta + vec2(0.0001));
  vec2 ambient = vec2(
    sin(uv.y * 11.0 + uTime * 0.8),
    cos(uv.x * 9.0 - uTime * 0.7)
  ) * 0.0025;
  vec2 warp = -direction * influence * (0.030 + sin(distanceToPointer * 34.0 - uTime * 5.0) * 0.006);
  vec2 displaced = uv + ambient + warp;
  vec2 split = (ambient + warp) * (0.25 + influence * 1.4);
  vec4 base = texture2D(uText, displaced);
  float red = texture2D(uText, displaced + split).r;
  float blue = texture2D(uText, displaced - split).b;
  float alpha = max(base.a, max(texture2D(uText, displaced + split).a, texture2D(uText, displaced - split).a));
  gl_FragColor = vec4(red, base.g, blue, alpha);
}`;

export function WarpText({ text, className = "", color = "#ffffff80" }: WarpTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const renderer = new Renderer({ alpha: true, antialias: true, dpr: Math.min(window.devicePixelRatio, 2) });
    const gl = renderer.gl;
    const canvas = gl.canvas;
    canvas.setAttribute("aria-hidden", "true");
    container.appendChild(canvas);

    const texture = new Texture(gl, { generateMipmaps: false, minFilter: gl.LINEAR, magFilter: gl.LINEAR });
    const program = new Program(gl, {
      vertex,
      fragment,
      transparent: true,
      uniforms: {
        uText: { value: texture },
        uPointer: { value: [0.5, 0.5] },
        uActive: { value: reduceMotion ? 0 : 0.16 },
        uTime: { value: 0 },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
    const pointer = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5, active: reduceMotion ? 0 : 0.16, targetActive: reduceMotion ? 0 : 0.16 };
    let animationFrame = 0;

    const rasterize = () => {
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const textCanvas = document.createElement("canvas");
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      textCanvas.width = Math.round(rect.width * scale);
      textCanvas.height = Math.round(rect.height * scale);
      const context = textCanvas.getContext("2d");
      if (!context) return;
      const computed = window.getComputedStyle(container);
      context.scale(scale, scale);
      context.fillStyle = color;
      context.font = `${computed.fontWeight} ${computed.fontSize} ${computed.fontFamily}`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(text, rect.width / 2, rect.height / 2);
      texture.image = textCanvas;
      texture.needsUpdate = true;
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      renderer.setSize(rect.width, rect.height);
      rasterize();
    };
    const render = (time: number) => {
      pointer.x += (pointer.targetX - pointer.x) * 0.1;
      pointer.y += (pointer.targetY - pointer.y) * 0.1;
      pointer.active += (pointer.targetActive - pointer.active) * 0.08;
      program.uniforms.uPointer.value = [pointer.x, pointer.y];
      program.uniforms.uActive.value = pointer.active;
      program.uniforms.uTime.value = reduceMotion ? 0 : time * 0.001;
      renderer.render({ scene: mesh });
      if (!reduceMotion) animationFrame = window.requestAnimationFrame(render);
    };
    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.targetX = (event.clientX - rect.left) / rect.width;
      pointer.targetY = 1 - (event.clientY - rect.top) / rect.height;
      pointer.targetActive = 1;
    };
    const onPointerLeave = () => {
      pointer.targetActive = 0.16;
    };

    const observer = new ResizeObserver(resize);
    observer.observe(container);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);
    resize();
    if (reduceMotion) render(0);
    else animationFrame = window.requestAnimationFrame(render);

    return () => {
      observer.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      window.cancelAnimationFrame(animationFrame);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
    };
  }, [color, text]);

  return <div ref={containerRef} className={`warp-text ${className}`.trim()} role="img" aria-label={text} />;
}
