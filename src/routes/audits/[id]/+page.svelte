<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { Separator } from "$lib/components/ui/separator/index.js";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import { calculateBaseScore } from "cvss4";

	// Imports des composants
	import ReportPreview from "$lib/components/audit/ReportPreview.svelte";
	import SmartEditor from "$lib/components/audit/editors/SmartEditor.svelte";
	import DbSelector from "$lib/components/audit/editors/DbSelector.svelte";
	import SidebarCollection from "$lib/components/audit/editors/SidebarCollection.svelte";

	import { toStringVector } from "$lib/index";
	import {
		Plus,
		Trash2,
		ChevronRight,
		FileText,
		ShieldCheck,
		ArrowLeft,
		Save,
		Upload,
		FileDown,
		LayoutDashboard,
		Database
	} from "lucide-svelte";
	import { ReportState } from "$lib/report-state.svelte";

	// 1. Initialisation de l'état
	const state = new ReportState();
</script>

{@html `<style>${state.report.meta.customCSS}</style>`}

<Sidebar.Provider style="--sidebar-width: 380px;">
	<Sidebar.Root collapsible="offcanvas" class="border-r bg-sidebar">
		<Sidebar.Header
			class="border-b h-15.25 px-4 flex-row items-center justify-between shrink-0 bg-sidebar/50 backdrop-blur"
		>
			<div class="flex items-center gap-2">
				<div class="bg-blue-600 p-1.5 rounded-lg text-white">
					<ShieldCheck class="w-4 h-4" />
				</div>
				<span class="font-bold text-xs uppercase tracking-widest"
					>Reported</span
				>
			</div>
			<div class="flex items-center gap-0.5">
				<Button
					variant="ghost"
					size="icon"
					class="h-8 w-8"
					onclick={state.exportHTML}
					title="Export HTML"><FileDown class="w-4 h-4" /></Button
				>
				<Button
					variant="ghost"
					size="icon"
					class="h-8 w-8"
					onclick={state.saveReport}
					title="Save JSON"><Save class="w-4 h-4" /></Button
				>
				<label class="cursor-pointer">
					<div
						class="inline-flex items-center justify-center rounded-md hover:bg-accent h-8 w-8"
					>
						<Upload class="w-4 h-4" />
					</div>
					<input
						type="file"
						class="hidden"
						accept=".json"
						onchange={state.loadReport}
					/>
				</label>
			</div>
		</Sidebar.Header>

		<Sidebar.Content
			class="flex flex-col h-full overflow-y-auto overflow-x-hidden"
		>
			{#if state.activeSection !== null || state.activeIndex !== null}
				<div
					class="flex flex-col h-full bg-background animate-in slide-in-from-left duration-150"
				>
					<div
						class="flex items-center justify-between h-12 px-3 border-b bg-muted/10 shrink-0"
					>
						<div class="flex items-center gap-2">
							<Button
								variant="ghost"
								size="icon"
								class="h-7 w-7"
								onclick={state.closeEditor}
								><ArrowLeft class="w-4 h-4" /></Button
							>
							<div
								class="flex items-center gap-1.5 overflow-hidden"
							>
								<state.editorInfo.icon
									class="w-3.5 h-3.5 text-blue-600 shrink-0"
								/>
								<span
									class="text-[10px] font-black uppercase tracking-wider truncate"
									>{state.editorInfo.title}</span
								>
							</div>
						</div>

						<div class="flex items-center gap-1">
							{#if state.activeSection === "contacts"}<Button
									size="sm"
									variant="outline"
									class="h-6 text-[9px] px-2"
									onclick={state.addContact}>+ ADD</Button
								>{/if}
							{#if state.activeSection === "tracking"}<Button
									size="sm"
									variant="outline"
									class="h-6 text-[9px] px-2"
									onclick={state.addTracking}>+ ADD</Button
								>{/if}
							{#if state.activeIndex !== null}<Button
									variant="ghost"
									size="icon"
									class="h-7 w-7 text-destructive hover:bg-destructive/10"
									onclick={() => {
										if (state.activeCollection === 'vulnerabilities') {
											state.deleteVulnerability(state.activeIndex!);
										} else if (state.activeCollection === 'detailedWork') {
											state.deleteWork(state.activeIndex!);
										}
									}}
									><Trash2 class="w-3.5 h-3.5" /></Button
								>{/if}
						</div>
					</div>

					<div class="p-4 flex-1 overflow-y-auto">
						{#if state.activeSection === "vulnerability_db"}
							<DbSelector 
								items={state.vulnsForLang} 
								onSelect={state.addVulnerabilityFromDb} 
								lang={state.report.meta.lang}
								helperText="Sélectionnez une vulnérabilité pour l'ajouter au rapport avec des textes pré-remplis"
								descriptionKey="description"
							/>
						{:else if state.activeSection === "work_db"}
							<DbSelector 
								items={state.worksForLang} 
								onSelect={state.addWorkFromDb} 
								lang={state.report.meta.lang}
								helperText="Sélectionnez un bloc de travail pour l'ajouter au rapport"
								descriptionKey="description"
							/>
						{:else}
							<SmartEditor {state} />
						{/if}
					</div>
				</div>
			{:else}
				<div class="p-2 space-y-4">
					<Sidebar.Group>
						<Sidebar.Menu>
							{#each Object.entries(state.sectionsConfig) as [id, config]}
								{#if id !== 'vulnerabilities' && id !== 'vulnerability_db' && id !== 'work_db' && id !== 'work'}
									<Sidebar.MenuItem>
										<Sidebar.MenuButton
											onclick={() => state.openSection(id as any)}
											isActive={state.activeSection === id}
										>
											<config.icon class="w-4 h-4 text-blue-600/70" />
											<span>{config.title}</span>
										</Sidebar.MenuButton>
									</Sidebar.MenuItem>
								{/if}
							{/each}
						</Sidebar.Menu>
					</Sidebar.Group>

					<SidebarCollection 
						label="Travaux Détaillés"
						items={state.report.detailedWork}
						onAdd={state.addWork}
						onOpenDb={() => state.openSection('work_db')}
						onOpenItem={state.openWorkItem}
					>
						{#snippet itemContent(work)}
							<div class="bg-muted p-1 rounded">
								<ShieldCheck class="w-3 h-3 text-muted-foreground" />
							</div>
							<span class="text-[11px] font-medium truncate uppercase tracking-tight">
								{work.title}
							</span>
						{/snippet}
					</SidebarCollection>

					<SidebarCollection 
						label="Vulnérabilités"
						items={state.report.vulnerabilities}
						onAdd={state.addVulnerability}
						onOpenDb={() => state.openSection('vulnerability_db')}
						onOpenItem={state.openVulnerability}
						class="flex-1"
					>
						{#snippet itemContent(vuln)}
							{@const score = calculateBaseScore(toStringVector(vuln.cvss))}
							<span class="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border text-muted-foreground w-8 text-center shrink-0">
								{score.toFixed(1)}
							</span>
							<span class="text-[11px] font-medium truncate uppercase tracking-tight">
								{vuln.title}
							</span>
						{/snippet}
					</SidebarCollection>
				</div>
			{/if}
		</Sidebar.Content>
	</Sidebar.Root>

	<Sidebar.Inset class="flex flex-col h-screen overflow-hidden bg-muted/20">
		<header
			class="bg-background shrink-0 flex items-center justify-between gap-2 border-b px-4 h-15.25 shadow-sm z-10"
		>
			<div class="flex items-center gap-4">
				<Sidebar.Trigger class="-ms-1" />
				<Separator orientation="vertical" class="h-6" />
				<div
					class="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-widest"
				>
					<LayoutDashboard class="w-3.5 h-3.5" /> Aperçu
				</div>
			</div>
			<div
				class="text-[10px] text-muted-foreground px-3 py-1 bg-muted rounded-full font-mono"
			>
				{state.report.meta.client} — v{state.report.meta.version}
			</div>
		</header>
		<div class="flex-1 overflow-auto p-4 md:p-8 flex justify-center">
			<ReportPreview {state} />
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
