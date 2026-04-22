<script lang="ts">
	import { colorCvss, toStringVector, type CvssV4 } from "$lib";
	import { calculateBaseScore } from "cvss4";

	let {
		vector = $bindable(),
	}: {
		vector: CvssV4;
	} = $props();

	// Les 11 métriques de base de CVSS v4.0
	const metrics = [
		{
			id: "AV",
			name: "Attack Vector",
			options: { N: "Network", A: "Adjacent", L: "Local", P: "Physical" },
		},
		{
			id: "AC",
			name: "Attack Complexity",
			options: { L: "Low", H: "High" },
		},
		{
			id: "AT",
			name: "Attack Requirements",
			options: { N: "None", P: "Present" },
		},
		{
			id: "PR",
			name: "Privileges Required",
			options: { N: "None", L: "Low", H: "High" },
		},
		{
			id: "UI",
			name: "User Interaction",
			options: { N: "None", P: "Passive", A: "Active" },
		},
		{
			id: "VC",
			name: "Vuln. Confidentiality",
			options: { H: "High", L: "Low", N: "None" },
		},
		{
			id: "VI",
			name: "Vuln. Integrity",
			options: { H: "High", L: "Low", N: "None" },
		},
		{
			id: "VA",
			name: "Vuln. Availability",
			options: { H: "High", L: "Low", N: "None" },
		},
		{
			id: "SC",
			name: "Subsequent Conf.",
			options: { H: "High", L: "Low", N: "None" },
		},
		{
			id: "SI",
			name: "Subsequent Integ.",
			options: { H: "High", L: "Low", N: "None" },
		},
		{
			id: "SA",
			name: "Subsequent Avail.",
			options: { H: "High", L: "Low", N: "None" },
		},
	];

	let score = $derived(calculateBaseScore(toStringVector(vector)));
	// Code couleur qualitatif selon le standard FIRST
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
	<div class="grid grid-cols-1 2xl:grid-cols-2 gap-x-6 gap-y-4">
		{#each metrics as metric}
			<div class="flex flex-col space-y-1.5">
				<p
					class="text-[11px] font-bold text-muted-foreground uppercase tracking-wider"
				>
					{metric.name} ({metric.id})
				</p>
				<div class="flex gap-1">
					{#each Object.entries(metric.options) as [val, label]}
						<button
							type="button"
							onclick={() => (vector[metric.id] = val)}
							class={`flex-1 text-[10px] font-bold py-1.5 px-1 rounded transition-all ${
								vector[metric.id] === val
									? "bg-primary text-primary-foreground shadow-sm ring-1 ring-primary"
									: "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
							}`}
							title={label}
						>
							{val} - {label}
						</button>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>
