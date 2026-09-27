---
name: react
description: Use when creating, modifying, or reviewing React components and frontend/JSX code (.tsx/.jsx files, UI under src/). Encodes the project's React conventions - function components, hook rules, key prop, semantic HTML/ARIA accessibility, React 19 ref-as-prop, safe link/image rendering - for authoring new UI and verifying that existing components and diffs conform.
---

# React / Frontend Conventions

Applies to React components and frontend code (`*.tsx` / `*.jsx`, UI under `src/`). Use this skill both when creating new UI and when reviewing existing components or diffs for conformance.

## Components & JSX

- Use function components over class components
- Call hooks at the top level only, never conditionally
- Specify all dependencies in hook dependency arrays correctly
- Use the `key` prop for elements in iterables (prefer unique IDs over array indices)
- Nest children between opening and closing tags instead of passing as props
- Don't define components inside other components

## React 19+

- Use ref as a prop instead of `React.forwardRef`

## Accessibility (semantic HTML & ARIA)

- Provide meaningful alt text for images
- Use proper heading hierarchy
- Add labels for form inputs
- Include keyboard event handlers alongside mouse events
- Use semantic elements (`<button>`, `<nav>`, etc.) instead of divs with roles

## Frontend security

- Add `rel="noopener"` when using `target="_blank"` on links
- Avoid `dangerouslySetInnerHTML` unless absolutely necessary
- Don't assign directly to `document.cookie`

## Frontend performance

- Use proper image components (e.g., Next.js `<Image>`) over `<img>` tags
