<script lang="ts">
	import * as Item from "$lib/components/ui/item/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Separator } from "$lib/components/ui/separator/index.js";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import RichTextEditor from "$lib/mycomponents/RichTextEditor.svelte";
	import Cvss4Calculator from "$lib/mycomponents/Cvss4Calculator.svelte";
	import { calculateBaseScore } from "cvss4";

	import { colorCvss, toStringVector, type Report } from "$lib/index";

	// 1. Initialisation de l'état réactif avec $state
	let report: Report = $state({
		document: {
			title: "Nouveau Rapport",
			client: "Client A",
			version: "1.0",
			date: new Date(),
			auditor: "Auditeur",
			confidentiality: "Confidentiel",
		},
		contacts: [],
		tracking: [],
		introduction: {
			context: "",
			objectives: "",
			stakeholders: "",
			mailingList: "",
			period: "",
			scope: "",
		},
		managementSummary: {
			workDone: "",
			globalSecurityLevel: "",
			vulnerabilitiesOverview: "",
			recommendationsOverview: "",
		},
		detailedWork: {
			methodology: "",
			discovery: "",
			osint: "",
			networkScan: "",
			appScan: "",
			waf: "",
			xss: "",
			sqli: "",
			permissions: "",
		},
		style: {
			themeColor: "text-blue-600",
			fontFamily: "sans",
			headerStyle: "default",
			logoBase64: "",
		},
		vulnerabilities: [],
	});

	let activeSection = $state<
		| "document"
		| "contacts"
		| "tracking"
		| "introduction"
		| "summary"
		| "work"
		| "vulnerabilities"
	>("vulnerabilities");
	let activeIndex = $state<number | null>(null);

	// 2. Génération automatique du sommaire avec $derived
	let sommaire = $derived([
		{ numero: 1, title: "VOS CONTACTS", section: "contacts" },
		{ numero: 2, title: "SUIVI DU DOCUMENT", section: "tracking" },
		{ numero: 3, title: "INTRODUCTION", section: "introduction" },
		{ numero: 4, title: "RÉSUMÉ MANAGÉRIAL", section: "summary" },
		{ numero: 5, title: "TRAVAUX DÉTAILLÉS", section: "work" },
		...report.vulnerabilities.map(({ title }, index) => ({
			numero: `5.2.${index + 1}`,
			title,
			section: "vulnerabilities",
			index,
		})),
	]);

	// 3. Fonctions CRUD
	function addVulnerability() {
		report.vulnerabilities.push({
			id: crypto.randomUUID(),
			title: "Nouvelle vulnérabilité",
			category: "Web",
			cvss: {
				AV: "N",
				AC: "L",
				AT: "N",
				PR: "N",
				UI: "N",
				VC: "N",
				VI: "N",
				VA: "N",
				SC: "N",
				SI: "N",
				SA: "N",
			},
			description: "",
			procedure: "",
			impact: "",
			remediation: "",
			status: "Ouverte",
		});
		activeIndex = report.vulnerabilities.length - 1;
	}

	function deleteVulnerability(index: number) {
		report.vulnerabilities.splice(index, 1);
		if (activeIndex === index) {
			activeIndex = null;
		} else if (activeIndex !== null && activeIndex > index) {
			activeIndex--;
		}
	}

	// 4. Fonctions de Sauvegarde et Chargement
	function saveReport() {
		const dataStr =
			"data:text/json;charset=utf-8," +
			encodeURIComponent(JSON.stringify(report, null, 2));
		const dlAnchorElem = document.createElement("a");
		dlAnchorElem.setAttribute("href", dataStr);
		dlAnchorElem.setAttribute(
			"download",
			`rapport_${report.document.client.replace(/\s+/g, "_")}.json`,
		);
		dlAnchorElem.click();
	}

	function loadReport(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				if (e.target?.result) {
					const data = JSON.parse(e.target.result as string);
					// On s'assure que la date est bien un objet Date
					if (data.document && data.document.date) {
						data.document.date = new Date(data.document.date);
					}
					report = data;
					activeIndex = null;
				}
			};
			reader.readAsText(file);
		}
	}
</script>

<Sidebar.Provider style="--sidebar-width: 500px;">
	<Sidebar.Root collapsible="offcanvas">
		<Sidebar.Header class="gap-3.5 border-b p-4">
			<div class="flex w-full items-center justify-between">
				<div class="text-foreground text-base font-semibold">
					Configuration du Rapport
				</div>
			</div>
		</Sidebar.Header>

		<Sidebar.Content>
			{#if activeIndex !== null}
				<div class="flex flex-col p-4 h-full">
					<div class="flex items-center justify-between mb-4">
						<h2
							class="text-sm font-bold uppercase tracking-wider text-gray-500"
						>
							Édition Vulnérabilité
						</h2>
						<Button
							variant="ghost"
							size="sm"
							onclick={() => (activeIndex = null)}
						>
							Retour
						</Button>
					</div>

					<div class="space-y-5 overflow-y-auto pb-8 pr-1">
						<div class="space-y-1.5">
							<Label>Titre</Label>
							<Input
								bind:value={
									report.vulnerabilities[activeIndex].title
								}
							/>
						</div>

						<div class="space-y-1.5">
							<Label>Catégorie</Label>
							<Input
								bind:value={
									report.vulnerabilities[activeIndex].category
								}
							/>
						</div>

						<div class="space-y-1.5">
							<Cvss4Calculator
								bind:vector={
									report.vulnerabilities[activeIndex].cvss
								}
							/>
						</div>

						<div class="space-y-1.5">
							<Label>Description</Label>
							<RichTextEditor
								bind:value={
									report.vulnerabilities[activeIndex]
										.description
								}
							/>
						</div>

						<div class="space-y-1.5">
							<Label>Procédure de reproduction</Label>
							<RichTextEditor
								bind:value={
									report.vulnerabilities[activeIndex]
										.procedure
								}
							/>
						</div>
					</div>
				</div>
			{:else}
				<Sidebar.Group>
					<Sidebar.GroupLabel>Sections Générales</Sidebar.GroupLabel>
					<Sidebar.GroupContent>
						<Sidebar.Menu>
							<Sidebar.MenuItem>
								<Sidebar.MenuButton
									isActive={activeSection === "document"}
									onclick={() => (activeSection = "document")}
								>
									Informations Générales
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
							<Sidebar.MenuItem>
								<Sidebar.MenuButton
									isActive={activeSection === "contacts"}
									onclick={() => (activeSection = "contacts")}
								>
									1. Vos Contacts
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
							<Sidebar.MenuItem>
								<Sidebar.MenuButton
									isActive={activeSection === "tracking"}
									onclick={() => (activeSection = "tracking")}
								>
									2. Suivi du Document
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
							<Sidebar.MenuItem>
								<Sidebar.MenuButton
									isActive={activeSection === "introduction"}
									onclick={() =>
										(activeSection = "introduction")}
								>
									3. Introduction
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
							<Sidebar.MenuItem>
								<Sidebar.MenuButton
									isActive={activeSection === "summary"}
									onclick={() => (activeSection = "summary")}
								>
									4. Résumé Managérial
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
							<Sidebar.MenuItem>
								<Sidebar.MenuButton
									isActive={activeSection === "work"}
									onclick={() => (activeSection = "work")}
								>
									5. Travaux Détaillés
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						</Sidebar.Menu>
					</Sidebar.GroupContent>
				</Sidebar.Group>

				<Sidebar.Group>
					<div class="flex items-center justify-between px-2 mb-2">
						<Sidebar.GroupLabel
							>5.2 Vulnérabilités</Sidebar.GroupLabel
						>
						<Button
							size="sm"
							variant="ghost"
							onclick={addVulnerability}>+</Button
						>
					</div>
					<Sidebar.GroupContent>
						{#each report.vulnerabilities as vuln, index}
							<Item.Root
								variant="default"
								class="hover:bg-accent/50 transition-colors"
							>
								<Item.Content>
									<Item.Title
										>{vuln.title ||
											"Sans titre"}</Item.Title
									>
								</Item.Content>
								<Item.Actions>
									<Button
										variant="secondary"
										size="sm"
										onclick={() => (activeIndex = index)}
									>
										Éditer
									</Button>
									<Button
										variant="destructive"
										size="sm"
										onclick={() =>
											deleteVulnerability(index)}
									>
										Suppr.
									</Button>
								</Item.Actions>
							</Item.Root>
							<Separator />
						{/each}
					</Sidebar.GroupContent>
				</Sidebar.Group>

				<!-- Formulaires d'édition des sections -->
				<div class="p-4 border-t bg-muted/20 overflow-y-auto">
					{#if activeSection === "document"}
						<div class="space-y-4">
							<h3 class="font-bold">Informations Document</h3>
							<div class="space-y-1.5">
								<Label>Titre</Label>
								<Input bind:value={report.document.title} />
							</div>
							<div class="space-y-1.5">
								<Label>Client</Label>
								<Input bind:value={report.document.client} />
							</div>
							<div class="space-y-1.5">
								<Label>Version</Label>
								<Input bind:value={report.document.version} />
							</div>
							<div class="space-y-1.5">
								<Label>Confidentialité</Label>
								<Input
									bind:value={report.document.confidentiality}
								/>
							</div>
						</div>
					{:else if activeSection === "contacts"}
						<div class="space-y-4">
							<div class="flex items-center justify-between">
								<h3 class="font-bold">1. Vos Contacts</h3>
								<Button
									size="sm"
									variant="outline"
									onclick={() =>
										report.contacts.push({
											name: "",
											role: "",
											email: "",
										})}>+ Ajouter</Button
								>
							</div>
							{#each report.contacts as contact, i}
								<div
									class="p-3 border rounded-lg bg-background space-y-2 relative pt-8"
								>
									<Button
										size="sm"
										variant="ghost"
										class="absolute top-1 right-1 h-6 w-6 p-0"
										onclick={() =>
											report.contacts.splice(i, 1)}
										>×</Button
									>
									<Input
										placeholder="Nom"
										bind:value={contact.name}
									/>
									<Input
										placeholder="Rôle"
										bind:value={contact.role}
									/>
									<Input
										placeholder="Email"
										bind:value={contact.email}
									/>
								</div>
							{/each}
						</div>
					{:else if activeSection === "tracking"}
						<div class="space-y-4">
							<div class="flex items-center justify-between">
								<h3 class="font-bold">2. Suivi du Document</h3>
								<Button
									size="sm"
									variant="outline"
									onclick={() =>
										report.tracking.push({
											version: "",
											date: "",
											author: "",
											description: "",
										})}>+ Ajouter</Button
								>
							</div>
							{#each report.tracking as track, i}
								<div
									class="p-3 border rounded-lg bg-background space-y-2 relative pt-8"
								>
									<Button
										size="sm"
										variant="ghost"
										class="absolute top-1 right-1 h-6 w-6 p-0"
										onclick={() =>
											report.tracking.splice(i, 1)}
										>×</Button
									>
									<Input
										placeholder="Version"
										bind:value={track.version}
									/>
									<Input
										placeholder="Date"
										bind:value={track.date}
									/>
									<Input
										placeholder="Auteur"
										bind:value={track.author}
									/>
									<Input
										placeholder="Description"
										bind:value={track.description}
									/>
								</div>
							{/each}
						</div>
					{:else if activeSection === "introduction"}
						<div class="space-y-4">
							<h3 class="font-bold">3. Introduction</h3>
							<div class="space-y-1.5">
								<Label>3.1 Contexte et Objectifs</Label>
								<RichTextEditor
									bind:value={report.introduction.context}
								/>
							</div>
							<div class="space-y-1.5">
								<Label>3.5 Périmètre</Label>
								<RichTextEditor
									bind:value={report.introduction.scope}
								/>
							</div>
						</div>
					{:else if activeSection === "summary"}
						<div class="space-y-4">
							<h3 class="font-bold">4. Résumé Managérial</h3>
							<div class="space-y-1.5">
								<Label>4.1 Travaux réalisés</Label>
								<RichTextEditor
									bind:value={
										report.managementSummary.workDone
									}
								/>
							</div>
							<div class="space-y-1.5">
								<Label>4.2 Niveau global de sécurité</Label>
								<RichTextEditor
									bind:value={
										report.managementSummary
											.globalSecurityLevel
									}
								/>
							</div>
						</div>
					{:else if activeSection === "work"}
						<div class="space-y-4">
							<h3 class="font-bold">5. Travaux Détaillés</h3>
							<div class="space-y-1.5">
								<Label>5.1.1 Découverte du périmètre</Label>
								<RichTextEditor
									bind:value={report.detailedWork.discovery}
								/>
							</div>
							<div class="space-y-1.5">
								<Label>5.1.2 Analyse OSINT</Label>
								<RichTextEditor
									bind:value={report.detailedWork.osint}
								/>
							</div>
							<div class="space-y-1.5">
								<Label>5.1.3 Scan réseaux</Label>
								<RichTextEditor
									bind:value={report.detailedWork.networkScan}
								/>
							</div>
							<div class="space-y-1.5">
								<Label>5.1.4 Scan applicatif</Label>
								<RichTextEditor
									bind:value={report.detailedWork.appScan}
								/>
							</div>
						</div>
					{/if}
				</div>
			{/if}
		</Sidebar.Content>
	</Sidebar.Root>

	<Sidebar.Inset class="flex flex-col h-screen overflow-hidden bg-muted/30">
		<header
			class="bg-background shrink-0 flex items-center justify-between gap-2 border-b p-4 shadow-sm z-10"
		>
			<div class="flex items-center gap-4">
				<Sidebar.Trigger class="-ms-1" />
				<Separator orientation="vertical" class="h-6" />
				<div class="flex items-center gap-3">
					<Button onclick={saveReport} variant="default"
						>Sauvegarder JSON</Button
					>
					<div class="relative">
						<Input
							type="file"
							accept=".json"
							onchange={loadReport}
							class="max-w-xs cursor-pointer file:cursor-pointer file:bg-transparent file:border-0 file:font-medium"
						/>
					</div>
				</div>
			</div>
		</header>

		<div class="flex-1 overflow-auto p-4 md:p-8">
			<div
				class="bg-background mx-auto w-full max-w-4xl min-h-264 shadow-sm ring-1 ring-border rounded-sm p-10 sm:p-16"
			>
				<!-- Page de Garde Simplifiée -->
				<header class="border-b-8 pb-12 mb-16 border-blue-600">
					<h1
						class="text-5xl font-black tracking-tighter text-foreground uppercase mb-4"
					>
						Rapport d'Audit de Sécurité
					</h1>
					<div class="space-y-2">
						<p class="text-2xl text-blue-600 font-bold">
							{report.document.title}
						</p>
						<p class="text-xl text-muted-foreground font-medium">
							Client : {report.document.client}
						</p>
					</div>
					<div
						class="mt-12 grid grid-cols-2 gap-8 text-sm text-muted-foreground"
					>
						<div>
							<p class="font-bold text-foreground">Version</p>
							<p>{report.document.version}</p>
						</div>
						<div>
							<p class="font-bold text-foreground">Date</p>
							<p>{report.document.date.toLocaleDateString()}</p>
						</div>
						<div>
							<p class="font-bold text-foreground">
								Confidentialité
							</p>
							<p
								class="uppercase px-2 py-0.5 bg-zinc-100 border rounded w-fit"
							>
								{report.document.confidentiality}
							</p>
						</div>
					</div>
				</header>

				<!-- Sommaire -->
				<div
					class="mb-16 p-8 bg-muted/30 rounded-xl border border-border/50"
				>
					<h2 class="text-2xl font-bold mb-6 italic">
						TABLE DES MATIÈRES
					</h2>
					<ul class="space-y-2">
						{#each sommaire as item}
							<li
								class="flex justify-between border-b border-border/20 pb-1"
							>
								<span class="font-medium text-sm"
									>{item.numero}
									{item.title || "Sans titre"}</span
								>
							</li>
						{/each}
					</ul>
				</div>

				<!-- 1. Vos Contacts -->
				<section class="mb-16">
					<h2 class="text-3xl font-bold mb-8 border-b pb-2">
						1. VOS CONTACTS
					</h2>
					{#if report.contacts.length === 0}
						<p class="italic text-muted-foreground">
							Aucun contact renseigné.
						</p>
					{:else}
						<table class="w-full text-left border-collapse border">
							<thead>
								<tr class="bg-muted/50">
									<th class="p-3 border">Nom</th>
									<th class="p-3 border">Rôle</th>
									<th class="p-3 border">Email</th>
								</tr>
							</thead>
							<tbody>
								{#each report.contacts as contact}
									<tr>
										<td class="p-3 border font-medium"
											>{contact.name}</td
										>
										<td class="p-3 border"
											>{contact.role}</td
										>
										<td class="p-3 border text-blue-600"
											>{contact.email}</td
										>
									</tr>
								{/each}
							</tbody>
						</table>
					{/if}
				</section>

				<!-- 2. Suivi du Document -->
				<section class="mb-16">
					<h2 class="text-3xl font-bold mb-8 border-b pb-2">
						2. SUIVI DU DOCUMENT
					</h2>
					{#if report.tracking.length === 0}
						<p class="italic text-muted-foreground">
							Aucun historique renseigné.
						</p>
					{:else}
						<table class="w-full text-left border-collapse border">
							<thead>
								<tr class="bg-muted/50">
									<th class="p-3 border">Version</th>
									<th class="p-3 border">Date</th>
									<th class="p-3 border">Auteur</th>
									<th class="p-3 border">Description</th>
								</tr>
							</thead>
							<tbody>
								{#each report.tracking as track}
									<tr>
										<td class="p-3 border font-bold"
											>{track.version}</td
										>
										<td class="p-3 border">{track.date}</td>
										<td class="p-3 border"
											>{track.author}</td
										>
										<td class="p-3 border"
											>{track.description}</td
										>
									</tr>
								{/each}
							</tbody>
						</table>
					{/if}
				</section>

				<!-- 3. Introduction -->
				<section class="mb-16">
					<h2 class="text-3xl font-bold mb-8 border-b pb-2">
						3. INTRODUCTION
					</h2>
					<div class="space-y-8">
						<div>
							<h3 class="text-xl font-bold mb-3 text-blue-600">
								3.1 Contexte et Objectifs
							</h3>
							<div class="prose prose-sm max-w-none">
								{@html report.introduction.context ||
									"Non renseigné."}
							</div>
						</div>
						<div>
							<h3 class="text-xl font-bold mb-3 text-blue-600">
								3.5 Périmètre
							</h3>
							<div class="prose prose-sm max-w-none">
								{@html report.introduction.scope ||
									"Non renseigné."}
							</div>
						</div>
					</div>
				</section>

				<!-- 4. Résumé Managérial -->
				<section class="mb-16">
					<h2 class="text-3xl font-bold mb-8 border-b pb-2">
						4. RÉSUMÉ MANAGÉRIAL
					</h2>
					<div class="space-y-8">
						<div>
							<h3 class="text-xl font-bold mb-3 text-blue-600">
								4.1 Travaux réalisés
							</h3>
							<div class="prose prose-sm max-w-none">
								{@html report.managementSummary.workDone ||
									"Non renseigné."}
							</div>
						</div>
						<div>
							<h3 class="text-xl font-bold mb-3 text-blue-600">
								4.2 Niveau global de sécurité
							</h3>
							<div class="prose prose-sm max-w-none">
								{@html report.managementSummary
									.globalSecurityLevel || "Non renseigné."}
							</div>
						</div>
					</div>
				</section>

				<!-- 5. Travaux Détaillés -->
				<section class="mb-16">
					<h2 class="text-3xl font-bold mb-8 border-b pb-2">
						5. TRAVAUX DÉTAILLÉS
					</h2>
					<div class="space-y-8 mb-12">
						<h3 class="text-xl font-bold mb-3 text-blue-600">
							5.1 Recherche de vulnérabilités
						</h3>
						{#if report.detailedWork.discovery}
							<div>
								<h4 class="text-lg font-bold mb-2">
									5.1.1 Découverte du périmètre
								</h4>
								<div class="prose prose-sm max-w-none">
									{@html report.detailedWork.discovery}
								</div>
							</div>
						{/if}
						{#if report.detailedWork.osint}
							<div>
								<h4 class="text-lg font-bold mb-2">
									5.1.2 Analyse OSINT
								</h4>
								<div class="prose prose-sm max-w-none">
									{@html report.detailedWork.osint}
								</div>
							</div>
						{/if}
						{#if report.detailedWork.networkScan}
							<div>
								<h4 class="text-lg font-bold mb-2">
									5.1.3 Scan réseaux
								</h4>
								<div class="prose prose-sm max-w-none">
									{@html report.detailedWork.networkScan}
								</div>
							</div>
						{/if}
						{#if report.detailedWork.appScan}
							<div>
								<h4 class="text-lg font-bold mb-2">
									5.1.4 Scan applicatif
								</h4>
								<div class="prose prose-sm max-w-none">
									{@html report.detailedWork.appScan}
								</div>
							</div>
						{/if}
					</div>

					<h3 class="text-xl font-bold mb-6 text-blue-600">
						5.2 Vulnérabilités découvertes
					</h3>

					<div class="space-y-12">
						{#each report.vulnerabilities as vuln, i}
							<div
								class="page-break-inside-avoid relative {activeIndex ===
								i
									? 'ring-2 ring-blue-500/50 p-6 rounded-xl bg-blue-50/30 -mx-6'
									: ''}"
							>
								<h3
									class="text-2xl font-bold {report.style
										.themeColor} mb-4"
								>
									5.2.{i + 1}
									{vuln.title || "Titre de la vulnérabilité"}
								</h3>

								<div class="flex flex-wrap gap-3 mb-6">
									<span
										class="px-3 py-1 {colorCvss(
											calculateBaseScore(
												toStringVector(vuln.cvss),
											),
										)} rounded-full text-sm font-bold border"
									>
										CVSS: {calculateBaseScore(
											toStringVector(vuln.cvss),
										)}
									</span>
									<span
										class="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium border border-border"
									>
										{vuln.category}
									</span>
								</div>

								<div class="space-y-6 text-sm leading-relaxed">
									<div>
										<h4
											class="text-lg font-bold mb-2 text-foreground"
										>
											Description
										</h4>
										<div
											class="text-muted-foreground prose prose-sm max-w-none"
										>
											{@html vuln.description ||
												"Aucune description fournie."}
										</div>
									</div>

									<div>
										<h4
											class="text-lg font-bold mb-2 text-foreground"
										>
											Procédure de reproduction
										</h4>
										<div
											class="prose prose-sm max-w-none text-muted-foreground"
										>
											{@html vuln.procedure ||
												"Aucune procédure technique spécifiée."}
										</div>
									</div>
								</div>
							</div>

							{#if i < report.vulnerabilities.length - 1}
								<Separator class="my-8" />
							{/if}
						{/each}
					</div>
				</section>
			</div>
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>

<style>
	@reference "./layout.css";
	:global(.prose) {
		@apply text-foreground leading-relaxed;
	}
	:global(.prose p) {
		@apply mb-4;
	}
	:global(.prose ul) {
		@apply list-disc list-inside mb-4;
	}
	:global(.prose ol) {
		@apply list-decimal list-inside mb-4;
	}
	:global(.prose code) {
		@apply bg-muted text-muted-foreground px-1.5 py-0.5 rounded-md font-mono text-sm border border-border;
	}
	:global(.prose pre),
	:global(.prose .ql-code-block-container),
	:global(.prose pre.ql-syntax) {
		@apply bg-zinc-950 text-green-400 p-4 rounded-lg my-4 overflow-x-auto border border-zinc-800 text-sm font-mono;
		white-space: pre-wrap !important;
	}
	:global(.prose .ql-code-block) {
		display: block;
		min-height: 1em;
	}
	:global(.prose pre code) {
		@apply bg-transparent text-inherit p-0 rounded-none border-none;
	}
</style>
