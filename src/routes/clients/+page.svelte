<script lang="ts">
	import { Building } from "@lucide/svelte";
	import DataListView from "$lib/components/DataListView.svelte";
	import type { Client } from "$lib/interfaces.js";
	
	let { data } = $props();
	const clients = $derived(data.clients);

	const fields = [
		{ id: 'name', label: 'Nom du client', type: 'text', placeholder: 'ex: Acme Corp', required: true },
		{ id: 'shortname', label: 'Nom court (Trigger)', type: 'text', placeholder: 'ex: ACME' },
		{ id: 'email', label: 'Email de contact', type: 'email', placeholder: 'contact@acme.com' }
	];
</script>

{#snippet clientCell(client:Client)}
	<div class="flex items-center gap-3"><div class="bg-muted p-2 rounded-lg"><Building class="w-4 h-4 text-blue-600" /></div>{client.name}</div>
{/snippet}

{#snippet codeCell(client:Client)}
	<span class="font-mono text-xs uppercase text-muted-foreground">{client.shortname || '-'}</span>
{/snippet}

{#snippet emailCell(client:Client)}
	{client.email || '-'}
{/snippet}

<DataListView 
	title="Clients" 
	description="Gérez votre base de clients et leurs contacts."
	addLabel="Nouveau Client"
	sheetTitle="Ajouter un Client"
	items={clients}
	onEdit={() => {}}
	{fields}
	columns={[
		{ header: "Client", cell: clientCell },
		{ header: "Code", cell: codeCell },
		{ header: "Email", cell: emailCell }
	]}
/>
