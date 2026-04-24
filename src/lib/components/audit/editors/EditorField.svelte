<script lang="ts">
	import { Label } from "$lib/components/ui/label/index.js";

	interface Props {
		label: string;
		children: any;
	}

	let { label, children }: Props = $props();
</script>

<div class="space-y-1.5">
	<Label
		class="text-[10px] uppercase font-bold text-muted-foreground tracking-wider"
	>
		{label}
	</Label>
	{@render children()}
</div>
