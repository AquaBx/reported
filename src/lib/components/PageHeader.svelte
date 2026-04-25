<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import { Plus } from "@lucide/svelte";
    import type { Snippet } from "svelte";

    let { title, description, addLabel, children }: { 
        title: string, 
        description?: string, 
        addLabel?: string,
        children?: Snippet 
    } = $props();
</script>

<div class="flex items-center justify-between">
    <div>
        <h1 class="text-3xl font-bold tracking-tight">{title}</h1>
        {#if description}
            <p class="text-muted-foreground">{description}</p>
        {/if}
    </div>
    <div class="flex items-center gap-2">
        {#if children}
            {@render children()}
        {:else if addLabel}
            <form action="/?/create" method="POST">
                <Button type="submit">
                    <Plus class="mr-2 h-4 w-4" />
                    {addLabel}
                </Button>
            </form>
        {/if}
    </div>
</div>
