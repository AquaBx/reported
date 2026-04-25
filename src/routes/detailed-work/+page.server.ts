import { connectDB } from '$lib/server/db';
import { WorkModel, Settings } from '$lib/server/models';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { serialize } from '$lib/utils';

import { parseMultilangForm } from '$lib/server/utils';

export const load: PageServerLoad = async () => {
    await connectDB();
    const [works, settings] = await Promise.all([
        WorkModel.find().sort({ 'title.fr': 1 }),
        Settings.findOne({ key: 'languages' })
    ]);
    
    return {
        works: serialize(works),
        languages: settings?.value || [{ code: 'fr', label: 'Français' }, { code: 'en', label: 'English' }]
    };
};

export const actions: Actions = {
    create: async ({ request }) => {
        await connectDB();
        const formData = await request.formData();
        
        const settings = await Settings.findOne({ key: 'languages' });
        const languages = settings?.value || [{ code: 'fr', label: 'Français' }];

        const data = parseMultilangForm(formData, languages, ['title', 'description']);
        
        if (!Object.values(data.title)[0]) return fail(400, { message: 'Titre requis' });
        
        await WorkModel.create(data);
        
        return { success: true };
    },
    delete: async ({ request }) => {
        await connectDB();
        const formData = await request.formData();
        const id = formData.get('id') as string;
        await WorkModel.findByIdAndDelete(id);
        return { success: true };
    }
};
