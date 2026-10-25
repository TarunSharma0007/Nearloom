import { Navbar } from "@/components/Navbar";
import { SiteFooter } from "@/components/SiteFooter";
import { Card } from "@/components/ui/card";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />

      <div className="container mx-auto px-4 pt-20 pb-16 md:pt-28 md:pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-6 mb-12 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-display font-bold">
              Terms of Service
            </h1>
            <p className="text-lg text-muted-foreground">
              Last updated: August 2026
            </p>
          </div>

          <Card className="p-8 md:p-12 space-y-8 backdrop-blur-sm bg-card/50 border-border/50 animate-fade-in">
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using Nearloom ("the Platform"), you accept and agree to be bound by the terms
                and provision of this agreement. If you do not agree to these Terms of Service, please do not
                use the Platform.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold">2. Description of Service</h2>
              <p className="text-muted-foreground leading-relaxed">
                Nearloom provides a platform for discovering and listing local communities. We facilitate connections
                between community seekers and community organizers but do not manage or operate the communities
                themselves.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold">3. User Responsibilities</h2>
              <div className="space-y-3 text-muted-foreground">
                <p className="leading-relaxed">Users agree to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide accurate and truthful information</li>
                  <li>Maintain the security of their account</li>
                  <li>Not impersonate others or misrepresent affiliations</li>
                  <li>Not use the platform for illegal purposes</li>
                  <li>Respect the intellectual property rights of others</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold">4. Community Listings</h2>
              <p className="text-muted-foreground leading-relaxed">
                Community organizers are responsible for the accuracy of their listings. Nearloom reserves the right
                to remove or modify listings that violate our guidelines, contain false information, or are
                deemed inappropriate.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold">5. User Content</h2>
              <p className="text-muted-foreground leading-relaxed">
                You retain ownership of content you submit to Nearloom. By posting content, you grant Nearloom a
                non-exclusive, worldwide, royalty-free license to use, display, and distribute your content
                on the Platform.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold">6. Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your use of the Platform is also governed by our Privacy Policy. Please review our Privacy
                Policy to understand our practices regarding your personal information.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold">7. Prohibited Activities</h2>
              <div className="space-y-3 text-muted-foreground">
                <p className="leading-relaxed">Users may not:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Engage in spamming or unsolicited advertising</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Distribute malware or harmful code</li>
                  <li>Scrape or copy content without permission</li>
                  <li>Interfere with the Platform's operation</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold">8. Disclaimer of Warranties</h2>
              <p className="text-muted-foreground leading-relaxed">
                The Platform is provided "as is" without warranties of any kind. Nearloom does not guarantee the
                accuracy, completeness, or usefulness of any information on the Platform.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold">9. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                Nearloom shall not be liable for any indirect, incidental, special, consequential, or punitive
                damages resulting from your use of the Platform.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold">10. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these terms at any time. Continued use of the Platform after
                changes constitutes acceptance of the modified terms.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold">11. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about these Terms of Service, please contact us at legal@nearloom.app
              </p>
            </section>
          </Card>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
};

export default Terms;
