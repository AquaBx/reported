# GEMINI.md - Project Context: Reported

## Project Overview
**Reported** is a modern security audit report generator. It allows security auditors to create professional, customizable reports with real-time previews, CVSS v4.0 calculations, and multi-language support.

### Main Technologies
- **Framework:** [Svelte 5](https://svelte.dev/) (utilizing Runes: `$state`, `$derived`, `$effect`).
- **Framework Wrapper:** [SvelteKit](https://kit.svelte.dev/) (configured for static or node adapter).
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) for the UI; **Vanilla CSS** for the reports.
- **UI Components:** [shadcn-svelte](https://shadcn-svelte.com/) and [bits-ui](https://bits-ui.com/).
- **Icons:** [Lucide Svelte](https://lucide.dev/).
- **CVSS Calculator:** [cvss4](https://www.npmjs.com/package/cvss4).
- **Rich Text Editor:** [Quill](https://quilljs.com/).
- **Database:** [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/).
- **Build Tool:** [Vite](https://vitejs.dev/).

---

## Core Principles & Philosophy
- **Radical Minimalism:** Less code is better. Favor dynamic logic and generic components driven by data configurations over repetitive specific components.
- **Total Style Customization:** The entire styling of the report rendering resides in `reportStyle`. The preview should not depend on hardcoded styles or framework-specific utilities (like Tailwind) for its layout, allowing infinite user customization.
- **DB Ready Architecture:** Maintain flat, serializable data structures. The application is already integrated with MongoDB/Mongoose.
- **Zero Redundancy:** If a structure is repeated more than twice, it must be refactored.

---

## Architecture

### Core State Management
- **`src/lib/report-state.svelte.ts`**: The "Brain" of the application. Manages the `ReportState` class, handling i18n mapping, section configurations, and export/import logic.

### Data Models & Utilities
- **`src/lib/index.ts`**: Defines core interfaces (`Report`, `Vulnerability`, `CvssV4`) and provides utility functions and the `DEFAULT_CSS` template.
- **`src/lib/server/models.ts`**: Mongoose schemas and models for MongoDB.

### UI Components
- **`src/lib/components/`**:
    - `DataListView.svelte`: Generic component for list views (Audits, Clients, etc.).
    - `ReportPreview.svelte`: Pure view rendering the report based on `customCSS`.
    - `Cvss4Calculator.svelte`: Specialized input for CVSS metrics.
    - `RichTextEditor.svelte`: Wrapper for professional content editing.
    - `editors/SmartEditor.svelte`: A generic, configuration-driven editor that renders fields dynamically.

---

## Building and Running

### Development
```bash
bun dev          # Start development server
```

### Production Build
```bash
bun run build    # Build for production
```

### Type Checking
```bash
bun run check    # Run svelte-check
```

---

## Development Conventions

- **Svelte 5 Runes:** Use global runes directly (`$state`, `$derived`, etc.) without imports.
- **Surgical Updates:** Each modification must aim to simplify logic and reduce code volume.
- **i18n Readiness:** `report.content` and dictionary keys are structured to support future multilingual expansions.
- **Clean DB Interactions:** Use the service layer (to be completed) for all MongoDB operations.

---

# Principes Directeurs - Reported (Svelte 5)

Objectif : **Minimalisme et Concision radicale.**

## 🚀 Code & Architecture
- **Concision Extrême** : Moins il y a de lignes de code (LOC), mieux c'est. Utiliser la logique dynamique plutôt que la répétition.
- **Runes Globales** : Aucun import pour `$state`, `$derived`, `$props`, `$bindable`.
- **État Centralisé** : Tout l'état et les actions résident dans `ReportState.svelte.ts`. Les composants sont des "vues" pures.
- **Modularité Dynamique** : Ne jamais créer un composant spécifique si une configuration de données (JSON) peut piloter un composant générique (`SmartEditor`).

## 📊 Données & Évolutivité
- **Modèle de Données Propre** : Maintenir des structures plates et sérialisables. Déjà intégré avec **MongoDB**.
- **Préparation i18n** : La structure `report.content` supporte le multilingue (mapping fr/en).

---

# Roadmap: Missing Features

=== 1. CALENDAR UI REBUILD ===
- Implement FullCalendar in `/calendar` route.
- Views: dayGrid month + timeGrid week + day.
- Events = audit assignments { id, title, start, end, auditor_id, audit_id, color }.
- Color per auditor (deterministic from id hash).
- Drag-drop reschedule functionality.

=== 2. AUTHENTICATION & SSO ===
- Implement [Auth.js for SvelteKit](https://authjs.dev/reference/sveltekit) or [Lucia](https://lucia-auth.com/).
- Providers: Credentials (local) + Authentik (OIDC).
- Role-based access control (Admin, User, Reviewer).
- TOTP 2FA for local accounts.

=== 4. INTEGRATIONS & AUTOMATION ===
- **Import Parsers**: Nessus (XML), Nmap (XML), SSLyze (JSON), Nikto (XML/CSV), Burp (XML).
- **Automation Tasks**: Task list per audit for automated imports and scans.
- **API Bridge**: Endpoint for external tools to push findings directly into an audit.
