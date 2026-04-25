import { connectDB } from '$lib/server/db';
import { AuditModel } from '$lib/server/models';
import type { Actions, PageServerLoad } from './$types';
import { serialize } from '$lib/utils';
import { MergeOrCreateAudit } from '$lib/interfaces';

export const load: PageServerLoad = async () => {
    await connectDB();
    const audits = await AuditModel.find().sort({ updatedAt: -1 });

    return {
        audits: serialize(audits)
    };
};

export const actions: Actions = {
    create: async ({ request }) => {
        await connectDB();
        const data = await request.formData();

        const defaultData = MergeOrCreateAudit(Object.fromEntries(data.entries()));

        console.log(defaultData)

        await AuditModel.create(defaultData);
        return { success: true };
    },
    import: async ({ request }) => {
        await connectDB();
        const data = await request.formData();
        const importData = JSON.parse(data.get('importData') as string);
        
        // Ensure we don't overwrite existing ID
        delete importData._id;
        delete importData.id;

        const audit = await AuditModel.create(importData);
        return { success: true, id: audit._id.toString() };
    },
    delete: async ({ request }) => {
        await connectDB();
        const data = await request.formData();
        const id = data.get('id');
        await AuditModel.findByIdAndDelete(id);
        return { success: true };
    }
};
