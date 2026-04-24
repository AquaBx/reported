<script lang="ts">
	import { calculateBaseScore } from "cvss4";
	import { colors, toStringVector, type Vulnerability } from "$lib/index";

	interface Props {
		vulnerabilities: Vulnerability[];
	}

	let { vulnerabilities }: Props = $props();

	let currentStats = $derived.by(() => {
		const counts = { Critical: 0, High: 0, Medium: 0, Low: 0, Info: 0 };
		vulnerabilities.forEach((v) => {
			try {
				const score = calculateBaseScore(toStringVector(v.cvss));
				if (typeof score === "number" && !isNaN(score)) {
					if (score >= 9.0) counts.Critical++;
					else if (score >= 7.0) counts.High++;
					else if (score >= 4.0) counts.Medium++;
					else if (score > 0) counts.Low++;
					else counts.Info++;
				}
			} catch (e) {
				counts.Info++;
			}
		});
		return counts;
	});

	let maxCount = $derived(Math.max(...Object.values(currentStats), 1));
</script>

<div class="cvss-horizontal-chart">
	{#each Object.entries(currentStats) as [severity, count]}
		<div class="chart-row">
			<div class="row-label">{severity}</div>
			<div class="row-bar-container">
				<div
					class="row-bar-fill"
					style="width: {(count / maxCount) *
						100}%; background-color: {colors[
						severity as keyof typeof colors
					]}"
				>
					{#if count > 0}
						<span class="row-bar-count">{count}</span>
					{/if}
				</div>
			</div>
		</div>
	{/each}
</div>
