<script lang="ts">
	import { onMount } from "svelte";
	import "quill/dist/quill.snow.css"; // Le thème par défaut de Quill

	let { value = $bindable("") } = $props<{ value: string }>();

	let editorContainer: HTMLElement;
	let quill: Quill;

	onMount(async () => {
		const { default: Quill } = await import("quill");

		quill = new Quill(editorContainer, {
			theme: "snow",
			placeholder: "Rédigez ici, collez ou glissez une image...",
			modules: {
				toolbar: [
					[{ header: [1, 2, 3, false] }],
					["bold", "italic", "underline", "strike", "code"],
					[{ list: "ordered" }, { list: "bullet" }],
					["link", "image", "code-block"],
					["clean"],
				],
			},
		});

		// Initialiser la valeur
		if (value) {
			quill.root.innerHTML = value;
		}

		// Écouter les modifications de l'utilisateur
		quill.on("text-change", () => {
			value = quill.root.innerHTML;
		});
	});
</script>

<div
	class="rounded-md border border-input bg-background shadow-sm overflow-hidden"
>
	<div bind:this={editorContainer} class="min-h-37.5 bg-white text-sm"></div>
</div>

<style>
	/* Ajustements pour intégrer Quill au design system Svelte/Shadcn */
	:global(.ql-toolbar) {
		border-top: none !important;
		border-left: none !important;
		border-right: none !important;
		border-bottom: 1px solid hsl(var(--border)) !important;
		background-color: hsl(var(--muted) / 0.5);
	}
	:global(.ql-container) {
		border: none !important;
		font-family: inherit !important;
	}
</style>
