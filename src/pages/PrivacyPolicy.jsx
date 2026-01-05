import React, { useEffect } from 'react';
import { Shield } from 'lucide-react';

const Section = ({ number, title, children }) => (
    <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
            <h2 className="text-xl font-bold text-gray-900">{number}. {title}</h2>
        </div>
        <div className="text-gray-600 leading-relaxed">{children}</div>
    </div>
);

export default function PrivacyPolicy() {
    useEffect(() => {
        document.title = 'Privacy Policy - 1cPublishing';
        document.querySelector('meta[name="description"]')?.setAttribute('content', 'Privacy Policy for 1cpublishing.com, Neural Mindmap and other Apps.');
        document.querySelector('meta[name="keywords"]')?.setAttribute('content', '1cPublishing Privacy Policy, Neural Mindmap privacy, data protection');
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 mb-8 text-white">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                            <Shield className="w-7 h-7" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Privacy Policy</h1>
                            <p className="text-white/80">Effective Date: December 5, 2025</p>
                        </div>
                    </div>
                </div>

                {/* Introduction */}
                <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
                    <p className="text-gray-700 leading-relaxed mb-4">
                        We, <strong>1c Publishing Inc.</strong>, and its subsidiaries and affiliates (collectively, "1c Publishing," "us," or "we"), understand that your privacy is essential to you. We are deeply committed to respecting your privacy and safeguarding your personal data, particularly in connection with your use of the Neural Mindmap app.
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        This Privacy Policy outlines how we collect, handle, and protect your personal information ("Privacy Policy") when obtained through 1c Publishing's websites, including 1cpublishing.com, the Neural Mindmap app, and other digital platforms (collectively, our "Sites" and "App").
                    </p>
                    
                    <div className="bg-purple-50 border-l-4 border-purple-600 p-4 mt-6">
                        <h3 className="font-bold text-gray-900 mb-2">Scope of this Privacy Policy</h3>
                        <p className="text-gray-700 text-sm leading-relaxed mb-2">
                            This policy applies to data collected when you interact with our Sites and App.
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                            <li><strong>Neural Mindmap App Users:</strong> This policy specifically covers data related to your use of the Neural Mindmap application, including content creation, account usage, and interactions within the app.</li>
                            <li><strong>Website Visitors:</strong> This policy covers data collected when you visit 1cpublishing.com.</li>
                        </ul>
                        <p className="text-gray-600 text-sm mt-3">
                            <strong>Note:</strong> You are not required to share your personal information with us, but withholding it may result in limitations in how we deliver our full suite of services or optimize your experience with the Neural Mindmap app, websites, or newsletters.
                        </p>
                    </div>

                    <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mt-6">
                        <h3 className="font-bold text-gray-900 mb-2">Terms of Use</h3>
                        <p className="text-gray-700 text-sm leading-relaxed mb-2">
                            By accessing and using 1c Publishing's websites, the Neural Mindmap app, and services, you agree to the following terms:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                            <li><strong>Acceptable Use:</strong> You agree not to use 1c Publishing's platforms or services in any unlawful or harmful manner.</li>
                            <li><strong>Intellectual Property:</strong> All content, tools, and resources, including the Neural Mindmap App, are the intellectual property of 1c Publishing and may not be copied, distributed, or modified without permission.</li>
                            <li><strong>Modifications:</strong> 1c Publishing reserves the right to update these terms at any time. Notifications of major changes will be provided, but we encourage regular review of our terms for updates.</li>
                        </ul>
                        <p className="text-gray-600 text-sm mt-3">
                            For further details, please review our comprehensive Terms of Service.
                        </p>
                    </div>
                </div>

                {/* Sections */}
                <div className="bg-white rounded-2xl border border-gray-200 p-8">
                    <Section number="1" title="Data Collection and Usage Practices">
                        <p className="mb-4">
                            We ensure transparency in our data collection practices by clearly outlining the types of data we gather to provide and improve the Neural Mindmap App and our services. We collect only the data necessary for these purposes.
                        </p>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-300 text-sm">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border border-gray-300 p-3 text-left font-bold">Category</th>
                                        <th className="border border-gray-300 p-3 text-left font-bold">Examples of Data Collected</th>
                                        <th className="border border-gray-300 p-3 text-left font-bold">Purpose of Collection</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border border-gray-300 p-3">App Usage Data</td>
                                        <td className="border border-gray-300 p-3">Device type, operating system, crash logs, interaction data (e.g., features used, session length).</td>
                                        <td className="border border-gray-300 p-3">To maintain, analyze, and improve the Neural Mindmap App's performance and user experience.</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 p-3">User Account/Identifiers</td>
                                        <td className="border border-gray-300 p-3">Email address, username, password (hashed), subscription status.</td>
                                        <td className="border border-gray-300 p-3">To create and manage your account, provide access to features, and authenticate users.</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 p-3">Mindmap Content</td>
                                        <td className="border border-gray-300 p-3">Text, images, and structure of mindmaps created within the Neural Mindmap App.</td>
                                        <td className="border border-gray-300 p-3">To provide the core functionality of the App (i.e., saving and displaying your mindmaps). We treat this content as private and confidential.</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 p-3">Transactional Data</td>
                                        <td className="border border-gray-300 p-3">Billing information, payment history (processed by third-party payment providers).</td>
                                        <td className="border border-gray-300 p-3">To process payments for subscriptions or premium features.</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 p-3">Communications Data</td>
                                        <td className="border border-gray-300 p-3">Information from customer support inquiries or feedback.</td>
                                        <td className="border border-gray-300 p-3">To respond to requests, provide support, and improve services.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        
                        <p className="mt-4">
                            <strong>Secure Methods:</strong> We employ secure methods to collect data, including encrypted connections and secure data transfer protocols, ensuring your information is protected.
                        </p>
                    </Section>

                    <Section number="2" title="Data Anonymization and Protection">
                        <ul className="list-disc list-inside space-y-2">
                            <li><strong>Anonymization:</strong> To protect user identities, we may employ robust data anonymization techniques, such as using aggregated, non-personally identifiable data for analysis and research purposes.</li>
                            <li><strong>Content Confidentiality:</strong> Mindmap content created within the Neural Mindmap App is considered highly confidential. We do not scan, share, or use this content for any purpose other than providing the service and supporting your access to it, unless you explicitly choose to share it.</li>
                        </ul>
                    </Section>

                    <Section number="3" title="Third-Party Data Sharing">
                        <p className="mb-3">
                            We maintain strict policies on third-party data sharing. Data is only shared with trusted partners (e.g., cloud storage providers, analytics services) for the purpose of operating and improving the Neural Mindmap App and our Sites.
                        </p>
                        <ul className="list-disc list-inside space-y-2">
                            <li><strong>Vendor Requirements:</strong> We require all third parties to adhere to the same privacy standards and sign confidentiality agreements.</li>
                            <li><strong>Mindmap Content:</strong> Your specific mindmap content is never shared with external entities for marketing or research purposes without your explicit consent.</li>
                        </ul>
                    </Section>

                    <Section number="4" title="Data Storage and Transfers">
                        <ul className="list-disc list-inside space-y-2">
                            <li><strong>Storage Policies:</strong> We use secure cloud storage solutions to store user data, ensuring that data is encrypted both in transit and at rest.</li>
                            <li><strong>Cross-Border Data Transfers:</strong> As a global platform, your data may be processed and stored in the United States or other jurisdictions where 1c Publishing or its service providers operate. We adhere to international privacy regulations, such as GDPR and CCPA, to ensure data is transferred securely and with adequate legal safeguards.</li>
                        </ul>
                    </Section>

                    <Section number="5" title="Participant Rights">
                        <p className="mb-3">1c Publishing upholds your rights regarding your personal data:</p>
                        <ul className="list-disc list-inside space-y-2">
                            <li><strong>Access, Correction, and Deletion:</strong> You have the right to access, correct, or request the deletion of your personal data held by us.</li>
                            <li><strong>Exercising Rights:</strong> You can easily contact us to exercise these rights using the contact information provided below.</li>
                        </ul>
                    </Section>

                    <Section number="6" title="Use of AI and Machine Learning">
                        <p className="mb-3">
                            The Neural Mindmap App may leverage AI and machine learning for features such as smart suggestions or content structuring.
                        </p>
                        <ul className="list-disc list-inside space-y-2">
                            <li><strong>Ethical AI:</strong> We ensure that AI is used in ways that maintain your privacy and do not lead to biased outcomes.</li>
                            <li><strong>Mindmap Content and AI:</strong> Any AI processing of your mindmap content is performed solely to provide and improve the functionality of the App for you, and we take steps to prevent the use of your private content to train broad, publicly accessible AI models.</li>
                        </ul>
                    </Section>

                    <Section number="7" title="Data Security Measures">
                        <p className="mb-3">We employ advanced security measures to protect your data from unauthorized access, including:</p>
                        <ul className="list-disc list-inside space-y-2">
                            <li>Encryption</li>
                            <li>Firewalls</li>
                            <li>Secure access controls</li>
                            <li>Regular security assessments</li>
                        </ul>
                        <p className="mt-3">
                            <strong>Your Role:</strong> We encourage you to use unique, strong passwords for your Neural Mindmap account and avoid sharing sensitive information online.
                        </p>
                    </Section>

                    <Section number="8" title="Data Breach Protocols">
                        <p>
                            In the unlikely event of a data breach, we have a comprehensive protocol in place for immediate containment, notification of affected individuals, and collaboration with authorities to mitigate risks and prevent future incidents.
                        </p>
                    </Section>

                    <Section number="9" title="Children's Privacy">
                        <p>
                            We do not knowingly target or collect data from children under the age of 13. If you believe your child has shared information with us, please contact us immediately so we can take steps to delete the data as required.
                        </p>
                    </Section>

                    <Section number="10" title="Contact Us">
                        <p className="mb-3">
                            For questions about this Privacy Policy or 1c Publishing's privacy practices regarding the Neural Mindmap app or 1cpublishing.com, please reach out to us:
                        </p>
                        <p className="font-semibold">Email: <a href="mailto:privacy@1cpublishing.com" className="text-purple-600 hover:underline">privacy@1cpublishing.com</a></p>
                    </Section>

                    <Section number="11" title="Updates to This Policy">
                        <p>
                            We may update this Policy from time to time to reflect changes in our practices or compliance requirements. The updated version will be posted on our Sites, so please check back periodically.
                        </p>
                    </Section>
                </div>
            </div>
        </div>
    );
}