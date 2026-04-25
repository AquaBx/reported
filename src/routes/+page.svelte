<script lang="ts">
	import * as Card from "$lib/components/ui/card/index.js";
	import { ShieldCheck, AlertTriangle, CheckCircle2, Clock, Calendar as CalendarIcon, User } from "@lucide/svelte";
	import type { Audit } from "$lib/interfaces";

	let { data } = $props();
	const audits : Audit[] = $derived(data.audits);

	const stats = $derived([
		{ title: "Total Audits", value: audits.length.toString(), icon: ShieldCheck, color: "text-blue-600" },
		{ title: "In Progress", value: audits.filter(a => a.state === 'In Progress').length.toString(), icon: Clock, color: "text-yellow-600" },
		{ title: "To Review", value: audits.filter(a => a.state === 'Review').length.toString(), icon: AlertTriangle, color: "text-orange-600" },
		{ title: "Completed", value: audits.filter(a => a.state === 'Approved').length.toString(), icon: CheckCircle2, color: "text-green-600" }
	]);

	// --- Timeline Logic ---
	const startDate = new Date();
	startDate.setHours(0, 0, 0, 0);

	const daysCount = 90; // Réduit à 90 pour le dashboard
	const days = Array.from({ length: daysCount }, (_, i) => {
		const d = new Date(startDate);
		d.setDate(d.getDate() + i);
		return d;
	});

	const auditors = $derived.by(() => {
		const names = new Set<string>();
		audits.forEach(a => a.auditors?.forEach(aud => aud.name && names.add(aud.name)));
		const list = Array.from(names).sort();
		return list.length > 0 ? list : ["Non assigné"];
	});

	function getAuditStyle(audit: Audit, auditorName: string) {
		if (!audit.date_start || !audit.date_end) return null;
		const start = new Date(audit.date_start);
		const end = new Date(audit.date_end);
		start.setHours(0, 0, 0, 0);
		end.setHours(0, 0, 0, 0);

		const viewEnd = new Date(startDate);
		viewEnd.setDate(viewEnd.getDate() + daysCount);

		if (end < startDate || start > viewEnd) return null;

		const isAssigned = (audit.auditors?.some(a => a.name === auditorName)) || (auditorName === "Non assigné" && (!audit.auditors || audit.auditors.length === 0));
		if (!isAssigned) return null;

		const diffStart = Math.max(0, Math.floor((start.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
		const diffEnd = Math.min(daysCount - 1, Math.floor((end.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
		const span = diffEnd - diffStart + 1;

		return { start: diffStart, span, color: getColor(audit._id as string) };
	}

	function getColor(id: string) {
		const colors = ['bg-blue-600', 'bg-indigo-600', 'bg-purple-600', 'bg-emerald-600', 'bg-amber-600', 'bg-rose-600'];
		let hash = 0;
		for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
		return colors[Math.abs(hash) % colors.length];
	}

	const isWeekend = (date: Date) => [0, 6].includes(date.getDay());
</script>

<div class="p-8 space-y-8 h-full flex flex-col min-h-0 overflow-hidden">
	<div class="shrink-0 space-y-8">
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Dashboard</h1>
			<p class="text-muted-foreground">Welcome back, Benjamin. Here's what's happening.</p>
		</div>

		<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			{#each stats as stat}
				<Card.Root>
					<Card.Header class="flex flex-row items-center justify-between pb-2">
						<Card.Title class="text-sm font-medium">{stat.title}</Card.Title>
						<stat.icon class="size-4 {stat.color}" />
					</Card.Header>
					<Card.Content class="text-2xl font-bold">
						{stat.value}
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	</div>

	<!-- Timeline Card -->
	<div class="flex-1 flex flex-col min-h-0 min-w-0">
		<div class="shrink-0 pb-4">
			<div class="flex items-center gap-2">
				<CalendarIcon class="w-5 h-5 text-blue-600" />
				<h2 class="text-xl font-bold tracking-tight">Planning de l'équipe</h2>
			</div>
			<p class="text-sm text-muted-foreground">Vue continue sur les 3 prochains mois.</p>
		</div>

		<div class="flex-1 border rounded-xl bg-card overflow-hidden shadow-sm flex flex-col min-h-0">
			<div class="flex-1 overflow-auto">
				<div class="inline-block min-w-full align-middle">
					<div class="relative border-b border-r" style="width: calc(200px + {daysCount * 40}px);">

						<!-- Header Row (Sticky Top) -->
						<div class="sticky top-0 z-30 flex bg-card/95 backdrop-blur border-b">
							<div class="sticky left-0 z-40 w-[200px] border-r bg-card px-4 py-3 flex items-center shrink-0">
								<span class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Auditeurs</span>
							</div>
							<div class="flex">
								{#each days as date}
									<div class="w-[40px] border-r shrink-0 py-3 flex flex-col items-center justify-center {isWeekend(date) ? 'bg-muted/30' : ''}">
										<span class="text-[8px] font-bold uppercase text-muted-foreground">{date.toLocaleDateString('fr-FR', { weekday: 'short' })}</span>
										<span class="text-xs font-mono font-bold {date.getTime() === startDate.getTime() ? 'text-blue-600' : ''}">{date.getDate()}</span>
									</div>
								{/each}
							</div>
						</div>

						<!-- Auditor Rows -->
						{#each auditors as auditor}
							<div class="flex border-b last:border-0 hover:bg-muted/5 transition-colors group">
								<div class="sticky left-0 z-20 w-[200px] border-r bg-card/98 backdrop-blur px-4 py-3 flex items-center shrink-0 shadow-[2px_0_10px_rgba(0,0,0,0.02)]">
									<div class="flex items-center gap-3 overflow-hidden">
										<div class="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
											<User class="w-4 h-4 text-blue-600" />
										</div>
										<span class="text-xs font-bold truncate tracking-tight">{auditor}</span>
									</div>
								</div>

								<div class="relative flex h-16">
									{#each days as date}
										<div class="w-[40px] border-r shrink-0 {isWeekend(date) ? 'bg-muted/10' : ''}"></div>
									{/each}

									{#each audits as audit}
										{@const style = getAuditStyle(audit, auditor)}
										{#if style}
											<a href="/audits/{audit._id}" 
											   class="absolute top-3 bottom-3 z-10 rounded-md border shadow-sm px-2 flex items-center gap-2 overflow-hidden transition-all hover:scale-[1.01] hover:z-20 text-white border-white/10 {style.color}"
											   style="left: calc({style.start * 40}px + 4px); width: calc({style.span * 40}px - 8px);">
												<ShieldCheck class="w-3.5 h-3.5 shrink-0 opacity-80" />
												<span class="text-[10px] font-bold truncate leading-none">{audit.name}</span>
											</a>
										{/if}
									{/each}
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<style>
	::-webkit-scrollbar { width: 6px; height: 6px; }
	::-webkit-scrollbar-track { background: transparent; }
	::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.05); border-radius: 10px; }
	::-webkit-scrollbar-thumb:hover { background: rgba(0, 0, 0, 0.1); }
</style>