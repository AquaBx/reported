<script lang="ts">
	import { calculateBaseScore } from "cvss4";
	import { colorCvss, severityLabel, toStringVector } from "$lib/index";
	import type { ReportState } from "$lib/report-state.svelte";
	import CvssChart from "./CvssChart.svelte";

	let { state, themeColor }: { state: ReportState, themeColor: string } = $props();
	let report = $derived(state.report);
</script>

{#snippet section(n: string, t: string)} <h2 class="title-h2"><span class="number-prefix">{n}.</span> {t}</h2> {/snippet}
{#snippet sub(n: string, t: string, c?: string)}
    <h3 class="title-h3"><span class="number-prefix">{n}</span> {t}</h3>
    <div class="prose">{@html c || state.t('none')}</div>
{/snippet}

<div id="report-preview" class="report-container" style="--report-accent: {themeColor}">
    <header style="margin-bottom: 120px; margin-top: 40px;">
        <h1 class="title-h1">{state.t('audit_report')}</h1>
        <p style="font-size: 1.5rem; color: var(--report-accent); font-weight: 700; margin-left: 45px;">{report.name}</p>
        <div class="report-meta-grid">
            <div class="meta-item">
                <span class="meta-label">{state.t("confidentiality")}</span>
                <span class="meta-value">{report["confidentiality"]}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">{state.t("client")}</span>
                <span class="meta-value">{report["client"]?.name}</span>
            </div>
        </div>
    </header>

    <section>
        {@render section('#', state.t('toc'))}
        <div style="margin-left: 3rem;">
            {#each state.sommaire as item}
                <div style="display: flex; gap: 1.5rem; padding: 0.75rem 0; border-bottom: 1px solid #f8f8f8; align-items: baseline;">
                    <span style="font-weight: 900; color: var(--report-accent); width: 50px; font-size: 0.8rem;">{item.numero}</span>
                    <span style="font-weight: 500;">{item.title}</span>
                </div>
            {/each}
        </div>
    </section>

    {#each [{n:'1', k:'contacts', f:['name', 'email']}, {n:'2', k:'tracking', f:['version', 'date', 'description']}] as t}
        <section>
            {@render section(t.n, state.t(t.k))}
            <table class="report-table">
                <thead><tr>{#each t.f as f}<th>{state.t(f)}</th>{/each}</tr></thead>
                <tbody>{#each (report as any)[t.k] as r}<tr>{#each t.f as f}<td class={f==='email'?'accent-text':''}>{r[f]}</td>{/each}</tr>{/each}</tbody>
            </table>
        </section>
    {/each}

    <section>
        {@render section('3', state.t('introduction'))}
        {#each ['context', 'objectives', 'stakeholders', 'mailing', 'scope'] as k, i}
            {@render sub(`3.${i+1}`, state.t(k), report.content?.[`intro_${k}`])}
        {/each}
    </section>

    <section>{@render section('4', state.t('summary'))}
        {@render sub('4.1', state.t('sum_work'), report.content?.sum_work)}
        <CvssChart vulnerabilities={report.vulnerabilities} />
        {#each ['security', 'vulns', 'recos'] as k, i} {@render sub(`4.${i+2}`, state.t(`sum_${k}`), report.content?.[`sum_${k}`])} {/each}
    </section>

    <section>{@render section('5', state.t('work'))}
        {#each report.detailedWork as task, i} {@render sub(`5.${i+1}`, task.title, task.description)} {/each}
    </section>

    <section>{@render section('6', state.t('vulns_discovered'))}
        {#each report.vulnerabilities as v, i}
            {@const s = calculateBaseScore(toStringVector(v.cvss))}
            {@const st = colorCvss(s)}
            <div class="vuln-entry">
                <h3 class="title-h3"><span class="number-prefix">6.{i+1}</span> {v.title}</h3>
                <div class="badge-pill" style="background: {st.bg}; color: {st.text}; border-color: {st.border}; margin: 1rem 0;">
                    <span class="badge-label">{state.t('severity')}</span> {severityLabel(s)} ({s.toFixed(1)})
                </div>
                {#each ['description', 'impact', 'procedure', 'remediation'] as k}
                    {#if v[k as keyof typeof v]}<div class="prose" style="margin-top:1rem"><p class="detail-label">{state.t(k)}</p>{@html v[k as keyof typeof v]}</div>{/if}
                {/each}
            </div>
        {/each}
    </section>
</div>
