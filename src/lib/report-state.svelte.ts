import { Bug, Users, History, Info, ChartColumn, ShieldCheck, Settings as SettingsIcon, SquarePen } from "@lucide/svelte";
import { DICTIONARY } from "./config";
import type { Audit, Client, Settings, Vulnerability, Work } from "./interfaces";
import { MergeOrCreateAudit } from "./interfaces";

export type Section = "config" | "contacts" | "tracking" | "introduction" | "summary" | "work" | "vulnerabilities" | "vulnerability_db" | "work_db";

const CVSS_DEFAULT = { AV: "N", AC: "L", AT: "N", PR: "N", UI: "N", VC: "N", VI: "N", VA: "N", SC: "N", SI: "N", SA: "N" };

const f = (id: string, type: any = 'rich', path?: string) => ({ id, label: id.replace(/intro_|sum_/, ''), type, path: path || `content.${id}` });

export class ReportState {
    report = $state<Audit>(null!);
    activeSection = $state<Section | null>(null);
    activeCollection = $state<"vulnerabilities" | "detailedWork" | null>(null);
    activeIndex = $state<number | null>(null);

    vulnDb = $state<Vulnerability[]>([]);
    workDb = $state<Work[]>([]);
    clients = $state<Client[]>([]);
    settings = $state<Settings>({ languages: [], reportStyle: "", themeColor: "" })
    lang = $derived(this.report.lang);

    constructor(initialData: Audit, dbVulnerabilities: Vulnerability[], dbWorks: Work[], dbClients: Client[], dbSettings: Settings) {
        this.vulnDb = dbVulnerabilities;
        this.workDb = dbWorks;
        this.clients = dbClients;
        this.settings = dbSettings;
        this.report = MergeOrCreateAudit(initialData);
    }

    t = (key: string) => (DICTIONARY as any)[key]?.[this.lang] || key;

    private mapItem(item: any, fields: string[]) {
        const mapped = { ...item };
        fields.forEach(f => mapped[f] = item[f]?.[this.lang] || Object.values(item[f] || {})[0] || "");
        return mapped;
    }

    vulnsForLang = $derived(this.vulnDb.map(v => this.mapItem(v, ['title', 'category', 'description', 'impact', 'remediation'])));
    worksForLang = $derived(this.workDb.map(w => this.mapItem(w, ['title', 'description'])));

    get sectionsConfig(): Record<string, any> {
        return {
            config: {
                title: "Configuration", icon: SettingsIcon, fields: [
                    { id: 'lang', label: 'lang', type: 'select', path: 'lang', options: this.settings.languages.map(l => ({ label: l.label, value: l.code })) },
                    { id: 'name', label: 'name', type: 'input', path: 'name' },
                    { id: 'client', label: 'client', type: 'select', path: 'client', options: this.clients.map(c => ({ label: c.name, value: c })) },
                    { id: 'state', label: 'status', type: 'select', path: 'state', options: ['In Progress', 'Review', 'Approved', 'Cancelled'].map(s => ({ label: s, value: s })) },
                    { id: 'date_start', label: 'date_start', type: 'date', path: 'date_start' },
                    { id: 'date_end', label: 'date_end', type: 'date', path: 'date_end' },
                    { id: 'confidentiality', label: 'confidentiality', type: 'select', path: 'confidentiality', options: ['Confidentiel', 'Public'].map(s => ({ label: s, value: s })) },
                ]
            },
            contacts: { title: this.t('contacts'), icon: Users, fields: [{ id: 'contacts', label: 'contacts', type: 'list', path: 'contacts', fields: ['name', 'role', 'email'].map(id => ({ id, label: id, type: 'input' })) }] },
            tracking: { title: this.t('tracking'), icon: History, fields: [{ id: 'tracking', label: 'tracking', type: 'list', path: 'tracking', fields: ['version', 'date', 'author', 'description'].map(id => ({ id, label: id, type: 'input' })) }] },
            introduction: { title: this.t('introduction'), icon: Info, fields: ['intro_context', 'intro_objectives', 'intro_stakeholders', 'intro_mailing', 'intro_period', 'intro_scope'].map(id => f(id, id.includes('period') ? 'input' : 'rich')) },
            summary: { title: this.t('summary'), icon: ChartColumn, fields: ['sum_work', 'sum_security', 'sum_vulns', 'sum_recos'].map(id => f(id)) },
            work: { title: this.t('work'), icon: ShieldCheck, fields: [{ id: 'title', label: 'title', type: 'input' }, f('description', 'rich', 'description')] },
            vulnerabilities: { title: this.t('vulnerabilities'), icon: Bug, fields: [{ id: 'title', label: 'title', type: 'input' }, { id: 'category', label: 'category', type: 'input' }, { id: 'cvss', label: 'cvss', type: 'cvss' }, ...['description', 'impact', 'procedure', 'remediation'].map(id => f(id, 'rich', id))] }
        };
    }

    editorInfo = $derived(this.activeIndex !== null ? this.sectionsConfig[this.activeCollection === 'vulnerabilities' ? 'vulnerabilities' : 'work'] : this.sectionsConfig[this.activeSection!] || { title: "Édition", icon: SquarePen, fields: [] });

    sommaire = $derived([
        { numero: "1", title: this.t('contacts') },
        { numero: "2", title: this.t('tracking') },
        { numero: "3", title: this.t('introduction') },
        { numero: "4", title: this.t('summary') },
        { numero: "5", title: this.t('work') },
        ...this.report.detailedWork.map((t, i) => ({ numero: `5.${i + 1}`, title: t.title })),
        { numero: "6", title: this.t('vulns_discovered') },
        ...this.report.vulnerabilities.map((v, i) => ({ numero: `6.${i + 1}`, title: v.title })),
    ]);

    open = (s: Section | null = null, coll: any = null, idx: any = null) => { this.activeSection = s; this.activeCollection = coll; this.activeIndex = idx; };
    closeEditor = () => this.open();
    openVulnerability = (i: number) => this.open(null, 'vulnerabilities', i);
    openWorkItem = (i: number) => this.open(null, 'detailedWork', i);
    openLibrary = (type: 'vuln' | 'work') => this.open(type === 'vuln' ? 'vulnerability_db' : 'work_db');

    addItem = (coll: 'contacts' | 'tracking' | 'detailedWork' | 'vulnerabilities', item: any) => {
        (this.report as any)[coll] = [...(this.report as any)[coll], item];
        if (coll === 'detailedWork') this.openWorkItem(this.report.detailedWork.length - 1);
        if (coll === 'vulnerabilities') this.openVulnerability(this.report.vulnerabilities.length - 1);
    };

    addCurrentSectionItem = () => {
        if (this.activeSection === 'contacts') this.addItem('contacts', { name: "", role: "", email: "" });
        if (this.activeSection === 'tracking') this.addItem('tracking', { version: "", date: "", author: "", description: "" });
    };

    addNewWork = () => this.addItem('detailedWork', { title: "Nouveaux travaux", description: "" });
    addNewVulnerability = () => this.addItem('vulnerabilities', { id: crypto.randomUUID(), title: "Nouvelle vuln", category: "Web", cvss: { ...CVSS_DEFAULT }, description: "", procedure: "", impact: "", remediation: "" });

    addFromDb = (tpl: any, type: 'vuln' | 'work') => {
        const get = (v: any) => v?.[this.lang] || Object.values(v || {})[0] || "";
        if (type === 'vuln') {
            this.addItem('vulnerabilities', { id: crypto.randomUUID(), title: get(tpl.title), category: get(tpl.category) || "Web", cvss: tpl.cvss ? { ...tpl.cvss } : { ...CVSS_DEFAULT }, description: get(tpl.description), procedure: get(tpl.procedure), impact: get(tpl.impact), remediation: get(tpl.remediation) });
        } else {
            this.addItem('detailedWork', { title: get(tpl.title), description: get(tpl.description) });
        }
    };

    deleteItem = (coll: 'detailedWork' | 'vulnerabilities', i: number) => {
        (this.report as any)[coll] = (this.report as any)[coll].filter((_: any, idx: number) => idx !== i);
        this.closeEditor();
    };

    exportHTML = () => {
        const el = document.getElementById("report-preview");
        if (!el) return;
        const html = `<!DOCTYPE html><html><head><style>${this.settings.reportStyle}</style></head><body><div style="--report-accent: ${this.settings.themeColor}">${el.outerHTML}</div></body></html>`;
        const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([html], { type: "text/html" })); a.download = `rapport_${this.report.client?.name}.html`; a.click();
    };

    exportJSON = () => {
        const data = JSON.stringify(this.report, null, 2);
        const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([data], { type: "application/json" })); a.download = `audit_${this.report.name}.json`; a.click();
    };

    loadReport = (e: Event) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => this.report = JSON.parse(ev.target?.result as string);
        reader.readAsText(file);
    };
}
