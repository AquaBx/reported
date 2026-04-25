<script lang="ts">
	import * as Table from "$lib/components/ui/table/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Plus, Trash2, SquarePen } from "@lucide/svelte";
	import { enhance } from '$app/forms';
	import * as Sheet from "$lib/components/ui/sheet/index.js";
	import * as ButtonGroup from "$lib/components/ui/button-group/index.js";
	import PageHeader from "$lib/components/PageHeader.svelte";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { Textarea } from "$lib/components/ui/textarea/index.js";
	import type { Snippet } from "svelte";

	let {
		title,
		description,
		addLabel = "Nouveau",
		items = [],
		columns = [],
		idField = "_id",
		deleteAction = "?/delete",
		createAction = "?/create",
		sheetTitle = "Ajouter",
		sheetDescription = "Remplissez les informations ci-dessous.",
		sheetContent,
		fields = [],
		rowActions,
		extraActions,
		onEdit
	}: {
		title: string;
		description: string;
		addLabel?: string;
		items: any[];
		columns: { header: string; cell: Snippet<[any]>; class?: string }[];
		idField?: string;
		deleteAction?: string;
		createAction?: string;
		sheetTitle?: string;
		sheetDescription?: string;
		sheetContent?: Snippet;
		fields?: { id: string; label: string; type: string; placeholder?: string; required?: boolean }[];
		rowActions?: Snippet<[any]>;
		extraActions?: Snippet;
		onEdit?: (item: any) => void;
	} = $props();

	let isCreateOpen = $state(false);
</script>

<div class="p-8 space-y-6">
	<PageHeader {title} {description}>
		<div class="flex items-center gap-2">
			{#if extraActions}
				{@render extraActions()}
			{/if}
			{#if sheetContent || fields.length > 0}
				<Sheet.Root bind:open={isCreateOpen}>
				<Sheet.Trigger>
					{#snippet child({ props })}
						<Button {...props}><Plus class="mr-2 h-4 w-4" /> {addLabel}</Button>
					{/snippet}
				</Sheet.Trigger>
				<Sheet.Content class="sm:max-w-2xl overflow-y-auto">
					<Sheet.Header>
						<Sheet.Title>{sheetTitle}</Sheet.Title>
						<Sheet.Description>{sheetDescription}</Sheet.Description>
					</Sheet.Header>
					<form
						action={createAction}
						method="POST"
						use:enhance={() =>
							async ({ update }) => {
								await update();
								isCreateOpen = false;
							}}
						class="space-y-6 py-4"
					>
						{#if fields.length > 0}
							{#each fields as field}
								<div class="space-y-2">
									<Label for={field.id}>{field.label}</Label>
									{#if field.type === 'textarea'}
										<Textarea id={field.id} name={field.id} placeholder={field.placeholder} required={field.required} />
									{:else}
										<Input id={field.id} name={field.id} type={field.type} placeholder={field.placeholder} required={field.required} />
									{/if}
								</div>
							{/each}
						{/if}
						
						{#if sheetContent}
							{@render sheetContent()}
						{/if}
						<Button type="submit" class="w-full">Enregistrer</Button>
					</form>
				</Sheet.Content>
			</Sheet.Root>
		{/if}
	</PageHeader>

	<div class="border rounded-lg bg-card overflow-hidden">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					{#each columns as col}
						<Table.Head class={col.class}>{col.header}</Table.Head>
					{/each}
					<Table.Head class="text-right">Actions</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#if !items.length}
					<Table.Row>
						<Table.Cell colspan={columns.length + 1} class="text-center py-10 text-muted-foreground">
							Aucun élément trouvé.
						</Table.Cell>
					</Table.Row>
				{:else}
					{#each items as item}
						<Table.Row>
							{#each columns as col}
								<Table.Cell class={col.class}>{@render col.cell(item)}</Table.Cell>
							{/each}
							<Table.Cell class="text-right">
								<form action={deleteAction} class="flex justify-end" method="POST" use:enhance>
									<input type="hidden" name="id" value={item[idField]} />
									<ButtonGroup.Root orientation="horizontal">
										{#if rowActions}
											{@render rowActions(item)}
										{/if}
										{#if onEdit}
											<Button variant="secondary" onclick={() => onEdit(item)} size="icon"><SquarePen /></Button>
										{/if}
										<Button variant="destructive" type="submit" size="icon"><Trash2 /></Button>
									</ButtonGroup.Root>
								</form>
							</Table.Cell>
						</Table.Row>
					{/each}
				{/if}
			</Table.Body>
		</Table.Root>
	</div>
</div>
