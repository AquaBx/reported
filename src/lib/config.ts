import type { Vulnerability } from "./index";

export const DICTIONARY = {
    config: { fr: "Design & Projet", en: "Design & Project" },
    contacts: { fr: "Vos Contacts", en: "Contacts" },
    tracking: { fr: "Suivi du document", en: "Document Tracking" },
    introduction: { fr: "Introduction", en: "Introduction" },
    summary: { fr: "Résumé Managérial", en: "Management Summary" },
    work: { fr: "Travaux Détaillés", en: "Detailed Work" },
    vulnerabilities: { fr: "Vulnérabilités", en: "Vulnerabilities" },
    toc: { fr: "Table des matières", en: "Table of Contents" },
    vulns_discovered: { fr: "Vulnérabilités découvertes", en: "Discovered Vulnerabilities" },
    audit_report: { fr: "Rapport d'Audit", en: "Audit Report" },
    lang: { fr: "Langue du Rapport", en: "Report Language" },
    title: { fr: "Titre du Rapport", en: "Report Title" },
    client: { fr: "Client", en: "Client" },
    version: { fr: "Version", en: "Version" },
    date: { fr: "Date", en: "Date" },
    confidentiality: { fr: "Confidentialité", en: "Confidentiality" },
    themeColor: { fr: "Couleur Thème", en: "Theme Color" },
    customCSS: { fr: "CSS Personnalisé", en: "Custom CSS" },
    name: { fr: "Nom", en: "Name" },
    role: { fr: "Rôle", en: "Role" },
    email: { fr: "Email", en: "Email" },
    author: { fr: "Auteur", en: "Author" },
    description: { fr: "Description", en: "Description" },
    context: { fr: "Contexte", en: "Context" },
    objectives: { fr: "Objectifs", en: "Objectives" },
    stakeholders: { fr: "Intervenants", en: "Stakeholders" },
    mailing: { fr: "Liste de diffusion", en: "Mailing List" },
    period: { fr: "Période d'audit", en: "Audit Period" },
    scope: { fr: "Périmètre technique", en: "Technical Scope" },
    sum_work: { fr: "Synthèse des travaux", en: "Work Summary" },
    sum_security: { fr: "Niveau global", en: "Global Security Level" },
    sum_vulns: { fr: "Synthèse vulnérabilités", en: "Vulnerabilities Summary" },
    sum_recos: { fr: "Synthèse recommandations", en: "Recommendations Summary" },
    category: { fr: "Catégorie", en: "Category" },
    cvss: { fr: "CVSS ", en: "CVSS " },
    impact: { fr: "Impact", en: "Impact" },
    procedure: { fr: "Reproduction", en: "Reproduction" },
    remediation: { fr: "Remédiation", en: "Remediation" },
    severity: { fr: "SÉVÉRITÉ", en: "SEVERITY" },
    none: { fr: "Non renseigné.", en: "Not provided." },
    delete: { fr: "Supprimer", en: "Delete" },
    vulnerability_db: { fr: "Base de vulnérabilités", en: "Vulnerability Database" }
};

export interface LocalizedVulnerability {
    title: { fr: string; en: string };
    category: { fr: string; en: string };
    description: { fr: string; en: string };
    impact: { fr: string; en: string };
    remediation: { fr: string; en: string };
    cvss: any;
}

export const VULNERABILITY_DB: LocalizedVulnerability[] = [
    {
        title: { fr: "Cross-Site Scripting (XSS) - Réfléchie", en: "Reflected Cross-Site Scripting (XSS)" },
        category: { fr: "Sécurité Web", en: "Web Security" },
        description: { 
            fr: "L'application ne neutralise pas ou neutralise mal des entrées fournies par l'utilisateur qui sont ensuite incluses dans une page web générée dynamiquement.", 
            en: "The application does not properly neutralize user-supplied input that is later included in dynamically generated web pages." 
        },
        impact: { 
            fr: "Un attaquant peut exécuter des scripts malveillants dans le navigateur de la victime, permettant le vol de session ou la modification du contenu.", 
            en: "An attacker can execute malicious scripts in the victim's browser, leading to session theft or content manipulation." 
        },
        remediation: { 
            fr: "Échapper systématiquement les données en fonction du contexte de sortie et mettre en œuvre une CSP.", 
            en: "Systematically escape data based on the output context and implement a Content Security Policy (CSP)." 
        },
        cvss: { AV: "N", AC: "L", AT: "N", PR: "N", UI: "P", VC: "L", VI: "L", VA: "N", SC: "N", SI: "N", SA: "N" }
    },
    {
        title: { fr: "Injection SQL", en: "SQL Injection" },
        category: { fr: "Injection", en: "Injection" },
        description: { 
            fr: "Les entrées utilisateur ne sont pas correctement filtrées avant d'être utilisées dans une requête SQL.", 
            en: "User inputs are not properly filtered before being used in a SQL query." 
        },
        impact: { 
            fr: "Accès non autorisé aux données sensibles, modification ou suppression de données.", 
            en: "Unauthorized access to sensitive data, data modification or deletion." 
        },
        remediation: { 
            fr: "Utiliser exclusivement des requêtes préparées (paramétrées).", 
            en: "Use exclusively prepared statements (parameterized queries)." 
        },
        cvss: { AV: "N", AC: "L", AT: "N", PR: "N", UI: "N", VC: "H", VI: "H", VA: "H", SC: "N", SI: "N", SA: "N" }
    }
];

export interface LocalizedWork {
    title: { fr: string; en: string };
    description: { fr: string; en: string };
}

export const WORK_DB: LocalizedWork[] = [
    {
        title: { fr: "Phase de Reconnaissance", en: "Reconnaissance Phase" },
        description: { 
            fr: "Identification des actifs exposés et cartographie de la surface d'attaque.", 
            en: "Identification of exposed assets and attack surface mapping." 
        }
    },
    {
        title: { fr: "Tests d'Intrusion Externes", en: "External Penetration Testing" },
        description: { 
            fr: "Tentatives d'exploitation des vulnérabilités identifiées depuis l'extérieur du réseau.", 
            en: "Attempts to exploit identified vulnerabilities from outside the network." 
        }
    }
];
