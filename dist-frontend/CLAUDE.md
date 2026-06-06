# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DevSidecar Download Page - a download page for the DevSidecar developer sidecar tool (docmirror/dev-sidecar). Built with Next.js 15 App Router. Fetches release data from the GitHub API.

## Commands

```bash
npm run dev      # Start dev server with Turbopack
npm run build    # Production build with Turbopack
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Tech Stack

- **Framework**: Next.js 15 with App Router and Turbopack
- **UI**: Tailwind CSS 4, Radix UI components, class-variance-authority
- **Fonts**: Local fonts loaded via `next/font/local` (GoogleSansCode, NotoSansSC, NotoColorEmoji)
- **Data Source**: GitHub API (`api.github.com/repos/docmirror/dev-sidecar/releases`)

## Architecture

- `app/page.tsx` - Main page component ("use client"), contains OS/architecture selectors and download buttons
- `app/layout.tsx` - Root layout with metadata, fonts, and global structure
- `app/footer.tsx` - Footer component with copyright
- `app/globals.css` - Tailwind 4 theme using CSS variables, supports dark mode via `.dark` class
- `app/history-versions-dialog.tsx` - Dialog showing all historical versions for the selected platform
- `components/ui/*` - Wrappers around Radix UI primitives (button, select, label, table, badge, spinner, switch)
- `components/download-button.tsx` - Reusable download button with version display and file info
- `components/data-table.tsx` - Reusable data table component using @tanstack/react-table
- `lib/api.ts` - GitHub API client: fetch releases, parse asset names, find assets by OS/arch
- `lib/utils.ts` - Utilities: `cn()` (clsx+twMerge), `copyToClipboard()`, `isPreviewVersion()`, `formatDataSize()`, `describeAsset()`, `normalizeVersion()`
- `lib/fonts.ts` - Local font definitions exported as Next.js font objects
- `contexts/releases.ts` - React Context providing release data to child components

## API Layer

`lib/api.ts` fetches from `https://api.github.com/repos/docmirror/dev-sidecar/releases` and provides:
- `fetchReleases()` - Get releases from GitHub API
- `getLatestStableRelease()` / `getLatestPreviewRelease()` - Filter stable/preview releases
- `parseAssetName()` - Parse asset filename to extract OS, arch, format
- `findAsset()` - Find a specific asset by OS and arch
- `getArchList()` - Get available architectures for a given OS

## Asset Naming Convention

DevSidecar download files follow the format:
```
DevSidecar-<version>-<os>-<arch>.<ext>
```

Examples:
- `DevSidecar-2.0.2-windows-universal.exe`
- `DevSidecar-2.0.2-macos-universal.dmg`
- `DevSidecar-2.0.2-linux-x86_64.deb`

## Important Patterns

- Path alias: `@/*` maps to root (defined in tsconfig.json)
- Tailwind 4 uses `@import "tailwindcss"` with `@theme inline` for CSS variable definitions
- Components use `cn()` from `lib/utils.ts` for conditional class merging
- Version checking: `isPreviewVersion()` returns true for versions containing "pre", "rc", or "test"
- Release data is fetched client-side from the public GitHub API (no authentication required)
