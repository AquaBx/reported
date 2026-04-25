<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { Textarea } from "$lib/components/ui/textarea/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Plus, Trash2, Save, Globe, Palette, Code } from "@lucide/svelte";
	import { enhance } from '$app/forms';

	let { data } = $props();
	
	let { languages, reportStyle, themeColor } = $derived(data);
</script>

<form action="?/save" method="POST" use:enhance={() => {
    return async ({ update }) => { await update({ reset: false }); };
}} class="p-8 max-w-3xl mx-auto space-y-8">
    
    <div class="flex items-center justify-between border-b pb-6">
        <div>
            <h1 class="text-3xl font-bold tracking-tight">Paramètres</h1>
            <p class="text-muted-foreground">Configuration globale de l'application.</p>
        </div>
        <Button type="submit" size="lg" class="shadow-lg"><Save class="mr-2 h-5 w-5" /> Enregistrer tout</Button>
    </div>

    <input type="hidden" name="languages" value={JSON.stringify(languages)} />
    <input type="hidden" name="reportStyle" value={reportStyle} />
    <input type="hidden" name="themeColor" value={themeColor} />

    <!-- Langues -->
    <Card.Root>
        <Card.Header>
            <Card.Title class="flex items-center gap-2"><Globe class="w-5 h-5" /> Langues</Card.Title>
            <Card.Description>Langues disponibles pour la génération des rapports.</Card.Description>
        </Card.Header>
        <Card.Content class="space-y-4">
            <div class="space-y-3">
                {#each languages as lang, i}
                    <div class="flex items-center gap-3 p-2 rounded-lg border bg-muted/30 group">
                        <Input bind:value={lang.code} placeholder="fr" class="w-20 font-mono bg-background" />
                        <Input bind:value={lang.label} placeholder="Français" class="flex-1 bg-background" />
                        <Button variant="ghost" size="icon" class="text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onclick={() => languages.splice(i, 1)}><Trash2 class="h-4 w-4" /></Button>
                    </div>
                {/each}
            </div>
            <Button type="button" variant="outline" class="w-full border-dashed" onclick={() => languages.push({ code: '', label: '' })}><Plus class="mr-2 h-4 w-4" /> Ajouter une langue</Button>
        </Card.Content>
    </Card.Root>

    <!-- Apparence -->
    <Card.Root>
        <Card.Header>
            <Card.Title class="flex items-center gap-2"><Palette class="w-5 h-5" /> Apparence</Card.Title>
            <Card.Description>Identité visuelle des rapports générés.</Card.Description>
        </Card.Header>
        <Card.Content class="space-y-6">
            <div class="grid gap-4">
                <Label>Couleur d'accentuation</Label>
                <div class="flex items-center gap-4 p-4 border rounded-xl bg-muted/30">
                    <input type="color" bind:value={themeColor} class="w-14 h-14 rounded-full cursor-pointer border-none bg-transparent" />
                    <div class="flex-1 space-y-1">
                        <Input bind:value={themeColor} class="font-mono text-lg border-none p-0 h-auto focus-visible:ring-0 uppercase bg-transparent" />
                        <p class="text-xs text-muted-foreground">Utilisée pour les titres, bordures et éléments clés.</p>
                    </div>
				</div>
				<Label>Style Personnalisé (CSS)</Label>
				<Textarea bind:value={reportStyle} rows={12} class="p-4 border rounded-xl bg-muted/30 font-mono text-xs focus-visible:ring-0 resize-none  leading-relaxed" spellcheck="false" />
            </div>
        </Card.Content>
    </Card.Root>

</form>
