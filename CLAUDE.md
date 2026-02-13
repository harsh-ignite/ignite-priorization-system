# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Vue 3 + TypeScript prioritization system using the Eisenhower Matrix to visualize and manage tasks based on urgency and importance. Task prioritization is calculated using the RICE framework (Reach × Impact × Confidence / Effort).

## Development Commands

```bash
# Start development server (runs on http://localhost:5174)
npm run dev

# Build for production
npm run build

# Type check
vue-tsc -b

# Preview production build
npm run preview
```

## Technology Stack

- **Framework**: Vue 3.5 with Composition API (`<script setup>`)
- **State Management**: Pinia with `pinia-plugin-persistedstate` for localStorage persistence
- **Styling**: Tailwind CSS v4 with `@tailwindcss/vite` plugin
- **UI Components**: shadcn-vue (New York style) with Reka UI primitives and Lucide icons
- **Build Tool**: Vite 7
- **Database**: Supabase (local development setup available in `supabase/` directory)

## Architecture

### State Management Pattern

All application state lives in `src/stores/cardStore.ts` (Pinia store):
- Single source of truth for all cards and selected card state
- Automatic localStorage persistence via `pinia-plugin-persistedstate`
- Composition API pattern with `defineStore` setup syntax

### Component Structure

**Three-column layout:**
1. **Left Sidebar** (`CardForm.vue`) - Create new tasks
2. **Center** (`EisenhowerMatrix.vue`) - 2x2 matrix displaying tasks in quadrants
3. **Right Panel** (`CardDetailsPanel.vue`) - View/edit selected task

**Data Flow:**
- Components read from cardStore (reactive)
- User actions trigger store mutations
- Matrix automatically re-renders when cards update
- Selection state (`selectedCardId`) controls right panel visibility

### Card Model

Each card includes:
- **Eisenhower Matrix fields**: `urgency` (1-10), `important` (1-10)
  - Quadrant logic: urgent/important >= 6 = high
- **RICE Framework fields**: `reach`, `impact`, `confidence`, `effortMonths`
  - Score formula: `(reach × impact × confidence/100) / effortMonths`
- Standard fields: `title`, `owner`, `effort`, `id`, `createdAt`

RICE scores are displayed on each card in the matrix and used for prioritization within quadrants.

### Quadrants

- **Do First** (Red): Important & Urgent (both >= 6)
- **Schedule** (Blue): Important & Not Urgent
- **Delegate** (Yellow): Not Important & Urgent
- **Eliminate** (Green): Not Important & Not Urgent

## UI Components

### shadcn-vue Integration

- Uses shadcn-vue components with Reka UI headless primitives
- Path aliases configured in `vite.config.ts`: `@/` maps to `src/`
- Component imports use `@/components/ui/*` pattern
- Tailwind v4 with CSS variables for theming (slate base color)
- New York component style variant

### Existing UI Components

- `@/components/ui/button` - Button component
- `@/components/ui/alert-dialog` - Modal dialog for confirmations (used for delete)

When adding new shadcn-vue components, they should follow the existing pattern in `src/components/ui/`.

## Key Patterns

1. **No prop drilling**: CardStore is imported directly in components that need it
2. **Computed properties**: Use for derived state (e.g., `selectedCard`)
3. **Reactive card placement**: Cards automatically appear in correct quadrants based on urgency/importance thresholds
4. **Selection management**: Click on any card (sidebar or matrix) to select it; right panel shows details

## Supabase Setup

Local Supabase instance is configured but database integration is not yet implemented. The project currently uses localStorage persistence through Pinia.

To start local Supabase:
```bash
supabase start
```

Supabase Studio available at: http://127.0.0.1:54323
