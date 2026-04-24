<script lang="ts">
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Database, Plus, ChevronRight } from "lucide-svelte";
	import type { Snippet } from "svelte";

	let { 
		label, 
		items, 
		onAdd, 
		onOpenDb, 
		onOpenItem,
		itemContent,
		class: className = ""
	}: {
		label: string,
		items: any[],
		onAdd: () => void,
		onOpenDb: () => void,
		onOpenItem: (i: number) => void,
		itemContent?: Snippet<[any]>,
		class?: string
	} = $props();
</script>

<Sidebar.Group class={className}>
	<div class="flex items-center justify-between px-2 mb-2">
		<Sidebar.GroupLabel class="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/70">
			{label}
		</Sidebar.GroupLabel>
		<div class="flex items-center gap-1">
			<Button 
				size="icon" 
				variant="ghost" 
				class="h-6 w-6 hover:bg-blue-50 hover:text-blue-600" 
				onclick={onOpenDb} 
				title="Library"
			>
				<Database class="w-3.5 h-3.5" />
			</Button>
			<Button 
				size="icon" 
				variant="ghost" 
				class="h-6 w-6 hover:bg-blue-50 hover:text-blue-600" 
				onclick={onAdd}
			>
				<Plus class="w-3.5 h-3.5" />
			</Button>
		</div>
	</div>
	<div class="px-2 space-y-1">
		{#each items as item, index}
			<button
				class="w-full group flex items-center justify-between p-2 rounded-lg border bg-background/50 transition-all hover:border-blue-200 hover:bg-blue-50/50 text-left"
				onclick={() => onOpenItem(index)}
			>
				<div class="min-w-0 flex items-center gap-2">
					{#if itemContent}
						{@render itemContent(item)}
					{:else}
						<span class="text-[11px] font-medium truncate uppercase tracking-tight">
							{item.title || "Sans titre"}
						</span>
					{/if}
				</div>
				<ChevronRight class="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
			</button>
		{/each}
	</div>
</Sidebar.Group>
