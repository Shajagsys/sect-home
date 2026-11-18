export interface FaqItem {
  q: string;
  a: string;
}

export const FAQS: FaqItem[] = [
  {
    q: 'What is the typical turnaround time for a comprehensive VAPT?',
    a: 'Most standard web or mobile application assessments are concluded within 1 to 3 weeks, depending on the complexity of the architecture. Enterprise-grade network and multi-cloud environment audits are meticulously scoped and may take longer to ensure absolute thoroughness.',
  },
  {
    q: "How does India's DPDP Act impact our current data security posture?",
    a: 'The Digital Personal Data Protection (DPDP) Act imposes strict mandates on how Indian enterprises collect, store and process user data. Our compliance sprints map your existing data flows against DPDP requirements, identifying gaps in consent management, data localisation and encryption protocols.',
  },
  {
    q: 'Is there any operational downtime during penetration testing?',
    a: 'Business continuity is our priority. We rigorously scope every engagement to mitigate any risk to your live production environments. For highly sensitive infrastructure, we conduct assessments in staging environments or schedule intrusive testing exclusively during off-peak hours.',
  },
  {
    q: 'What differentiates a standard vulnerability scan from a bespoke penetration test?',
    a: 'A vulnerability assessment primarily utilises automated tools to flag theoretical weaknesses. A bespoke penetration test is a highly manual, offensive engagement where our experts actively attempt to exploit those weaknesses, demonstrating the actual, real-world business impact.',
  },
  {
    q: 'Do you provide remediation assistance post-audit?',
    a: 'Absolutely. We do not just hand over a report and walk away. Our engagement includes dedicated consultation sessions where our security engineers guide your development and IT teams through the recommended fixes.',
  },
  {
    q: 'How frequently should an organisation mandate a security audit?',
    a: 'Industry best practices dictate that comprehensive penetration testing should be conducted at least annually, as well as immediately following any major architectural changes. Regulated sectors such as BFSI often require bi-annual or quarterly assessments.',
  },
  {
    q: 'Will our proprietary data be secure during the engagement?',
    a: 'Confidentiality is the bedrock of our operations. All engagements are governed by comprehensive NDAs. Assessment data is encrypted at rest and in transit, access is restricted on a need-to-know basis, and data is purged post-engagement per our retention policies.',
  },
  {
    q: 'Can you prepare us for a compliance framework from scratch?',
    a: 'Yes. Our "Compliance Sprint" engagement model is designed precisely for this scenario — a baseline gap assessment against your target framework followed by a step-by-step remediation roadmap to ensure you are audit-ready within a committed timeline.',
  },
];
