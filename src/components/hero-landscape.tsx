import Image from "next/image";

export function HeroLandscape() {
  return (
    <div className="hero-landscape" aria-hidden="true">
      <Image
        src="/hero-landscape.png"
        alt=""
        fill
        sizes="100vw"
        preload
      />
    </div>
  );
}
