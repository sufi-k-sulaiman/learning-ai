import React from 'react';
import { Shield, Users, Database, Globe, Mail, AlertTriangle, FileText, Eye, Server, UserCheck, Brain, User, Fingerprint, Scale, ShieldCheck, BarChart3, LogOut, ClipboardCheck, Cloud, GraduationCap, Building2, Heart, DollarSign, Share2, HardDrive, Key, Link2, RefreshCw } from 'lucide-react';

const Section = ({ number, title, icon: Icon, children }) => (
    <div className="mb-8">
        <div className="flex items-start gap-4 mb-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <Icon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
                <h3 className="text-xl font-bold text-gray-900">{number}. {title}</h3>
            </div>
        </div>
        <div className="ml-14 text-gray-600 leading-relaxed space-y-3">
            {children}
        </div>
    </div>
);

export default function PrivacyPolicy() {
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
                            <p className="text-white/80">How we protect and handle your data</p>
                        </div>
                    </div>
                </div>

                {/* Introduction */}
                <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
                    <p className="text-gray-700 leading-relaxed mb-4">
                        We, <strong>1cPublishing Inc.</strong>, and its subsidiaries and affiliates (collectively, "1cPublishing," "us," or "we"), understand that your privacy is essential to you. We are deeply committed to respecting your privacy and safeguarding your personal data.
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        This privacy notice outlines how we collect, handle, and protect your personal information ("Privacy Notice") when obtained through 1cPublishing's websites, applications, and digital platforms (collectively, our "Sites"), as well as through our externally facing business activities—including service offerings, events, surveys, and communications.
                    </p>
                </div>

                {/* Additional Privacy Notices */}
                <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Additional or Alternative Privacy Notices</h2>
                    </div>
                    <p className="text-gray-600 mb-4">Depending on the nature of your relationship with 1cPublishing, additional or alternative privacy notices may apply, including the following:</p>
                    <ul className="space-y-3 text-gray-600">
                        <li className="flex items-start gap-2">
                            <span className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></span>
                            <span><strong>Recruiting Privacy Notice:</strong> For individuals applying to join 1cPublishing.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></span>
                            <span><strong>Client Privacy Notice:</strong> If you are engaging with 1cPublishing's research and analysis services.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></span>
                            <span><strong>Solutions Privacy Notice:</strong> For users accessing 1cPublishing's solutions and tools on behalf of an organization.</span>
                        </li>
                    </ul>
                    <p className="text-gray-600 mt-4">
                        If you are an employee of a 1cPublishing client or service provider, your personal data may be provided to us by your employer. In these cases, our use of your data is governed by the agreement with your employer.
                    </p>
                    <p className="text-gray-600 mt-4 italic">
                        You are not required to share your personal information with us, but withholding it may result in limitations in how we deliver our full suite of services or optimize your experience with our solutions, websites, or newsletters.
                    </p>
                </div>

                {/* Terms of Use Summary */}
                <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                            <Scale className="w-5 h-5 text-amber-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Terms of Use</h2>
                    </div>
                    <p className="text-gray-600 mb-4">By accessing and using 1cPublishing's websites, tools, and services, you agree to the following terms:</p>
                    <div className="space-y-3">
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <p className="font-semibold text-gray-800">Acceptable Use</p>
                            <p className="text-gray-600 text-sm">You agree not to use 1cPublishing's platforms or services in any unlawful or harmful manner.</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <p className="font-semibold text-gray-800">Intellectual Property</p>
                            <p className="text-gray-600 text-sm">All content, tools, and resources provided by 1cPublishing are the intellectual property of 1cPublishing and may not be copied, distributed, or modified without permission.</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <p className="font-semibold text-gray-800">Limitation of Liability</p>
                            <p className="text-gray-600 text-sm">1cPublishing shall not be held liable for any damages resulting from the use or inability to use our services.</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <p className="font-semibold text-gray-800">Modifications</p>
                            <p className="text-gray-600 text-sm">1cPublishing reserves the right to update these terms at any time. Notifications of major changes will be provided.</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <p className="font-semibold text-gray-800">Termination</p>
                            <p className="text-gray-600 text-sm">1cPublishing retains the right to suspend or terminate access to its services if users violate these terms.</p>
                        </div>
                    </div>
                </div>

                {/* Main Privacy Sections */}
                <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
                    <Section number="1" title="Data Collection Practices" icon={Database}>
                        <p>1cPublishing.com ensures transparency in its data collection practices by clearly outlining the types of data it gathers, such as demographic information, survey responses, and behavioral data. The company emphasizes collecting only the data necessary for research purposes, minimizing the risk of overreach.</p>
                        <p>Additionally, 1cPublishing.com employs secure methods to collect data, including encrypted online surveys and secure data transfer protocols. This ensures that participant information remains confidential and protected from unauthorized access.</p>
                    </Section>

                    <Section number="2" title="Informed Consent" icon={UserCheck}>
                        <p>1cPublishing.com prioritizes obtaining informed consent from participants by providing clear and concise explanations of how their data will be used. Participants are informed about the purpose of the research, the types of data collected, and their rights regarding data usage.</p>
                        <p>The company also ensures that consent is an ongoing process, allowing participants to withdraw at any time. This approach fosters trust and aligns with ethical research standards.</p>
                    </Section>

                    <Section number="3" title="Data Anonymization" icon={Eye}>
                        <p>To protect participant identities, 1cPublishing.com employs robust data anonymization techniques, such as removing personally identifiable information and using aggregated data for analysis. This ensures that individual responses cannot be traced back to participants.</p>
                        <p>Furthermore, the company regularly reviews its anonymization methods to stay ahead of emerging privacy risks and maintain compliance with global privacy standards.</p>
                    </Section>

                    <Section number="4" title="Third-Party Data Sharing" icon={Share2}>
                        <p>1cPublishing.com maintains strict policies on third-party data sharing, ensuring that data is only shared with trusted partners for research purposes.</p>
                        <p>The company requires all third parties to adhere to the same privacy standards and sign confidentiality agreements. Participants are informed about any potential data sharing, and their explicit consent is obtained before sharing their information with external entities.</p>
                    </Section>

                    <Section number="5" title="Data Retention Periods" icon={HardDrive}>
                        <p>1cPublishing.com defines clear data retention periods, ensuring that participant data is stored only for as long as necessary to fulfill research objectives.</p>
                        <p>Once the retention period expires, data is securely deleted or anonymized. The company also conducts regular audits to ensure compliance with its data retention policies and to identify opportunities for improvement.</p>
                    </Section>

                    <Section number="6" title="Data Breach Protocols" icon={AlertTriangle}>
                        <p>In the event of a data breach, 1cPublishing.com has a comprehensive protocol in place to mitigate risks and protect participant information.</p>
                        <p>This includes immediate containment measures, notification of affected individuals, and collaboration with authorities. The company also conducts post-breach analyses to identify vulnerabilities and implement measures to prevent future incidents.</p>
                    </Section>

                    <Section number="7" title="Cross-Border Data Transfers" icon={Globe}>
                        <p>1cPublishing.com navigates the complexities of cross-border data transfers by adhering to international privacy regulations, such as GDPR and PIPL.</p>
                        <p>The company ensures that data is transferred securely and only to countries with adequate privacy protections. Participants are informed about cross-border data transfers, and their consent is obtained before their data is shared internationally.</p>
                    </Section>

                    <Section number="8" title="Participant Rights" icon={Users}>
                        <p>1cPublishing.com upholds participant rights by providing mechanisms for accessing, correcting, and deleting their personal data.</p>
                        <p>Participants can easily contact the company to exercise these rights. The company also educates participants about their privacy rights, empowering them to make informed decisions about their data.</p>
                    </Section>

                    <Section number="9" title="Use of AI and Machine Learning" icon={Brain}>
                        <p>1cPublishing.com leverages AI and machine learning for data analysis while ensuring ethical considerations are prioritized.</p>
                        <p>The company avoids using AI in ways that could compromise participant privacy or lead to biased outcomes. Transparency is key, and participants are informed about how AI is used in the research process, fostering trust and accountability.</p>
                    </Section>

                    <Section number="10" title="Children's Data Protection" icon={User}>
                        <p>1cPublishing.com implements special measures to protect the data of underage participants, including obtaining parental consent and using age-appropriate language in communications.</p>
                        <p>The company also limits the collection of sensitive data from children and ensures compliance with regulations like COPPA.</p>
                    </Section>

                    <Section number="11" title="Biometric Data Usage" icon={Fingerprint}>
                        <p>When collecting biometric data, 1cPublishing.com employs stringent security measures to protect this sensitive information.</p>
                        <p>The company ensures that biometric data is used solely for research purposes and not for identification. Participants are fully informed about the collection and use of biometric data, and their explicit consent is obtained before proceeding.</p>
                    </Section>

                    <Section number="12" title="Compliance with Global Regulations" icon={Scale}>
                        <p>1cPublishing.com stays up-to-date with global privacy regulations, such as GDPR, CCPA, and LGPD, to ensure compliance across jurisdictions.</p>
                        <p>The company regularly reviews its policies to align with evolving legal requirements. This proactive approach minimizes legal risks and demonstrates 1cPublishing.com's commitment to participant privacy.</p>
                    </Section>

                    <Section number="13" title="Data Security Measures" icon={ShieldCheck}>
                        <p>1cPublishing.com employs advanced security measures, such as encryption, firewalls, and secure access controls, to protect participant data from unauthorized access.</p>
                        <p>The company also conducts regular security assessments to identify and address potential vulnerabilities.</p>
                    </Section>

                    <Section number="14" title="Transparency in Research Findings" icon={BarChart3}>
                        <p>1cPublishing.com ensures that research findings are shared in a way that does not compromise participant privacy. Aggregated data is used to present results, and individual responses are never disclosed.</p>
                        <p>This approach maintains the integrity of the research while respecting participant confidentiality.</p>
                    </Section>

                    <Section number="15" title="Opt-Out Mechanisms" icon={LogOut}>
                        <p>Participants can easily opt out of 1cPublishing.com's research studies at any time, ensuring that their participation is entirely voluntary.</p>
                        <p>The company provides clear instructions on how to withdraw consent. Opt-out mechanisms are designed to be user-friendly, minimizing barriers for participants who wish to exercise this right.</p>
                    </Section>

                    <Section number="16" title="Monitoring and Auditing" icon={ClipboardCheck}>
                        <p>1cPublishing.com conducts regular audits to ensure compliance with its privacy policies and identify areas for improvement.</p>
                        <p>These audits are performed by internal and external experts. The company also monitors its data handling practices to ensure they align with industry best practices and legal requirements.</p>
                    </Section>

                    <Section number="17" title="Cloud Storage Policies" icon={Cloud}>
                        <p>1cPublishing.com uses secure cloud storage solutions to store participant data, ensuring that data is encrypted both in transit and at rest.</p>
                        <p>The company carefully selects cloud providers that comply with global privacy standards and conducts regular assessments of their security measures.</p>
                    </Section>

                    <Section number="18" title="Employee Training" icon={GraduationCap}>
                        <p>1cPublishing.com invests in employee training to ensure staff members understand privacy best practices and their role in protecting participant data.</p>
                        <p>Training programs are regularly updated to reflect changes in privacy regulations and emerging threats.</p>
                    </Section>

                    <Section number="19" title="Vendor Management" icon={Building2}>
                        <p>1cPublishing.com requires all vendors to adhere to its privacy standards and sign agreements to ensure compliance.</p>
                        <p>The company conducts regular assessments of vendor practices to identify potential risks. This approach minimizes the likelihood of data breaches and ensures that participant data is handled responsibly.</p>
                    </Section>

                    <Section number="20" title="Ethical Data Usage" icon={Heart}>
                        <p>1cPublishing.com is committed to using participant data ethically, avoiding practices that could harm individuals or compromise their privacy.</p>
                        <p>The company regularly reviews its data usage policies to ensure they align with ethical standards and participant expectations.</p>
                    </Section>
                </div>

                {/* Financial Incentives */}
                <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Notice of Financial Incentives</h2>
                    </div>
                    <p className="text-gray-600 mb-4">
                        Under California law, 1cPublishing.com is required to disclose details regarding the financial incentives we may offer. Similarly, Colorado law mandates transparency about loyalty programs, known as "Bona Fide Loyalty Programs," which provide benefits such as enhanced goods or services.
                    </p>
                    
                    <h3 className="font-bold text-gray-800 mt-6 mb-2">The Incentive and Its Terms</h3>
                    <p className="text-gray-600 mb-4">
                        Occasionally, we may provide financial incentives to promote our services. These could include discounts, coupons, promotional codes, or exclusive features available to customers subscribing to 1cPublishing Premium Services. Participation in these programs may require you to share personal information such as contact details, billing information, or device advertising IDs.
                    </p>

                    <h3 className="font-bold text-gray-800 mt-6 mb-2">Targeted Advertising</h3>
                    <p className="text-gray-600 mb-4">
                        In compliance with Colorado law, we disclose any categories of personal data processed or sold for targeted advertising in connection with a financial incentive program. Specific details will be shared when you opt into such programs, as required by law.
                    </p>

                    <h3 className="font-bold text-gray-800 mt-6 mb-2">Your Choices</h3>
                    <p className="text-gray-600 mb-4">
                        Participation in financial incentive programs is entirely optional. California law provides you with the right to withdraw from such programs at any time. You may do so by updating your preferences in your account settings or by contacting us at <a href="mailto:privacy@1cPublishing.com" className="text-purple-600 hover:underline">privacy@1cPublishing.com</a>. Please note that withdrawal may affect your eligibility for future rewards or promotions.
                    </p>

                    <h3 className="font-bold text-gray-800 mt-6 mb-2">Third Parties and Data Sharing</h3>
                    <p className="text-gray-600">
                        Any personal information collected through these programs may be shared with our trusted business partners, vendors, and affiliates who support 1cPublishing.com's services.
                    </p>
                </div>

                {/* Additional Information */}
                <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <Server className="w-5 h-5 text-purple-600" />
                                <h3 className="font-bold text-gray-800">Information Transfers and Storage</h3>
                            </div>
                            <p className="text-gray-600 ml-8">
                                As a U.S.-based company, 1cPublishing.com may process and store collected data within the United States. If you reside outside the U.S. and use our services, you acknowledge that your data may be processed or stored in jurisdictions with differing data protection laws. For users in Europe, data transfers comply with applicable legal safeguards.
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <User className="w-5 h-5 text-purple-600" />
                                <h3 className="font-bold text-gray-800">Children's Privacy</h3>
                            </div>
                            <p className="text-gray-600 ml-8">
                                1cPublishing.com does not knowingly target or collect data from children. If you believe your child has shared information with us, please contact us at <a href="mailto:privacy@1cPublishing.com" className="text-purple-600 hover:underline">privacy@1cPublishing.com</a>. We will take immediate steps to delete the data as required.
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <Key className="w-5 h-5 text-purple-600" />
                                <h3 className="font-bold text-gray-800">Data Security</h3>
                            </div>
                            <p className="text-gray-600 ml-8">
                                We prioritize the safety of your information, but no system can guarantee 100% security. To protect your account, we encourage best practices like using unique passwords and avoiding sharing sensitive information online.
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <Link2 className="w-5 h-5 text-purple-600" />
                                <h3 className="font-bold text-gray-800">Third-Party Sites and Integrations</h3>
                            </div>
                            <p className="text-gray-600 ml-8">
                                Some 1cPublishing.com services may be integrated with third-party products or link to external websites. This Notice does not apply to their privacy practices, and we encourage you to review their policies separately.
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <RefreshCw className="w-5 h-5 text-purple-600" />
                                <h3 className="font-bold text-gray-800">Updates to This Notice</h3>
                            </div>
                            <p className="text-gray-600 ml-8">
                                From time to time, we may update this Notice to reflect changes in our practices or compliance requirements. Updated versions will be posted on relevant pages, so please check back periodically.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contact Us */}
                <div className="bg-purple-50 rounded-2xl border border-purple-200 p-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Mail className="w-6 h-6 text-purple-600" />
                        <h2 className="text-xl font-bold text-gray-900">Contact Us</h2>
                    </div>
                    <p className="text-gray-600">
                        For questions about this Notice or 1cPublishing.com's privacy practices, please reach out to us at{' '}
                        <a href="mailto:privacy@1cPublishing.com" className="text-purple-600 hover:underline font-medium">privacy@1cPublishing.com</a>
                    </p>
                </div>
            </div>
        </div>
    );
}