import { Header } from "@/components/LandingPage/Header";
import { Footer } from "@/components/LandingPage/Footer";

export default function TermsPage() {
  return (
    <>
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Terms of Service</h1>

        <div className="prose prose-lg max-w-none">
          <p className="mb-6 text-gray-600">
            <strong>Company:</strong> ThinkTapFlow
            <br />
            <strong>Service:</strong> AI-Powered Content Generation Platform
            <br />
            <strong>Effective Date:</strong> June 2025
            <br />
            <strong>Last Updated:</strong> June 2025
          </p>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">1. Acceptance of Terms</h2>
            <p className="mb-4 text-gray-700">
              By accessing or using ThinkTapFlow (the "Service"), you agree to be bound by these
              Terms of Service ("Terms") and our Privacy Policy. If you disagree with any part of
              these terms, you may not access the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">2. Description of Service</h2>
            <h3 className="mb-3 text-xl font-semibold text-gray-800">2.1 Core Service</h3>
            <p className="mb-4 text-gray-700">
              ThinkTapFlow is a Software-as-a-Service (SaaS) platform that provides:
            </p>
            <ul className="mb-4 list-disc pl-6 text-gray-700">
              <li>
                AI-powered content generation for social media posts, blogs, and marketing materials
              </li>
              <li>Pre-designed content templates and customization options</li>
              <li>Content analytics and performance tracking</li>
              <li>Team collaboration tools for content creation</li>
              <li>API access for developers and integrations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              3. Account Registration and Eligibility
            </h2>
            <p className="mb-4 text-gray-700">
              You must be at least 18 years old to create an account. You must provide accurate and
              complete registration information and are responsible for maintaining the
              confidentiality of your account credentials.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              4. Subscription Plans and Billing
            </h2>
            <h3 className="mb-3 text-xl font-semibold text-gray-800">4.1 Available Plans</h3>
            <ul className="mb-4 list-disc pl-6 text-gray-700">
              <li>
                <strong>Free Plan:</strong> Basic tools and limited content generation — ideal for
                individuals testing the platform
              </li>
              <li>
                <strong>Pro Plan:</strong> Unlock advanced features, priority usage limits, and
                analytics — perfect for serious creators
              </li>
              <li>
                <strong>Plus Plan:</strong> All Pro features + team collaboration, bulk generation,
                and premium support
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">5. Acceptable Use Policy</h2>
            <h3 className="mb-3 text-xl font-semibold text-gray-800">5.2 Prohibited Uses</h3>
            <p className="mb-4 text-gray-700">You may NOT use ThinkTapFlow to:</p>
            <ul className="mb-4 list-disc pl-6 text-gray-700">
              <li>Generate content that violates any laws or regulations</li>
              <li>Create misleading, false, or defamatory content</li>
              <li>Infringe on intellectual property rights of others</li>
              <li>Generate spam, malicious, or harmful content</li>
              <li>Create content that promotes illegal activities</li>
            </ul>
          </section>

          <section className="mb-8 rounded-lg border-l-4 border-yellow-400 bg-yellow-50 p-6">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              6. Religious and Ethical Considerations
            </h2>
            <h3 className="mb-3 text-xl font-semibold text-gray-800">
              6.1 Developer's Islamic Declaration
            </h3>
            <div className="mb-4 rounded-lg bg-yellow-100 p-4">
              <p className="mb-2 text-sm font-medium text-yellow-800">
                IMPORTANT NOTICE FOR ALL USERS - ESPECIALLY MUSLIM USERS:
              </p>
              <p className="mb-4 text-gray-700">
                As the creator and developer of ThinkTapFlow, I make the following declaration
                before Allah (SWT):
              </p>
              <p className="mb-4 text-gray-700">
                <strong>English Declaration:</strong> I hereby disclaim all responsibility before
                Allah for any use of this platform that conflicts with Islamic principles and
                teachings, including but not limited to creating content for videos, media, or
                projects that contain music (موسيقى), generating content that promotes haram
                activities, or using the Service for purposes that contradict Islamic values.
              </p>
              <p className="mb-4 text-gray-700" dir="rtl" lang="ar">
                <strong>إعلان شرعي:</strong> بسم الله الرحمن الرحيم - أُعلن وأُشهد الله تبارك وتعالى
                أنني أُخلي مسؤوليتي أمام الله سبحانه وتعالى من أي استعمال لهذه المنصة يتعارض مع
                تعاليم الإسلام وأحكام الشريعة الإسلامية.
              </p>
            </div>
            <p className="text-gray-700">
              Every user bears complete personal responsibility for ensuring their use of
              ThinkTapFlow aligns with their religious beliefs and obligations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              7. Intellectual Property Rights
            </h2>
            <p className="mb-4 text-gray-700">
              You own the content you generate using ThinkTapFlow. Generated content becomes your
              property upon creation. You are responsible for ensuring generated content doesn't
              infringe third-party rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">10. Limitation of Liability</h2>
            <div className="rounded-lg bg-red-50 p-4">
              <p className="mb-2 text-gray-700">
                <strong>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW:</strong>
              </p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE"</li>
                <li>WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED</li>
                <li>OUR TOTAL LIABILITY IS LIMITED TO THE AMOUNT YOU PAID FOR THE SERVICE</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">16. Contact Information</h2>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="mb-2 text-gray-700">
                <strong>Legal Inquiries:</strong> info@thinktapflow.com
              </p>
              <p className="mb-2 text-gray-700">
                <strong>General Support:</strong> info@thinktapflow.com
              </p>
              <p className="text-gray-700">
                <strong>Response Time:</strong> 24-48 hours
              </p>
            </div>
          </section>

          <div className="rounded-lg p-6 text-center">
            <p className="italic text-gray-700">
              "May Allah bless this work if it serves His creation in ways that are pleasing to Him,
              and may it be a source of benefit rather than harm. Ameen."
            </p>
            <p className="mt-4 text-sm text-gray-600">
              Last Updated: June 2025 | Document Version: 1.0
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
