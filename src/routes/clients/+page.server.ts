import { connectDB } from '$lib/server/db';
import { ClientModel } from '$lib/server/models';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { serialize } from '$lib/utils';

export const load: PageServerLoad = async () => {
    await connectDB();
    const clients = await ClientModel.find().sort({ name: 1 });
    return {
        clients: serialize(clients)
    };
};

export const actions: Actions = {
    create: async ({ request }) => {
        await connectDB();
        const formData = await request.formData();
        const name = formData.get('name') as string;
        
        if (!name) return fail(400, { message: 'Nom requis' });
        
        await ClientModel.create({
            name,
            shortname: formData.get('shortname') as string,
            email: formData.get('email') as string
        });
        
        return { success: true };
    },
    delete: async ({ request }) => {
        await connectDB();
        const formData = await request.formData();
        const id = formData.get('id') as string;
        await ClientModel.findByIdAndDelete(id);
        return { success: true };
    }
};
