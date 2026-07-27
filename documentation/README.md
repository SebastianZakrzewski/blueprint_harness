# Blueprint Harness — interaktywna dokumentacja (wersja wstępna)

Ten katalog zawiera klikalną, statyczną stronę dokumentacji repozytorium,
wizualnie inspirowaną [developers.openai.com/api/docs](https://developers.openai.com/api/docs).
Nie jest częścią kanonicznej struktury `docs/` egzekwowanej przez Harness —
to dodatkowy, przeglądalny widok nad istniejącą dokumentacją źródłową
(`AGENTS.md`, `ARCHITECTURE.md`, `docs/`, `packages/`) oraz podręcznikiem
użytkownika PL.

## Jak otworzyć

Najprościej: dwuklik na `index.html` (działa lokalnie, bez serwera i bez
budowania). Diagramy i wyszukiwarka wymagają połączenia z internetem, bo
`marked.js` i `mermaid.js` są ładowane z CDN.

Alternatywnie, z dowolnym lokalnym serwerem statycznym:

```bash
cd documentation
python -m http.server 8080
# otwórz http://localhost:8080
```

## Struktura

```text
documentation/
├── index.html          # szkielet aplikacji (topbar, sidebar, content, TOC)
├── assets/
│   ├── styles.css       # ciemny motyw, layout, komponenty
│   ├── content.js        # NAWIGACJA + treść każdej strony (Markdown)
│   └── app.js            # router (hash-based), renderer Markdown/Mermaid, wyszukiwarka, TOC
└── README.md
```

## Jak dodać / zmienić stronę

1. Dodaj wpis `{ id, title }` do właściwej grupy w `window.HARNESS_NAV`
   (`assets/content.js`).
2. Dodaj `window.HARNESS_PAGES["twoj-id"] = "# Treść w Markdown...";`
   Backtiki wewnątrz treści muszą być poprzedzone `\` (bo cała strona jest
   zapisana jako JS template literal), np. `` \`kod\` ``.
3. Diagramy Mermaid: użyj bloku ```` ```mermaid ... ``` ```` — renderowanie
   dzieje się automatycznie po stronie klienta.
4. Odśwież stronę — sidebar, breadcrumb, pager i spis treści (TOC) budują się
   automatycznie z `HARNESS_NAV` i nagłówków `##`/`###` na stronie.

## Status

To jest **wersja wstępna** (draft) — treść została zsyntetyzowana z bieżących
plików repozytorium (`docs/product-specs/*`, `docs/design-docs/*`,
`ARCHITECTURE.md`, `AGENTS.md`, `packages/*`) oraz z podręcznika
`SellGenius-Harness-Podręcznik-Użytkownika-PL.md`. Będzie iteracyjnie
rozwijana wraz z postępem implementacji (patrz strona **Postęp ExecPlan V1**).
