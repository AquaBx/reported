<script lang="ts">
	import { colorCvss, toStringVector, type CvssV4 } from "$lib";
	import { calculateBaseScore } from "cvss4";
	import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
	import * as Tooltip from "$lib/components/ui/tooltip/index.js";

	let {
		vector = $bindable(),
	}: {
		vector: CvssV4;
	} = $props();

	// Ajout des descriptions officielles traduites pour les tooltips
	const metrics = [
		{
			id: "AV",
			name: "Attack Vector",
			description:
				"Le contexte par lequel l'exploitation est possible (ex: à distance via le réseau, ou nécessite un accès physique).",
			options: { N: "Network", A: "Adjacent", L: "Local", P: "Physical" },
		},
		{
			id: "AC",
			name: "Attack Complexity",
			description:
				"Conditions hors du contrôle de l'attaquant qui doivent exister pour exploiter la vulnérabilité (ex: contournement de mitigations).",
			options: { L: "Low", H: "High" },
		},
		{
			id: "AT",
			name: "Attack Requirements",
			description:
				"Conditions préalables d'exécution ou de déploiement spécifiques au système cible (ex: race condition complexe).",
			options: { N: "None", P: "Present" },
		},
		{
			id: "PR",
			name: "Privileges Required",
			description:
				"Le niveau de privilèges que l'attaquant doit posséder avant de réussir l'attaque.",
			options: { N: "None", L: "Low", H: "High" },
		},
		{
			id: "UI",
			name: "User Interaction",
			description:
				"L'attaque nécessite-t-elle qu'un utilisateur humain participe d'une manière ou d'une autre ? (ex: cliquer sur un lien).",
			options: { N: "None", P: "Passive", A: "Active" },
		},
		{
			id: "VC",
			name: "Vuln. Confidentiality",
			description:
				"Impact sur la confidentialité du système vulnérable lui-même.",
			options: { H: "High", L: "Low", N: "None" },
		},
		{
			id: "VI",
			name: "Vuln. Integrity",
			description:
				"Impact sur l'intégrité du système vulnérable lui-même.",
			options: { H: "High", L: "Low", N: "None" },
		},
		{
			id: "VA",
			name: "Vuln. Availability",
			description:
				"Impact sur la disponibilité du système vulnérable lui-même.",
			options: { H: "High", L: "Low", N: "None" },
		},
		{
			id: "SC",
			name: "Subsequent Conf.",
			description:
				"Impact sur la confidentialité d'un système subséquent (un autre système impacté par la compromission du premier).",
			options: { H: "High", L: "Low", N: "None" },
		},
		{
			id: "SI",
			name: "Subsequent Integ.",
			description: "Impact sur l'intégrité d'un système subséquent.",
			options: { H: "High", L: "Low", N: "None" },
		},
		{
			id: "SA",
			name: "Subsequent Avail.",
			description: "Impact sur la disponibilité d'un système subséquent.",
			options: { H: "High", L: "Low", N: "None" },
		},
	];

	let score = $derived(calculateBaseScore(toStringVector(vector)));
	let scoreColor = $derived(colorCvss(score));
</script>

<div class="rounded-lg border bg-card p-4 shadow-sm">
	<div class="flex items-center justify-between border-b pb-4 mb-4">
		<div>
			<h3 class="font-semibold text-sm">Calculateur CVSS v4.0</h3>
			<p
				class="text-[11px] text-muted-foreground font-mono mt-1 break-all"
			>
				{toStringVector(vector)}
			</p>
		</div>
		<div class="text-center shrink-0 ml-4">
			<span
				class={`text-2xl font-black px-4 py-1 rounded-md border ${scoreColor}`}
			>
				{score.toFixed(1)}
			</span>
		</div>
	</div>

	<div class="flex flex-col gap-4">
		{#each metrics as metric}
			<div class="flex items-center justify-between">
				<Tooltip.Provider delayDuration={200}>
					<Tooltip.Root>
						<Tooltip.Trigger
							class="text-[11px] font-bold text-muted-foreground uppercase tracking-wide cursor-help text-left hover:text-foreground transition-colors"
						>
							{metric.id}
							<span class="hidden sm:inline">— {metric.name}</span
							>
						</Tooltip.Trigger>
						<Tooltip.Content side="right" class="max-w-62.5 text-xs">
							<p>
								<strong>{metric.name} :</strong>
								{metric.description}
							</p>
						</Tooltip.Content>
					</Tooltip.Root>
				</Tooltip.Provider>

				<ToggleGroup.Root
					variant="outline"
					type="single"
					size="sm"
					bind:value={vector[metric.id]}
				>
					{#each Object.entries(metric.options) as [val, label]}
						<ToggleGroup.Item
							value={val}
							class="h-7 px-2 text-[10px] sm:text-xs"
						>
							{label}
						</ToggleGroup.Item>
					{/each}
				</ToggleGroup.Root>
			</div>
		{/each}
	</div>
</div>
