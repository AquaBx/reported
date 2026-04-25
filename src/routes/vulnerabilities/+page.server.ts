import { connectDB } from '$lib/server/db';
import { VulnerabilityModel, Settings } from '$lib/server/models';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { serialize } from '$lib/utils';

import { parseMultilangForm } from '$lib/server/utils';

export const load: PageServerLoad = async () => {
    await connectDB();
    const [vulnerabilities, settings] = await Promise.all([
        VulnerabilityModel.find().sort({ 'title.fr': 1 }),
        Settings.findOne({ key: 'languages' })
    ]);
    
    return {
        vulnerabilities: serialize(vulnerabilities),
        languages: settings?.value || [{ code: 'fr', label: 'Français' }, { code: 'en', label: 'English' }]
    };
};

export const actions: Actions = {
    create: async ({ request }) => {
        await connectDB();
        const formData = await request.formData();
        
        const settings = await Settings.findOne({ key: 'languages' });
        const languages = settings?.value || [{ code: 'fr', label: 'Français' }];

        const data = parseMultilangForm(formData, languages, ['title', 'category', 'description', 'impact', 'remediation']);
        
        if (!Object.values(data.title)[0]) return fail(400, { message: 'Titre requis' });
        
        await VulnerabilityModel.create({
            ...data,
            cvss: { AV: "N", AC: "L", AT: "N", PR: "N", UI: "N", VC: "N", VI: "N", VA: "N", SC: "N", SI: "N", SA: "N" }
        });
        
        return { success: true };
    },
    delete: async ({ request }) => {
        await connectDB();
        const formData = await request.formData();
        const id = formData.get('id') as string;
        await VulnerabilityModel.findByIdAndDelete(id);
        return { success: true };
    }
};
