import { type Report, createReport, DEFAULT_CSS } from "./index";
import { Bug, FileText, Users, History, Info, BarChart3, ShieldCheck, Edit2, Database } from "lucide-svelte";
import { DICTIONARY, VULNERABILITY_DB, WORK_DB } from "./config";

export type Section = "config" | "contacts" | "tracking" | "introduction" | "summary" | "work" | "vulnerabilities" | "vulnerability_db" | "work_db" | null;

export interface FieldConfig {
    id: string;
    label: string;
    type: "input" | "textarea" | "rich" | "color" | "cvss" | "list" | "select";
    path?: string;
    fields?: FieldConfig[];
    options?: { label: string, value: string }[];
}

export interface SectionConfig {
    title: string;
    icon: any;
    fields: FieldConfig[];
}

export class ReportState {
    report = $state<Report>(createReport());
    activeSection = $state<Section>(null);
    activeCollection = $state<"vulnerabilities" | "detailedWork" | null>(null);
    activeIndex = $state<number | null>(null);

    dict = DICTIONARY;
    vulnDb = VULNERABILITY_DB;
    workDb = WORK_DB;

    vulnsForLang = $derived(this.vulnDb.map(v => ({
        ...v,
        title: v.title[this.report.meta.lang],
        category: v.category[this.report.meta.lang],
        description: v.description[this.report.meta.lang],
        impact: v.impact[this.report.meta.lang],
        remediation: v.remediation[this.report.meta.lang],
    })));
    
    worksForLang = $derived(this.workDb.map(w => ({
        ...w,
        title: w.title[this.report.meta.lang],
        description: w.description[this.report.meta.lang],
    })));

    t = (key: string) => (this.dict as any)[key]?.[this.report.meta.lang] || key;

    sectionsConfig = $derived.by<Record<string, SectionConfig>>(() => ({
        config: {
            title: this.t('config'), icon: FileText,
            fields: [
                { id: 'lang', label: 'lang', type: 'select', path: 'meta.lang', options: [{label: 'Français', value: 'fr'}, {label: 'English', value: 'en'}] },
                { id: 'title', label: 'title', type: 'input', path: 'meta.title' },
                { id: 'client', label: 'client', type: 'input', path: 'meta.client' },
                { id: 'version', label: 'version', type: 'input', path: 'meta.version' },
                { id: 'date', label: 'date', type: 'input', path: 'meta.date' },
                { id: 'confidentiality', label: 'confidentiality', type: 'input', path: 'meta.confidentiality' },
                { id: 'themeColor', label: 'themeColor', type: 'color', path: 'meta.themeColor' },
                { id: 'customCSS', label: 'customCSS', type: 'textarea', path: 'meta.customCSS' }
            ]
        },
        contacts: {
            title: this.t('contacts'), icon: Users,
            fields: [{ id: 'contacts', label: 'contacts', type: 'list', path: 'contacts', fields: [
                { id: 'name', label: 'name', type: 'input' },
                { id: 'role', label: 'role', type: 'input' },
                { id: 'email', label: 'email', type: 'input' }
            ]}]
        },
        tracking: {
            title: this.t('tracking'), icon: History,
            fields: [{ id: 'tracking', label: 'tracking', type: 'list', path: 'tracking', fields: [
                { id: 'version', label: 'version', type: 'input' },
                { id: 'date', label: 'date', type: 'input' },
                { id: 'author', label: 'author', type: 'input' },
                { id: 'description', label: 'description', type: 'input' }
            ]}]
        },
        introduction: {
            title: this.t('introduction'), icon: Info,
            fields: [
                { id: 'intro_context', label: 'context', type: 'rich', path: 'content.intro_context' },
                { id: 'intro_objectives', label: 'objectives', type: 'rich', path: 'content.intro_objectives' },
                { id: 'intro_stakeholders', label: 'stakeholders', type: 'rich', path: 'content.intro_stakeholders' },
                { id: 'intro_mailing', label: 'mailing', type: 'rich', path: 'content.intro_mailing' },
                { id: 'intro_period', label: 'period', type: 'input', path: 'content.intro_period' },
                { id: 'intro_scope', label: 'scope', type: 'rich', path: 'content.intro_scope' }
            ]
        },
        summary: {
            title: this.t('summary'), icon: BarChart3,
            fields: [
                { id: 'sum_work', label: 'sum_work', type: 'rich', path: 'content.sum_work' },
                { id: 'sum_security', label: 'sum_security', type: 'rich', path: 'content.sum_security' },
                { id: 'sum_vulns', label: 'sum_vulns', type: 'rich', path: 'content.sum_vulns' },
                { id: 'sum_recos', label: 'sum_recos', type: 'rich', path: 'content.sum_recos' }
            ]
        },
        work: {
            title: this.t('work'), icon: ShieldCheck,
            fields: [
                { id: 'title', label: 'title', type: 'input' },
                { id: 'description', label: 'description', type: 'rich' }
            ]
        },
        vulnerabilities: {
            title: this.t('vulnerabilities'), icon: Bug,
            fields: [
                { id: 'title', label: 'title', type: 'input' },
                { id: 'category', label: 'category', type: 'input' },
                { id: 'cvss', label: 'cvss', type: 'cvss' },
                { id: 'description', label: 'description', type: 'rich' },
                { id: 'impact', label: 'impact', type: 'rich' },
                { id: 'procedure', label: 'procedure', type: 'rich' },
                { id: 'remediation', label: 'remediation', type: 'rich' }
            ]
        },
        vulnerability_db: {
            title: this.t('vulnerability_db'), icon: Database,
            fields: []
        },
        work_db: {
            title: this.t('vulnerability_db'), icon: Database,
            fields: []
        }
    }));

    editorInfo = $derived.by(() => {
        if (this.activeIndex !== null && this.activeCollection) return this.sectionsConfig[this.activeCollection === 'vulnerabilities' ? 'vulnerabilities' : 'work'];
        return this.activeSection ? this.sectionsConfig[this.activeSection] : { title: "Édition", icon: Edit2, fields: [] };
    });

    sommaire = $derived([
        { numero: "1", title: this.t('contacts') },
        { numero: "2", title: this.t('tracking') },
        { numero: "3", title: this.t('introduction') },
        { numero: "4", title: this.t('summary') },
        { numero: "5", title: this.t('work') },
        ...this.report.detailedWork.map((task, i) => ({ numero: `5.${i + 1}`, title: task.title })),
        { numero: "6", title: this.t('vulns_discovered') },
        ...this.report.vulnerabilities.map((vuln, i) => ({ numero: `6.${i + 1}`, title: vuln.title })),
    ]);

    openSection = (s: Section) => { this.activeIndex = null; this.activeCollection = null; this.activeSection = s; };
    openVulnerability = (i: number) => { this.activeSection = null; this.activeCollection = 'vulnerabilities'; this.activeIndex = i; };
    openWorkItem = (i: number) => { this.activeSection = null; this.activeCollection = 'detailedWork'; this.activeIndex = i; };
    closeEditor = () => { this.activeSection = null; this.activeCollection = null; this.activeIndex = null; };

    addContact = () => this.report.contacts.push({ name: "", role: "", email: "" });
    addTracking = () => this.report.tracking.push({ version: "", date: "", author: "", description: "" });
    addWork = () => {
        this.report.detailedWork.push({ title: "Nouveaux travaux", description: "" });
        this.openWorkItem(this.report.detailedWork.length - 1);
    };
    addWorkFromDb = (template: any) => {
        this.report.detailedWork.push({
            title: template.title || "Nouveau travail",
            description: template.description || ""
        });
        this.openWorkItem(this.report.detailedWork.length - 1);
    };

    addVulnerability = () => {
        this.report.vulnerabilities.push({
            id: crypto.randomUUID(), title: "Nouvelle vuln", category: "Web",
            cvss: { AV: "N", AC: "L", AT: "N", PR: "N", UI: "N", VC: "N", VI: "N", VA: "N", SC: "N", SI: "N", SA: "N" },
            description: "", procedure: "", impact: "", remediation: ""
        });
        this.openVulnerability(this.report.vulnerabilities.length - 1);
    };

    addVulnerabilityFromDb = (template: any) => {
        this.report.vulnerabilities.push({
            id: crypto.randomUUID(),
            title: template.title || "Nouvelle vuln",
            category: template.category || "Web",
            cvss: template.cvss ? { ...template.cvss } : { AV: "N", AC: "L", AT: "N", PR: "N", UI: "N", VC: "N", VI: "N", VA: "N", SC: "N", SI: "N", SA: "N" },
            description: template.description || "",
            procedure: template.procedure || "",
            impact: template.impact || "",
            remediation: template.remediation || ""
        });
        this.openVulnerability(this.report.vulnerabilities.length - 1);
    };

    deleteVulnerability = (i: number) => {
        this.report.vulnerabilities.splice(i, 1);
        this.closeEditor();
    };

    deleteWork = (i: number) => {
        this.report.detailedWork.splice(i, 1);
        this.closeEditor();
    };

    saveReport = () => {
        const data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.report, null, 2));
        const a = document.createElement("a");
        a.href = data; a.download = `rapport_${this.report.meta.client}.json`; a.click();
    };

    exportHTML = () => {
        const el = document.getElementById("report-preview");
        if (!el) return;
        const html = `<!DOCTYPE html><html><head><style>${this.report.meta.customCSS}</style></head><body><div style="--report-accent: ${this.report.meta.themeColor}">${el.outerHTML}</div></body></html>`;
        const blob = new Blob([html], { type: "text/html" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob); a.download = `rapport_${this.report.meta.client}.html`; a.click();
    };

    loadReport = (e: Event) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                const data = JSON.parse(ev.target?.result as string);
                if (!data.meta.customCSS) data.meta.customCSS = DEFAULT_CSS;
                this.report = data;
            };
            reader.readAsText(file);
        }
    };
}
