<script lang="ts">
	import { Input } from "$lib/components/ui/input/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import RichTextEditor from "../RichTextEditor.svelte";
	import EditorField from "./EditorField.svelte";
	import { Trash2, Plus } from "lucide-svelte";
	import type { FieldConfig } from "$lib/report-state.svelte";

	let { data = $bindable(), fields, t }: { data: any[]; fields: FieldConfig[]; t: (key: string) => string } = $props();

	function addItem() {
		const newItem = fields.reduce((acc, field) => {
			acc[field.id] = field.type === "rich" ? "" : "";
			return acc;
		}, {} as any);
		data.push(newItem);
	}

	function removeItem(index: number) {
		data.splice(index, 1);
	}
</script>

<div class="space-y-4">
	{#each data as item, i}
		<div class="p-4 border rounded-xl relative group bg-muted/10 space-y-4">
			<Button
				variant="ghost"
				size="icon"
				class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 h-8 w-8 text-destructive"
				onclick={() => removeItem(i)}
			>
				<Trash2 class="h-4 w-4" />
			</Button>

			{#each fields as field}
				<EditorField label={t(field.label)}>
					{#if field.type === "rich"}
						<RichTextEditor bind:value={item[field.id]} />
					{:else if field.type === "textarea"}
						<textarea
							bind:value={item[field.id]}
							class="w-full min-h-[100px] p-3 rounded-md border bg-background"
						></textarea>
					{:else}
						<Input bind:value={item[field.id]} />
					{/if}
				</EditorField>
			{/each}
		</div>
	{/each}
</div>