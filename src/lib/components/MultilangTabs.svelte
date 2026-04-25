<script lang="ts">
    import * as Tabs from "$lib/components/ui/tabs/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Textarea } from "$lib/components/ui/textarea/index.js";
    import type { Snippet } from "svelte";

    let { languages, fields }: { 
        languages: any[], 
        fields: { id: string, label: string, type: 'input' | 'textarea', placeholder?: string, rows?: number }[]
    } = $props();
</script>

<Tabs.Root value={languages[0].code} class="w-full">
    <Tabs.List class="grid w-full" style="grid-template-columns: repeat({languages.length}, 1fr)">
        {#each languages as lang}
            <Tabs.Trigger value={lang.code}>{lang.label}</Tabs.Trigger>
        {/each}
    </Tabs.List>
    
    {#each languages as lang}
        <Tabs.Content value={lang.code} class="space-y-4 pt-4 animate-in fade-in zoom-in-95 duration-200">
            {#each fields as field}
                <div class="space-y-2">
                    <Label for="{field.id}_{lang.code}">{field.label} ({lang.code.toUpperCase()})</Label>
                    {#if field.type === 'textarea'}
                        <Textarea 
                            id="{field.id}_{lang.code}" 
                            name="{field.id}_{lang.code}" 
                            rows={field.rows || 3} 
                            placeholder={field.placeholder}
                        />
                    {:else}
                        <Input 
                            id="{field.id}_{lang.code}" 
                            name="{field.id}_{lang.code}" 
                            placeholder={field.placeholder} 
                            required={lang.code === languages[0].code && field.id === 'title'} 
                        />
                    {/if}
                </div>
            {/each}
        </Tabs.Content>
    {/each}
</Tabs.Root>
