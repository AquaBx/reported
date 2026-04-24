<script lang="ts">
	import type { ReportState } from "$lib/report-state.svelte";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Textarea } from "$lib/components/ui/textarea/index.js";
	import RichTextEditor from "../RichTextEditor.svelte";
	import Cvss4Calculator from "../Cvss4Calculator.svelte";
	import EditorField from "./EditorField.svelte";
	import GenericList from "./GenericList.svelte";

	let { state }: { state: ReportState } = $props();

	function getBinding(field: any) {
		let target: any;
		let key: string;

		if (state.activeIndex !== null && state.activeCollection) {
			target = state.report[state.activeCollection][state.activeIndex];
			key = field.id;
		} else {
			const parts = field.path?.split('.') || [];
			target = state.report;
			for (let i = 0; i < parts.length - 1; i++) {
				target = target[parts[i]];
			}
			key = parts[parts.length - 1];
		}

		return { target, key };
	}
</script>

<div class="space-y-6 pb-32">
	{#each state.editorInfo.fields as field}
		{@const binding = getBinding(field)}
		
		{#if field.type === "list"}
			<GenericList 
				bind:data={binding.target[binding.key]} 
				fields={field.fields || []}
				t={state.t}
			/>
		{:else}
			<EditorField label={state.t(field.label)}>
				{#if field.type === "rich"}
					<RichTextEditor bind:value={binding.target[binding.key]} />
				{:else if field.type === "textarea"}
					<Textarea
						bind:value={binding.target[binding.key]}
						class="min-h-40 font-mono text-[11px] bg-zinc-950 text-zinc-300"
					/>
				{:else if field.type === "color"}
					<div class="flex items-center gap-4">
						<input type="color" bind:value={binding.target[binding.key]} class="h-10 w-20 cursor-pointer" />
						<code class="text-xs">{binding.target[binding.key]}</code>
					</div>
				{:else if field.type === "select"}
					<select bind:value={binding.target[binding.key]} class="w-full h-10 px-3 rounded-md border bg-background">
						{#each field.options || [] as opt}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				{:else if field.type === "cvss"}
					<div class="p-4 bg-muted/30 rounded-xl border border-dashed">
						<Cvss4Calculator bind:vector={binding.target[binding.key]} />
					</div>
				{:else}
					<Input bind:value={binding.target[binding.key]} />
				{/if}
			</EditorField>
		{/if}
	{/each}
</div>
