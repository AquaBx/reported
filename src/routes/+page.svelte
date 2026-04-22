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
		style: {
			themeColor: "text-blue-600",
			fontFamily: "sans",
			headerStyle: "default",
			logoBase64: "",
		},
		vulnerabilities: [],
	});

	let activeIndex = $state<number | null>(null);

	// 2. Génération automatique du sommaire avec $derived
	let sommaire = $derived(
		report.vulnerabilities.map(({ title }, index) => ({
			numero: index + 1,
			title,
		})),
	);

	// Fonction utilitaire pour les couleurs de sévérité
	function getSeverityColor(severity: string) {
		switch (severity) {
			case "Critique":
				return "text-red-600";
			case "Élevée":
				return "text-orange-500";
			case "Moyenne":
				return "text-yellow-600";
			case "Faible":
				return "text-green-600";
			default:
				return "text-gray-600";
		}
	}

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
					report = JSON.parse(e.target.result as string);
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
					Vulnérabilités
				</div>
				{#if activeIndex === null}
					<Button size="sm" onclick={addVulnerability}
						>+ Ajouter</Button
					>
				{/if}
			</div>
		</Sidebar.Header>

		<Sidebar.Content>
			<Sidebar.Group class="px-0 h-full">
				<Sidebar.GroupContent class="h-full">
					{#if activeIndex !== null}
						<div class="flex flex-col h-full bg-gray-50/30 p-4">
							<div class="flex items-center justify-between mb-6">
								<h2
									class="text-sm font-bold uppercase tracking-wider text-gray-500"
								>
									Édition
								</h2>
								<Button
									variant="ghost"
									size="sm"
									onclick={() => (activeIndex = null)}
								>
									Fermer
								</Button>
							</div>

							<div class="space-y-5 overflow-y-auto pb-8 pr-1">
								<div class="space-y-1.5">
									<Label>Titre</Label>
									<Input
										bind:value={
											report.vulnerabilities[activeIndex]
												.title
										}
									/>
								</div>

								<div class="grid grid-cols-2 gap-4">
									<div class="space-y-1.5">
										<Label>Catégorie</Label>
										<Input
											bind:value={
												report.vulnerabilities[
													activeIndex
												].category
											}
										/>
									</div>
								</div>

								<div class="col-span-2 mt-4 mb-2">
									<Cvss4Calculator
										bind:vector={
											report.vulnerabilities[activeIndex]
												.cvss
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
						{#if report.vulnerabilities.length === 0}
							<div
								class="p-8 text-center text-sm text-muted-foreground flex flex-col items-center gap-4"
							>
								<p>Aucune vulnérabilité identifiée.</p>
								<Button
									variant="outline"
									onclick={addVulnerability}
									>Ajouter la première</Button
								>
							</div>
						{/if}
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
									<Item.Description class="truncate">
										{vuln.description ||
											"Aucune description"}
									</Item.Description>
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
					{/if}
				</Sidebar.GroupContent>
			</Sidebar.Group>
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
				<div
					class="mb-10 grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6 opacity-40 hover:opacity-100 transition-opacity print:hidden"
				>
					<div class="space-y-1.5">
						<Label>Titre du document</Label>
						<Input
							bind:value={report.document.title}
							class="font-semibold"
						/>
					</div>
					<div class="space-y-1.5">
						<Label>Nom du client</Label>
						<Input bind:value={report.document.client} />
					</div>
				</div>

				<header class="border-b-4 pb-6 mb-10 border-blue-600">
					<h1
						class="text-4xl font-extrabold tracking-tight text-foreground"
					>
						{report.document.title}
					</h1>
					<p class="text-xl text-muted-foreground mt-2 font-medium">
						Client : {report.document.client}
					</p>
				</header>

				<div
					class="mb-12 p-8 bg-muted/50 rounded-xl border border-border/50"
				>
					<h2 class="text-2xl font-bold mb-6">Sommaire</h2>
					{#if sommaire.length === 0}
						<p class="text-muted-foreground italic">
							Le sommaire se générera automatiquement.
						</p>
					{/if}
					<ul class="space-y-3">
						{#each sommaire as item}
							<li
								class="flex justify-between border-b border-border/50 pb-2"
							>
								<span class="font-medium"
									>{item.numero}. {item.title ||
										"Sans titre"}</span
								>
								<!-- <span
									class="font-semibold {getSeverityColor(
										item.severity,
									)}"
								>
									{item.severity}
								</span> -->
							</li>
						{/each}
					</ul>
				</div>

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
								{i + 1}. {vuln.title ||
									"Titre de la vulnérabilité"}
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

							<div class="space-y-6">
								<div>
									<h4
										class="text-lg font-bold mb-2 text-foreground"
									>
										Description
									</h4>
									<p
										class="text-muted-foreground whitespace-pre-wrap leading-relaxed"
									>
										{@html vuln.description ||
											"Aucune description fournie."}
									</p>
								</div>

								<div>
									<h4
										class="text-lg font-bold mb-2 text-foreground"
									>
										Procédure de reproduction
									</h4>
									<pre
										class="bg-zinc-950 text-green-400 p-4 rounded-lg mt-2 overflow-x-auto border border-zinc-800"><code
											class="text-sm font-mono"
											>{@html vuln.procedure ||
												"Aucune procédure technique spécifiée."}</code
										></pre>
								</div>
							</div>
						</div>

						{#if i < report.vulnerabilities.length - 1}
							<Separator class="my-8" />
						{/if}
					{/each}
				</div>
			</div>
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
