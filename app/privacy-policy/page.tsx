import { Header } from '@/components/LandingPage/Header';
import { Footer } from '@/components/LandingPage/Footer';

export default function PrivacyPage() {
    return (
        <>
            <Header />

            <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

                <div className="prose prose-lg max-w-none">
                    <p className="text-gray-600 mb-6">
                        <strong>Company:</strong> ThinkTapFlow<br />
                        <strong>Service:</strong> AI-Powered Content Generation Platform<br />
                        <strong>Effective Date:</strong> June 2025<br />
                        <strong>Last Updated:</strong> June 2025
                    </p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                        <p className="text-gray-700 mb-4">
                            This Privacy Policy describes how ThinkTapFlow ("we," "our," or "us") collects, uses, and protects your information when you use our automated content generation SaaS application.
                        </p>
                        <p className="text-gray-700">
                            By using ThinkTapFlow, you consent to the data practices described in this policy.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Account Information</h3>
                        <ul className="list-disc pl-6 text-gray-700 mb-4">
                            <li>Email address - Required for account creation and login</li>
                            <li>Password - Encrypted and stored securely</li>
                            <li>Name and profile information - Optional display name and profile details</li>
                            <li>Company information - Optional business details for billing</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 Content Generation Data</h3>
                        <ul className="list-disc pl-6 text-gray-700 mb-4">
                            <li>Input prompts and parameters - What you ask our AI to generate</li>
                            <li>Generated content - The AI-created text, posts, and materials</li>
                            <li>Template selections - Which content templates you use</li>
                            <li>Generation history - Record of your content creation activity</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3">2.3 Usage Analytics</h3>
                        <ul className="list-disc pl-6 text-gray-700 mb-4">
                            <li>Platform usage metrics - Features used, time spent, frequency of use</li>
                            <li>Generation statistics - Number of posts created, templates used</li>
                            <li>Performance data - Response times, error rates, system performance</li>
                            <li>Device information - Browser type, operating system, IP address</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 Service Provision</h3>
                        <ul className="list-disc pl-6 text-gray-700 mb-4">
                            <li>Process your content generation requests</li>
                            <li>Maintain your account and user preferences</li>
                            <li>Provide customer support and technical assistance</li>
                            <li>Monitor and improve AI model performance</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 Platform Improvement</h3>
                        <ul className="list-disc pl-6 text-gray-700 mb-4">
                            <li>Analyze usage patterns to enhance features</li>
                            <li>Train and improve our AI content generation models</li>
                            <li>Develop new templates and content types</li>
                            <li>Optimize platform performance and reliability</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. AI Model Training and Content Usage</h2>
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1 Content Processing</h3>
                            <ul className="list-disc pl-6 text-gray-700 mb-4">
                                <li>Your input prompts may be processed to improve AI responses</li>
                                <li>Generated content is temporarily stored during processing</li>
                                <li><strong>We do not use your personal content to train public AI models</strong></li>
                                <li>Content is processed in secure, encrypted environments</li>
                            </ul>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Storage and Security</h2>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3">5.1 Security Measures</h3>
                        <div className="bg-green-50 p-4 rounded-lg">
                            <ul className="list-disc pl-6 text-gray-700">
                                <li><strong>End-to-End Encryption:</strong> All data is encrypted in transit using TLS 1.3 and stored securely with AES-256 encryption.</li>
                                <li><strong>Access Management:</strong> We implement role-based access controls and multi-factor authentication to ensure only authorized users can access sensitive data.</li>
                                <li><strong>Ongoing Security Audits:</strong> Regular vulnerability assessments and penetration testing are conducted to identify and fix potential threats.</li>
                                <li><strong>Secure Cloud Infrastructure:</strong> Hosted on trusted cloud providers with compliance to industry standards such as ISO 27001 and SOC 2.</li>
                            </ul>
                        </div>


                        <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">5.3 Data Retention</h3>
                        <ul className="list-disc pl-6 text-gray-700 mb-4">
                            <li>Account data: Retained while your account is active</li>
                            <li>Generated content: Stored according to your plan's limits</li>
                            <li>Usage analytics: Aggregated data retained for 2 years</li>
                            <li>Deleted data: Permanently removed within 30 days of deletion request</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Third-Party Services</h2>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3">6.1 Payment Processing</h3>
                        <p className="text-gray-700 mb-4">
                            <strong>Paddle:</strong> Handles all payment processing and billing. Data shared includes billing information and subscription details for payment processing, tax compliance, and fraud prevention.
                        </p>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3">6.2 AI and Infrastructure Services</h3>
                        <ul className="list-disc pl-6 text-gray-700 mb-4">
                            <li><strong>OpenAI/Anthropic:</strong> AI model access for content generation</li>
                            <li><strong>Supabase:</strong> Database and authentication services</li>
                            <li><strong>Vercel:</strong> Hosting and content delivery</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Privacy Rights</h2>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3">7.1 Access and Control</h3>
                        <ul className="list-disc pl-6 text-gray-700 mb-4">
                            <li>Account dashboard: View and manage your personal information</li>
                            <li>Data export: Download your generated content and account data</li>
                            <li>Content deletion: Delete specific generated content or entire history</li>
                            <li>Account closure: Delete your account and associated data</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3">7.3 Legal Rights (where applicable)</h3>
                        <ul className="list-disc pl-6 text-gray-700 mb-4">
                            <li>Data portability: Receive your data in machine-readable format</li>
                            <li>Correction: Update inaccurate personal information</li>
                            <li>Deletion: Request removal of your personal data</li>
                            <li>Restriction: Limit how we process your information</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Children's Privacy</h2>
                        <div className="bg-red-50 p-4 rounded-lg">
                            <ul className="list-disc pl-6 text-gray-700">
                                <li>ThinkTapFlow is not intended for users under 18 years of age</li>
                                <li>We do not knowingly collect information from children under 18</li>
                                <li>If we discover we have collected information from a child, we will delete it immediately</li>
                                <li>Parents who believe their child has provided information should contact us</li>
                            </ul>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Information</h2>
                        <div className="p-4 rounded-lg">
                            <p className="text-gray-700 mb-2">
                                <strong>Privacy Questions:</strong> info@thinktapflow.com
                            </p>
                            <p className="text-gray-700 mb-2">
                                <strong>Data Protection Requests:</strong> info@thinktapflow.com
                            </p>
                            <p className="text-gray-700">
                                <strong>General Support:</strong> info@thinktapflow.com
                            </p>
                        </div>
                    </section>

                    <div className="text-center p-6 rounded-lg">
                        <p className="text-sm text-gray-600">
                            Last Updated: June 2025 | Document Version: 1.0
                            {/* | Next Review Date: June 2025 */}
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    )
}
