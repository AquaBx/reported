export interface Settings {
    languages: Language[],
    themeColor: string,
    reportStyle: string
}

export interface Language {
    label: string,
    code: string
}

export interface CvssV4 {
    AV: string; AC: string; AT: string; PR: string; UI: string;
    VC: string; VI: string; VA: string; SC: string; SI: string; SA: string;
    [key: string]: string;
}

export interface Vulnerability {
    _id?: string;
    title: Record<string, string>;
    category: Record<string, string>;
    description: Record<string, string>;
    impact: Record<string, string>;
    remediation: Record<string, string>;
    procedure: Record<string, string>;
    cvss: CvssV4;
}

export interface AuditVulnerability {
    title: string;
    category: string;
    description: string;
    procedure: string;
    impact: string;
    remediation: string;
    cvss: CvssV4;
}

export interface Work {
    _id?: string;
    title: Record<string, string>;
    description: Record<string, string>;
}

export interface AuditWork {
    title: string;
    description: string;
}

export interface Auditor {
    id: string;
    name: string;
    role: string;
    email?: string;
    phone?: string;
}

export interface Client {
    id: string;
    name: string;
    shortname?: string;
    email?: string;
    logo?: string;
    address?: string;
}

export interface Setting {
    key: string;
    value: any;
}

export interface Audit {
    _id?: string;
    name: string;
    client?: Client;
    date_start: Date;
    date_end: Date;
    state: 'In Progress' | 'Review' | 'Approved' | 'Cancelled';
    confidentiality: string;
    lang: string;
    auditors: Array<Auditor>;
    tracking: Array<{ version: string; date: string; author: string; description: string; }>;
    detailedWork: Array<AuditWork>;
    vulnerabilities: AuditVulnerability[];
    content: Record<string, string>;
    updatedAt?: Date;
    createdAt?: Date;
}
export function MergeOrCreateAudit(initial: Partial<Audit> = {}): Audit {
    return {
        name: initial.name || "Nouveau Pentest",
        state: initial.state || "In Progress",
        client: initial.client || undefined,
        date_start: initial.date_start || new Date(),
        date_end: initial.date_end || new Date(),
        confidentiality: initial.confidentiality || "Confidentiel",
        lang: initial.lang || 'fr',
        auditors: initial.auditors || [],
        tracking: initial.tracking || [],
        detailedWork: initial.detailedWork || [],
        vulnerabilities: initial.vulnerabilities || [],
        content: initial.content || {}
    }
}