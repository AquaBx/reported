<script lang="ts">
	import { Bug } from "@lucide/svelte";
	import DataListView from "$lib/components/DataListView.svelte";
	import type { AuditVulnerability } from "$lib/interfaces.js";

	let { data } = $props();
	const vulnerabilities = $derived(data.vulnerabilities);
    const languages = $derived(data.languages);

	const fields = [
		{ id: 'title', label: 'Titre (Défaut)', type: 'text', placeholder: 'ex: Injection SQL', required: true },
		{ id: 'category', label: 'Catégorie', type: 'text', placeholder: 'ex: Injection' },
		{ id: 'description', label: 'Description', type: 'textarea' },
		{ id: 'impact', label: 'Impact', type: 'textarea' },
		{ id: 'remediation', label: 'Remédiation', type: 'textarea' }
	];
</script>

{#snippet titleCell(vuln:AuditVulnerability)}
	<div class="flex items-center gap-3">
		<div class="bg-muted p-2 rounded-lg"><Bug class="w-4 h-4 text-red-600" /></div>
		<div class="font-medium">{vuln.title[languages[0].code] || Object.values(vuln.title)[0] || 'Sans titre'}</div>
	</div>
{/snippet}

{#snippet translationsCell(vuln:AuditVulnerability)}
	<div class="flex gap-1">
		{#each Object.keys(vuln.title) as l} 
			<span class="text-[10px] bg-muted px-1.5 py-0.5 rounded font-bold uppercase">{l}</span> 
		{/each}
	</div>
{/snippet}

<DataListView 
	title="Base de Vulnérabilités" 
	description="Gérez votre référentiel multilingue."
	addLabel="Nouvelle Vulnérabilité"
	sheetTitle="Ajouter une Vulnérabilité"
	sheetDescription="Remplissez les informations de base."
	items={vulnerabilities}
	onEdit={() => {}}
	{fields}
	columns={[
		{ header: "Titre (Principal)", cell: titleCell },
		{ header: "Traductions", cell: translationsCell }
	]}
/>
