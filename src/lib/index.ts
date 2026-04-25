export function toStringVector(s: any) { 
    return `CVSS:4.0/AV:${s.AV}/AC:${s.AC}/AT:${s.AT}/PR:${s.PR}/UI:${s.UI}/VC:${s.VC}/VI:${s.VI}/VA:${s.VA}/SC:${s.SC}/SI:${s.SI}/SA:${s.SA}`; 
}

export const colors = { Critical: "#dc2626", High: "#ea580c", Medium: "#ca8a04", Low: "#16a34a", Info: "#2563eb" };

export function colorCvss(s: number) {
    if (s >= 9.0) return { bg: "#fef2f2", text: colors.Critical, border: "#fee2e2" };
    if (s >= 7.0) return { bg: "#fff7ed", text: colors.High, border: "#ffedd5" };
    if (s >= 4.0) return { bg: "#fefce8", text: colors.Medium, border: "#fef9c3" };
    if (s > 0) return { bg: "#f0fdf4", text: colors.Low, border: "#dcfce7" };
    return { bg: "#f9fafb", text: colors.Info, border: "#f3f4f6" };
}

export function severityKey(s: number) {
    if (s >= 9.0) return "Critical";
    if (s >= 7.0) return "High";
    if (s >= 4.0) return "Medium";
    if (s > 0) return "Low";
    return "Info";
}

export function severityLabel(s: number) { 
    const labels: any = { Critical: "CRITIQUE", High: "ÉLEVÉE", Medium: "MOYENNE", Low: "FAIBLE", Info: "INFO" };
    return labels[severityKey(s)];
}

