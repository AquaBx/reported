<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { Separator } from "$lib/components/ui/separator/index.js";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import { calculateBaseScore } from "cvss4";
	import { enhance } from '$app/forms';

	import ReportPreview from "$lib/components/audit/ReportPreview.svelte";
	import SmartEditor from "$lib/components/audit/editors/SmartEditor.svelte";
	import DbSelector from "$lib/components/audit/editors/DbSelector.svelte";
	import SidebarCollection from "$lib/components/audit/editors/SidebarCollection.svelte";

	import { toStringVector } from "$lib/index";
	import {
		Trash2,
		ShieldCheck,
		ArrowLeft,
		Save,
		Download,
		FileDown,
		LayoutDashboard
	} from "@lucide/svelte";
	import { ReportState } from "$lib/report-state.svelte";
	import type { Audit, Client, Settings, Vulnerability, Work } from "$lib/interfaces";

	let { data } = $props();

	let {audit, vulnerabilities, works, clients, settings}
	:	{audit:Audit, vulnerabilities:Vulnerability[], works : Work[], clients:Client[], settings:Settings} 
	= $derived(data)

	const reportState = $derived(new ReportState(audit, vulnerabilities, works, clients, settings));
	let isSaving = $state(false);

	function handleDeleteCurrent() {
		if (reportState.activeIndex !== null && reportState.activeCollection) {
			reportState.deleteItem(reportState.activeCollection, reportState.activeIndex);
		}
	}
</script>

{@html `<style>${settings.reportStyle}</style>`}

<Sidebar.Provider style="--sidebar-width: 380px;">
	<Sidebar.Root collapsible="offcanvas" class="border-r bg-sidebar">
		<Sidebar.Header class="border-b h-15.25 px-4 flex-row items-center justify-between shrink-0 bg-sidebar/50 backdrop-blur">
			<div class="flex items-center gap-2">
				<div class="bg-blue-600 p-1.5 rounded-lg text-white"><ShieldCheck class="w-4 h-4" /></div>
				<span class="font-bold text-xs uppercase tracking-widest">Reported</span>
			</div>
			<div class="flex items-center gap-0.5">
				<Button variant="ghost" size="icon" class="h-8 w-8" onclick={reportState.exportJSON} title="Export JSON"><Download class="w-4 h-4" /></Button>
				<Button variant="ghost" size="icon" class="h-8 w-8" onclick={reportState.exportHTML} title="Export HTML"><FileDown class="w-4 h-4" /></Button>
				<form action="?/save" method="POST" use:enhance={() => { isSaving = true; return async ({ update }) => { await update(); isSaving = false; }; }}>
					<input type="hidden" name="reportData" value={JSON.stringify(reportState.report)} />
					<Button type="submit" variant="ghost" size="icon" class="h-8 w-8 {isSaving ? 'animate-pulse text-blue-600' : ''}" title="Sauvegarder dans MongoDB"><Save class="w-4 h-4" /></Button>
				</form>
			</div>
		</Sidebar.Header>

		<Sidebar.Content class="flex flex-col h-full overflow-y-auto overflow-x-hidden">
			{#if reportState.activeSection || reportState.activeIndex !== null}
				<div class="flex flex-col h-full bg-background animate-in slide-in-from-left duration-150">
					<div class="flex items-center justify-between h-12 px-3 border-b bg-muted/10 shrink-0">
						<div class="flex items-center gap-2">
							<Button variant="ghost" size="icon" class="h-7 w-7" onclick={reportState.closeEditor}><ArrowLeft class="w-4 h-4" /></Button>
							<div class="flex items-center gap-1.5 overflow-hidden">
								<reportState.editorInfo.icon class="w-3.5 h-3.5 text-blue-600 shrink-0" />
								<span class="text-[10px] font-black uppercase tracking-wider truncate">{reportState.editorInfo.title}</span>
							</div>
						</div>
						<div class="flex items-center gap-1">
							{#if ['contacts', 'tracking'].includes(reportState.activeSection || '')}
								<Button size="sm" variant="outline" class="h-6 text-[9px] px-2" onclick={reportState.addCurrentSectionItem}>+ ADD</Button>
							{/if}
							{#if reportState.activeIndex !== null}
								<Button variant="ghost" size="icon" class="h-7 w-7 text-destructive hover:bg-destructive/10" onclick={handleDeleteCurrent}><Trash2 class="w-3.5 h-3.5" /></Button>
							{/if}
						</div>
					</div>

					<div class="p-4 flex-1 overflow-y-auto">
						{#if reportState.activeSection === 'vulnerability_db'}
							<DbSelector items={reportState.vulnsForLang} onSelect={(v) => reportState.addFromDb(v, 'vuln')} lang={reportState.lang} helperText="Sélectionnez un élément pour l'ajouter" descriptionKey="description" />
						{:else if reportState.activeSection === 'work_db'}
							<DbSelector items={reportState.worksForLang} onSelect={(w) => reportState.addFromDb(w, 'work')} lang={reportState.lang} helperText="Sélectionnez un élément pour l'ajouter" descriptionKey="description" />
						{:else}
							<SmartEditor state={reportState} />
						{/if}
					</div>
				</div>
			{:else}
				<div class="p-2 space-y-4">
					<Sidebar.Group>
						<Sidebar.Menu>
							{#each Object.entries(reportState.sectionsConfig) as [id, config]}
								{#if !['vulnerabilities', 'vulnerability_db', 'work_db', 'work'].includes(id)}
									<Sidebar.MenuItem>
										<Sidebar.MenuButton onclick={() => reportState.open(id as any)} isActive={reportState.activeSection === id}>
											<config.icon class="w-4 h-4 text-blue-600/70" />
											<span>{config.title}</span>
										</Sidebar.MenuButton>
									</Sidebar.MenuItem>
								{/if}
							{/each}
						</Sidebar.Menu>
					</Sidebar.Group>

					<SidebarCollection label="Travaux" items={reportState.report.detailedWork} onAdd={reportState.addNewWork} onOpenDb={() => reportState.openLibrary('work')} onOpenItem={reportState.openWorkItem}>
						{#snippet itemContent(work)}
							<div class="bg-muted p-1 rounded"><ShieldCheck class="w-3 h-3 text-muted-foreground" /></div>
							<span class="text-[11px] font-medium truncate uppercase tracking-tight">{work.title}</span>
						{/snippet}
					</SidebarCollection>

					<SidebarCollection label="Vulnérabilités" items={reportState.report.vulnerabilities} onAdd={reportState.addNewVulnerability} onOpenDb={() => reportState.openLibrary('vuln')} onOpenItem={reportState.openVulnerability} class="flex-1">
						{#snippet itemContent(vuln)}
							{@const score = calculateBaseScore(toStringVector(vuln.cvss))}
							<span class="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border text-muted-foreground w-8 text-center shrink-0">{score.toFixed(1)}</span>
							<span class="text-[11px] font-medium truncate uppercase tracking-tight">{vuln.title}</span>
						{/snippet}
					</SidebarCollection>
				</div>
			{/if}
		</Sidebar.Content>
	</Sidebar.Root>

	<Sidebar.Inset class="flex flex-col h-screen overflow-hidden bg-muted/20">
		<header class="bg-background shrink-0 flex items-center justify-between gap-2 border-b px-4 h-15.25 shadow-sm z-10">
			<div class="flex items-center gap-4">
				<Sidebar.Trigger class="-ms-1" /><Separator orientation="vertical" class="h-6" />
				<div class="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-widest"><LayoutDashboard class="w-3.5 h-3.5" /> Aperçu</div>
			</div>
			<div class="text-[10px] text-muted-foreground px-3 py-1 bg-muted rounded-full font-mono">{reportState.report.name}</div>
		</header>
		<div class="flex-1 overflow-auto p-4 md:p-8 flex justify-center"><ReportPreview state={reportState} themeColor={data.settings.themeColor} /></div>
	</Sidebar.Inset>
</Sidebar.Provider>
