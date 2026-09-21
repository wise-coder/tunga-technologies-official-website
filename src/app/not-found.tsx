import { Button, Container, SectionKicker } from "@/components/ui";
export default function NotFound() {
  return (
    <section className="error-page">
      <Container>
        <SectionKicker>404 · Page not found</SectionKicker>
        <h1>A different path forward.</h1>
        <p>
          This page may have moved, or it isn’t published yet. Let’s get you
          back to somewhere useful.
        </p>
        <div className="button-row">
          <Button href="/">Back to home</Button>
          <Button href="/solutions" variant="secondary">
            Explore solutions
          </Button>
        </div>
      </Container>
    </section>
  );
}
