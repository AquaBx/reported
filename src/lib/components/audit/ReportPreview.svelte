<script lang="ts">
	import { calculateBaseScore } from "cvss4";
	import { colorCvss, severityLabel, toStringVector } from "$lib/index";
	import type { ReportState } from "$lib/report-state.svelte";
	import CvssChart from "./CvssChart.svelte";

	let { state }: { state: ReportState } = $props();
	
	let report = $derived(state.report);
</script>

{#snippet section(number : string, title:string)}
    <h2 class="title-h2"><span class="number-prefix">{number}.</span> {title}</h2>
{/snippet}

{#snippet sub(number:string, title:string, content:string)}
    <h3 class="title-h3"><span class="number-prefix">{number}</span> {title}</h3>
    <div class="prose">{@html content || state.t('none')}</div>
{/snippet}

<div id="report-preview" class="report-container" style="--report-accent: {report.meta.themeColor}">
    <header style="margin-bottom: 120px; margin-top: 40px;">
        <h1 class="title-h1">{state.t('audit_report')}</h1>
        <p style="font-size: 1.5rem; color: var(--report-accent); font-weight: 700; margin-left: 45px;">{report.meta.title}</p>
        <div class="report-meta-grid">
            <div class="meta-item"><span class="meta-label">{state.t('client')}</span><span class="meta-value">{report.meta.client}</span></div>
            <div class="meta-item"><span class="meta-label">{state.t('version')}</span><span class="meta-value">{report.meta.version}</span></div>
            <div class="meta-item"><span class="meta-label">{state.t('date')}</span><span class="meta-value">{report.meta.date}</span></div>
            <div class="meta-item"><span class="meta-label">{state.t('confidentiality')}</span><span class="meta-value">{report.meta.confidentiality}</span></div>
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

    <section>
        {@render section('1', state.t('contacts'))}
        <table class="report-table">
            <thead><tr><th>{state.t('name')}</th><th>Email</th></tr></thead>
            <tbody>
                {#each report.contacts as c}
                    <tr><td>{c.name}</td><td class="accent-text">{c.email}</td></tr>
                {/each}
            </tbody>
        </table>
    </section>

    <section>
        {@render section('2', state.t('tracking'))}
        <table class="report-table">
            <thead><tr><th>{state.t('version')}</th><th>{state.t('date')}</th><th>{state.t('description')}</th></tr></thead>
            <tbody>
                {#each report.tracking as t}
                    <tr><td>{t.version}</td><td>{t.date}</td><td>{t.description}</td></tr>
                {/each}
            </tbody>
        </table>
    </section>

    <section>
        {@render section('3', state.t('introduction'))}
        {@render sub('3.1', state.t('context'), report.content.intro_context)}
        {@render sub('3.2', state.t('objectives'), report.content.intro_objectives)}
        {@render sub('3.3', state.t('stakeholders'), report.content.intro_stakeholders)}
        {@render sub('3.4', state.t('mailing'), report.content.intro_mailing)}
        {@render sub('3.6', state.t('scope'), report.content.intro_scope)}
    </section>

    <section>{@render section('4', state.t('summary'))}
        {@render sub('4.1', state.t('sum_work'), report.content.sum_work)}

        <CvssChart vulnerabilities={report.vulnerabilities} />

        {@render sub('4.2', state.t('sum_security'), report.content.sum_security)}
        {@render sub('4.3', state.t('sum_vulns'), report.content.sum_vulns)}
        {@render sub('4.4', state.t('sum_recos'), report.content.sum_recos)}
    </section>

    <section>
        {@render section('5', state.t('work'))}
        {#each report.detailedWork as task, i}
            {@render sub(`5.${i+1}`, task.title, task.description)}
        {/each}
    </section>

    <section>{@render section('6', state.t('vulns_discovered'))}
        {#each report.vulnerabilities as v, i}
            {@const s = calculateBaseScore(toStringVector(v.cvss))}
            {@const style = colorCvss(s)}
            <div class="vuln-entry">
                <h3 class="title-h3"><span class="number-prefix">6.{i+1}</span> {v.title}</h3>
                <div class="vuln-badges-row">
                    <div class="badge-pill" style="background: {style.bg}; color: {style.text}; border-color: {style.border};">
                        <span class="badge-label">{state.t('severity')}</span> 
                        {severityLabel(s)} ({s.toFixed(1)})
                    </div>
                </div>
                <div class="prose"><p class="detail-label">{state.t('description')}</p>{@html v.description}</div>
                <div class="prose" style="margin-top:1rem"><p class="detail-label">{state.t('impact')}</p>{@html v.impact}</div>
                {#if v.procedure}<div class="prose" style="margin-top:1rem"><p class="detail-label">{state.t('procedure')}</p>{@html v.procedure}</div>{/if}
                <div class="prose" style="margin-top:1rem"><p class="detail-label">{state.t('remediation')}</p>{@html v.remediation}</div>
            </div>
        {/each}
    </section>
</div>
