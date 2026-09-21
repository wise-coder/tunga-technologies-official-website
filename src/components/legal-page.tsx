import { legal } from "@/content/legal";
import { Container, Hero } from "./ui";

export function LegalPage({ kind }: { kind: "privacy" | "terms" }) {
  const privacy = kind === "privacy";
  return (
    <>
      <Hero
        kicker="Tunga Technologies"
        title={privacy ? "Privacy notice." : "Website terms."}
        description={
          privacy
            ? "How information shared through this website is intended to be handled."
            : "Information about this website and links to Tunga products."
        }
      />
      <section className="section">
        <Container>
          <div className="legal-body">
            {!legal.approved && (
              <div className="legal-banner">
                <strong>Draft — pending company review.</strong>
                <p>
                  This notice is not final. Online enquiry delivery remains
                  unavailable until the approved privacy notice and contact
                  channel are in place.
                </p>
              </div>
            )}
            {legal[kind].map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                <p>{section.text}</p>
              </section>
            ))}
            {privacy && (
              <>
                <section>
                  <h2>Retention</h2>
                  <p>
                    {legal.retention ||
                      "The enquiry retention period has not yet been confirmed. It must be specified in the approved notice before online enquiries are enabled."}
                  </p>
                </section>
                <section>
                  <h2>Questions about your information</h2>
                  <p>
                    {legal.privacyContact ? (
                      <>
                        Contact{" "}
                        <a href={`mailto:${legal.privacyContact}`}>
                          {legal.privacyContact}
                        </a>{" "}
                        about information you have shared.
                      </>
                    ) : (
                      "The company’s privacy contact has not yet been confirmed. Contact details will be published in the approved notice."
                    )}
                  </p>
                </section>
              </>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
