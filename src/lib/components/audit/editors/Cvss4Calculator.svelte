<script lang="ts">
	import { colorCvss, toStringVector } from "$lib";
	import { calculateBaseScore } from "cvss4";
	import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
	import * as Tooltip from "$lib/components/ui/tooltip/index.js";
	import type { CvssV4 } from "$lib/interfaces";

	let { vector = $bindable() }: { vector: CvssV4 } = $props();

	const metrics = [
		{ id: "AV", name: "Attack Vector", desc: "Contexte d'exploitation (Réseau, Physique...)", opts: { N: "Network", A: "Adjacent", L: "Local", P: "Physical" } },
		{ id: "AC", name: "Attack Complexity", desc: "Conditions hors contrôle de l'attaquant", opts: { L: "Low", H: "High" } },
		{ id: "AT", id2: "Attack Requirements", desc: "Conditions spécifiques au système", opts: { N: "None", P: "Present" } },
		{ id: "PR", name: "Privileges Required", desc: "Niveau de privilèges requis", opts: { N: "None", L: "Low", H: "High" } },
		{ id: "UI", name: "User Interaction", desc: "Interaction humaine requise", opts: { N: "None", P: "Passive", A: "Active" } },
		{ id: "VC", name: "Vuln. Conf.", desc: "Confidentialité du système vulnérable", opts: { H: "High", L: "Low", N: "None" } },
		{ id: "VI", name: "Vuln. Integ.", desc: "Intégrité du système vulnérable", opts: { H: "High", L: "Low", N: "None" } },
		{ id: "VA", name: "Vuln. Avail.", desc: "Disponibilité du système vulnérable", opts: { H: "High", L: "Low", N: "None" } },
		{ id: "SC", name: "Subsequent Conf.", desc: "Confidentialité système subséquent", opts: { H: "High", L: "Low", N: "None" } },
		{ id: "SI", name: "Subsequent Integ.", desc: "Intégrité système subséquent", opts: { H: "High", L: "Low", N: "None" } },
		{ id: "SA", name: "Subsequent Avail.", desc: "Disponibilité système subséquent", opts: { H: "High", L: "Low", N: "None" } }
	];

	let score = $derived(calculateBaseScore(toStringVector(vector)));
	let st = $derived(colorCvss(score));
</script>

<div class="p-4 bg-muted/30 rounded-xl border border-dashed"> 
	<div class="flex items-center justify-between border-b pb-4 mb-4">
		<div class="min-w-0">
			<h3 class="font-semibold text-sm">Calculateur CVSS v4.0</h3>
			<p class="text-[10px] text-muted-foreground font-mono mt-1 truncate">{toStringVector(vector)}</p>
		</div>
		<span class="text-2xl font-black px-4 py-1 rounded-md border shrink-0 ml-4" style="background: {st.bg}; color: {st.text}; border-color: {st.border}">{score.toFixed(1)}</span>
	</div>

	<div class="flex flex-col gap-3">
		{#each metrics as m}
			<div class="flex items-center justify-between gap-2">
				<Tooltip.Provider delayDuration={200}>
					<Tooltip.Root>
						<Tooltip.Trigger class="text-[10px] font-bold text-muted-foreground uppercase tracking-wide cursor-help text-left hover:text-foreground">
							{m.id} <span class="hidden sm:inline">— {m.name || m.id2}</span>
						</Tooltip.Trigger>
						<Tooltip.Content side="right" class="max-w-60 text-xs"><p><strong>{m.name || m.id2} :</strong> {m.desc}</p></Tooltip.Content>
					</Tooltip.Root>
				</Tooltip.Provider>
				<ToggleGroup.Root variant="outline" type="single" size="sm" bind:value={vector[m.id]} class="shrink-0">
					{#each Object.entries(m.opts) as [v, l]} <ToggleGroup.Item value={v} class="h-6 px-1.5 text-[9px] min-w-8">{v}</ToggleGroup.Item> {/each}
				</ToggleGroup.Root>
			</div>
		{/each}
	</div>
</div>