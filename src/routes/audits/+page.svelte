<script lang="ts">
	import { Badge } from "$lib/components/ui/badge/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { formatDate } from "$lib/utils";
	import { goto } from "$app/navigation";
	import { ExternalLink, FileUp, Download } from "@lucide/svelte";
	import DataListView from "$lib/components/DataListView.svelte";
	import type { Audit } from "$lib/interfaces.js";

	let { data } = $props();
	const audits = $derived(data.audits);

	function getStatusVariant(state: string) {
		const variants: any = { Approved: 'success', Review: 'warning', Cancelled: 'error', 'In Progress': 'info' };
		return variants[state] || 'secondary';
	}

	const fields = [
		{ id: 'name', label: "Nom de l'audit", type: 'text', placeholder: 'ex: Audit Interne Q2', required: true },
		{ id: 'date_start', label: 'Date de début', type: 'date', required: true },
		{ id: 'date_end', label: 'Date de fin', type: 'date', required: true }
	];

	function handleImport(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = async (ev) => {
			const importData = ev.target?.result as string;
			const formData = new FormData();
			formData.append('importData', importData);
			
			const response = await fetch('?/import', {
				method: 'POST',
				body: formData,
				headers: { 'x-sveltekit-action': 'true' }
			});

			const result = await response.json();
			if (result.type === 'success' && result.data?.id) {
				goto(`/audits/${result.data.id}`);
			} else {
				location.reload();
			}
		};
		reader.readAsText(file);
	}

	function handleExport(audit: Audit) {
		const data = JSON.stringify(audit, null, 2);
		const a = document.createElement("a");
		a.href = URL.createObjectURL(new Blob([data], { type: "application/json" }));
		a.download = `audit_${audit.name}.json`;
		a.click();
	}
</script>

{#snippet titleCell(audit:Audit)}
	<span class="font-medium">{audit.name}</span>
{/snippet}

{#snippet customerCell(audit:Audit)}
	{audit.client ? audit.client.name : 'N/A'}
{/snippet}

{#snippet dateStartCell(audit:Audit)}
	{formatDate(audit.date_start)}
{/snippet}

{#snippet dateEndCell(audit:Audit)}
	{formatDate(audit.date_end)}
{/snippet}

{#snippet statusCell(audit:Audit)}
	<Badge variant={getStatusVariant(audit.state)}>{audit.state}</Badge>
{/snippet}

{#snippet rowActions(audit:Audit)}
	<Button variant="secondary" onclick={() => handleExport(audit)} size="icon"><Download class="h-4 w-4" /></Button>
	<Button variant="secondary" onclick={() => goto(`/audits/${audit._id}`)} size="icon"><ExternalLink/></Button>
{/snippet}

{#snippet extraActions()}
	<Button variant="outline" onclick={() => document.getElementById('import-input')?.click()}>
		<FileUp class="mr-2 h-4 w-4" /> Importer JSON
	</Button>
	<input type="file" id="import-input" class="hidden" accept=".json" onchange={handleImport} />
{/snippet}

<DataListView 
	title="Audits" 
	description="Gérez et suivez vos audits de sécurité." 
	addLabel="Nouvel Audit"
	items={audits}
	deleteAction="?/delete"
	{rowActions}
	{extraActions}
	{fields}
	columns={[
		{ header: "Nom de l'audit", cell: titleCell },
		{ header: "Client", cell: customerCell },
		{ header: "Début", cell: dateStartCell },
		{ header: "Fin", cell: dateEndCell },
		{ header: "Statut", cell: statusCell }
	]}
/>
