import type { LucideIcon } from 'lucide-react';
import {
  Search,
  Globe,
  Smartphone,
  Cloud,
  Network,
  CodeXml,
  GitBranch,
  FileCheck2,
  Swords,
  Siren,
} from 'lucide-react';

export interface ServiceGroup {
  heading: string;
  intro?: string;
  items: string[];
}

export interface ServiceDetail {
  slug: string;
  navLabel: string;
  icon: LucideIcon;
  tagline: string;
  title: string;
  heroLine: string;
  overview: string[];
  groupsLabel: string;
  groups: ServiceGroup[];
  deliverables: string[];
}

/** Shared across every service page — the docx's own recommendation:
 * "I strongly recommend using the same structure for every service page." */
export const METHODOLOGY_STEPS = [
  { title: 'Scope', desc: 'Define applications, assets, environments and authorized testing boundaries.' },
  { title: 'Discovery', desc: 'Understand the authorized attack surface before any testing begins.' },
  { title: 'Assessment', desc: 'Combine automated tooling with deep manual security testing.' },
  { title: 'Validation', desc: 'Manually validate significant findings to eliminate false positives.' },
  { title: 'Risk Analysis', desc: 'Prioritise findings by severity, exploitability, exposure and business impact.' },
  { title: 'Reporting', desc: 'Deliver both technical and management-level reporting.' },
  { title: 'Remediation', desc: 'Provide actionable, engineer-ready recommendations.' },
  { title: 'Retesting', desc: 'Verify that vulnerabilities have been properly addressed.' },
];

export const WHO_NEEDS_THIS = ['BFSI', 'Healthcare', 'SaaS', 'E-commerce', 'Government', 'Enterprises'];

export const WHY_CHOOSE_US = [
  'Manual and automated testing, not one or the other',
  'Risk-based prioritisation over raw scanner output',
  'Executive-ready reporting alongside full technical detail',
  'Remediation-focused approach, not just a findings dump',
  'Independent security assessment',
  'Retesting and validation included as standard',
];

export const SERVICES: ServiceDetail[] = [
  {
    slug: 'vapt',
    navLabel: 'VAPT',
    icon: Search,
    tagline: 'Vulnerability Assessment & Penetration Testing',
    title: 'Find what automated scanners miss — and prove it can be exploited.',
    heroLine: 'Identify vulnerabilities before attackers do.',
    overview: [
      'Vulnerability Assessment and Penetration Testing (VAPT) helps organisations discover, validate, prioritise and remediate security vulnerabilities across their digital infrastructure.',
      'Vulnerability assessment focuses on identifying potential weaknesses, while penetration testing goes further by manually validating whether identified weaknesses can actually be exploited within the authorised scope.',
    ],
    groupsLabel: 'What We Test',
    groups: [
      {
        heading: 'Web Application VAPT',
        items: [
          'Application discovery',
          'Authentication testing',
          'Authorization testing',
          'Session management testing',
          'Input validation',
          'Injection testing',
          'Cross-site scripting assessment',
          'CSRF assessment',
          'SSRF assessment',
          'File-upload security',
          'Security configuration review',
          'Business-logic testing',
          'Sensitive-data exposure assessment',
        ],
      },
      {
        heading: 'API VAPT',
        items: [
          'REST API assessment',
          'GraphQL assessment',
          'Authentication testing',
          'Authorization testing',
          'Token/JWT security',
          'Rate-limit assessment',
          'Input validation',
          'API endpoint discovery',
          'Object-level authorization',
          'Sensitive information exposure',
        ],
      },
      {
        heading: 'Network VAPT',
        items: [
          'External infrastructure assessment',
          'Internal infrastructure assessment',
          'Service exposure review',
          'Network configuration assessment',
          'Firewall assessment',
          'VPN assessment',
          'Network segmentation assessment',
        ],
      },
      {
        heading: 'Cloud VAPT',
        items: [
          'Public asset discovery',
          'Cloud configuration review',
          'IAM assessment',
          'Storage security',
          'Network security',
          'Logging and monitoring assessment',
        ],
      },
    ],
    deliverables: [
      'Executive summary',
      'Technical vulnerability report',
      'Risk rating',
      'Evidence',
      'Affected assets',
      'Business impact',
      'Remediation recommendations',
      'Retest report',
    ],
  },
  {
    slug: 'web-api-security',
    navLabel: 'Web & API Security',
    icon: Globe,
    tagline: 'Web Application & API Security',
    title: 'Your web applications and APIs are the front door. We test it like an attacker would.',
    heroLine: 'A vulnerability here can expose customer information, business data, or critical functionality.',
    overview: [
      'Modern businesses depend heavily on web applications and APIs. A vulnerability in these systems can potentially expose customer information, business data, or critical functionality.',
    ],
    groupsLabel: 'What We Assess',
    groups: [
      { heading: 'Authentication', items: ['Login security', 'Password policies', 'MFA implementation', 'Account recovery', 'Session handling'] },
      { heading: 'Authorization', items: ['Role-based access', 'Privilege escalation', 'Horizontal access control', 'Vertical access control', 'Object-level authorization'] },
      { heading: 'Input Security', items: ['Injection vulnerabilities', 'Cross-site scripting', 'Input validation', 'File upload handling'] },
      { heading: 'Session Security', items: ['Session management', 'Cookie security', 'Session expiration', 'Token handling'] },
      {
        heading: 'Business Logic',
        intro: 'Particularly important — automated scanners often miss business-logic vulnerabilities.',
        items: [
          'Unauthorized workflow manipulation',
          'Price manipulation',
          'Accessing restricted functionality',
          'Improper transaction validation',
        ],
      },
      {
        heading: 'API Security',
        intro: 'Tested across REST APIs, GraphQL APIs, JSON endpoints, authentication APIs, payment APIs and internal APIs.',
        items: [
          'Authentication',
          'Authorization',
          'Rate limiting',
          'Input validation',
          'Token security',
          'Object-level authorization',
          'Sensitive information exposure',
          'API configuration',
          'Error handling',
        ],
      },
    ],
    deliverables: [
      'API attack-surface inventory',
      'Vulnerability report',
      'Risk classification',
      'Technical evidence',
      'Remediation guidance',
      'Retesting',
    ],
  },
  {
    slug: 'mobile-security',
    navLabel: 'Mobile Security',
    icon: Smartphone,
    tagline: 'Mobile Application Security',
    title: 'Mobile applications carry sensitive data — and talk to your backend constantly.',
    heroLine: 'Android, iOS, mobile APIs and the backend services behind them.',
    overview: [
      'Mobile applications contain sensitive information and frequently communicate with backend APIs. We provide security testing for Android, iOS, mobile APIs and backend services.',
    ],
    groupsLabel: 'What We Assess',
    groups: [
      {
        heading: 'Static Analysis',
        intro: 'Review application packages to identify security weaknesses.',
        items: ['Hardcoded secrets', 'Insecure configurations', 'Sensitive information', 'Cryptographic implementation', 'Third-party dependencies', 'Application permissions'],
      },
      {
        heading: 'Dynamic Analysis',
        intro: 'Evaluate application behaviour during execution.',
        items: ['Network communication', 'Authentication', 'Authorization', 'Local storage', 'Runtime behaviour', 'API communication'],
      },
      {
        heading: 'Data Security',
        intro: 'How applications handle sensitive material at rest and in transit.',
        items: ['Credentials', 'Tokens', 'Personal information', 'Application data', 'Sensitive business information'],
      },
      { heading: 'Network Security', items: ['TLS configuration', 'Certificate validation', 'Secure communication', 'API communication'] },
      {
        heading: 'Mobile API Security',
        intro: 'Because mobile apps rely heavily on APIs, the backend is assessed too.',
        items: ['Broken authorization', 'Authentication weaknesses', 'Excessive data exposure', 'Rate-limit weaknesses', 'Improper input validation'],
      },
    ],
    deliverables: [
      'Mobile security assessment report',
      'Vulnerability severity',
      'Evidence',
      'Affected application components',
      'Remediation recommendations',
      'Retesting report',
    ],
  },
  {
    slug: 'cloud-security',
    navLabel: 'Cloud Security',
    icon: Cloud,
    tagline: 'Cloud & Container Security',
    title: 'Misconfiguration, excessive permissions and exposed services — found before an attacker finds them.',
    heroLine: 'Assessments across AWS, Microsoft Azure, Google Cloud, Kubernetes and container environments.',
    overview: [
      'Cloud environments can become vulnerable because of misconfiguration, excessive permissions, exposed services, or weak identity controls.',
    ],
    groupsLabel: 'What We Assess',
    groups: [
      { heading: 'IAM Security', items: ['User permissions', 'Roles', 'Policies', 'Privilege levels', 'Service accounts', 'Access keys', 'MFA configuration'] },
      { heading: 'Storage Security', items: ['Public storage', 'Access controls', 'Encryption', 'Backup configuration', 'Data exposure'] },
      { heading: 'Network Security', items: ['Security groups', 'Firewall rules', 'Network segmentation', 'Public endpoints', 'Internet exposure'] },
      { heading: 'Cloud Configuration', items: ['Logging', 'Monitoring', 'Encryption', 'Secrets management', 'Security controls', 'Resource configurations'] },
      { heading: 'Container Security', items: ['Container images', 'Image vulnerabilities', 'Runtime configuration', 'Secrets', 'Container privileges'] },
      { heading: 'Kubernetes Security', items: ['RBAC', 'Cluster configuration', 'Network policies', 'Secrets', 'Workloads', 'Exposed services'] },
    ],
    deliverables: [
      'Cloud security assessment',
      'Misconfiguration report',
      'Risk register',
      'IAM findings',
      'Architecture recommendations',
      'Remediation roadmap',
    ],
  },
  {
    slug: 'network-security',
    navLabel: 'Network Security',
    icon: Network,
    tagline: 'Network & Infrastructure Security',
    title: 'Your infrastructure, evaluated from both outside and inside the perimeter.',
    heroLine: 'Authorized external and internal network assessments.',
    overview: [
      "Network security testing evaluates the organisation's infrastructure from authorised external and internal perspectives.",
    ],
    groupsLabel: 'What We Assess',
    groups: [
      { heading: 'External Network Assessment', items: ['Servers', 'Firewalls', 'VPN gateways', 'Remote services', 'Public applications', 'Network devices'] },
      { heading: 'Internal Network Assessment', items: ['Internal servers', 'Workstations', 'Network services', 'Access controls', 'Segmentation', 'Administrative interfaces'] },
      { heading: 'Firewall Assessment', items: ['Firewall rules', 'Unnecessary exposure', 'Access controls', 'Network segmentation'] },
      { heading: 'VPN Assessment', items: ['Authentication', 'Configuration', 'Encryption', 'Access restrictions'] },
      {
        heading: 'Active Directory Security',
        intro: 'For organisations using Windows domains.',
        items: ['Identity configuration', 'Privilege management', 'Authentication controls', 'Access relationships', 'Security configuration'],
      },
      {
        heading: 'Wireless Security',
        intro: 'Authorised wireless assessments.',
        items: ['Encryption configuration', 'Authentication', 'Network segmentation', 'Rogue access-point risks'],
      },
    ],
    deliverables: [
      'Infrastructure assessment report',
      'Vulnerability list',
      'Risk rating',
      'Network exposure analysis',
      'Remediation recommendations',
    ],
  },
  {
    slug: 'secure-code-review',
    navLabel: 'Secure Code Review',
    icon: CodeXml,
    tagline: 'Secure Code Review',
    title: 'Catch vulnerabilities in source code — before they ever reach production.',
    heroLine: 'Identify security problems during development, not after deployment.',
    overview: [
      'Secure code review identifies vulnerabilities directly in application source code. Instead of discovering a vulnerability after deployment, organisations can identify security problems during development.',
    ],
    groupsLabel: 'What We Review',
    groups: [
      { heading: 'Authentication', items: ['Login implementation', 'Password handling', 'MFA', 'Session management'] },
      { heading: 'Authorization', items: ['Access-control implementation', 'Role management', 'Permission validation'] },
      { heading: 'Input Handling', items: ['Input validation', 'Output encoding', 'Injection prevention'] },
      { heading: 'Cryptography', items: ['Encryption', 'Hashing', 'Key management', 'Random-number generation'] },
      {
        heading: 'Secrets',
        intro: 'Identify accidentally exposed credentials.',
        items: ['API keys', 'Passwords', 'Tokens', 'Credentials'],
      },
      {
        heading: 'Languages Covered',
        items: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'PHP', 'Go', 'C/C++', 'Kotlin'],
      },
    ],
    deliverables: [
      'Finding location',
      'Vulnerability description',
      'Risk rating',
      'Explanation',
      'Secure implementation guidance',
      'Recommendation',
    ],
  },
  {
    slug: 'devsecops',
    navLabel: 'DevSecOps',
    icon: GitBranch,
    tagline: 'DevSecOps',
    title: 'From "develop, deploy, discover vulnerability" to "develop, scan, fix, test, deploy."',
    heroLine: 'Security integrated directly into the software development lifecycle.',
    overview: [
      'DevSecOps integrates security into the software development lifecycle — moving security left so issues are caught during development, not after release.',
    ],
    groupsLabel: 'What We Cover',
    groups: [
      { heading: 'SAST', items: ['Static analysis of source code for security vulnerabilities'] },
      { heading: 'DAST', items: ['Dynamic testing of running applications'] },
      { heading: 'SCA', items: ['Identify vulnerable third-party dependencies'] },
      { heading: 'Secret Scanning', items: ['Detect accidentally committed credentials and secrets'] },
      { heading: 'Container Security', items: ['Assess container images and configurations'] },
      { heading: 'Infrastructure-as-Code Security', items: ['Terraform', 'Kubernetes manifests', 'Cloud infrastructure templates'] },
      { heading: 'CI/CD Integration', items: ['GitHub Actions', 'GitLab CI/CD', 'Jenkins', 'Azure DevOps', 'Other CI/CD systems'] },
      {
        heading: 'Security Gates',
        intro: 'Commit → SAST → Dependency Scan → Secret Scan → Build → Container Scan → DAST → Security Gate → Deployment.',
        items: [],
      },
    ],
    deliverables: [
      'DevSecOps maturity assessment',
      'Pipeline security architecture',
      'Security tooling recommendations',
      'CI/CD integration',
      'Security policies',
      'Continuous vulnerability monitoring',
    ],
  },
  {
    slug: 'compliance',
    navLabel: 'Compliance',
    icon: FileCheck2,
    tagline: 'Compliance & Security Audits',
    title: "Know precisely where your controls stand against the frameworks that matter to you.",
    heroLine: 'ISO 27001, SOC 2, PCI DSS, GDPR, HIPAA, NIST CSF and CIS Controls.',
    overview: [
      "Compliance services help organisations understand whether their security processes and controls align with applicable standards and requirements. The exact services depend on the organisation's industry and applicable requirements.",
    ],
    groupsLabel: 'What We Assess',
    groups: [
      {
        heading: 'Security Audit',
        items: [
          'Security policies',
          'Access control',
          'Asset management',
          'Risk management',
          'Incident response',
          'Business continuity',
          'Security monitoring',
          'Data protection',
        ],
      },
      {
        heading: 'Gap Assessment',
        intro: 'Current State → Required State → Gap → Remediation.',
        items: [],
      },
      {
        heading: 'Risk Assessment',
        items: ['Assets', 'Threats', 'Vulnerabilities', 'Business impact', 'Existing controls', 'Residual risk'],
      },
      {
        heading: 'Frameworks',
        items: ['ISO 27001', 'SOC 2', 'PCI DSS', 'GDPR', 'HIPAA', 'NIST Cybersecurity Framework', 'CIS Controls'],
      },
    ],
    deliverables: [
      'Gap assessment',
      'Risk register',
      'Control assessment',
      'Remediation roadmap',
      'Management report',
      'Policy recommendations',
    ],
  },
  {
    slug: 'red-teaming',
    navLabel: 'Red Teaming',
    icon: Swords,
    tagline: 'Red Teaming & Purple Teaming',
    title: 'A broader evaluation of your defensive capabilities through authorized adversary simulation.',
    heroLine: 'Attack paths and defensive effectiveness across multiple layers, not a single application.',
    overview: [
      "Unlike a traditional VAPT engagement that may focus on specific applications or infrastructure, red teaming evaluates attack paths and defensive effectiveness across multiple layers.",
    ],
    groupsLabel: 'What We Evaluate',
    groups: [
      { heading: 'External Attack Surface', items: ['Evaluate authorized internet-facing assets'] },
      { heading: 'Identity Security', items: ['Assess how identity and access controls withstand simulated attacks'] },
      { heading: 'Internal Security', items: ['Evaluate whether security boundaries and controls prevent unauthorized movement within the environment'] },
      { heading: 'Detection & Response', items: ['Determine whether defensive teams and controls can identify and respond to simulated malicious activity'] },
      {
        heading: 'Purple Teaming',
        intro: 'Combines offensive and defensive teams to improve:',
        items: ['Detection', 'Alerting', 'Investigation', 'Response', 'Security controls'],
      },
    ],
    deliverables: [
      'Executive attack narrative',
      'Attack-path analysis',
      'Security-control assessment',
      'Detection gaps',
      'Recommendations',
      'Remediation roadmap',
    ],
  },
  {
    slug: 'incident-response',
    navLabel: 'Incident Response',
    icon: Siren,
    tagline: 'Incident Response',
    title: 'A structured way to handle a security incident — from triage to recovery.',
    heroLine: 'Investigation, forensics, threat hunting and root-cause analysis under pressure.',
    overview: [
      'Incident response helps organisations handle cybersecurity incidents in a structured manner.',
    ],
    groupsLabel: 'What This Covers',
    groups: [
      {
        heading: 'Incident Triage',
        intro: 'What happened? Which systems are affected? What information is available? How severe is the incident?',
        items: [],
      },
      {
        heading: 'Investigation',
        intro: 'Analyse available evidence.',
        items: ['Logs', 'Security alerts', 'System activity', 'Network information', 'Endpoint telemetry'],
      },
      {
        heading: 'Digital Forensics',
        items: ['Where appropriate and authorised, investigate digital evidence to understand the incident timeline and scope'],
      },
      { heading: 'Threat Hunting', items: ['Search for indicators of suspicious activity across authorised environments'] },
      {
        heading: 'Root-Cause Analysis',
        intro: 'Initial Event → Security Weakness → Impact → Root Cause.',
        items: [],
      },
      { heading: 'Recovery', items: ['Contain the incident', 'Restore affected systems', 'Strengthen controls', 'Improve monitoring'] },
      {
        heading: 'Post-Incident Review',
        items: ['Identify security gaps', 'Update security controls', 'Improve response procedures', 'Update policies', 'Strengthen monitoring'],
      },
    ],
    deliverables: [
      'Incident investigation report',
      'Timeline',
      'Root-cause analysis',
      'Impact assessment',
      'Recommendations',
      'Security improvement roadmap',
    ],
  },
];

export function getServiceBySlug(slug: string): ServiceDetail | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
