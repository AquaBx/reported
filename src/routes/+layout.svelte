<script lang="ts">
	import "./layout.css";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import { 
		Bug,
		Inbox, 
		SquareDot, 
		Building, 
		Calendar, 
		Users, 
		Settings,
		ChevronUp,
		User,
		LogOut,
		PanelLeft,
		ShieldCheck,
		LayoutDashboard
	} from "@lucide/svelte";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import favicon from "$lib/assets/favicon.svg";
	import { page } from '$app/state';

	let { children } = $props();

	const items = [
		{ title: "Dashboard", icon: LayoutDashboard, url: "/" },
		{ title: "Audits", icon: SquareDot, url: "/audits" },
		{ title: "Clients", icon: Building, url: "/clients" },
		{ title: "Vulnerabilities", icon: Bug, url: "/vulnerabilities" },
		{ title: "Work Templates", icon: ShieldCheck, url: "/detailed-work" },
		{ title: "Team", icon: Users, url: "/team" },
		{ title: "Settings", icon: Settings, url: "/settings" },
	];

	let isEditor = $derived(page.url.pathname.includes('/audits/') && page.url.pathname.split('/').length > 2);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Reported - Security Audit Reporter</title>
</svelte:head>

<Sidebar.Provider>
	{#if !isEditor}
		<Sidebar.Root collapsible="icon" class="border-r bg-sidebar">
			<Sidebar.Header class="h-15.25 border-b flex flex-row items-center px-4 shrink-0 bg-sidebar/50 backdrop-blur justify-between">
				<div class="flex items-center gap-2 overflow-hidden">
					<div class="bg-blue-600 p-1.5 rounded-lg text-white shrink-0">
						<ShieldCheck class="w-4 h-4" />
					</div>
					<span class="font-bold text-xs uppercase tracking-widest truncate group-data-[collapsible=icon]:hidden">Reported</span>
				</div>
			</Sidebar.Header>
			<Sidebar.Content class="overflow-y-auto overflow-x-hidden">
				<Sidebar.Group>
					<Sidebar.Menu>
						{#each items as item}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton tooltipContent={item.title} isActive={page.url.pathname === item.url}>
									{#snippet child({ props })}
										<a href={item.url} {...props}>
											<item.icon class={page.url.pathname === item.url ? "text-blue-600" : "text-blue-600/70"} />
											<span class="font-medium">{item.title}</span>
											<!-- {#if item.badge}
												<span class="ml-auto bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[10px] font-bold">
													{item.badge}
												</span>
											{/if} -->
										</a>
									{/snippet}
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.Group>
			</Sidebar.Content>
			<Sidebar.Footer class="border-t bg-sidebar/50 backdrop-blur">
				<Sidebar.Menu>
					<Sidebar.MenuItem>
						<DropdownMenu.Root>
							<DropdownMenu.Trigger>
								{#snippet child({ props })}
									<Sidebar.MenuButton {...props}>
										<User class="text-blue-600/70" />
										<span class="font-medium text-xs">Benjamin Canac</span>
										<ChevronUp class="ml-auto text-muted-foreground w-3 h-3" />
									</Sidebar.MenuButton>
								{/snippet}
							</DropdownMenu.Trigger>
							<DropdownMenu.Content side="top" class="w-[--reka-dropdown-menu-trigger-width]">
								<DropdownMenu.Item>
									<User class="mr-2 h-4 w-4" />
									<span>Profile</span>
								</DropdownMenu.Item>
								<DropdownMenu.Item>
									<Settings class="mr-2 h-4 w-4" />
									<span>Settings</span>
								</DropdownMenu.Item>
								<DropdownMenu.Separator />
								<DropdownMenu.Item class="text-destructive focus:text-destructive">
									<LogOut class="mr-2 h-4 w-4" />
									<span>Log out</span>
								</DropdownMenu.Item>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</Sidebar.MenuItem>
				</Sidebar.Menu>
			</Sidebar.Footer>
			<Sidebar.Rail />
		</Sidebar.Root>
	{/if}

	<Sidebar.Inset class="flex flex-col h-dvh bg-muted/10 min-w-0 overflow-hidden">
		{#if !isEditor}
			<header class="bg-background shrink-0 flex items-center justify-between gap-2 border-b px-4 h-15.25 shadow-sm z-10 min-w-0">
				<div class="flex items-center gap-4 min-w-0">
					<Sidebar.Trigger class="-ms-1" />
					<div class="h-6 w-px bg-border"></div>
					<div class="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest truncate">
						<LayoutDashboard class="w-3.5 h-3.5 shrink-0" /> 
						{#if page.url.pathname === "/"}
							Dashboard
						{:else}
							<span class="truncate">{page.url.pathname.split('/').pop() || 'Dashboard'}</span>
						{/if}
					</div>
				</div>
			</header>
		{/if}
		<main class="flex-1 min-h-0 min-w-0 overflow-hidden flex flex-col">
			{@render children()}
		</main>
	</Sidebar.Inset>
</Sidebar.Provider>
