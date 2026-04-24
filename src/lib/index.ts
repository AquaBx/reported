export const DEFAULT_CSS = `
:root {
    --report-bg: #ffffff;
    --report-text: #18181b;
    --report-muted: #71717a;
    --report-border: #e4e4e7;
}

.report-container {
    background-color: var(--report-bg);
    margin: 0 auto;
    width: 100%;
    max-width: 800px;
    min-height: 297mm;
    padding: 80px;
    font-family: 'Inter', system-ui, sans-serif;
    color: var(--report-text);
    line-height: 1.6;
}

/* Titres Harmonisés */
.title-h1 {
    font-size: 3.5rem;
    font-weight: 900;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
    letter-spacing: -0.04em;
    border-left: 15px solid var(--report-accent);
    padding-left: 30px;
}

.title-h2 {
    font-size: 1.5rem;
    font-weight: 800;
    text-transform: uppercase;
    margin: 4rem 0 2rem 0;
    display: flex;
    align-items: center;
    gap: 1rem;
}

.title-h2::after {
    content: "";
    flex: 1;
    height: 1px;
    background: var(--report-border);
}

.title-h3 {
    font-size: 1.1rem;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--report-accent);
    margin: 2.5rem 0 1rem 0;
    letter-spacing: 0.05em;
}

.number-prefix {
    color: var(--report-accent);
    font-weight: 900;
}

/* Tableaux avec Arrondis (Retour au style apprécié) */
.report-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid var(--report-border);
    margin-bottom: 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}

.report-table th {
    text-align: left;
    padding: 1rem;
    background: #fcfcfd;
    border-bottom: 1px solid var(--report-border);
    font-weight: 700;
    text-transform: uppercase;
    color: var(--report-muted);
    font-size: 0.7rem;
    letter-spacing: 0.05em;
}

.report-table td {
    padding: 1rem;
    border-bottom: 1px solid var(--report-border);
    font-size: 0.9rem;
}

.report-table tr:last-child td {
    border-bottom: none;
}

.report-meta-grid {
    margin-top: 80px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-left: 45px;
}

/* Nouveau Format de Vulnérabilité (Badges visuels) */
.vuln-entry {
    margin-bottom: 5rem;
    page-break-inside: avoid;
}

.vuln-badges-row {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    flex-wrap: wrap;
}

.badge-pill {
    padding: 4px 12px;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 800;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 6px;
    border: 1px solid transparent;
}

.badge-label {
    opacity: 0.7;
    font-weight: 600;
    font-size: 0.65rem;
}

.cvss-vector-box {
    font-family: monospace;
    font-size: 0.65rem;
    color: var(--report-muted);
    background: #f8fafc;
    padding: 6px 12px;
    border-radius: 4px;
    display: inline-block;
    margin-top: 10px;
}

/* Utilitaires */
.prose {
    font-size: 0.95rem;
    color: #3f3f46;
}

.prose p {
    margin-bottom: 1rem;
}

.prose pre {
    background: #09090b;
    color: #4ade80;
    padding: 1.5rem;
    border-radius: 8px;
    font-family: monospace;
    font-size: 0.8rem;
    border: 1px solid #27272a;
}

.accent-text {
    color: var(--report-accent);
    font-weight: 700;
}

/* Graphique CVSS */
.cvss-horizontal-chart {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    margin: 2rem 0;
    background: #fcfcfd;
    padding: 25px;
    border-radius: 12px;
    border: 1px solid var(--report-border);
}

.chart-row {
    display: flex;
    align-items: center;
    gap: 12px;
    height: 22px;
}

.row-label {
    width: 80px;
    font-size: 8px;
    font-weight: 800;
    text-transform: uppercase;
    color: var(--report-muted);
    text-align: right;
}

.row-bar-container {
    flex: 1;
    background: #f4f4f5;
    height: 100%;
    border-radius: 4px;
    overflow: hidden;
}

.row-bar-fill {
    height: 100%;
    border-radius: 0 4px 4px 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 8px;
}

.row-bar-count {
    color: white;
    font-size: 10px;
    font-weight: 900;
}

.meta-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.meta-label {
    font-size: 0.65rem;
    font-weight: 800;
    text-transform: uppercase;
    color: var(--report-muted);
}

.meta-value {
    font-size: 0.95rem;
    font-weight: 600;
    text-transform: capitalize;
}

.meta-value.badge {
    background: #f1f5f9;
    padding: 2px 10px;
    border-radius: 6px;
    width: fit-content;
    font-size: 0.8rem;
}

.detail-label {
    font-size: 0.75rem;
    font-weight: 800;
    text-transform: uppercase;
    color: var(--report-accent);
    margin-bottom: 0.5rem;
    letter-spacing: 0.05em;
}


@media print {
    .report-container {
        padding: 0;
    }
}
`.trim();


export interface CvssV4 { AV: string; AC: string; AT: string; PR: string; UI: string; VC: string; VI: string; VA: string; SC: string; SI: string; SA: string; [key: string]: string; }

export function toStringVector(s: CvssV4) { return `CVSS:4.0/AV:${s.AV}/AC:${s.AC}/AT:${s.AT}/PR:${s.PR}/UI:${s.UI}/VC:${s.VC}/VI:${s.VI}/VA:${s.VA}/SC:${s.SC}/SI:${s.SI}/SA:${s.SA}`; }

export const colors = { Critical: "#dc2626", High: "#ea580c", Medium: "#ca8a04", Low: "#16a34a", Info: "#2563eb" };
export function colorCvss(s: number) {
    if (s >= 9.0) return { bg: "#fef2f2", text: colors.Critical, border: "#fee2e2" };
    if (s >= 7.0) return { bg: "#fff7ed", text: colors.High, border: "#ffedd5" };
    if (s >= 4.0) return { bg: "#fefce8", text: colors.Medium, border: "#fef9c3" };
    if (s > 0) return { bg: "#f0fdf4", text: colors.Low, border: "#dcfce7" };
    return { bg: "#f9fafb", text: colors.Info, border: "#f3f4f6" };
}
export function severityLabel(s: number) { if (s >= 9.0) return "CRITIQUE"; if (s >= 7.0) return "ÉLEVÉE"; if (s >= 4.0) return "MOYENNE"; if (s > 0) return "FAIBLE"; return "INFO"; }

export interface Vulnerability { id: string; title: string; category: string; cvss: CvssV4; description: string; procedure: string; impact: string; remediation: string; }

export interface Report {
    meta: { title: string; client: string; version: string; date: string; confidentiality: string; themeColor: string; customCSS: string; lang: 'fr' | 'en'; };
    contacts: Array<{ name: string; role: string; email: string; }>;
    tracking: Array<{ version: string; date: string; author: string; description: string; }>;
    detailedWork: Array<{ title: string; description: string; }>;
    vulnerabilities: Vulnerability[];
    content: Record<string, string>;
}

export function createReport(): Report {
    return {
        meta: { title: "Nouveau Rapport", client: "Client", version: "1.0", date: new Date().toISOString().split('T')[0], confidentiality: "Confidentiel", themeColor: "#2563eb", customCSS: DEFAULT_CSS, lang: 'fr' },
        contacts: [],
        tracking: [],
        detailedWork: [],
        vulnerabilities: [],
        content: {
            intro_context: "", intro_objectives: "", intro_stakeholders: "", intro_mailing: "", intro_period: "", intro_scope: "",
            sum_work: "", sum_security: "", sum_vulns: "", sum_recos: ""
        }
    }
}
