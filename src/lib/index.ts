// place files you want to import through the `$lib` alias in self folder.


export interface CvssV4 {
    AV: string
    AC: string
    AT: string
    PR: string
    UI: string
    VC: string
    VI: string
    VA: string
    SC: string
    SI: string
    SA: string
}

export function toStringVector(self: CvssV4) {
    return `CVSS:4.0/AV:${self.AV}/AC:${self.AC}/AT:${self.AT}/PR:${self.PR}/UI:${self.UI}/VC:${self.VC}/VI:${self.VI}/VA:${self.VA}/SC:${self.SC}/SI:${self.SI}/SA:${self.SA}`;
}

export function colorCvss(score: number) {
    return score >= 9.0
        ? "text-red-600 bg-red-100 border-red-200"
        : score >= 7.0
            ? "text-orange-600 bg-orange-100 border-orange-200"
            : score >= 4.0
                ? "text-yellow-600 bg-yellow-100 border-yellow-200"
                : score > 0
                    ? "text-green-600 bg-green-100 border-green-200"
                    : "text-gray-600 bg-gray-100 border-gray-200"
}

export interface Vulnerability {
    id: string;
    title: string;
    category: string;
    cvss: CvssV4;
    description: string;
    procedure: string;
    impact: string;
    remediation: string;
    status: string;
}

export interface Contact {
    name: string;
    role: string;
    email: string;
}

export interface Tracking {
    version: string;
    date: string;
    author: string;
    description: string;
}

export interface Report {
    document: {
        client: string;
        title: string;
        version: string;
        date: Date;
        auditor: string;
        confidentiality: string;
    };
    contacts: Contact[];
    tracking: Tracking[];
    introduction: {
        context: string;
        objectives: string;
        stakeholders: string;
        mailingList: string;
        period: string;
        scope: string;
    };
    managementSummary: {
        workDone: string;
        globalSecurityLevel: string;
        vulnerabilitiesOverview: string;
        recommendationsOverview: string;
    };
    detailedWork: {
        methodology: string;
        discovery: string;
        osint: string;
        networkScan: string;
        appScan: string;
        waf: string;
        xss: string;
        sqli: string;
        permissions: string;
    };
    style: {
        themeColor: string;
        fontFamily: string;
        headerStyle: string;
        logoBase64: string;
    };
    vulnerabilities: Vulnerability[];
}