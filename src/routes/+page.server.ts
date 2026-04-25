import { connectDB } from '$lib/server/db';
import { AuditModel } from '$lib/server/models';
import type { PageServerLoad } from './$types';
import { serialize } from '$lib/utils';

export const load: PageServerLoad = async () => {
    await connectDB();
    const audits = await AuditModel.find().sort({ updatedAt: -1 });
    return {
        audits: serialize(audits)
    };
};