import { Navbar } from "@/components/Navbar";
import { SiteFooter } from "@/components/SiteFooter";
import { Card } from "@/components/ui/card";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />

      <div className="container mx-auto px-4 pt-20 pb-16 md:pt-28 md:pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-6 mb-12 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-display font-bold">
              Privacy Policy
            </h1>
            <p className="text-lg text-muted-foreground">
              Last updated: August 2026
            </p>
          </div>

          <Card className="p-8 md:p-12 space-y-8 backdrop-blur-sm bg-card/50 border-border/50 animate-fade-in">
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold">1. Information We Collect</h2>
              <div className="space-y-3 text-muted-foreground">
                <p className="leading-relaxed">We collect information you provide directly to us, including:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Account information (name, email, profile details)</li>
                  <li>Community listings and descriptions</li>
                  <li>Messages and communications</li>
                  <li>Usage data and analytics</li>
                  <li>Location data (city, district, state)</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold">2. How We Use Your Information</h2>
              <div className="space-y-3 text-muted-foreground">
                <p className="leading-relaxed">We use the information we collect to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Enable community discovery and connections</li>
                  <li>Send you updates and notifications</li>
                  <li>Respond to your requests and support needs</li>
                  <li>Analyze usage patterns and trends</li>
                  <li>Detect and prevent fraud or abuse</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold">3. Information Sharing</h2>
              <p className="text-muted-foreground leading-relaxed">
                We do not sell your personal information. We may share your information with:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground">
                <li>Other users (as part of community listings and profiles)</li>
                <li>Service providers who assist in our operations</li>
                <li>Law enforcement when required by law</li>
                <li>With your consent for specific purposes</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold">4. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal information.
                However, no method of transmission over the internet is 100% secure, and we cannot guarantee
                absolute security.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold">5. Your Rights and Choices</h2>
              <div className="space-y-3 text-muted-foreground">
                <p className="leading-relaxed">You have the right to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Access and update your personal information</li>
                  <li>Delete your account and associated data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Request a copy of your data</li>
                  <li>Object to certain data processing activities</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold">6. Cookies and Tracking</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use cookies and similar tracking technologies to collect information about your browsing
                activities. You can control cookies through your browser settings.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold">7. Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our Platform is not intended for children under 13 years of age. We do not knowingly collect
                personal information from children under 13.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold">8. International Data Transfers</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your information may be transferred to and processed in countries other than your own. We ensure
                appropriate safeguards are in place for such transfers.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold">9. Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting
                the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold">10. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about this Privacy Policy, please contact us at privacy@nearloom.app
              </p>
            </section>
          </Card>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
};

export default Privacy;
