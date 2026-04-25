<script lang="ts">
	import type { ReportState } from "$lib/report-state.svelte";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Textarea } from "$lib/components/ui/textarea/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import RichTextEditor from "./RichTextEditor.svelte";
	import Cvss4Calculator from "./Cvss4Calculator.svelte";
	import GenericList from "./GenericList.svelte";

	let { state }: { state: ReportState } = $props();

	function getBinding(field: any) {
		if (state.activeIndex !== null && state.activeCollection) return { target: state.report[state.activeCollection][state.activeIndex], key: field.id };
		const parts = field.path?.split('.') || [];
		let target = state.report as any;
		for (let i = 0; i < parts.length - 1; i++) target = target[parts[i]] || (target[parts[i]] = {});
		return { target, key: parts[parts.length - 1] };
	}
</script>

<div class="space-y-6 pb-32">
	{#each state.editorInfo.fields as field}
		{@const { target, key } = getBinding(field)}
		{#if field.type === "list"}
			<GenericList bind:data={target[key]} fields={field.fields || []} t={state.t} />
		{:else}
			<div class="space-y-1.5">
				<Label class="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{state.t(field.label)}</Label>
				{#if field.type === "rich"} 
					<RichTextEditor bind:value={target[key]} />
				{:else if field.type === "textarea"} 
					<Textarea bind:value={target[key]} class="min-h-40 font-mono text-[11px] bg-zinc-950 text-zinc-300" />
				{:else if field.type === "select"}
					<select bind:value={target[key]} class="w-full h-10 px-3 rounded-md border bg-background">
						{#each field.options || [] as opt} 
							<option value={opt.value}>{opt.label}</option> 
						{/each}
					</select>
				{:else if field.type === "cvss"}
					<Cvss4Calculator bind:vector={target[key]} /> 
				{:else if field.type === "date"}
					<Input type="date" bind:value={target[key]} />
				{:else} 
					<Input bind:value={target[key]} />
				{/if}
			</div>
		{/if}
	{/each}
</div>
