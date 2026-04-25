import { DEFAULT_CSS } from '$lib/default.css';
import { connectDB } from '$lib/server/db';
import { Settings } from '$lib/server/models';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
    await connectDB();
    const [languages, reportStyle, themeColor] = await Promise.all([
        Settings.findOne({ key: 'languages' }),
        Settings.findOne({ key: 'reportStyle' }),
        Settings.findOne({ key: 'themeColor' })
    ]);
    
    return {
        languages: languages?.value || [{ code: 'fr', label: 'Français' }, { code: 'en', label: 'English' }],
        reportStyle: reportStyle?.value || DEFAULT_CSS,
        themeColor: themeColor?.value || '#2563eb'
    };
};

export const actions: Actions = {
    save: async ({ request }) => {
        await connectDB();
        const formData = await request.formData();
        
        const languages = JSON.parse(formData.get('languages') as string);
        const reportStyle = formData.get('reportStyle') as string;
        const themeColor = formData.get('themeColor') as string;
        
        await Promise.all([
            Settings.findOneAndUpdate({ key: 'languages' }, { value: languages }, { upsert: true }),
            Settings.findOneAndUpdate({ key: 'reportStyle' }, { value: reportStyle }, { upsert: true }),
            Settings.findOneAndUpdate({ key: 'themeColor' }, { value: themeColor }, { upsert: true })
        ]);
        
        return { success: true };
    }
};
