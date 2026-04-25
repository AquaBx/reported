<script lang="ts">
	import { ShieldCheck } from "@lucide/svelte";
	import DataListView from "$lib/components/DataListView.svelte";
	import type { AuditWork } from "$lib/interfaces.js";

	let { data } = $props();
	const works = $derived(data.works);
    const languages = $derived(data.languages);

	const fields = [
		{ id: 'title', label: 'Titre du bloc (Défaut)', type: 'text', placeholder: 'ex: Phase de Reconnaissance', required: true },
		{ id: 'description', label: 'Description détaillée', type: 'textarea' }
	];
</script>

{#snippet titleCell(work:AuditWork)}
	<div class="flex items-center gap-3">
		<div class="bg-muted p-2 rounded-lg"><ShieldCheck class="w-4 h-4 text-green-600" /></div>
		<div class="font-medium">{work.title[languages[0].code] || Object.values(work.title)[0] || 'Sans titre'}</div>
	</div>
{/snippet}

{#snippet translationsCell(work:AuditWork)}
	<div class="flex gap-1">
		{#each Object.keys(work.title) as l} 
			<span class="text-[10px] bg-muted px-1.5 py-0.5 rounded font-bold uppercase">{l}</span> 
		{/each}
	</div>
{/snippet}

<DataListView 
	title="Modèles de Travaux" 
	description="Gérez vos descriptions types en plusieurs langues."
	addLabel="Nouveau Modèle"
	sheetTitle="Ajouter un Modèle de Travail"
	sheetDescription="Créez une description réutilisable."
	items={works}
	onEdit={() => {}}
	{fields}
	columns={[
		{ header: "Titre du modèle", cell: titleCell },
		{ header: "Traductions", cell: translationsCell }
	]}
/>
