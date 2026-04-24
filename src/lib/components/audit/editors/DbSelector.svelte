<script lang="ts">
	import { Plus } from "lucide-svelte";

	let { 
		items, 
		onSelect, 
		lang,
		helperText,
		descriptionKey = null
	}: { 
		items: any[], 
		onSelect: (item: any) => void, 
		lang: string,
		helperText: string,
		descriptionKey?: string | null
	} = $props();
</script>

<div class="space-y-4">
	<p class="text-[11px] text-muted-foreground italic mb-4">
		{helperText} ({lang.toUpperCase()}).
	</p>
	<div class="grid gap-2">
		{#each items as item}
			<button 
				class="w-full text-left p-3 rounded-xl border bg-card hover:border-blue-500 hover:ring-1 hover:ring-blue-500 transition-all group"
				onclick={() => onSelect(item)}
			>
				<div class="flex justify-between items-start gap-2 mb-1">
					<span class="text-xs font-bold uppercase tracking-tight group-hover:text-blue-600 transition-colors">{item.title}</span>
					<Plus class="w-3.5 h-3.5 text-muted-foreground group-hover:text-blue-600" />
				</div>
				{#if descriptionKey && item[descriptionKey]}
					<div class="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
						{item[descriptionKey]}
					</div>
				{/if}
			</button>
		{/each}
	</div>
</div>
