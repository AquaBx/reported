<script lang="ts">
	import { calculateBaseScore } from "cvss4";
	import { colors, toStringVector, severityKey } from "$lib/index";

	let { vulnerabilities }: { vulnerabilities: any[] } = $props();

	let stats = $derived.by(() => {
		const counts: any = { Critical: 0, High: 0, Medium: 0, Low: 0, Info: 0 };
		vulnerabilities.forEach((v) => {
			try { counts[severityKey(calculateBaseScore(toStringVector(v.cvss)))]++; } catch(e) { counts.Info++; }
		});
		return counts;
	});

	let max = $derived(Math.max(...Object.values(stats) as number[], 1));
</script>

<div class="cvss-horizontal-chart">
	{#each Object.entries(stats) as [sev, count]}
		<div class="chart-row">
			<div class="row-label">{sev}</div>
			<div class="row-bar-container">
				<div class="row-bar-fill" style="width: {(count as number / max) * 100}%; background-color: {colors[sev as keyof typeof colors]}">
					{#if count as number > 0} <span class="row-bar-count">{count}</span> {/if}
				</div>
			</div>
		</div>
	{/each}
</div>
