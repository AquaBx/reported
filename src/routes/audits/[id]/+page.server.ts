import { error, fail, redirect } from '@sveltejs/kit';
import { connectDB } from '$lib/server/db';
import { AuditModel, VulnerabilityModel, WorkModel, ClientModel, Settings } from '$lib/server/models';
import type { PageServerLoad, Actions } from './$types';
import { serialize } from '$lib/utils';
import { MergeOrCreateAudit } from '$lib/interfaces';

export const load: PageServerLoad = async ({ params }) => {
    await connectDB();
    const [audit, vulnerabilities, works,clients, styleSetting, themeSetting, langSetting] = await Promise.all([
        AuditModel.findById(params.id).lean(),
        VulnerabilityModel.find().sort({ 'title.fr': 1 }).lean(),
        WorkModel.find().sort({ 'title.fr': 1 }).lean(),
        ClientModel.find().sort({ name: 1 }).lean(),
        Settings.findOne({ key: 'reportStyle' }).lean(),
        Settings.findOne({ key: 'themeColor' }).lean(),
        Settings.findOne({ key: 'languages' }).lean(),
    ]);

    if (!audit) throw error(404, 'Audit non trouvé');

    // On prépare l'objet complet ici (SSR)
    const fullAudit = MergeOrCreateAudit(serialize(audit));
    return {
        audit: fullAudit,
        vulnerabilities: serialize(vulnerabilities),
        works: serialize(works),
        clients: serialize(clients),
        settings: {
            languages: langSetting.value || [],
            themeColor: themeSetting.value || "",
            reportStyle: styleSetting.value || "#000000"
        }
    };
};

export const actions: Actions = {
    save: async ({ params, request }) => {
        await connectDB();
        const formData = await request.formData();
        const reportData = JSON.parse(formData.get('reportData') as string);

        // Remove _id and timestamps to avoid conflicts
        delete reportData._id;
        delete reportData.updatedAt;
        delete reportData.createdAt;

        try {
            const updated = await AuditModel.findByIdAndUpdate(params.id, reportData, { new: true });
            if (!updated) {
                console.error('Audit not found for ID:', params.id);
                return fail(404, { message: 'Audit non trouvé' });
            }
            return { success: true };
        } catch (err) {
            console.error('Error saving audit:', err);
            return fail(500, { message: 'Erreur lors de la sauvegarde' });
        }
    },
    delete: async ({ params }) => {
        await connectDB();
        await AuditModel.findByIdAndDelete(params.id);
        throw redirect(303, '/audits');
    }
};
