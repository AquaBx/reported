import mongoose from 'mongoose';
import type { Audit, Client, Vulnerability, Work, Setting, Auditor } from '$lib/interfaces';

const multilang = { type: Map, of: String };

const AuditorSchema = new mongoose.Schema<Auditor>({
    name: String, role: String, email: String, phone: String
}, { _id: false });

const TrackingSchema = new mongoose.Schema({
    version: String, date: String, author: String, description: String
}, { _id: false });

const VulnSchema = new mongoose.Schema<Vulnerability>({
    title: { ...multilang, required: true },
    category: multilang, description: multilang, impact: multilang, remediation: multilang, procedure: multilang,
    cvss: mongoose.Schema.Types.Mixed
}, { timestamps: true });

const WorkSchema = new mongoose.Schema<Work>({
    title: { ...multilang, required: true }, description: multilang
}, { timestamps: true });

const ClientSchema = new mongoose.Schema<Client>({
    name: { type: String, required: true }, shortname: String, email: String, logo: String, address: String,
}, { timestamps: true });

const AuditSchema = new mongoose.Schema<Audit>({
    name: { type: String, required: true },
    client: { type: ClientSchema, required: false },
    date_start: Date,
    date_end: Date,
    state: { type: String, enum: ['In Progress', 'Review', 'Approved', 'Cancelled'], default: 'In Progress' },
    lang: { type: String, default: 'fr' },
    confidentiality: String,
    auditors: [AuditorSchema],
    tracking: [TrackingSchema],
    content: { type: Map, of: String },
    detailedWork: [
        {
            title: String,
            description: String,
        }
    ],
    vulnerabilities: [
        {
            title: String,
            category: String,
            description: String,
            procedure: String,
            impact: String,
            remediation: String,
            cvss: mongoose.Schema.Types.Mixed
        }
    ]
}, { timestamps: true });

const SettingsSchema = new mongoose.Schema<Setting>({
    key: { type: String, required: true, unique: true }, value: mongoose.Schema.Types.Mixed
}, { timestamps: true });

export const AuditModel = mongoose.models.Audit || mongoose.model<Audit>('Audit', AuditSchema);
export const VulnerabilityModel = mongoose.models.Vulnerability || mongoose.model<Vulnerability>('Vulnerability', VulnSchema);
export const ClientModel = mongoose.models.Client || mongoose.model<Client>('Client', ClientSchema);
export const WorkModel = mongoose.models.Work || mongoose.model<Work>('Work', WorkSchema);
export const Settings = mongoose.models.Settings || mongoose.model<Setting>('Settings', SettingsSchema);