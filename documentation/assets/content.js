/* Blueprint Harness docs — navigation structure and page content.
   Content is authored as Markdown (rendered client-side via marked.js + mermaid).
   Backticks inside template literals are escaped as \` so they render literally. */

window.HARNESS_NAV = [
  {
    title: "Start",
    items: [
      { id: "overview", title: "Przegląd projektu" },
      { id: "quickstart", title: "Pierwsze kroki" },
      { id: "repo-map", title: "Mapa repozytorium" },
    ],
  },
  {
    title: "Podręcznik użytkownika (PL)",
    items: [
      { id: "manual-intro", title: "Czym jest Harness" },
      { id: "manual-roles", title: "Role człowieka i agentów" },
      { id: "manual-workflow", title: "Pełny przepływ pracy" },
      { id: "manual-autonomy", title: "Autonomia i produkcja" },
      { id: "manual-commands", title: "Referencja komend" },
      { id: "manual-checklist", title: "Checklisty i sygnały STOP" },
    ],
  },
  {
    title: "Architektura",
    items: [
      { id: "arch-system", title: "Kontekst systemu" },
      { id: "arch-layers", title: "Warstwy i granice domen" },
      { id: "arch-packages", title: "Topologia pakietów" },
      { id: "arch-ownership", title: "Własność plików i upgrade" },
    ],
  },
  {
    title: "Product Specs",
    items: [
      { id: "spec-blueprint", title: "Harness Blueprint" },
      { id: "spec-bootstrap", title: "Project bootstrap" },
      { id: "spec-upgrade", title: "Harness upgrade" },
      { id: "spec-lifecycle", title: "Autonomous task lifecycle" },
    ],
  },
  {
    title: "Design Docs",
    items: [
      { id: "design-core-beliefs", title: "Core beliefs" },
      { id: "design-blueprint-architecture", title: "Blueprint architecture" },
      { id: "design-docs-ingestion", title: "Docs ingestion & bootstrap" },
      { id: "design-task-review", title: "Task execution & review loop" },
      { id: "design-arch-enforcement", title: "Architecture enforcement" },
      { id: "design-worktree-observability", title: "Worktree & observability" },
      { id: "design-release-autonomy", title: "Release & autonomy" },
      { id: "design-entropy-maintenance", title: "Entropy & maintenance" },
    ],
  },
  {
    title: "Governance i jakość",
    items: [
      { id: "gov-reliability", title: "Reliability" },
      { id: "gov-security", title: "Security" },
      { id: "gov-design-standards", title: "Design standards" },
      { id: "gov-product-sense", title: "Product sense" },
      { id: "gov-frontend", title: "Frontend" },
      { id: "gov-quality-score", title: "Quality score" },
      { id: "gov-plans", title: "Plans & ExecPlans" },
    ],
  },
  {
    title: "Stan implementacji",
    items: [
      { id: "status-execplan", title: "Postęp ExecPlan V1" },
      { id: "status-packages", title: "Pakiety kodu" },
    ],
  },
  {
    title: "Referencje",
    items: [
      { id: "ref-invariants", title: "Katalog invariantów" },
      { id: "ref-states", title: "Statusy i stany" },
      { id: "ref-autonomy-levels", title: "Poziomy autonomii A0–A4" },
      { id: "ref-sources", title: "Źródła i pochodzenie" },
    ],
  },
];

window.HARNESS_PAGES = {};
var P = window.HARNESS_PAGES;

/* ============================================================ START ============================================================ */

P["overview"] = "# Blueprint Harness\n\n" +
"<span class=\"eyebrow\"></span>\n\n" +
"**Blueprint Harness** to prywatne, wersjonowane repozytorium-fabryka, które instaluje agentowe środowisko inżynieryjne (\`AGENTS.md\`, \`ARCHITECTURE.md\`, \`docs/\`, CLI, profile technologiczne) w nowych projektach klienckich. Repozytorium **samo stosuje własny Harness do siebie**.\n\n" +
"> Człowiek wskazuje cel i podejmuje decyzje wymagające osądu. Agent wykonuje pracę, zbiera dowody, sprawdza rezultat i działa w granicach Harnessu.\n\n" +
"## Stan repozytorium na dziś\n\n" +
"Ta dokumentacja jest **wersją wstępną**, wygenerowaną z bieżącego stanu repo (\`packages/\`, \`docs/\`, ExecPlan \`build-harness-blueprint-v1\`). Repozytorium przechodzi od zatwierdzonego projektu (Docs-only) do działającej implementacji TypeScript.\n\n" +
"| Element | Status |\n| --- | --- |\n" +
"| Kanoniczne Docs (\`docs/product-specs\`, \`docs/design-docs\`) | \`APPROVED\` / \`NOT_VERIFIED\` |\n" +
"| Monorepo pnpm (\`packages/cli\`, \`core\`, \`profile-sdk\`, \`template-openai\`, \`profiles/typescript-node\`) | \`IMPLEMENTED\` (szkielet) |\n" +
"| Universal Core (invariants, lifecycle, policy, audit, checkpoint) | \`IMPLEMENTED\` — milestone M1 |\n" +
"| Harness CLI, Docs validation, bootstrap, profile TS/Node | \`APPROVED_NOT_IMPLEMENTED\` |\n" +
"| Worktree isolation, observability, release, autonomy runtime | \`APPROVED_NOT_IMPLEMENTED\` |\n\n" +
"Szczegółowy postęp: [Postęp ExecPlan V1](#/status-execplan).\n\n" +
"## Model mentalny: fabryka i produkt\n\n" +
"```mermaid\nflowchart TD\n    Design[\"Kanoniczne Docs Blueprintu\"] --> Factory[\"Paczka @sellgenius/harness\"]\n    Factory --> Project[\"BASE w nowym repozytorium\"]\n    Project --> Work[\"Codzienna praca agentów\"]\n    Work --> Evidence[\"Testy, review i dowody produkcyjne\"]\n    Evidence --> Improve[\"Ulepszanie Harnessu\"]\n    Improve --> Factory\n```\n\n" +
"1. Obecne Docs są projektem fabryki.\n" +
"2. Implementacja zmienia je w działającą paczkę \`@sellgenius/harness\`.\n" +
"3. Paczka instaluje BASE w każdym nowym projekcie klienta.\n" +
"4. Projekt korzysta z lokalnego Harnessu podczas każdej zmiany.\n" +
"5. Dowody i incydenty ulepszają kolejne wersje fabryki.\n\n" +
"## Czym Harness jest\n\n" +
"Środowiskiem inżynieryjnym przygotowanym dla agentów tworzących i utrzymujących oprogramowanie — łączy repozytoryjną wiedzę, planowanie, mechaniczne reguły architektury, izolowane środowiska, sterowanie działającą aplikacją, testy i review, CI i release, monitoring produkcji, recovery, kontrolowaną autonomię oraz cykliczne usuwanie entropii.\n\n" +
"## Czym Harness nie jest\n\n" +
"- gotową aplikacją klienta;\n" +
"- zastępstwem Product Specs i architektury konkretnego projektu;\n" +
"- nieograniczonym dostępem agenta do produkcji;\n" +
"- gwarancją poprawności opartą wyłącznie na przekonaniu modelu;\n" +
"- jednym monolitycznym \`AGENTS.md\`;\n" +
"- mechanizmem pozwalającym agentowi samodzielnie przyznać sobie uprawnienia.\n\n" +
"## Nawigacja po tej dokumentacji\n\n" +
"<div class=\"card-grid\">\n" +
"<div class=\"card\"><h4>📘 Podręcznik użytkownika</h4><p>Skondensowany przewodnik PL: role, cykl pracy, autonomia, komendy.</p><a href=\"#/manual-intro\">Czytaj →</a></div>\n" +
"<div class=\"card\"><h4>🏗️ Architektura</h4><p>Komponenty Blueprintu, warstwy semantyczne, granice domen.</p><a href=\"#/arch-system\">Czytaj →</a></div>\n" +
"<div class=\"card\"><h4>📄 Product Specs</h4><p>Wymagany rezultat i kryteria akceptacji każdej funkcjonalności.</p><a href=\"#/spec-blueprint\">Czytaj →</a></div>\n" +
"<div class=\"card\"><h4>🧭 Design Docs</h4><p>Techniczne mechanizmy: bootstrap, review, release, autonomia.</p><a href=\"#/design-core-beliefs\">Czytaj →</a></div>\n" +
"<div class=\"card\"><h4>🛡️ Governance</h4><p>Reliability, Security, Quality Score i standardy projektowe.</p><a href=\"#/gov-reliability\">Czytaj →</a></div>\n" +
"<div class=\"card\"><h4>📦 Stan implementacji</h4><p>Postęp milestone'ów ExecPlan V1 i pakiety kodu TypeScript.</p><a href=\"#/status-execplan\">Czytaj →</a></div>\n" +
"</div>\n";

P["quickstart"] = "# Pierwsze kroki\n\n" +
"Repozytorium jest \"agent-first\": punktem wejścia dla każdego zadania — ludzkiego i agentowego — jest plik [\`AGENTS.md\`](https://github.com/SebastianZakrzewski/blueprint_harness/blob/main/AGENTS.md) w katalogu głównym.\n\n" +
"## Wymagany cykl zadania\n\n" +
"1. Przeczytaj \`AGENTS.md\`.\n" +
"2. Zaklasyfikuj zadanie i jego ryzyko.\n" +
"3. Otwórz tylko odpowiednią dokumentację z mapy repozytorium.\n" +
"4. Zapisz \`Documentation consulted\` i \`Invariants applied\` w planie lub PR.\n" +
"5. Ustal bieżący baseline przed wprowadzeniem zmian.\n" +
"6. Użyj jednego izolowanego worktree i środowiska na zadanie lub ExecPlan.\n" +
"7. Wykonaj pełną pętlę walidacji i review.\n" +
"8. Eskaluj, gdy wymagany jest osąd człowieka.\n\n" +
"## Podstawowe komendy Harnessu\n\n" +
"```bash\nharness inspect\nharness validate-docs\nharness check --fast\nharness check --full\nharness env up\nharness env status\nharness env down\nharness autonomy status\n```\n\n" +
"> Komendy mogą być niedostępne, zanim powstanie początkowy scaffold. Pierwszy ExecPlan implementacyjny musi ustanowić je stopniowo i odnotować zweryfikowaną alternatywę użytą na każdym etapie.\n\n" +
"## Lokalne środowisko deweloperskie\n\n" +
"Repozytorium używa **pnpm workspaces** i **Vitest**.\n\n" +
"```bash\nnpm install -g pnpm@9\npnpm install\npnpm -r build\npnpm -r test\n```\n\n" +
"## Nienegocjowalne invarianty\n\n" +
"- Repozytoryjne, wersjonowane artefakty są operacyjnym źródłem prawdy.\n" +
"- Zewnętrzny input jest parsowany i walidowany na granicach systemu.\n" +
"- Kierunki zależności domen i warstw z \`ARCHITECTURE.md\` są egzekwowane.\n" +
"- Kod produkcyjny jest czytelny, proporcjonalnie abstrakcyjny i jawnie nazwany.\n" +
"- Nazwane funkcje produkcyjne mają użyteczną, czytelną dla człowieka dokumentację kontraktu.\n" +
"- Testy demonstrują istotne z zewnątrz zachowanie i ochronę regresyjną.\n" +
"- Logi strukturalne zawierają identyfikatory korelacji i nigdy nie ujawniają sekretów.\n" +
"- Agenci nie mogą wyłączać kontroli, osłabiać asercji ani edytować CI, by obejść błąd.\n" +
"- Zmiany produkcyjne przechodzą przez worktree, PR, CI, niezmienny artefakt i pipeline release.\n" +
"- Agent może rekomendować wyższą autonomię, ale nigdy nie może jej sobie przyznać.\n" +
"- Automatyczny downgrade i \`AUTONOMY_FREEZE\` są zawsze dozwolonymi działaniami ochronnymi.\n";

P["repo-map"] = "# Mapa repozytorium\n\n" +
"\`AGENTS.md\` traktuje repozytorium nie jako encyklopedię, lecz jako mapę do wersjonowanych źródeł prawdy.\n\n" +
"<div class=\"table-wrap\">\n\n| Potrzeba | Źródło prawdy |\n| --- | --- |\n" +
"| Granice systemu i warstwy pakietów | \`ARCHITECTURE.md\` |\n" +
"| Zachowanie produktu i akceptacja | \`docs/product-specs/index.md\` |\n" +
"| Techniczny design i core beliefs | \`docs/design-docs/index.md\` |\n" +
"| Planowanie i wymagania ExecPlan | \`docs/PLANS.md\` |\n" +
"| Aktywna i zakończona historia wykonania | \`docs/exec-plans/\` |\n" +
"| Zasady decyzji produktowych | \`docs/PRODUCT_SENSE.md\` |\n" +
"| Konwencje projektowe | \`docs/DESIGN.md\` |\n" +
"| Stosowalność i zasady frontendu | \`docs/FRONTEND.md\` |\n" +
"| Niezawodność, release i recovery | \`docs/RELIABILITY.md\` |\n" +
"| Bezpieczeństwo i uprawnienia produkcyjne | \`docs/SECURITY.md\` |\n" +
"| Jakość i gotowość autonomii | \`docs/QUALITY_SCORE.md\` |\n" +
"| Wygenerowana reprezentacja bazy danych | \`docs/generated/db-schema.md\` |\n" +
"| Zewnętrzne referencje techniczne | \`docs/references/\` |\n\n</div>\n\n" +
"## Struktura katalogów\n\n" +
"```text\nblueprint_harness/\n├── AGENTS.md\n├── ARCHITECTURE.md\n├── docs/\n│   ├── design-docs/\n│   ├── exec-plans/\n│   │   ├── active/\n│   │   └── completed/\n│   ├── generated/\n│   ├── product-specs/\n│   ├── references/\n│   ├── DESIGN.md\n│   ├── FRONTEND.md\n│   ├── PLANS.md\n│   ├── PRODUCT_SENSE.md\n│   ├── QUALITY_SCORE.md\n│   ├── RELIABILITY.md\n│   └── SECURITY.md\n└── packages/\n    ├── cli/\n    ├── core/\n    ├── profile-sdk/\n    ├── template-openai/\n    └── profiles/\n        └── typescript-node/\n```\n\n" +
"## Słowniki statusów\n\n" +
"**Status dokumentu**\n\n" +
"- \`DRAFT\` — jeszcze nie jest zatwierdzonym źródłem intencji.\n" +
"- \`APPROVED\` — normatywny i wiążący aż do zastąpienia.\n" +
"- \`SUPERSEDED\` — zachowany historycznie, powiązany z następcą.\n\n" +
"**Weryfikacja**\n\n" +
"- \`NOT_VERIFIED\` — dowody implementacji jeszcze nie istnieją.\n" +
"- \`VERIFIED\` — bieżący kod i testy zostały sprawdzone względem dokumentu.\n" +
"- \`STALE\` — dowody lub implementacja się zmieniły, potrzebna ponowna weryfikacja.\n\n" +
"Status opisuje autorytet dokumentu. Weryfikacja opisuje, czy bieżąca implementacja go potwierdza. Są celowo rozdzielone.\n";

/* ============================================================ MANUAL (PL) ============================================================ */

P["manual-intro"] = "# Czym jest Harness\n\n" +
"Skondensowany przewodnik na bazie *\"SellGenius Harness — podręcznik użytkownika i atlas przepływów\"* (v1.0, commit bazowy \`e7989a1\`).\n\n" +
"## Definicja\n\n" +
"Harness łączy: repozytoryjną wiedzę, planowanie, mechaniczne reguły architektury, izolowane środowiska, sterowanie działającą aplikacją, testy i review, CI i release, monitoring produkcji, recovery, kontrolowaną autonomię oraz cykliczne usuwanie entropii.\n\n" +
"## Architektura Blueprintu\n\n" +
"```mermaid\nflowchart TD\n    CLI[\"Harness CLI\"] --> Core[\"Universal Core\"]\n    CLI --> Template[\"OpenAI Repository Template\"]\n    CLI --> Profiles[\"Stack Profiles\"]\n    Profiles --> SDK[\"Profile SDK\"]\n    Core --> Upgrade[\"Upgrade Engine\"]\n    Template --> Target[\"Repozytorium projektu\"]\n    Profiles --> Target\n    Upgrade --> Target\n```\n\n" +
"| Komponent | Rola |\n| --- | --- |\n" +
"| **Harness CLI** | Interfejs użytkownika do bootstrapu, kontroli, środowiska i aktualizacji. |\n" +
"| **Universal Core** | Uniwersalne znaczenie lifecycle, invariantów, dowodów, planów, polityki, audytu i autonomii. |\n" +
"| **OpenAI Repository Template** | Struktura wiedzy OpenAI oraz techniczne elementy Cursor, CI i Harnessu. |\n" +
"| **Profile SDK** | Kontrakt, który musi spełnić każda technologia obsługiwana przez Harness. |\n" +
"| **Stack Profiles** | Tłumaczą uniwersalne zasady na konkretne narzędzia, frameworki i platformy. |\n" +
"| **Upgrade Engine** | Aktualizuje zainstalowany Harness przez kontrolowany PR bez cichego nadpisywania wiedzy projektu. |\n\n" +
"## Struktura wiedzy w każdym projekcie\n\n" +
"```text\nAGENTS.md\nARCHITECTURE.md\ndocs/\n├── design-docs/\n│   ├── index.md\n│   ├── core-beliefs.md\n│   └── ...\n├── exec-plans/\n│   ├── active/\n│   ├── completed/\n│   └── tech-debt-tracker.md\n├── generated/\n│   └── db-schema.md\n├── product-specs/\n│   ├── index.md\n│   └── ...\n├── references/\n├── DESIGN.md\n├── FRONTEND.md\n├── PLANS.md\n├── PRODUCT_SENSE.md\n├── QUALITY_SCORE.md\n├── RELIABILITY.md\n└── SECURITY.md\n```\n\n" +
"Nie dodajemy standardowego \`BACKEND.md\` ani osobnego \`plan-template.md\`.\n";

P["manual-roles"] = "# Role człowieka i agentów\n\n" +
"## Człowiek\n\n" +
"Odpowiada za: problem biznesowy, priorytet, zakres, kryteria akceptacyjne, decyzje produktowe, istotne decyzje architektoniczne, ryzyko prawne/bezpieczeństwa/danych, operacje nieodwracalne, zatwierdzanie wzrostu autonomii.\n\n" +
"Może sprawdzić każdy plik, diff, test, log i trace — ale nie musi ręcznie autoryzować każdej linii kodu, gdy dany poziom autonomii został potwierdzony.\n\n" +
"## Agent implementujący\n\n" +
"Odczytuje cel i Docs → tworzy plan → zakłada izolowane środowisko → implementuje → uruchamia testy i aplikację → wykonuje self-review → reaguje na uwagi → aktualizuje Docs i ExecPlan → otwiera PR → po promocji może wykonywać merge i release.\n\n" +
"## Agent sprawdzający (independent reviewer)\n\n" +
"Niezależny reviewer nie implementuje tej samej zmiany. Sprawdza: zgodność z wymaganiami, poprawność, granice architektury, obsługę błędów, testy, regresje, bezpieczeństwo, czytelność i proporcjonalność abstrakcji.\n\n" +
"## Agenci specjalistyczni\n\n" +
"Włączają się zależnie od ryzyka:\n\n" +
"- Security Reviewer\n" +
"- Reliability Reviewer\n" +
"- Migration Reviewer\n" +
"- Frontend Reviewer\n" +
"- Agent/Evaluation Reviewer\n" +
"- Doc Gardener\n\n" +
"## Jak agent znajduje potrzebny kontekst\n\n" +
"```mermaid\nflowchart TD\n    Task[\"Zadanie użytkownika\"] --> Agents[\"AGENTS.md\"]\n    Agents --> Class[\"Klasyfikacja zadania\"]\n    Class --> Top[\"Właściwy dokument nadrzędny lub indeks\"]\n    Top --> Exact[\"Dokładny Product Spec lub Design Doc\"]\n    Exact --> Code[\"Powiązany kod i testy\"]\n```\n\n" +
"Agent nie otrzymuje od razu całej wiedzy repozytorium — zbyt duży prompt może wyprzeć kryteria zadania i zwiększyć ryzyko pominięcia istotnej reguły. W planie lub PR agent zapisuje \`Documentation consulted\` oraz \`Invariants applied\`.\n";

P["manual-workflow"] = "# Pełny przepływ pracy\n\n" +
"```mermaid\nflowchart TD\n    Intent[\"Cel biznesowy i Docs\"] --> Bootstrap[\"Import i bootstrap projektu\"]\n    Bootstrap --> Route[\"AGENTS.md i router dokumentacji\"]\n    Route --> Plan[\"Lightweight Plan lub ExecPlan\"]\n    Plan --> Environment[\"Izolowany worktree i runtime\"]\n    Environment --> Build[\"Implementacja milestone\"]\n    Build --> Validate[\"Testy, aplikacja i obserwowalność\"]\n    Validate --> Review[\"Self-review i niezależne review\"]\n    Review --> Clean{\"Wszystko czyste?\"}\n    Clean -->|Nie| Build\n    Clean -->|Tak| PR[\"Kompletny PR\"]\n    PR --> Merge{\"Polityka pozwala na merge?\"}\n    Merge -->|Nie| Human[\"Zatwierdzenie człowieka\"]\n    Merge -->|Tak| Main[\"Squash merge do main\"]\n    Human --> Main\n    Main --> Staging[\"Staging i release checks\"]\n    Staging --> Production{\"Polityka produkcyjna\"}\n    Production --> Observe[\"Rollout i monitoring\"]\n    Observe --> Stable{\"System stabilny?\"}\n    Stable -->|Tak| Complete[\"Weryfikacja i zamknięcie planu\"]\n    Stable -->|Nie| Recovery[\"Pause, rollback i incydent\"]\n    Recovery --> Build\n    Complete --> Gardening[\"Quality Score i garbage collection\"]\n```\n\n" +
"## Kiedy powstaje ExecPlan\n\n" +
"**Lightweight Plan** wystarcza, gdy zadanie jest: małe, lokalne, łatwo odwracalne, jednoetapowe, z oczywistym kryterium akceptacyjnym.\n\n" +
"**ExecPlan** jest wymagany, gdy zadanie: obejmuje kilka zależnych milestones, może trwać wiele godzin, przechodzi między agentami, dotyczy wielu domen, zmienia API/bazę/bezpieczeństwo/architekturę, wymaga migracji, ma trudny rollback, niesie znaczące ryzyko.\n\n" +
"```mermaid\nflowchart TD\n    Change[\"Proponowana zmiana\"] --> Risk{\"Mała, lokalna i odwracalna?\"}\n    Risk -->|Tak| Light[\"Lightweight Plan\"]\n    Risk -->|Nie| Exec[\"ExecPlan w active/\"]\n    Exec --> Review[\"Semantic review: PASS, REVISE lub ESCALATE\"]\n    Review --> Approval{\"Wymagana zgoda człowieka?\"}\n    Approval -->|Tak| Human[\"Zatwierdzenie\"]\n    Approval -->|Nie| Work[\"Implementacja\"]\n    Human --> Work\n```\n\n" +
"### Obowiązkowe części ExecPlanu\n\n" +
"1. Purpose / Big Picture\n2. Progress\n3. Surprises & Discoveries\n4. Decision Log\n5. Outcomes & Retrospective\n6. Context and Orientation\n7. Plan of Work\n8. Concrete Steps\n9. Validation and Acceptance\n10. Idempotence and Recovery\n11. Artifacts and Notes\n12. Interfaces and Dependencies\n\n" +
"## Izolacja przez worktree\n\n" +
"```mermaid\nflowchart TD\n    Main[\"main\"] --> WA[\"Worktree A — zadanie A\"]\n    Main --> WB[\"Worktree B — zadanie B\"]\n    WA --> EA[\"App, DB, porty i telemetry A\"]\n    WB --> EB[\"App, DB, porty i telemetry B\"]\n    EA --> PRA[\"PR A\"]\n    EB --> PRB[\"PR B\"]\n```\n\n" +
"Priorytet izolacji bazy danych: **1)** oddzielna ephemeral instance, **2)** osobna baza na lokalnym serwerze, **3)** osobny schemat jako fallback. Nigdy nie używamy produkcji ani współdzielonego staging jako środowiska zadania.\n\n" +
"```bash\nharness env up\nharness env status\nharness env down\n```\n";

P["manual-autonomy"] = "# Autonomia i produkcja\n\n" +
"## Droga na produkcję\n\n" +
"```mermaid\nflowchart TD\n    Main[\"Zweryfikowany commit main\"] --> Artifact[\"Niezmienny artefakt i checksum\"]\n    Artifact --> Staging[\"Staging\"]\n    Staging --> Gate{\"Wszystkie release gates?\"}\n    Gate -->|Nie| Repair[\"Nowy worktree i poprawka\"]\n    Gate -->|Tak| Rollout[\"Canary, blue-green, rolling lub atomic\"]\n    Rollout --> Observe[\"Sentry, logi, metryki i trace’y\"]\n    Observe --> Healthy{\"Progi stabilne?\"}\n    Healthy -->|Tak| Verified[\"PRODUCTION_VERIFIED\"]\n    Healthy -->|Nie| Rollback[\"Pause i rollback\"]\n    Rollback --> Repair\n```\n\n" +
"Artefakt jest budowany raz. Staging i produkcja otrzymują dokładnie te same bajty. Zmieniają się jedynie sekrety i konfiguracja środowiska.\n\n" +
"**Zakazane:** deploy bezpośrednio z worktree, deploy niezacommitowanego kodu, ręczne poprawianie plików na serwerze, inny build na staging i produkcji, produkcja bez aktywnego monitoringu, deploy bez zweryfikowanego rollbacku.\n\n" +
"## Poziomy autonomii\n\n" +
"| Poziom | Zachowanie |\n| --- | --- |\n" +
"| \`A0 OBSERVE\` | Agent rekomenduje; człowiek zatwierdza plan, merge i produkcję |\n" +
"| \`A1 EXECUTE\` | Agent implementuje i przygotowuje PR; człowiek zatwierdza merge i produkcję |\n" +
"| \`A2 AUTO_MERGE\` | Agent scala zatwierdzone klasy; produkcja pozostaje manualna |\n" +
"| \`A3 AUTO_DEPLOY_SAFE\` | Agent wdraża promowane, odwracalne klasy niskiego ryzyka |\n" +
"| \`A4 POLICY_AUTONOMOUS\` | Agent działa end-to-end w granicach polityki i eskaluje osąd |\n\n" +
"```mermaid\nstateDiagram-v2\n    [*] --> A0\n    A0 --> A1: Harness execution gates pass\n    A1 --> A2: 10 qualifying PRs plus approval\n    A2 --> A3: 5 manual releases plus recovery drills\n    A3 --> A4: 20 autonomous releases and 30 days\n    A4 --> FROZEN: critical failure or policy violation\n    A3 --> FROZEN: failed rollback or monitoring loss\n    A2 --> FROZEN: Harness bypass\n    FROZEN --> A0: human recovery approval\n```\n\n" +
"Pełna autonomia **nie oznacza braku reguł** — oznacza samodzielność wewnątrz zatwierdzonej polityki. Nowa decyzja biznesowa, destrukcyjna migracja, nieodwracalna operacja, niejasne wymaganie lub nieznany stan nadal wymagają człowieka.\n\n" +
"## Migracje bazy danych\n\n" +
"| Klasa | Znaczenie | Autonomia |\n| --- | --- | --- |\n" +
"| \`NONE\` | Brak zmiany schematu | Normalny release |\n" +
"| \`ADDITIVE\` | Kompatybilne dodanie | Po właściwej promocji |\n" +
"| \`TRANSFORMATIVE\` | Przekształcenie danych | Osobny plan migracji |\n" +
"| \`DESTRUCTIVE\` | Usunięcie danych lub struktury | Zawsze decyzja człowieka |\n\n" +
"```text\nAdd compatible structure\n→ deploy dual-compatible code\n→ migrate data\n→ verify\n→ remove old structure in a later release\n```\n\n" +
"## Sentry i pętla incydentu\n\n" +
"```mermaid\nflowchart TD\n    Signal[\"Sentry wykrywa issue lub regresję\"] --> Triage[\"Triage wpływu i release\"]\n    Triage --> Critical{\"Krytyczny wpływ?\"}\n    Critical -->|Tak| Protect[\"Pause lub rollback\"]\n    Critical -->|Nie| Worktree[\"Jeden worktree dla fingerprintu\"]\n    Protect --> Worktree\n    Worktree --> Reproduce[\"Reprodukcja\"]\n    Reproduce --> Test[\"Failing regression test\"]\n    Test --> Fix[\"Poprawka\"]\n    Fix --> Review[\"Pełny Harness, PR i rollout\"]\n    Review --> Verify[\"Okno obserwacji w Sentry\"]\n    Verify --> Learn[\"Test, lint, invariant lub release gate\"]\n```\n\n" +
"Sentry nie służy do bezpośredniego patchowania produkcji. Jeśli problemu nie można odtworzyć: \`REPRODUCTION_NOT_CONFIRMED\`. Spekulacyjna poprawka wysokiego ryzyka nie może zostać automatycznie wdrożona.\n";

P["manual-commands"] = "# Referencja komend i praca z Cursor\n\n" +
"Wszystkie poniższe komendy poza standardowym Git są obecnie **zaprojektowane, ale jeszcze niezaimplementowane** w pełni (patrz [Stan implementacji](#/status-execplan)).\n\n" +
"## Bootstrap\n\n```bash\nnpx @sellgenius/harness init --docs ./project-docs\n```\n\nTworzy kompletny BASE nowego projektu.\n\n" +
"## Inspekcja\n\n```bash\nharness inspect\n```\n\nPokazuje repo, Docs, stack, wersje, capabilities, drift i brakujące wymagania.\n\n" +
"## Docs\n\n```bash\nharness validate-docs\n```\n\nSprawdza strukturę, indeksy, statusy, linki, generated Docs i konflikty.\n\n" +
"## Szybka i pełna walidacja\n\n```bash\nharness check --fast   # ~30s na projekcie referencyjnym, po spójnej partii edycji\nharness check --full   # przed review, CI i merge\n```\n\n" +
"## Środowisko\n\n```bash\nharness env up\nharness env status\nharness env down\n```\n\n" +
"## Autonomia\n\n```bash\nharness autonomy status\n```\n\nPokazuje poziomy planowania, merge, staging, produkcji, rollbacku i incydentów oraz brakujące dowody promocji.\n\n" +
"## Upgrade\n\n```bash\nharness upgrade\n```\n\nTworzy kontrolowany upgrade PR.\n\n" +
"## Jak pracujesz z Cursor po instalacji Harnessu\n\n" +
"**Mała zmiana** — przykładowy prompt wysokiego poziomu:\n\n" +
"```text\nImplement the approved validation behavior for contact requests.\nFollow the repository task lifecycle, consult the relevant Product Spec and\nDesign Doc, use an isolated worktree, validate the running system, request an\nindependent review, and prepare a short complete PR. Do not merge.\n```\n\n" +
"**Złożona funkcja:**\n\n```text\nCreate an ExecPlan for the approved customer onboarding capability. Do not\nimplement until the plan passes semantic review and I approve material product,\narchitecture, migration, and security decisions.\n```\n\n" +
"**Błąd produkcyjny:**\n\n```text\nInvestigate the linked Sentry issue. Correlate it with the release, reproduce it\nin an isolated environment, create a failing regression test, implement and\nvalidate the fix, and prepare a PR. Do not patch production directly.\n```\n";

P["manual-checklist"] = "# Checklisty i sygnały STOP\n\n" +
"## Co sprawdzasz jako użytkownik\n\n" +
"Nie musisz czytać całego kodu przy każdym PR. Na początku sprawdzasz:\n\n" +
"1. Czy rezultat odpowiada celowi?\n" +
"2. Czy kryteria akceptacyjne mają dowody?\n" +
"3. Czy agent zgłosił ryzyko lub ograniczenia?\n" +
"4. Czy wszystkie checki i review są czyste?\n" +
"5. Czy runtime został rzeczywiście uruchomiony?\n" +
"6. Czy Docs i plan są aktualne?\n" +
"7. Czy istnieje recovery lub rollback?\n" +
"8. Czy decyzja mieści się w aktualnym poziomie autonomii?\n\n" +
"## Kiedy zatrzymać agenta — \`HUMAN_JUDGMENT_REQUIRED\`\n\n" +
"- wymagania są niejednoznaczne;\n" +
"- zatwierdzone Docs przeczą sobie;\n" +
"- zmienia się produkt lub zakres;\n" +
"- powstaje nowa granica architektury;\n" +
"- zmiana osłabia bezpieczeństwo;\n" +
"- występuje destrukcyjna migracja;\n" +
"- operacja jest nieodwracalna;\n" +
"- brakuje rollbacku;\n" +
"- stan produkcji jest nieznany;\n" +
"- monitoring jest niedostępny;\n" +
"- agent nie posiada jawnego uprawnienia.\n\n" +
"## Checklista przed każdym kolejnym krokiem budowy\n\n" +
"- Czy pracujemy na osobnej gałęzi?\n" +
"- Czy bieżący \`main\` jest czysty?\n" +
"- Czy zadanie ma plan odpowiedni do ryzyka?\n" +
"- Czy agent przeczytał właściwe Docs?\n" +
"- Czy milestone ma obserwowalne acceptance?\n" +
"- Czy repo pozostanie działające po PR?\n" +
"- Czy istnieją testy pozytywne, negatywne i false-positive?\n" +
"- Czy niezależny reviewer ocenił rezultat?\n" +
"- Czy Docs oraz \`QUALITY_SCORE.md\` odpowiadają dowodom?\n" +
"- Czy człowiek zatwierdził decyzję wymagającą osądu?\n\n" +
"## Najważniejsza zasada użytkowania\n\n" +
"Jeżeli agent nie potrafi bezpiecznie wykonać zadania, **nie zwiększamy jego swobody na podstawie obietnicy**. Ustalamy, czego brakuje: kontekstu, narzędzia, izolacji, testu, obserwowalności, reguły, review, recovery. Następnie ulepszamy Harness i ponownie sprawdzamy go na mierzalnym przykładzie. W ten sposób szybkość rośnie razem z kontrolą, a nie kosztem kontroli.\n";

/* ============================================================ ARCHITECTURE ============================================================ */

P["arch-system"] = "# Kontekst systemu\n\n" +
"Źródło: \`ARCHITECTURE.md\`. Status: \`APPROVED\` / \`NOT_VERIFIED\`.\n\n" +
"Harness Blueprint jest wersjonowaną fabryką do tworzenia i utrzymywania repozytoriów projektów czytelnych dla agentów. Instaluje uniwersalną płaszczyznę kontroli inżynieryjnej, mapuje dokumentację specyficzną dla projektu do publikowanego układu wiedzy OpenAI, wybiera tylko wymagane możliwości stosu technologicznego i udowadnia, że wynikowe repozytorium może być bezpiecznie zmieniane przez agentów.\n\n" +
"```mermaid\nflowchart TD\n    Human[\"Human architect\"] --> Docs[\"Approved project Docs\"]\n    Docs --> CLI[\"Harness CLI\"]\n    Blueprint[\"Versioned Blueprint\"] --> CLI\n    Cursor[\"Cursor agents\"] --> Repo[\"Generated project repository\"]\n    CLI --> Repo\n    Repo --> CI[\"CI and release platform\"]\n```\n\n" +
"Człowiek posiada intencję biznesową, akceptację, decyzje ryzyka i promocję autonomii. CLI i agenci Cursor działają wyłącznie wewnątrz zakodowanych polityk.\n\n" +
"## Komponenty Blueprintu\n\n" +
"```mermaid\nflowchart TD\n    CLI[\"Harness CLI\"] --> Core[\"Universal Core\"]\n    CLI --> Template[\"OpenAI Repository Template\"]\n    CLI --> Profile[\"Resolved Stack Profile\"]\n    Core --> Upgrade[\"Upgrade Engine\"]\n    Template --> Project[\"Project repository\"]\n    Profile --> Project\n    Upgrade --> Project\n```\n\n" +
"| Komponent | Odpowiedzialność |\n| --- | --- |\n" +
"| Harness CLI | Uruchamia bootstrap, inspekcję, walidację, środowisko, check i komendy upgrade/autonomii. |\n" +
"| Universal Core | Definiuje lifecycle, statusy, semantykę invariantów, ewaluację polityki, dowody i audyt. |\n" +
"| OpenAI Repository Template | Materializuje mapę wiedzy repozytorium i pliki operacyjne dla Cursor. |\n" +
"| Profile SDK | Definiuje kontrakt, który musi spełnić każdy profil technologiczny. |\n" +
"| Stack Profiles | Implementują scaffold, walidację, runtime, obserwowalność, build i deployment dla stosu. |\n" +
"| Upgrade Engine | Produkuje kontrolowane, przeglądalne migracje między wersjami Blueprintu. |\n\n" +
"## Granica release\n\n" +
"Kod trafia na produkcję wyłącznie jako niezmienny artefakt zbudowany z zatwierdzonego commita na \`main\`, zweryfikowany na staging, promowany przez bramkę polityki i obserwowany podczas kontrolowanego rollout. Agenci wywołują wąskie operacje pipeline'u; nie łatają serwerów, nie używają nieograniczonego SSH i nie piszą bezpośrednio do bazy produkcyjnej.\n\n" +
"## Protokół zmiany architektonicznej\n\n" +
"Propozycja zmiany granicy lub invariantu wymaga dowodów, zaktualizowanego grafu zależności, zatwierdzonego Design Doc i ExecPlanu, zgody człowieka oraz jednego PR zawierającego dokumentację, implementację, lint lub testy strukturalne, fixtures i wskazówki migracyjne. Agent nie może osłabić invariantu tylko po to, by lokalna zmiana przeszła.\n";

P["arch-layers"] = "# Warstwy i granice domen\n\n" +
"Domeny aplikacji używają tylko potrzebnych im warstw. Puste warstwy i spekulacyjne katalogi są zabronione.\n\n" +
"```mermaid\nflowchart TD\n    UI[\"UI\"] --> Runtime[\"Runtime\"]\n    Runtime --> Service[\"Service\"]\n    Runtime --> Providers[\"Providers\"]\n    Service --> Repo[\"Repo\"]\n    Service --> Providers\n    Repo --> Config[\"Config\"]\n    Config --> Types[\"Types\"]\n    Repo --> Types\n    Providers --> Types\n    Wiring[\"App Wiring\"] --> UI\n    Wiring --> Runtime\n```\n\n" +
"| Warstwa | Odpowiedzialność | Dozwolone zależności |\n| --- | --- | --- |\n" +
"| Types | Kontrakty i typy domenowe | Brak wobec wyższych warstw |\n" +
"| Config | Sparsowana, typowana konfiguracja | Types |\n" +
"| Repo | Kontrakty i implementacje trwałości danych | Types, Config |\n" +
"| Providers | Jawne cross-cutting lub zewnętrzne możliwości | Types, zatwierdzone Utils |\n" +
"| Service | Zachowanie domenowe i orkiestracja | Types, Config, Repo, Providers |\n" +
"| Runtime | Publiczne operacje udostępniane innym domenom | Types, Config, Service, Providers |\n" +
"| UI | Prezentacja i interakcja z użytkownikiem | Types, Runtime |\n" +
"| App Wiring | Kompozycja i budowa zależności | Wymagane warstwy publiczne |\n" +
"| Utils | Neutralne domenowo narzędzia | Brak importów domenowych |\n\n" +
"Domeny są **prywatne domyślnie**. Interakcja między domenami jest dozwolona wyłącznie przez publiczne operacje Runtime, zdarzenia domenowe lub zatwierdzoną orkiestrację. Zabronione są: bezpośrednie importy prywatnego Repo/Service innej domeny, bezpośredni dostęp do jej tabel, zduplikowane reguły biznesowe, cykle i Providers używane jako obejście.\n\n" +
"## Mechaniczne egzekwowanie\n\n" +
"```mermaid\nflowchart TD\n    Diff[\"Zmiana kodu\"] --> Graph[\"Graf importów i granic\"]\n    Graph --> Rules[\"ARCH, BOUNDARY i pozostałe invariants\"]\n    Rules --> Result{\"Naruszenie?\"}\n    Result -->|Nie| Pass[\"Kontynuuj walidację\"]\n    Result -->|Tak| Error[\"Stabilny kod błędu i instrukcja naprawy\"]\n    Error --> Fix[\"Agent poprawia przyczynę\"]\n    Fix --> Graph\n```\n\n" +
"## Walidacja granic\n\n" +
"Każda zewnętrzna wartość zaczyna jako \`unknown\` i przechodzi przez jawny parser, zanim stanie się typem domenowym. Dotyczy to HTTP, formularzy, webhooków, zmiennych środowiskowych, kolejek, wierszy bazy danych, zewnętrznych API, odpowiedzi LLM i wyjścia narzędzi.\n\n" +
"## Izolacja runtime\n\n" +
"Jedno zadanie lub ExecPlan używa jednego Git worktree, brancha, instancji aplikacji, konfiguracji, granicy bazy danych, przestrzeni nazw usług, strumienia telemetrii i lokalizacji artefaktów. Cleanup celuje wyłącznie w zasoby z dokładnym identyfikatorem worktree.\n";

P["arch-packages"] = "# Topologia pakietów\n\n" +
"```text\npackages/\n├── cli/\n├── core/\n├── template-openai/\n├── profile-sdk/\n└── profiles/\n    └── [profile-name]/\n```\n\n" +
"```mermaid\nflowchart TD\n    CLI[\"packages/cli\"] --> Core[\"packages/core\"]\n    CLI --> Template[\"packages/template-openai\"]\n    CLI --> SDK[\"packages/profile-sdk\"]\n    Profiles[\"packages/profiles/*\"] --> SDK\n    Profiles --> Core\n    Upgrade[\"Upgrade Engine\"] --> Core\n    Upgrade --> Template\n```\n\n" +
"Profile **nie mogą redefiniować** semantyki Universal Core. Tłumaczą stabilne identyfikatory invariantów i kontrakty lifecycle na sprawdzenia specyficzne dla danego stosu technologicznego.\n\n" +
"### Harness CLI (\`packages/cli\`)\n\n" +
"Koordynuje inspekcję repozytorium, import Docs, bootstrap, checki, cykl życia środowiska, upgrade'y i raportowanie autonomii. Nie wymyśla decyzji biznesowych ani nie wybiera po cichu niejednoznacznego stosu.\n\n" +
"### Universal Core (\`packages/core\`)\n\n" +
"Core posiada znaczenia invariantów, stany lifecycle, schematy wyników walidacji, ewaluację polityki, zdarzenia audytu, reguły planów, semantykę własności plików oraz interfejsy rozszerzeń. Jest **technologicznie neutralny**.\n\n" +
"### OpenAI Repository Template (\`packages/template-openai\`)\n\n" +
"Materializuje publikowany układ wiedzy plus konfigurację operacyjną skierowaną do Cursor. Dostarcza placeholdery i reguły, nie spekulacyjny kod aplikacji.\n\n" +
"### Profile SDK i Stack Profiles (\`packages/profile-sdk\`, \`packages/profiles/*\`)\n\n" +
"SDK definiuje wymagane operacje: detekcję, scaffold, checki, uruchomienie środowiska, walidację architektury, build, deployment staging, deployment produkcyjny i rollback. Profile implementują te operacje dla danego stosu, nie redefiniując polityki Core.\n\n" +
"Pierwszym bazowym profilem jest \`typescript-node\`. Jego pierwsza pełna referencyjna kompozycja używa NestJS, Mastra, PostgreSQL z Drizzle, Supabase, lokalnej obserwowalności Vector/Victoria, Sentry oraz deploymentu kontenerowego. Możliwości są instalowane tylko wtedy, gdy wymagają tego zatwierdzone Docs.\n\n" +
"### Upgrade Engine\n\n" +
"Silnik porównuje zainstalowany stan lock z docelową wersją Blueprintu, klasyfikuje każdy plik według własności, produkuje raport migracji, rozwiązuje bezpieczne zmiany mechaniczne i otwiera kontrolowany PR upgrade'u. Nigdy nie wykonuje nieprzeglądniętej mutacji w tle.\n\n" +
"## Stan instalacji\n\n" +
"\`harness.config.ts\` to czytelna dla projektu konfiguracja. \`harness.lock.json\` zapisuje dokładne wersje Core, template, profilu, capabilities, schematu polityki i sumy kontrolne plików zarządzanych.\n\n" +
"## Rozwiązywanie capabilities\n\n" +
"```mermaid\nflowchart TD\n    Docs[\"Approved project Docs\"] --> Detect[\"Detect required capabilities\"]\n    Detect --> Proposal[\"Resolved profile proposal\"]\n    Proposal --> Decision{\"Unambiguous and compatible?\"}\n    Decision -->|No| Human[\"Human decision\"]\n    Decision -->|Yes| Lock[\"Record resolved profile\"]\n    Human --> Lock\n```\n\n" +
"Żaden frontend, baza danych, kolejka, runtime agentowy ani nieużywana warstwa semantyczna nie jest tworzona wyłącznie na potencjalną przyszłą potrzebę.\n";

P["arch-ownership"] = "# Własność plików i model upgrade\n\n" +
"## Klasy własności plików\n\n" +
"| Klasa | Znaczenie | Zachowanie przy upgrade |\n| --- | --- | --- |\n" +
"| \`BLUEPRINT_MANAGED\` | Pliki operacyjne własności zainstalowanego Blueprintu | Aktualizowane wyłącznie przez PR upgrade'u |\n" +
"| \`PROJECT_OWNED\` | Docs produktu i implementacja produktu | Nigdy nienadpisywane przez Blueprint |\n" +
"| \`MERGE_CONTROLLED\` | Pliki współdzielone, np. \`AGENTS.md\` i \`harness.config.ts\` | Porównanie trójstronne z jawnym rozwiązaniem konfliktu |\n" +
"| \`GENERATED\` | Deterministyczna reprezentacja pochodząca z innego źródła | Regenerowane i porównywane w CI |\n\n" +
"Ciche nadpisania są zabronione. Edycja użytkownika lub projektu w pliku zarządzanym jest raportowana jako **drift** i rozwiązywana w przeglądalnym PR.\n\n" +
"## Powierzchnie kontroli wygenerowanego projektu\n\n" +
"| Powierzchnia | Rola |\n| --- | --- |\n" +
"| \`AGENTS.md\` | Krótki spis treści i punkt wejścia zadania |\n" +
"| \`.cursor/rules/\` | Cienkie, zawsze aktywne trasowanie do źródeł prawdy repozytorium |\n" +
"| \`.cursor/skills/\` | Procedury operacyjne z progresywnym odkrywaniem |\n" +
"| \`.cursor/agents/\` | Definicje niezależnych i specjalistycznych reviewerów |\n" +
"| \`.cursor/hooks.json\` | Szybkie sprzężenie zwrotne; nigdy ostateczna granica bezpieczeństwa |\n" +
"| \`harness.config.ts\` | Czytelna dla człowieka konfiguracja projektu i polityki |\n" +
"| \`harness.lock.json\` | Maszynowo czytelne wersje instalacji, własność i sumy kontrolne |\n" +
"| \`.github/workflows/\` | Egzekwowane bramki CI, konserwacji i release |\n" +
"| \`tests/structural/\` | Wykonywalne invarianty architektury i repozytorium |\n\n" +
"## Zgodność wersji (compatibility)\n\n" +
"Każda capability deklaruje wymagane zakresy Core i profile SDK, niekompatybilne capabilities, kolejność instalacji, dostarczane komendy, oczekiwane fixtures strukturalne i migracje upgrade'u. Rozwiązanie kończy się niepowodzeniem przed mutacją, gdy wybrany zestaw jest niekompatybilny.\n\n" +
"## Konsekwencje modelu\n\n" +
"- Nowe projekty współdzielą spójny lifecycle i kontrolki.\n" +
"- Mechanika specyficzna dla technologii pozostaje wymienna.\n" +
"- Wiedza projektowa pozostaje autorytatywna i chroniona.\n" +
"- Upgrade'y są przeglądalne i odwracalne.\n" +
"- System centralny wymaga silnych fixtures referencyjnych, by nie zepsuć każdego projektu podrzędnego.\n";

/* ============================================================ PRODUCT SPECS ============================================================ */

P["spec-blueprint"] = "# Harness Blueprint\n\n<span class=\"badge approved\">Approved</span>\n\n" +
"## Problem\n\nProjektowanie i dostarczanie systemów produkcyjnych wielokrotnie wymaga spójnej wiedzy repozytoryjnej, planowania, kontroli implementacji, walidacji runtime, review, bezpieczeństwa release'u i długoterminowej konserwacji. Odbudowywanie tych kontrolek z pamięci dla każdego projektu marnuje uwagę człowieka i czyni zachowanie agenta nieprzewidywalnym.\n\n" +
"## Rezultat produktowy\n\nDostarczyć wersjonowaną BASE, która może inicjalizować każdy zatwierdzony projekt agentowo-czytelnym, mechanicznie egzekwowanym środowiskiem inżynieryjnym, wzorowanym na publicznym podejściu OpenAI Harness Engineering, zaadaptowanym do Cursor.\n\n" +
"## Główny użytkownik\n\nArchitekt systemów odpowiedzialny za produkcyjne systemy klienckie, działający na poziomie intencji biznesowej, architektury, akceptacji, ryzyka i zatwierdzeń, zachowujący możliwość inspekcji każdej linii i artefaktu.\n\n" +
"## Wymagane możliwości\n\nProdukt musi:\n\n" +
"- zachować zatwierdzony układ wiedzy repozytorium OpenAI;\n" +
"- importować kanoniczne Docs bez zbędnego remapowania;\n" +
"- generować, proponować, walidować i uzyskiwać zatwierdzenie mapowań, gdy wejściowe Docs są niekanoniczne lub bez manifestu;\n" +
"- tworzyć wyłącznie fundament techniczny wymagany przez zatwierdzony projekt;\n" +
"- wspierać technologicznie neutralną politykę Core i profile specyficzne dla stosu;\n" +
"- dawać agentom lokalne instrukcje repozytoryjne, narzędzia, dostęp do runtime i feedback;\n" +
"- egzekwować architekturę, walidację granic, czytelność, testowanie, niezawodność, bezpieczeństwo i integralność Harnessu;\n" +
"- izolować równoległe zadania i ich mutowalne zasoby;\n" +
"- wymagać żywych planów dla złożonej pracy;\n" +
"- wykonywać self-review, niezależne review, CI, walidację runtime i iterację feedbacku aż do czystości;\n" +
"- produkować krótkie, kompletne PR-y;\n" +
"- wspierać kontrolowany merge, staging, rollout produkcyjny, monitoring, rollback i naprawę incydentów;\n" +
"- dostarczać feedback produkcyjny oparty na Sentry bez bezpośredniego patchowania produkcji;\n" +
"- mierzyć i promować autonomię osobno wg capability i klasy ryzyka;\n" +
"- automatycznie zamrażać lub obniżać niebezpieczną autonomię;\n" +
"- ciągle wykrywać i naprawiać entropię przez ukierunkowaną konserwację;\n" +
"- aktualizować się przez kontrolowane PR-y bez cichego nadpisywania wiedzy projektu.\n\n" +
"## Pierwsza obsługiwana rodzina\n\nPierwszy profil bazowy wspiera strict TypeScript na Node.js. Pierwsza pełna konfiguracja referencyjna waliduje NestJS, Mastra, PostgreSQL z Drizzle, Supabase, lokalną obserwowalność Victoria, Sentry i dostawę kontenerową. Wsparcie frontendu pozostaje opcjonalne i jest instalowane tylko gdy wymagają tego Docs projektu.\n\n" +
"## Non-goals dla V1\n\n" +
"- Wspieranie każdego języka i dostawcy chmury.\n" +
"- Instalowanie spekulacyjnych możliwości aplikacji.\n" +
"- Zastępowanie osądu biznesowego lub architektonicznego nieograniczonym agentem.\n" +
"- Dawanie agentom nieograniczonego shella produkcyjnego lub dostępu do bazy.\n" +
"- Twierdzenie, że niepublikowane szczegóły implementacji są potwierdzone przez OpenAI.\n" +
"- Optymalizacja pod kątem wolumenu kodu zamiast zweryfikowanych rezultatów.\n\n" +
"## Kryteria akceptacji\n\n" +
"- Projekt referencyjny może zostać zbootstrapowany z zatwierdzonych Docs.\n" +
"- Nowy agent może się w nim poruszać, używając wyłącznie kontekstu lokalnego repozytorium.\n" +
"- Celowo nieprawidłowe Docs, architektura, runtime, review, release, uprawnienia i przypadki entropii są wychwytywane przez bramki ich etapów.\n" +
"- Poprawna zmiana referencyjna osiąga \`READY_FOR_MERGE\` bez fałszywego blokowania.\n" +
"- Ponowne uruchomienie bootstrapu i konserwacji jest idempotentne.\n" +
"- Autonomia nie może być samodzielnie przyznana ani użyta do ominięcia obowiązkowych kontroli.\n" +
"- Cały zestaw bramek referencyjnych przechodzi przed wydaniem V1.\n";

P["spec-bootstrap"] = "# Project bootstrap\n\n<span class=\"badge approved\">Approved</span>\n\n" +
"## Rezultat dla użytkownika\n\nMając pusty lub zatwierdzony repozytorium docelowe i zatwierdzone Docs projektu, wyprodukować minimalny, uruchamialny fundament projektu, zachować intencję projektu, zainstalować poprawny Harness i możliwości technologiczne, zwalidować rezultat i otworzyć kompletny pierwszy PR.\n\n" +
"## Główne wywołanie\n\n```text\nnpx @sellgenius/harness init --docs ./project-docs\n```\n\n" +
"## Wymagane zachowanie\n\nBootstrap musi:\n\n" +
"- zinspekcjonować cel przed mutacją;\n" +
"- wymagać lub utworzyć commit kotwiczący dla bezpiecznej operacji worktree;\n" +
"- zinwentaryzować wszystkie przychodzące Docs;\n" +
"- użyć istniejącej struktury kanonicznej bezpośrednio, gdy jest ważna;\n" +
"- wygenerować proponowany manifest, gdy żaden nie istnieje;\n" +
"- zaproponować mapowania dla niekanonicznych Docs;\n" +
"- zażądać zatwierdzenia człowieka, zanim mapowanie zmieni znaczenie lub autorytet;\n" +
"- wykryć duplikaty, konflikty, brakujące tematy i nieznane dokumenty;\n" +
"- zainstalować strukturę wiedzy OpenAI i adapter Cursor;\n" +
"- rozwiązać minimalny kompatybilny zestaw możliwości Stack Profile;\n" +
"- zapytać, gdy wybór technologii jest niejednoznaczny;\n" +
"- wygenerować minimalny, uruchamialny scaffold;\n" +
"- skonfigurować izolowany runtime lokalny i wymagane checki;\n" +
"- zwalidować Docs, fixtures architektury, zdrowie runtime i idempotencję;\n" +
"- otworzyć PR bootstrapu z dowodami i ograniczeniami;\n" +
"- zatrzymać się przed pierwszym merge, oczekując zgody człowieka.\n\n" +
"## Zachowanie przy wznowieniu\n\nBootstrap może zostać przerwany i ponownie uruchomiony. Wznawia od ostatniego zweryfikowanego checkpointu, ponownie waliduje założenia, które mogły się zmienić, i nie tworzy duplikatów ani nie nadpisuje po cichu zawartości.\n\n" +
"## Zachowanie przy konflikcie\n\nGdy zatwierdzone źródła są w konflikcie, wybory technologiczne są niekompatybilne, lub istniejące repozytorium zawiera nakładającą się własność, bootstrap zatrzymuje się z jasnym raportem i \`HUMAN_JUDGMENT_REQUIRED\`. Nie rozwiązuje konfliktów normatywnych, wybierając tekst wyglądający na najnowszy.\n\n" +
"## Scenariusze akceptacji\n\n" +
"1. Import kanonicznych Docs bez mapowania semantycznego.\n" +
"2. Niekanoniczne Docs otrzymują zatwierdzone mapowanie i walidują się względem źródła.\n" +
"3. Brakujący manifest jest generowany przed mapowaniem.\n" +
"4. Brak frontendu nie tworzy scaffoldu frontendu i zapisuje \`NOT_APPLICABLE\`.\n" +
"5. Niekompatybilne capabilities blokują przed częściową instalacją.\n" +
"6. Przerwany bootstrap wznawia się bez duplikacji.\n" +
"7. Drugi kompletny przebieg nie produkuje niezamierzonego diffa.\n" +
"8. Pierwszy PR może zostać zrozumiany przez niezależnego agenta, używając wyłącznie kontekstu repozytorium.\n";

P["spec-upgrade"] = "# Harness upgrade\n\n<span class=\"badge approved\">Approved</span>\n\n" +
"## Rezultat dla użytkownika\n\nPrzyjąć nowszy Universal Core, template, profil, capability lub schemat polityki bez cichego dryfu, utraty wiedzy projektu lub nieprzeglądniętej zmiany zachowania.\n\n" +
"## Wymagane zachowanie\n\nUpgrade musi:\n\n" +
"- zinspekcjonować zainstalowany stan lock i wersje docelowe;\n" +
"- wylistować migracje i wymagania kompatybilności;\n" +
"- klasyfikować dotknięte pliki wg własności;\n" +
"- zachować wszystkie pliki projektu (\`PROJECT_OWNED\`);\n" +
"- wykonać kontrolowane porównanie trójstronne dla plików współdzielonych;\n" +
"- wykryć lokalne modyfikacje plików zarządzanych;\n" +
"- pokazać każdą proponowaną zmianę w dedykowanym branchu i worktree;\n" +
"- uruchomić walidację Docs, profilu, strukturalną, runtime i referencyjną;\n" +
"- zaktualizować stan wersji i sumy kontrolne dopiero po udanej migracji;\n" +
"- otworzyć krótki PR upgrade'u z rollbackiem i dowodami;\n" +
"- wymagać zatwierdzenia człowieka dla zmian normatywnych, uprawnień, bezpieczeństwa lub autonomii.\n\n" +
"## Zachowanie zabronione\n\nSystem nie może:\n\n" +
"- aktualizować projektów po cichu w tle;\n" +
"- nadpisywać Product Specs ani Design Docs;\n" +
"- obniżać progu bezpieczeństwa jako skrótu kompatybilności;\n" +
"- resetować zamrożenia autonomii (\`AUTONOMY_FREEZE\`);\n" +
"- zastępować decyzję projektu domyślną wartością Blueprintu;\n" +
"- odrzucać lokalną modyfikację pliku zarządzanego bez zgłoszenia;\n" +
"- oznaczać upgrade jako zakończony, gdy bramki referencyjne nie przechodzą.\n\n" +
"## Wersjonowanie\n\nCore, templates, profile, capabilities i schematy polityk używają jawnych wersji. Zmiany łamiące kontrakt wymagają major wersji i ścieżki migracji. Raport upgrade'u rozróżnia zmiany funkcjonalne, konfiguracyjne, generowane, dokumentacyjne, bezpieczeństwa i uprawnień.\n\n" +
"## Awaria i wznowienie\n\nPrzerwany upgrade pozostaje wznawialny z zapisanych checkpointów. Nieudany upgrade pozostawia bieżącą zainstalowaną wersję operacyjną i dostarcza dokładne kroki naprawy. Częściowe metadane wersji nie mogą twierdzić o sukcesie.\n\n" +
"## Scenariusze akceptacji\n\n" +
"1. Mechaniczna aktualizacja pliku zarządzanego produkuje czysty PR.\n" +
"2. Dokument należący do projektu pozostaje niezmieniony bajt-po-bajcie.\n" +
"3. Konflikt pliku współdzielonego jest ujawniony, a nie nadpisany.\n" +
"4. Niekompatybilny profil blokuje przed zacommitowaniem stanu docelowego.\n" +
"5. Zmiana polityki bezpieczeństwa wymaga jawnego zatwierdzenia człowieka.\n" +
"6. Ponowne uruchomienie zakończonego upgrade'u nie produkuje niezamierzonego diffa.\n" +
"7. Wycofanie upgrade'u przywraca poprzednie zweryfikowane zachowanie Harnessu.\n";

P["spec-lifecycle"] = "# Autonomous task lifecycle\n\n<span class=\"badge approved\">Approved</span>\n\n" +
"## Rezultat dla użytkownika\n\nOpisać żądaną zmianę na wysokim poziomie i otrzymać zweryfikowany, udokumentowany, sprawdzony rezultat, zachowując widoczność kodu, dowodów, decyzji i ryzyka. Zwiększać niezależność tylko po tym, jak repozytorium udowodni, że może to bezpiecznie wspierać.\n\n" +
"## Wymagany cykl życia\n\nDla każdego zadania system musi:\n\n" +
"1. zidentyfikować intencję, zakres, akceptację i ryzyko;\n" +
"2. skonsultować odpowiednie Docs repozytorium;\n" +
"3. utworzyć odpowiedni lekki plan lub ExecPlan;\n" +
"4. ustalić bieżący baseline;\n" +
"5. utworzyć izolowane środowisko worktree;\n" +
"6. zaimplementować jeden spójny milestone;\n" +
"7. zwalidować rzeczywisty runtime, gdy zmienia się zachowanie;\n" +
"8. wykonać self-review i uzyskać niezależne review;\n" +
"9. uruchomić wymagane review specjalistyczne i CI;\n" +
"10. iterować, aż nie pozostanie żadne wykonalne znalezisko;\n" +
"11. zaktualizować Docs, diagramy, plan i dowody;\n" +
"12. wyprodukować krótki, kompletny PR i raport gotowości;\n" +
"13. scalić tylko gdy pozwala na to bieżąca polityka;\n" +
"14. zweryfikować \`main\`, staging i produkcję tam, gdzie ma to zastosowanie;\n" +
"15. wycofać lub naprawić, gdy obserwowane zachowanie narusza kryteria release'u;\n" +
"16. zamknąć plan tylko wtedy, gdy kompletny rezultat jest potwierdzony dowodami.\n\n" +
"## Widoczność dla człowieka\n\nUżytkownik może zainspekcjonować: każdą zmienioną linię, historię planu i decyzji, skonsultowane Docs i zastosowane invarianty, testy i ustalenia reviewerów, dowody runtime, wyniki CI i release, sygnały produkcyjne i akcje rollback oraz powód każdej eskalacji.\n\n" +
"## Wymagana eskalacja\n\nAgent zatrzymuje się, gdy intencja produktu jest niejednoznaczna, zatwierdzone źródła są sprzeczne, potrzebna jest istotna zmiana zakresu lub architektury, wymagany jest osąd bezpieczeństwa lub prawny, możliwa jest destrukcja danych, rollback jest niedostępny, stan produkcji jest nieznany, lub polityka nie autoryzuje działania.\n\n" +
"## Odpowiedź produkcyjna\n\nKwalifikujący się problem produkcyjny może uruchomić automatyczny triage i izolowany workflow naprawczy. System musi odtworzyć problem lub stwierdzić, że reprodukcja nie jest potwierdzona, dodać ochronę regresyjną, dostarczyć normalną przeglądniętą zmianę i zweryfikować nowe wydanie. Bezpośrednie łatanie produkcji jest zabronione.\n\n" +
"## Scenariusze akceptacji\n\n" +
"1. Poprawne małe zadanie osiąga czysty PR bez zbędnego ładowania kontekstu.\n" +
"2. Złożone zadanie pozostaje wznawialne przez nowego agenta dzięki ExecPlanowi.\n" +
"3. Celowe naruszenie architektoniczne jest wychwytywane przed merge.\n" +
"4. Ustalenie reviewera powoduje poprawkę i ponowną walidację.\n" +
"5. Krytyczny flaky test blokuje, zamiast być ukryty.\n" +
"6. Promowana zmiana niskiego ryzyka może auto-mergować, gdy produkcja pozostaje manualna.\n" +
"7. Promowana zmiana produkcyjna wdraża się, obserwuje i weryfikuje autonomicznie.\n" +
"8. Symulowana regresja pauzuje, wycofuje, tworzy jeden workflow naprawczy i wraca normalną ścieżką PR.\n" +
"9. Destrukcyjna operacja żąda osądu człowieka nawet na najwyższym poziomie autonomii.\n";

/* ============================================================ DESIGN DOCS ============================================================ */

P["design-core-beliefs"] = "# Core beliefs\n\n<span class=\"badge approved\">Approved</span>\n\n" +
"## Humans steer; agents execute\n\nLudzie posiadają pożądane rezultaty, priorytet, akceptację, tolerancję ryzyka i osąd. Agenci posiadają implementację, testowanie, odpowiedź na review, dokumentację i bezpieczną operację wewnątrz jawnych ograniczeń.\n\n" +
"## Wiedza repozytorium jest systemem rekordu\n\nJeśli trwała decyzja nie może być odkryta z lokalnych, wersjonowanych artefaktów repozytorium, nie istnieje ona wiarygodnie dla agenta. Ważne decyzje z rozmów lub zewnętrznych narzędzi muszą zostać promowane do odpowiedniego Product Spec, Design Doc, planu, testu, schematu lub wykonywalnej reguły.\n\n" +
"## Daj agentom mapę, nie ogromny podręcznik\n\n\`AGENTS.md\` jest zwięzłym punktem wejścia. Kieruje agentów przez progresywne ujawnianie do najmniejszego istotnego zestawu źródeł. Kontekst jest zasobem ograniczonym; nieistotne instrukcje zmniejszają niezawodność.\n\n" +
"## Uczyń rzeczywisty system czytelnym\n\nAgenci muszą móc uruchomić, sterować, obserwować i zatrzymać aplikację lub równoważny runtime. Sama inspekcja kodu źródłowego jest niewystarczającym dowodem dla pracy behawioralnej.\n\n" +
"## Egzekwuj invarianty, nie osobisty gust implementacyjny\n\nCentralne reguły chronią granice, poprawność, powtarzalność, bezpieczeństwo i czytelność. Wewnątrz tych granic agenci zachowują lokalną swobodę.\n\n" +
"## Preferuj czytelny, przewidywalny kod\n\nKod produkcyjny powinien czytać się jak jasna narracja techniczna. Nazwy ujawniają intencję; jednostki są spójne; efekty uboczne są jawne; komentarze wyjaśniają \"dlaczego\"; testy demonstrują użycie.\n\n" +
"## Waliduj każdą zewnętrzną granicę\n\nNiezaufane lub zewnętrzne dane nigdy nie są traktowane jako wewnętrzna wartość domenowa przed parsowaniem i walidacją. Dotyczy to również wyjścia LLM i narzędzi.\n\n" +
"## Plany są żywymi artefaktami wykonania\n\nZłożona praca jest zapisywana w samowystarczalnych ExecPlanach, które nowy agent może kontynuować, używając wyłącznie repozytorium i planu.\n\n" +
"## Utrzymuj zmiany krótkotrwałe i kompletne\n\nKażdy PR dostarcza jeden spójny, weryfikowalny rezultat i pozostawia repozytorium w działającym stanie.\n\n" +
"## Pętl aż do czystości\n\nImplementacja jest śledzona przez self-review, niezależne review, review specjalistyczne w razie potrzeby, walidację runtime, CI i odpowiedź na każde wykonalne ustalenie.\n\n" +
"## Recovery jest zdolnością pierwszej klasy\n\nIdempotencja, wznowienie, rollback i bezpieczne ponowienie są projektowane przed awarią. Ochronny downgrade może nastąpić automatycznie; eskalacja uprawnień — nie.\n\n" +
"## Autonomia jest zdobywana przez środowisko\n\nAgent mający trudności jest dowodem brakującego kontekstu, narzędzi, zabezpieczeń lub feedbacku. Ulepsz Harness, a następnie zademonstruj zdolność przez obiektywne bramki.\n\n" +
"## Każdy incydent powinien wzmacniać system\n\nNapraw natychmiastowe zachowanie, następnie określ, czy przyczyna powinna stać się testem, lintem, invariantem strukturalnym, sygnałem obserwowalności, bramką release'u lub aktualizacją dokumentacji.\n\n" +
"## Entropia wymaga ciągłego garbage collection\n\nAgenci replikują istniejące wzorce, w tym słabe. Cykliczni gardenerzy skanują dryf, aktualizują oparte na dowodach oceny jakości i otwierają małe, ukierunkowane PR-y.\n";

P["design-blueprint-architecture"] = "# Blueprint architecture (design)\n\n<span class=\"badge approved\">Approved</span>\n\n" +
"## Kontekst\n\nBlueprint musi odtwarzać stabilne środowisko repozytoryjne agent-first dla nowych projektów, jednocześnie umożliwiając wiedzę biznesową specyficzną dla projektu i wybory technologiczne. Musi pozostać inspekcjonowalny, wersjonowany, aktualizowalny i odporny na ciche nadpisanie.\n\n" +
"## Decyzja\n\nBlueprint składa się z pięciu komponentów: TypeScript Harness CLI, Universal Harness Core, OpenAI Repository Template, Profile SDK i rozwiązane Stack Profiles, Upgrade Engine. **Centralne repozytorium Blueprintu stosuje własny Harness do siebie.**\n\n" +
"## Pierwszy profil bazowy\n\n\`typescript-node\`. Pierwsza pełna kompozycja referencyjna używa NestJS, Mastra, PostgreSQL z Drizzle, Supabase, lokalnej obserwowalności Vector/Victoria, Sentry i deploymentu kontenerowego.\n\n" +
"## Decyzja o własności plików\n\n- Pliki operacyjne zarządzane przez Blueprint aktualizują się tylko przez PR-y upgrade'u.\n" +
"- Product Specs, Design Docs i kod produktu są własnością projektu.\n" +
"- Współdzielone pliki wejścia i konfiguracji używają kontrolowanego merge trójstronnego.\n" +
"- Wygenerowane artefakty są regenerowane i porównywane, nie ręcznie edytowane.\n\n" +
"## Konsekwencje\n\n- Nowe projekty współdzielą spójny lifecycle i kontrolki.\n" +
"- Mechanika specyficzna dla technologii pozostaje wymienna.\n" +
"- Wiedza projektowa pozostaje autorytatywna i chroniona.\n" +
"- Upgrade'y są inspekcjonowalne i odwracalne.\n" +
"- System centralny wymaga silnych fixtures referencyjnych.\n\n" +
"## Pochodzenie\n\n- **OPENAI-CONFIRMED:** początkowy scaffold generowany przez Codex CLI z małego zestawu szablonów; lokalne narzędzia i dokumentacja.\n" +
"- **RECONSTRUCTED:** topologia pakietów, kompozycja profili, model własności, plik lock i protokół upgrade'u.\n";

P["design-docs-ingestion"] = "# Docs ingestion and bootstrap\n\n<span class=\"badge approved\">Approved</span>\n\n" +
"## Cel\n\nZamienić pusty lub nowo zakotwiczony repozytorium Git wraz z zatwierdzonymi Docs projektu w minimalny, uruchamialny, zwalidowany, czytelny dla agenta projekt bez utraty intencji lub zgadywania niejednoznacznych mapowań.\n\n" +
"## Manifest Docs\n\nManifest źródła opisuje dostępne dokumenty, ich autorytet, temat, status, zamierzone kanoniczne przeznaczenie i relacje. Jeśli przychodzące Docs nie mają manifestu, agent najpierw tworzy inwentaryzację i proponowany manifest. **Brak manifestu nie jest błędem. Ciche mapowanie jest zabronione.**\n\n" +
"## Stan bootstrap\n\n```mermaid\nstateDiagram-v2\n    [*] --> DISCOVERED\n    DISCOVERED --> DOCS_MAPPED\n    DOCS_MAPPED --> DOCS_VALIDATED\n    DOCS_VALIDATED --> HARNESS_INSTALLED\n    HARNESS_INSTALLED --> SCAFFOLD_GENERATED\n    SCAFFOLD_GENERATED --> VALIDATION_PASSED\n    VALIDATION_PASSED --> PR_OPENED\n    PR_OPENED --> COMPLETE\n```\n\n" +
"| Stan | Dowód |\n| --- | --- |\n" +
"| DISCOVERED | Inwentaryzacja repozytorium, Docs źródłowych i środowiska |\n" +
"| DOCS_MAPPED | Zatwierdzone lub niepotrzebne kanoniczne mapowanie |\n" +
"| DOCS_VALIDATED | Zwalidowana struktura, status, linki, konflikty i wymagana wiedza |\n" +
"| HARNESS_INSTALLED | Zapisany Core, adapter Cursor, konfiguracja i rozwiązany profil |\n" +
"| SCAFFOLD_GENERATED | Istnieje minimalny wymagany fundament aplikacji i infrastruktury |\n" +
"| VALIDATION_PASSED | Przechodzą sprawdzenia referencyjne i baseline runtime |\n" +
"| PR_OPENED | Istnieje kompletny PR bootstrapu z raportem i dowodami |\n" +
"| COMPLETE | Zatwierdzony przez człowieka początkowy merge i zweryfikowana po-merge'owa weryfikacja |\n\n" +
"## Kontrakt scaffoldu\n\nPoczątkowy scaffold to najmniejszy uruchamialny fundament techniczny wymagany przez zatwierdzone Docs i rozwiązany profil. Zawiera CI, formatowanie, testowanie, uruchamianie środowiska, health checki i ochronę strukturalną potrzebną dla jego obecnych możliwości. **Nie zawiera** spekulacyjnych domen, funkcji, abstrakcji ani pustych warstw semantycznych.\n\n" +
"## Idempotencja i wznowienie\n\nKażde przejście stanu zapisuje wejścia, wyjścia, sumy kontrolne, rozwiązane decyzje i bezpieczne cele czyszczenia. Ponowne uruchomienie komendy: wznawia od ostatniego zweryfikowanego stanu, ponownie waliduje założenia, nie duplikuje plików ani usług, nie nadpisuje treści projektu, raportuje drift przed kontynuacją.\n";

P["design-task-review"] = "# Task execution and review loop\n\n<span class=\"badge approved\">Approved</span>\n\n" +
"## Wybór planu\n\nUżyj lekkiego planu dla małego, lokalnego, odwracalnego zadania z oczywistą akceptacją. Użyj ExecPlanu dla pracy złożonej, wielogodzinnej, wielomodułowej, architektonicznej, API/schema/security/reliability/refaktoryzacyjnej/migracyjnej lub podatnej na przekazanie między agentami.\n\n" +
"## Jedno zadanie, jeden worktree\n\nAktywne zadanie lub ExecPlan posiada jeden branch, worktree, izolowany runtime, katalog dowodów i wątek review. Równolegli agenci nie współdzielą mutowalnego stanu aplikacji.\n\n" +
"## Warstwy review\n\n**Self-review implementera** — porównuje diff z intencją, akceptacją, Docs, invariantami architektonicznymi, edge case'ami, testami, zachowaniem runtime i niepowiązanymi zmianami.\n\n" +
"**Niezależny reviewer** — osobny, tylko-do-odczytu reviewer sprawdza poprawność, zgodność ze specyfikacją, architekturę, walidację granic, obsługę błędów, testy, regresje, czytelność i proporcjonalną abstrakcję.\n\n" +
"**Reviewerzy specjalistyczni** — ryzyko wyzwala review bezpieczeństwa, niezawodności, migracji, frontendu lub oceny agenta.\n\n" +
"**Cloud review** — CI, Cursor Bugbot i skonfigurowane Cloud Agent reviews inspekcjonują PR. Każde wykonalne ustalenie jest naprawiane, obalane konkretnym dowodem lub eskalowane.\n\n" +
"## Klasyfikacja awarii CI\n\n| Klasyfikacja | Odpowiedź |\n| --- | --- |\n" +
"| \`CODE_FAILURE\` | Napraw implementację |\n" +
"| \`TEST_FAILURE\` | Napraw test lub eskaluj konflikt specyfikacji |\n" +
"| \`INFRA_FAILURE\` | Kontrolowane ponowienie z zebranymi dowodami |\n" +
"| \`FLAKY_SUSPECTED\` | Reprodukuj w czystym środowisku i zdiagnozuj |\n" +
"| \`UNKNOWN_FAILURE\` | Zablokuj i eskaluj |\n\n" +
"BASE dopuszcza maksymalnie **dwa** kontrolowane ponowienia. Ślepe ponawianie aż do zielonego wyniku jest zabronione.\n\n" +
"## Gotowość do merge\n\nKońcowy raport używa \`READY_FOR_MERGE\` lub \`BLOCKED\`. Domyślną strategią jest jeden logiczny squash commit na PR.\n";

P["design-arch-enforcement"] = "# Architecture enforcement\n\n<span class=\"badge approved\">Approved</span>\n\n" +
"## Cel\n\nUtrzymać przewidywalne granice domen i warstw przy wysokiej przepustowości agentów, bez narzucania każdego lokalnego wyboru implementacyjnego.\n\n" +
"## Katalog uniwersalnych invariantów\n\n| ID | Intencja |\n| --- | --- |\n" +
"| \`ARCH-001\` | Zależności warstw podążają za zatwierdzonym kierunkiem |\n" +
"| \`ARCH-002\` | Dostęp cross-domain używa publicznej granicy |\n" +
"| \`ARCH-003\` | Graf zależności nie zawiera zabronionego cyklu |\n" +
"| \`BOUNDARY-001\` | Zewnętrzne wartości są parsowane i walidowane |\n" +
"| \`CONFIG-001\` | Konfiguracja jest sparsowana, typowana i scentralizowana |\n" +
"| \`LOG-001\` | Logi operacyjne są strukturalne |\n" +
"| \`LOG-002\` | Logi niosą wymagany kontekst korelacji i redagują wrażliwe dane |\n" +
"| \`NAME-001\` | Nazwy ujawniają intencję, typ, tożsamość i jednostki |\n" +
"| \`DOC-001\` | Nazwane funkcje produkcyjne posiadają wymaganą dokumentację kontraktu |\n" +
"| \`SIZE-001\` | Pliki i moduły pozostają w granicach czytelności zdefiniowanych przez profil |\n" +
"| \`ERROR-001\` | Semantyka błędów jest jawna i spójna |\n" +
"| \`SIDEFX-001\` | Efekty uboczne występują na widocznych, kontrolowanych granicach |\n" +
"| \`TEST-001\` | Istotne zmiany zachowania mają ochronę regresyjną |\n" +
"| \`RELIABILITY-001\` | Obecne są wymagane reguły timeout, retry i idempotencji |\n" +
"| \`RELIABILITY-002\` | Krytyczne operacje eksponują wymagane zdrowie i telemetrię |\n" +
"| \`ABSTRACTION-001\` | Współdzielone abstrakcje rozwiązują udowodnione powtarzające się zachowanie lub sprzężenie |\n" +
"| \`CLEAN-001\` | Martwy, zduplikowany lub wygasły kod nie kumuluje się |\n" +
"| \`HARNESS-001\` | Agenci nie mogą obchodzić, osłabiać ani modyfikować wymaganych kontroli |\n\n" +
"## Tryby sprawdzania\n\n\`harness check --fast\` uruchamia się po spójnej partii edycji i celuje w runtime projektu referencyjnego nie dłuższy niż 30 sekund. \`harness check --full\` uruchamia się przed review, CI i merge, obejmując wszystkie istotne testy, porównania generowane, Docs i walidację strukturalną.\n\n" +
"## Bramka jakości reguł\n\nKażda nowa lub zmodyfikowana reguła wymaga: co najmniej jednego fixture'a pozytywnego, jednego negatywnego, zademonstrowanej detekcji, zademonstrowanego braku znanego false positive, czytelnego tekstu błędu, akceptowalnej wydajności i jawnego zakresu oraz obsługi wyjątków.\n\n" +
"## Chronione zmiany\n\nAgent nie może usunąć testu strukturalnego, osłabić asercji, stłumić błędu ani edytować CI, by obejść awarię. Normatywna zmiana architektoniczna wymaga zatwierdzenia człowieka i PR zawierającego zaktualizowany Design Doc, \`ARCHITECTURE.md\`, implementację, regułę, fixtures, migrację i dowody.\n";

P["design-worktree-observability"] = "# Worktree and observability\n\n<span class=\"badge approved\">Approved</span>\n\n" +
"## Środowisko worktree\n\n\`harness env up\` provisionuje, a \`harness env down\` bezpiecznie usuwa zasoby oznaczone dokładnym identyfikatorem worktree. \`harness env status\` raportuje ich zdrowie i szczegóły połączenia bez ujawniania sekretów.\n\n" +
"## Priorytet izolacji bazy danych\n\n1. dedykowana ephemeral instancja usługi bazy danych;\n2. osobna baza na współdzielonym lokalnym serwerze;\n3. osobny schemat tylko wtedy, gdy poprzednie opcje są niepraktyczne.\n\n" +
"## Kontrolery runtime\n\n| Forma systemu | Wymagany kontroler i dowody |\n| --- | --- |\n" +
"| Web frontend | Cursor Browser, DOM snapshots, screenshots, konsola i sieć |\n" +
"| API | Klient HTTP, asercje kontraktu, logi i trace'y |\n" +
"| Worker | Fixtures kolejki, stan zadania, dowody efektów ubocznych i trace'y |\n" +
"| System agentowy | Konwersacje, ewaluacje, trace'y modelu i narzędzi, limity kroków |\n" +
"| Mobile | Kontroler emulatora/urządzenia, screenshots, logi i sieć |\n\n" +
"## Topologia lokalnej obserwowalności\n\n```mermaid\nflowchart TD\n    App[\"Isolated application\"] --> Vector[\"Vector\"]\n    Vector --> Logs[\"VictoriaLogs\"]\n    Vector --> Metrics[\"VictoriaMetrics\"]\n    Vector --> Traces[\"VictoriaTraces\"]\n    Agent[\"Cursor agent\"] --> Logs\n    Agent --> Metrics\n    Agent --> Traces\n```\n\n" +
"## Kontrakt korelacji\n\n```text\nworktreeId\nenvironment\nrelease\ntraceId\nrequestId\ndomain\noperation\n```\n\n" +
"## Jeden kontrakt instrumentacji\n\nKod aplikacji emituje jeden semantyczny model instrumentacji przez centralnego providera. Konfiguracja środowiska wybiera eksportery: lokalny development kieruje szczegółową telemetrię przez Vector i Victoria; produkcja kieruje wyselekcjonowane błędy, trace'y i sygnały wydajności do Sentry.\n\n" +
"## Bramka referencyjna\n\nBramka profilu uruchamia dwa worktree jednocześnie i dowodzi odrębnych portów, stanu bazy danych, telemetrii, stanu aplikacji i artefaktów. Przerywa i wznawia jedno środowisko, usuwa oba i dowodzi, że żadne nie zmodyfikowało drugiego ani żadnego współdzielonego zasobu.\n";

P["design-release-autonomy"] = "# Release and autonomy\n\n<span class=\"badge approved\">Approved</span>\n\n" +
"## Progresja środowisk\n\n```mermaid\nflowchart TD\n    Local[\"Isolated local worktree\"] --> PR[\"Pull request\"]\n    PR --> Main[\"main\"]\n    Main --> Staging[\"Staging\"]\n    Staging --> Gate{\"Production policy gate\"}\n    Gate -->|Allowed| Production[\"Production\"]\n    Gate -->|Blocked| Repair[\"New repair worktree\"]\n```\n\n" +
"## Niezmienny artefakt\n\nCommit na \`main\` jest budowany raz. Wynikowy zidentyfikowany i skontrolowany sumą kontrolną artefakt jest wdrażany na staging, a te same bajty są promowane na produkcję.\n\n" +
"## Stany release'u\n\n```text\nCREATED\nSTAGING_DEPLOYED\nSTAGING_VERIFIED\nPRODUCTION_READY\nCANARY\nOBSERVING\nROLLING_OUT\nPRODUCTION_VERIFIED\n```\n\nWyjątkowe stany: \`ROLLOUT_PAUSED\`, \`ROLLBACK_RUNNING\`, \`ROLLED_BACK\`, \`RELEASE_FAILED\`, \`HUMAN_JUDGMENT_REQUIRED\`.\n\n" +
"## Kolejność recovery\n\n1. zatrzymaj ekspansję ruchu;\n2. zachowaj dowody;\n3. przywróć ostatni zweryfikowany artefakt;\n4. zweryfikuj recovery;\n5. otwórz lub zaktualizuj incydent;\n6. zdiagnozuj w nowym izolowanym worktree;\n7. dodaj odtwarzający test regresyjny;\n8. dostarcz normalny, przeglądnięty PR i nowy release.\n\n" +
"## Model uprawnień produkcyjnych\n\nAgenci wywołują wąskie, audytowane operacje pipeline'u: deploy zweryfikowanego artefaktu, pauza lub wznowienie rollout, rollback do zweryfikowanego celu, uruchomienie smoke testów, uruchomienie zatwierdzonej migracji lub zamrożenie autonomii. Nie otrzymują nieograniczonego SSH, długożyjących poświadczeń, zdolności odczytu sekretów ani bezpośredniego zapisu do bazy produkcyjnej.\n\n" +
"## Wymiary autonomii\n\nZatwierdzenie planu, merge, deployment staging, deployment produkcyjny, rollback i odpowiedź na incydent są niezależnymi zdolnościami.\n\n" +
"## Domyślne progi promocji\n\n- **A1 → A2:** co najmniej 10 kolejnych kwalifikujących się PR-ów, wszystkie wymagane bramki przeszły, brak krytycznej regresji, obejścia lub dryfu dokumentacji, zatwierdzenie niezależnego ewaluatora.\n" +
"- **A2 → A3:** co najmniej 5 ręcznie zatwierdzonych releasów produkcyjnych, działający staging, korelacja Sentry, ćwiczenie zatrzymania rollout, ćwiczenie rollback, brak SEV-1/SEV-2 spowodowanego przez agenta.\n" +
"- **A3 → A4:** co najmniej 20 autonomicznych releasów przez co najmniej 30 dni, kompletna obserwowalność, poprawna eskalacja i rollback, brak obejścia polityki, ćwiczenie incydentu, niezależny audyt próbki.\n\n" +
"## Automatyczny downgrade\n\nOchronny downgrade jest natychmiastowy. SEV-1, obejście polityki, utrata integralności danych, nieudany rollback, niedostępny monitoring, nieprawidłowa proweniencja artefaktu lub próba samodzielnego przyznania sobie uprawnień przez agenta wyzwala \`AUTONOMY_FREEZE\`.\n";

P["design-entropy-maintenance"] = "# Entropy and maintenance\n\n<span class=\"badge approved\">Approved</span>\n\n" +
"## Kadencja konserwacji\n\n- Lint i testy strukturalne na poziomie PR — przy każdej zmianie.\n" +
"- Standardowy skan repozytorium — cotygodniowo.\n" +
"- Głęboki skan — po każdych 20 scalonych PR-ach.\n" +
"- Ukierunkowany skan — po istotnym incydencie.\n" +
"- Ponowna ewaluacja grafu zależności — po zmianie architektonicznej.\n\n" +
"## Sześć automatyzacji\n\n| Automation | Odpowiedzialność |\n| --- | --- |\n" +
"| Doc Gardener | Linki, indeksy, statusy, diagramy, wygenerowane Docs i dryf kod/dokument |\n" +
"| Architecture Gardener | Granice domen, kierunek warstw, cykle, zduplikowane kontrakty, wygasłe wyjątki |\n" +
"| Quality Auditor | Niezależny przegląd dowodów i aktualizacje \`QUALITY_SCORE.md\` |\n" +
"| Test Flake Gardener | Diagnoza źródłowej przyczyny i trwała naprawa potwierdzonych flaky testów |\n" +
"| Incident Learner | Zamiana przyczyn produkcyjnych w testy, linty, invarianty, telemetrię lub bramki release'u |\n" +
"| Autonomy Evaluator | Rekomendacja promocji, downgrade'u lub zamrożenia z obiektywnych dowodów |\n\n" +
"## Ograniczone PR-y\n\nGardening produkuje jeden mały PR dla jednego udowodnionego problemu w jednym ograniczonym obszarze. Nie wykonuje szerokich estetycznych przepisań ani spekulacyjnej abstrakcji.\n\n" +
"## Granica normatywna\n\nAgenci mogą mechanicznie naprawiać linki, indeksy, generowaną zawartość, formatowanie, martwe importy i opisy jednoznacznie udowodnione przez kod. Muszą eskalować zmianę celu produktu, zmianę zachowania publicznego, nową granicę domeny, zmianę Golden Principle, konflikt między zatwierdzonymi dokumentami, redukcję bezpieczeństwa, stały wyjątek lub promocję autonomii.\n\n" +
"## Idempotencja\n\nPo czyszczeniu natychmiastowe ponowne uruchomienie nie produkuje wykonalnego diffa. Naprzemienne lub powtarzane przepisania wskazują na niestabilną regułę i blokują auto-merge konserwacji.\n";

/* ============================================================ GOVERNANCE ============================================================ */

P["gov-reliability"] = "# Reliability\n\n<span class=\"badge approved\">Approved</span>\n\n" +
"## Cel niezawodności\n\nKażda operacja, która może się nie powieść, musi eksponować wystarczający stan, by agent mógł wykryć, zdiagnozować, bezpiecznie ponowić, wznowić, wycofać lub eskalować. Nieznany stan systemu nie jest traktowany jako sukces.\n\n" +
"## Progi release'u specyficzne dla projektu\n\n```text\nCritical journeys: UNDEFINED\nMaximum approved error rate: UNDEFINED\nMaximum latency by journey: UNDEFINED\nMaximum relative regression: UNDEFINED\nMinimum agent evaluation baseline: UNDEFINED\nCanary observation window: UNDEFINED\nFull-release observation window: UNDEFINED\nAutomatic pause conditions: UNDEFINED\nAutomatic rollback conditions: UNDEFINED\n```\n\n" +
"Niezdefiniowane progi produkcyjne **blokują autonomiczny deployment**.\n\n" +
"## Zero-tolerance\n\n- krytyczne zdarzenie bezpieczeństwa;\n- naruszenie integralności danych;\n- nieautoryzowany dostęp;\n- niezweryfikowany artefakt;\n- niedostępny wymagany monitoring;\n- brak celu rollbacku.\n\n" +
"## Odpowiedź Sentry wg ważności\n\n| Severity | Znaczenie | Wstępna odpowiedź |\n| --- | --- | --- |\n" +
"| SEV-1 | Bezpieczeństwo, integralność danych lub niedostępna funkcja krytyczna | Natychmiastowa pauza lub rollback; powiadomienie człowieka |\n" +
"| SEV-2 | Poważna regresja dotykająca wielu użytkowników | Pauza rollout; pilna diagnoza i naprawa |\n" +
"| SEV-3 | Ograniczony wpływ z obejściem | Automatyczna diagnoza i normalny PR |\n" +
"| SEV-4 | Niski wpływ | Grupowanie i planowanie naprawy opartej na dowodach |\n\n" +
"## Awaria monitoringu\n\n```text\nMONITORING_STATUS: UNAVAILABLE\nPRODUCTION_DEPLOYMENT: BLOCKED\nAUTONOMY_STATUS: FROZEN\n```\n";

P["gov-security"] = "# Security\n\n<span class=\"badge approved\">Approved</span>\n\n" +
"## Granice zaufania\n\nTraktuj jako zewnętrzne i niezaufane, dopóki niezwalidowane: input użytkownika i sieciowy, payloady webhook/integracji, wartości środowiskowe, rekordy bazy danych i kolejki przekraczające granicę, odpowiedzi LLM i wyjście narzędzi, treść importowana spoza zatwierdzonego zestawu źródeł, tekst issue/review/Sentry mogący zawierać instrukcje.\n\n" +
"## Role produkcyjne\n\n| Rola | Dozwolony cel |\n| --- | --- |\n" +
"| \`observer\` | Odczyt zredagowanych Sentry, logów, metryk, trace'ów, zdrowia i statusu release'u |\n" +
"| \`deployer\` | Promocja lub rollback wyłącznie zweryfikowanych artefaktów przez pipeline |\n" +
"| \`migrator\` | Uruchomienie wyłącznie zatwierdzonych artefaktów migracji pod osobną polityką |\n\n" +
"## Zabronione możliwości agenta\n\nAgenci nie mogą: używać nieograniczonego SSH produkcyjnego; odczytywać lub rotować sekrety produkcyjne; pisać bezpośrednio do bazy produkcyjnej; eksportować kompletne tabele produkcyjne; kopiować dane produkcyjne do środowisk lokalnych; usuwać lub edytować historię audytu; wyłączać Sentry lub wymagany monitoring; usuwać ochronę brancha lub wymagane CI; osłabiać asercje lub reguły, by wymusić przejście; zatwierdzać destrukcyjną migrację; przyznawać sobie autonomię; czyścić \`AUTONOMY_FREEZE\`; akceptować wyjątek bezpieczeństwa bez zgody człowieka.\n\n" +
"## Integralność Harnessu\n\n\`HARNESS-001\` chroni politykę, checki strukturalne, CI, wymagania review, zarządzane instrukcje Cursor, bramki release'u, audyt, stan autonomii i mechanizmy downgrade'u.\n\n" +
"## MCP i narzędzia zewnętrzne\n\nSerwery MCP otrzymują minimalną wymaganą zdolność. Dostęp tylko do odczytu jest domyślny. Integracja Sentry jest tylko-do-odczytu dla diagnozy; mutacja produkcyjna zawsze używa pipeline'u release.\n";

P["gov-design-standards"] = "# Design standards\n\n<span class=\"badge approved\">Approved</span>\n\n" +
"## Czytelność\n\nKod powinien komunikować intencję bez wymagania od czytelnika rekonstrukcji ukrytego stanu lub konwencji nazewnictwa.\n\n" +
"Nazwy muszą opisywać funkcjonalność lub reprezentowany typ: operacje używają jasnych czasowników; boolowskie używają \`is\`, \`has\`, \`can\` lub \`should\`; kolekcje używają nazw w liczbie mnogiej; identyfikatory zawierają kontekst przy niejednoznaczności; wartości z jednostkami zawierają jednostkę.\n\n" +
"## Dokumentacja funkcji\n\nKażda nazwana funkcja produkcyjna ma czytelną dla człowieka dokumentację kontraktu wyjaśniającą: cel, wejścia, wyjście, błędy, efekty uboczne, ważne invarianty.\n\n" +
"## Abstrakcje i wzorce\n\nUżyj wzorca projektowego lub abstrakcji, gdy rozwiązuje udowodniony problem sprzężenia, granic, testowania, powtarzalnego zachowania lub centralizacji invariantu. Unikaj spekulacyjnych punktów rozszerzeń, interfejsów jednorazowego użytku bez powodu granicznego i generycznych helperów zacierających znaczenie domenowe.\n\n" +
"## Diagramy\n\nUżyj Mermaid wewnątrz istniejących dokumentów Markdown, gdy relacja, sekwencja, topologia, maszyna stanów lub granica jest istotnie jaśniejsza wizualnie. Zmiana granic systemu, zależności, komunikacji komponentów, topologii deploymentu lub krytycznego przepływu danych wymaga aktualizacji odpowiedniego diagramu w tym samym PR.\n\n" +
"## Bar review\n\nPoprawne, utrzymywalne, testowalne i czytelne wyjście, spełniające zatwierdzone invarianty, przechodzi. Osobiste preferencje stylistyczne niezakodowane jako zatwierdzona reguła nie blokują zmiany.\n";

P["gov-product-sense"] = "# Product sense\n\n<span class=\"badge approved\">Approved</span>\n\n" +
"## Zasada produktowa\n\nHarness istnieje, by maksymalizować zweryfikowaną przepustowość inżynieryjną, zachowując ludzką kontrolę nad intencją i osądem.\n\n" +
"## Hierarchia decyzji\n\nGdy pojawiają się kompromisy, preferuj w tej kolejności:\n\n" +
"1. bezpieczeństwo użytkownika i danych;\n" +
"2. poprawność i powtarzalność;\n" +
"3. czytelność dla przyszłych agentów i ludzi;\n" +
"4. obserwowalność i możliwość recovery;\n" +
"5. utrzymywalność;\n" +
"6. zweryfikowaną szybkość dostawy;\n" +
"7. wygodę implementacji.\n\n" +
"> Szybkość bez dowodów nie jest przepustowością. Złożone zabezpieczenie bez udowodnionego ryzyka nie jest automatycznie jakością.\n\n" +
"## Dyscyplina zakresu\n\nBuduj minimalny kompletny system wymagany przez zatwierdzone Docs. Nie dodawaj nieużywanych warstw, spekulacyjnych abstrakcji wieloprojektowych, niezamówionych integracji ani przyszłościowych możliwości bez konkretnego bieżącego wymagania.\n\n" +
"## Wierność OpenAI\n\nZachowaj publicznie udokumentowaną strukturę i zasady OpenAI Harness Engineering. Jasno oznacz rekonstrukcję techniczną, adaptację Cursor i rozszerzenia SellGenius. Nie twierdź dostępu do niepublikowanych wewnętrznych szczegółów OpenAI.\n";

P["gov-frontend"] = "# Frontend\n\n<span class=\"badge notapplicable\">Not applicable</span>\n\n" +
"## Bieżący zakres\n\nCentralny Harness Blueprint V1 jest CLI, zestawem pakietów, szablonem repozytorium i systemem automatyzacji. **Nie ma produktowego frontendu** i dlatego nie tworzy warstwy UI ani pustej aplikacji frontendowej.\n\n" +
"## Wygenerowane projekty\n\nGdy zatwierdzone Docs projektu wymagają frontendu, rozwiązany Stack Profile dodaje odpowiednią capability frontendową i aktualizuje ten dokument o kontrakt specyficzny dla projektu. Ta capability musi dostarczyć:\n\n" +
"- kryteria akceptacji zorientowane na użytkownika;\n" +
"- kontrolę rzeczywistej przeglądarki lub platformy;\n" +
"- DOM snapshots i screenshots tam, gdzie ma to zastosowanie;\n" +
"- inspekcję konsoli i sieci;\n" +
"- sprawdzenia dostępności i responsywności odpowiednie dla produktu;\n" +
"- dowody przed/po dla zmian behawioralnych;\n" +
"- invarianty strukturalne i jakościowe specyficzne dla frontendu.\n\n" +
"Cursor Browser jest używany tylko wtedy, gdy istnieje web frontend.\n";

P["gov-quality-score"] = "# Quality score\n\n<span class=\"badge approved\">Approved</span>\n\n" +
"## Skala\n\n| Ocena | Znaczenie |\n| --- | --- |\n" +
"| A | Silne, mechanicznie egzekwowane kontrole z bieżącym kompletem dowodów |\n" +
"| B | Dobre kontrole z małymi, jawnymi, niekrytycznymi lukami |\n" +
"| C | Funkcjonalne, ale brakuje ważnych kontroli lub dowodów |\n" +
"| D | Znaczące ryzyko lub powtarzające się odstępstwo |\n" +
"| F | Niebezpieczne lub poniżej minimalnego wymaganego standardu |\n" +
"| N/A | Obszar jest celowo nieobecny |\n" +
"| UNVERIFIED | Dowody są niewystarczające, by przypisać ocenę |\n\n" +
"## Bieżąca ocena Blueprintu\n\nBlueprint ma zatwierdzone Docs, ale brak dowodów implementacji. Dlatego wszystkie obszary związane z implementacją pozostają \`UNVERIFIED\`.\n\n" +
"| Obszar | Ocena | Blokująca luka |\n| --- | --- | --- |\n" +
"| Wiedza repozytorium | UNVERIFIED | Linter Docs i bramka mapowania niezaimplementowane |\n" +
"| CLI i Universal Core | UNVERIFIED | Brak wykonywalnej implementacji lub testów (poza M1) |\n" +
"| Profile SDK | UNVERIFIED | Brak fixtures kompatybilności |\n" +
"| Profil TypeScript Node | UNVERIFIED | Brak scaffoldu referencyjnego |\n" +
"| Egzekwowanie architektury | UNVERIFIED | Brak lintów lub testów strukturalnych |\n" +
"| Izolacja worktree | UNVERIFIED | Bramka dwóch worktree niewykonana |\n" +
"| Lokalna obserwowalność | UNVERIFIED | Stos Vector/Victoria niewykonany |\n" +
"| Review i CI | UNVERIFIED | Brak referencyjnej bramki PR end-to-end |\n" +
"| Release i rollback | UNVERIFIED | Brak ćwiczenia staging lub rollback |\n" +
"| Bezpieczeństwo i uprawnienia | UNVERIFIED | Brak testów granic uprawnień |\n" +
"| Automatyzacja konserwacji | UNVERIFIED | Brak bramki entropii |\n\n" +
"## Krytyczne limity\n\n- Security F sprawia, że dotknięty obszar to F.\n" +
"- Data Integrity F sprawia, że dotknięty obszar to F.\n" +
"- Brak krytycznych testów regresyjnych ogranicza obszar do C.\n" +
"- Brak obserwowalności produkcyjnej ogranicza obszar produkcyjny do C.\n" +
"- Nietestowany rollback ogranicza obszar wdrażalny do C.\n\n" +
"## Gotowość autonomii\n\n```text\nCurrent level: A0 / design state\nPLAN: HUMAN_APPROVAL\nMERGE: HUMAN_APPROVAL\nSTAGING: DISABLED\nPRODUCTION: DISABLED\nROLLBACK: DISABLED\nINCIDENT_RESPONSE: DISABLED\nAUTONOMY_PROMOTION: BLOCKED\n```\n";

P["gov-plans"] = "# Plans & ExecPlans\n\n<span class=\"badge approved\">Approved</span>\n\n" +
"## Cel\n\nExecPlan jest samowystarczalnym, żywym dokumentem wykonawczym dla pracy, której nie można bezpiecznie ukończyć na podstawie krótkiej efemerycznej checklisty.\n\n" +
"## Kiedy wymagany jest ExecPlan\n\n- wiele zależnych milestone'ów;\n- praca może zająć godziny lub być przekazywana między agentami;\n- zmienia się kilka modułów, domen, aplikacji lub elementów infrastruktury;\n- zmiany publicznego API, schematu, migracji, bezpieczeństwa, niezawodności lub architektury;\n- istotny refaktor lub trudny rollback;\n- oczekiwane odkrycia wynikające z niepewności implementacyjnej;\n- niepoprawne wykonanie mogłoby mieć szeroki lub nieodwracalny wpływ.\n\n" +
"## Wymagana struktura\n\n1. Purpose / Big Picture\n2. Progress\n3. Surprises & Discoveries\n4. Decision Log\n5. Outcomes & Retrospective\n6. Context and Orientation\n7. Plan of Work\n8. Concrete Steps\n9. Validation and Acceptance\n10. Idempotence and Recovery\n11. Artifacts and Notes\n12. Interfaces and Dependencies\n\n" +
"## Wyjaśnienie poszczególnych sekcji\n\n" +
"### 1. Purpose / Big Picture\n\nOpisuje efekt z perspektywy użytkownika lub systemu, a nie samą listę zadań do wykonania. Najpierw określamy obserwowalne zachowanie, dopiero później kod.\n\n" +
"Słabo: *„Dodać InvariantCatalog”*.\n\n" +
"Lepiej: *„Po tej zmianie wszystkie invarianty architektoniczne będą miały jeden typowany katalog. CLI, testy i agenci będą korzystać z tych samych identyfikatorów, eliminując rozbieżności między dokumentacją a implementacją.”*\n\n" +
"### 2. Progress\n\nAktualny, żywy stan pracy jako checklista, aktualizowana po każdym istotnym okresie pracy:\n\n```text\n- [x] Zdefiniowano InvariantId.\n- [x] Dodano katalog 18 invariantów.\n- [ ] Dodano test duplikatów.\n- [ ] Dodano eksport publiczny.\n```\n\nKażdy punkt zatrzymania musi zostać zapisany — dzięki temu następny agent nie rekonstruuje stanu z Git diffu.\n\n" +
"### 3. Surprises & Discoveries\n\nNieoczekiwane fakty o repozytorium, zachowaniu narzędzi, ograniczeniach, wydajności lub obalone założenia — zawsze z dowodem i konsekwencją:\n\n```text\nObservation: INVARIANT_IDS było sortowane tylko w teście, ale nie w runtime.\nEvidence: Test snapshot zwracał inną kolejność na dwóch środowiskach.\n```\n\nTa sekcja chroni przed powtórnym odkrywaniem tego samego problemu.\n\n" +
"### 4. Decision Log\n\nKażda decyzja implementacyjna wraz z uzasadnieniem, dowodem, wymaganą zgodą i datą:\n\n```text\nDecision: InvariantId będzie union type, a nie enum.\nRationale: Union nie generuje runtime object i może zostać wyprowadzony\n  bezpośrednio z readonly katalogu.\nDate/Author: 2026-07-23 / Codex\n```\n\nDzięki temu widać nie tylko co agent zrobił, ale dlaczego.\n\n" +
"### 5. Outcomes & Retrospective\n\nPo zakończeniu porównaj wynik z pierwotnym celem: co dowieziono, czego nie, jaki jest dowód, co pozostało w długu technicznym.\n\n```text\nCel: jedno źródło prawdy dla invariantów\nWynik: 18 invariantów zarejestrowanych, eksportowanych i walidowanych\nPozostało: integracja katalogu z CLI w M2\n```\n\n" +
"### 6. Context and Orientation\n\nWyjaśnia strukturę repozytorium osobie, która nic o nim nie wie — z dokładnymi ścieżkami i zależnościami, nie ogólnikami typu „zmień core”:\n\n```text\npackages/core/src/invariants.ts\n    definiuje identyfikatory invariantów\n\npackages/core/src/index.ts\n    publiczna granica pakietu\n\npackages/core/test/invariants.test.ts\n    testuje integralność katalogu\n```\n\n" +
"### 7. Plan of Work\n\nNarracyjna kolejność zmian, milestone po milestone: *„Najpierw utworzyć typ InvariantId i katalog. Następnie wyprowadzić tablicę identyfikatorów. Potem dodać boundary parser \\`isInvariantId\\`. Na końcu dodać testy integralności i publiczne eksporty.”*\n\n" +
"### 8. Concrete Steps\n\nDokładne polecenia do uruchomienia wraz z oczekiwanym rezultatem:\n\n```bash\npnpm --filter @blueprint-harness/core test\npnpm -r build\npnpm -r test\n```\n\n```text\nExpected: 23 tests passed\nrecursive build exit code 0\nrecursive test exit code 0\n```\n\n" +
"### 9. Validation and Acceptance\n\nJedna z najważniejszych sekcji — akceptacja dotyczy obserwowalnego zachowania, nie samego istnienia kodu.\n\n" +
"Słabo: *„Dodano funkcję isInvariantId.”*\n\n" +
"Dobrze: *„\\`isInvariantId(\"ARCH-001\")\\` zwraca \\`true\\`. \\`isInvariantId(\"UNKNOWN\")\\` zwraca \\`false\\`. Każdy identyfikator z \\`INVARIANT_IDS\\` istnieje dokładnie raz.”*\n\n" +
"Kompilacja nie jest wystarczającym dowodem — plan musi pokazać działające zachowanie: test, wywołanie CLI albo odpowiedź HTTP.\n\n" +
"### 10. Idempotence and Recovery\n\nAgent musi wiedzieć, co zrobić po częściowej awarii — np. że ponowne uruchomienie generatora nie może utworzyć duplikatów, oraz jak wrócić do spójnego stanu:\n\n```text\nJeżeli build przerwie się po wygenerowaniu pliku:\n1. sprawdź git diff,\n2. usuń niekompletny artefakt,\n3. uruchom generator ponownie,\n4. uruchom pełną walidację.\n```\n\nSzczególnie ważne przy migracjach baz danych, generatorach kodu, zmianach schematu i procesach wieloetapowych.\n\n" +
"### 11. Artifacts and Notes\n\nZwięzłe odnośniki do logów, wyników testów, zrzutów ekranu, trace'ów, schematów, PR-ów i identyfikatorów release'ów — bez wklejania nieograniczonego outputu lub sekretów.\n\n" +
"### 12. Interfaces and Dependencies\n\nPubliczne kontrakty, operacje domenowe, eventy, schematy, dostawcy, usługi zewnętrzne, wersje pakietów, założenia kompatybilności i kierunek zależności, których dotyczy praca.\n\n" +
"## Czym są milestones\n\nMilestone to niezależnie weryfikowalny przyrost działającego systemu — nie jest to tylko grupa tasków.\n\n```text\nMilestone = cel + implementacja + rezultat + dowód działania\n```\n\n**Przykład — M1 Core contracts:**\n\n" +
"- **Cel:** utworzyć wspólny język danych dla wszystkich kolejnych modułów.\n" +
"- **Rezultat:** \\`InvariantId\\`, \\`ValidationResult\\`, \\`AuditEvent\\` i \\`Checkpoint\\` istnieją jako stabilne kontrakty.\n" +
"- **Dowód:** testy pakietu przechodzą, publiczne eksporty są dostępne, a niepoprawne dane są odrzucane na granicy systemu.\n\n" +
"Każdy milestone powinien być samodzielnie testowalny i przybliżać system do końcowego celu.\n\n" +
"## Jak agent wykonuje ExecPlan\n\n" +
"1. Agent czyta \\`AGENTS.md\\`.\n" +
"2. Rozpoznaje, że zadanie jest złożone.\n" +
"3. Czyta całe \\`PLANS.md\\`.\n" +
"4. Bada repozytorium.\n" +
"5. Tworzy konkretny ExecPlan.\n" +
"6. Implementuje pierwszy milestone.\n" +
"7. Uruchamia testy.\n" +
"8. Aktualizuje Progress.\n" +
"9. Zapisuje odkrycia i decyzje.\n" +
"10. Przechodzi do następnego milestone.\n" +
"11. Powtarza aż do spełnienia acceptance criteria.\n" +
"12. Uzupełnia retrospective.\n\n" +
"## Protokół istotnej zmiany\n\nAgent może aktualizować szczegóły techniczne i zapisywać powód. Zatrzymuje się przed kontynuacją, gdy odkrycie zmieniłoby zachowanie użytkownika, zaakceptowany zakres, architekturę, publiczne API, semantykę schematu, postawę bezpieczeństwa, ryzyko migracji, zewnętrznego dostawcę lub akcję nieodwracalną.\n\n" +
"## Bramka zamknięcia\n\nNie zamykaj planu, dopóki nie istnieją: dowody akceptacji, wymagane testy, bieżące Docs, czyste review, zielone CI, walidacja runtime i rezultaty. Plan nie może ukrywać niespełnionej akceptacji, bezpieczeństwa lub pracy nad integralnością danych w długu technicznym.\n";

/* ============================================================ STATUS ============================================================ */

P["status-execplan"] = "# Postęp ExecPlan: build-harness-blueprint-v1\n\n<span class=\"badge in-progress\">In progress</span>\n\n" +
"Plan: \`docs/exec-plans/active/build-harness-blueprint-v1.md\` — Status: **ACTIVE**. Cel: dostarczyć Harness Blueprint V1 z bramką końcową \`HARNESS_BLUEPRINT_V1_GATE\`.\n\n" +
"## Sukces jest obserwowalny, gdy\n\n1. Monorepo Blueprintu buduje się, testuje i przechodzi \`harness check --full\` na \`main\`.\n" +
"2. Projekt referencyjny bootstrapuje się z zatwierdzonych Docs, przechodzi wszystkie bramki referencyjne, a drugi bootstrap nie produkuje niezamierzonego diffa.\n" +
"3. Finalny milestone emituje \`HARNESS_BLUEPRINT_V1_GATE: PASS\` z powiązanymi dowodami.\n" +
"4. Oceny w \`QUALITY_SCORE.md\` przechodzą z UNVERIFIED do udowodnionych ocen tam, gdzie istnieją kontrole.\n\n" +
"## Tabela milestone'ów\n\n| Milestone | Status | Notatki |\n| --- | --- | --- |\n" +
"| M0 Monorepo scaffold | ✅ Ukończony | pnpm workspace + 5 stubów pakietów; testy Vitest; PR #1 |\n" +
"| M1 Universal Core | ✅ Ukończony | Kontrakty Core w \`packages/core\`; 23 testy jednostkowe; PR #2 |\n" +
"| M2 Docs and ExecPlan validation | 🔶 Aktywny | Tylko Core; bez zależności od CLI |\n" +
"| M3 OpenAI Repository Template | ⬜ Pozostały | |\n" +
"| M4 Cursor adapter | ⬜ Pozostały | |\n" +
"| M5 Profile SDK | ⬜ Pozostały | |\n" +
"| M6 CLI foundation | ⬜ Pozostały | Otacza M2 \`validate-docs\` |\n" +
"| M7 Docs discovery, mapping, manifest | ⬜ Pozostały | |\n" +
"| M8 Bootstrap init (HARNESS_INSTALLED) | ⬜ Pozostały | Self-apply przy HARNESS_INSTALLED |\n" +
"| M9 TypeScript/Node profile + scaffold | ⬜ Pozostały | 3 wewnętrzne PR-y |\n" +
"| M10 Worktree and isolated environment | ⬜ Pozostały | |\n" +
"| M11 Architecture lints and structural tests | ⬜ Pozostały | |\n" +
"| M12 Review and CI workflow | ⬜ Pozostały | |\n" +
"| M13 Local observability stack | ⬜ Pozostały | Wymaga pinów wersji OD-003 |\n" +
"| M14 Release, rollback, recovery, autonomy | ⬜ Pozostały | 3 wewnętrzne PR-y |\n" +
"| M15 Upgrade Engine | ⬜ Pozostały | |\n" +
"| M16 Reference validation and V1 gate | ⬜ Pozostały | 3 wewnętrzne PR-y |\n\n" +
"**Aktywny milestone:** M2 — Docs and ExecPlan validation.\n\n" +
"## Kluczowe odkrycia\n\n- Repozytorium było wyłącznie dokumentacją (25 plików markdown) przed M0 — brak \`packages/\`, brak CLI, brak CI.\n" +
"- \`docs/exec-plans/active/\` nie istniał — ten plan utworzył pierwszy aktywny ExecPlan.\n" +
"- Wszystkie kanoniczne dokumenty są \`APPROVED\` / \`NOT_VERIFIED\` — implementacja musi produkować dowody weryfikacji.\n" +
"- \`pnpm\` na Windows wymagał instalacji globalnej npm z flagą \`NODE_OPTIONS=--use-system-ca\`.\n\n" +
"## Kluczowe decyzje (Decision Log — skrót)\n\n| ID | Decyzja | Status |\n| --- | --- | --- |\n" +
"| OD-002 | Docker Compose jako referencyjna platforma deploymentu kontenerowego V1 | RESOLVED |\n" +
"| OD-004 | Lokalny Supabase domyślny dla walidacji, CI i izolacji worktree | RESOLVED |\n" +
"| OD-006 | Blueprint self-applies podczas M8 przy HARNESS_INSTALLED | RESOLVED |\n" +
"| OD-007 | Kolejność kompozycji capabilities: base → NestJS → DB/Drizzle → Supabase → Mastra → observability | RESOLVED |\n" +
"| OD-009 | Logika walidacji w \`packages/core\`; \`packages/cli\` to tylko wrapper CLI | RESOLVED |\n" +
"| OD-001 | Scope npm \`@sellgenius/harness\` i polityka rejestru | DEFERRED — blokuje tylko publikację |\n" +
"| OD-003 | Wersje Vector/Victoria do przypięcia w M13 | DEFERRED — blokuje ukończenie M13 |\n";

P["status-packages"] = "# Pakiety kodu (packages/)\n\nMonorepo używa **pnpm workspaces** + **TypeScript** (moduły ESM) + **Vitest**. Każdy pakiet buduje się przez \`tsc\` do \`dist/\`.\n\n" +
"| Pakiet | Nazwa npm | Rola |\n| --- | --- | --- |\n" +
"| \`packages/core\` | \`@blueprint-harness/core\` | Universal Harness Core — invarianty, lifecycle, wyniki walidacji, ownership, policy, audit, checkpoint |\n" +
"| \`packages/cli\` | \`@blueprint-harness/cli\` | Harness CLI (obecnie stub tożsamości pakietu) |\n" +
"| \`packages/profile-sdk\` | \`@blueprint-harness/profile-sdk\` | Kontrakt SDK dla profili technologicznych |\n" +
"| \`packages/template-openai\` | \`@blueprint-harness/template-openai\` | Szablon struktury repozytorium OpenAI |\n" +
"| \`packages/profiles/typescript-node\` | \`@blueprint-harness/profiles-typescript-node\` | Pierwszy Stack Profile (TypeScript na Node.js) |\n\n" +
"## Universal Core — publiczne API (\`packages/core/src/index.ts\`)\n\n```typescript\nexport { packageIdentity } from \"./package-identity.js\";\n\nexport {\n  INVARIANT_CATALOG,\n  INVARIANT_COUNT,\n  INVARIANT_IDS,\n  isInvariantId,\n} from \"./invariants.js\";\n\nexport {\n  BOOTSTRAP_STATE_COUNT,\n  BOOTSTRAP_STATE_ORDER,\n  isBootstrapState,\n  isUpgradePhase,\n  isValidBootstrapTransition,\n} from \"./lifecycle.js\";\n\nexport {\n  ValidationResultParseError,\n  deserializeValidationResult,\n  hasBlockingFindings,\n  parseFinding,\n  serializeValidationResult,\n} from \"./validation-result.js\";\n\nexport {\n  createFileOwnershipMetadata,\n  isFileOwnershipClass,\n} from \"./ownership.js\";\n\nexport {\n  createDefaultPolicyEvaluator,\n} from \"./policy.js\";\n\nexport { createAuditEvent } from \"./audit.js\";\n\nexport {\n  canResumeFrom,\n  getResumeState,\n  recordCheckpoint,\n} from \"./checkpoint.js\";\n```\n\n" +
"Ten moduł koduje wprost pojęcia z Design Docs: katalog invariantów (\`ARCH-001\`…\`HARNESS-001\`), stan bootstrap (\`DISCOVERED\`…\`COMPLETE\`), schemat \`ValidationResult\`, klasy własności plików, poziomy polityki autonomii oraz zdarzenia audytu — technologicznie neutralnie, zgodnie z \`docs/design-docs/blueprint-architecture.md\`.\n\n" +
"## Stan testów (M1)\n\n\`pnpm --filter @blueprint-harness/core test\` → **23/23** testów przechodzi (patrz \`packages/core/src/index.test.ts\`).\n\n" +
"## Co dalej (M2+)\n\nWedług ExecPlanu, kolejne milestone'y dodadzą: walidację Docs i ExecPlan (M2), szablon OpenAI (M3), adapter Cursor (M4), Profile SDK (M5), fundament CLI (M6) — otaczający \`harness validate-docs\` z M2 bez zależności do finalnego CLI.\n";

/* ============================================================ REFERENCE ============================================================ */

P["ref-invariants"] = "# Katalog invariantów\n\nKażda reguła otrzymuje fixture pozytywny, negatywny, test detekcji, test false positive, komunikat naprawczy i kontrolę wydajności.\n\n" +
"| ID | Chroniony obszar |\n| --- | --- |\n" +
"| \`ARCH-001\` | Kierunek zależności warstw |\n" +
"| \`ARCH-002\` | Publiczne granice domen |\n" +
"| \`ARCH-003\` | Niedozwolone cykle |\n" +
"| \`BOUNDARY-001\` | Walidacja danych zewnętrznych |\n" +
"| \`CONFIG-001\` | Typowana i centralna konfiguracja |\n" +
"| \`LOG-001\` | Strukturalne logowanie |\n" +
"| \`LOG-002\` | Korelacja i redakcja danych |\n" +
"| \`NAME-001\` | Czytelne nazwy |\n" +
"| \`DOC-001\` | Dokumentacja nazwanych funkcji produkcyjnych |\n" +
"| \`SIZE-001\` | Limity czytelności plików i modułów |\n" +
"| \`ERROR-001\` | Jawne semantyki błędów |\n" +
"| \`SIDEFX-001\` | Widoczne i kontrolowane efekty uboczne |\n" +
"| \`TEST-001\` | Ochrona regresyjna zachowania |\n" +
"| \`RELIABILITY-001\` | Timeout, retry i idempotencja |\n" +
"| \`RELIABILITY-002\` | Health i telemetry krytycznych operacji |\n" +
"| \`ABSTRACTION-001\` | Abstrakcje rozwiązujące rzeczywisty problem |\n" +
"| \`CLEAN-001\` | Martwy kod, duplikaty i wygasłe wyjątki |\n" +
"| \`HARNESS-001\` | Zakaz obchodzenia Harnessu |\n";

P["ref-states"] = "# Statusy i stany\n\n## Statusy dokumentów\n\n| Status | Znaczenie |\n| --- | --- |\n" +
"| \`DRAFT\` | Nie jest jeszcze zatwierdzonym źródłem intencji |\n" +
"| \`APPROVED\` | Normatywny i wiążący aż do zastąpienia |\n" +
"| \`SUPERSEDED\` | Zachowany historycznie, powiązany z następcą |\n\n" +
"## Statusy implementacji (z podręcznika)\n\n| Status | Znaczenie |\n| --- | --- |\n" +
"| \`IMPLEMENTED\` | Mechanizm rzeczywiście istnieje i można go użyć |\n" +
"| \`IN_PROGRESS\` | Konfiguracja lub implementacja rozpoczęta, bramka niepotwierdzona |\n" +
"| \`APPROVED_NOT_IMPLEMENTED\` | Mechanizm zatwierdzony w Docs, lecz kod jeszcze nie istnieje |\n\n" +
"## Typowe stany operacyjne\n\n| Stan | Znaczenie |\n| --- | --- |\n" +
"| \`READY_FOR_MERGE\` | Wszystkie wymagane kontrole PR przeszły |\n" +
"| \`BLOCKED\` | Istnieje nierozwiązana obowiązkowa kontrola |\n" +
"| \`HUMAN_JUDGMENT_REQUIRED\` | Potrzebna jest decyzja człowieka |\n" +
"| \`REPRODUCTION_NOT_CONFIRMED\` | Agent nie odtworzył wiarygodnie problemu |\n" +
"| \`PRODUCTION_VERIFIED\` | Release przeszedł pełne okno obserwacji |\n" +
"| \`ROLLOUT_PAUSED\` | Zwiększanie ruchu zostało zatrzymane |\n" +
"| \`ROLLED_BACK\` | Przywrócono ostatni stabilny artefakt |\n" +
"| \`AUTONOMY_FREEZE\` | Automatyczny merge lub deployment został wyłączony |\n" +
"| \`PROMOTION_RECOMMENDED\` | Dowody pozwalają człowiekowi rozważyć promocję |\n" +
"| \`UNVERIFIED\` | Nie istnieją wystarczające dowody jakości |\n\n" +
"## Klasy migracji bazy danych\n\n| Klasa | Znaczenie |\n| --- | --- |\n" +
"| \`NONE\` | Brak zmiany schematu |\n" +
"| \`ADDITIVE\` | Kompatybilne dodanie |\n" +
"| \`TRANSFORMATIVE\` | Przekształcenie danych |\n" +
"| \`DESTRUCTIVE\` | Usunięcie danych lub struktury |\n";

P["ref-autonomy-levels"] = "# Poziomy autonomii A0–A4\n\n```mermaid\nstateDiagram-v2\n    [*] --> A0\n    A0 --> A1: Harness execution gates pass\n    A1 --> A2: 10 qualifying PRs plus approval\n    A2 --> A3: 5 manual releases plus recovery drills\n    A3 --> A4: 20 autonomous releases and 30 days\n    A4 --> FROZEN: critical failure or policy violation\n    A3 --> FROZEN: failed rollback or monitoring loss\n    A2 --> FROZEN: Harness bypass\n    FROZEN --> A0: human recovery approval\n```\n\n" +
"| Poziom | Zachowanie |\n| --- | --- |\n" +
"| \`A0 OBSERVE\` | Agent rekomenduje; człowiek zatwierdza plan, merge i produkcję |\n" +
"| \`A1 EXECUTE\` | Agent implementuje i przygotowuje czyste PR-y; człowiek zatwierdza merge i produkcję |\n" +
"| \`A2 AUTO_MERGE\` | Agent scala promowane klasy ryzyka; produkcja pozostaje manualna |\n" +
"| \`A3 AUTO_DEPLOY_SAFE\` | Agent wdraża promowane, odwracalne klasy niskiego ryzyka |\n" +
"| \`A4 POLICY_AUTONOMOUS\` | Agent działa end-to-end wewnątrz zatwierdzonej polityki i eskaluje osąd |\n\n" +
"## Wymagania jakości dla promocji\n\nAuto-merge wymaga, by dotknięty obszar miał co najmniej ocenę B, bez zmienionych powierzchni D, F lub UNVERIFIED. Bezpieczna autonomia produkcyjna wymaga oceny A dla Reliability, Security, Observability i Rollback. A4 wymaga również wszystkich krytycznych domen na poziomie co najmniej B oraz całej ścieżki release i recovery na poziomie A.\n\n" +
"## Bramka produkcyjna\n\nPrzed włączeniem autonomii produkcyjnej kontrolowane ćwiczenie referencyjne dowodzi: integralności artefaktu, staging, rollout, detekcji Sentry, automatycznej pauzy, rollback, worktree incydentu, naprawy regresji, granic uprawnień, audytu, zamrożenia przy utracie monitoringu i release'u naprawczego.\n";

P["ref-sources"] = "# Źródła i pochodzenie (provenance)\n\n" +
"| Etykieta | Znaczenie |\n| --- | --- |\n" +
"| \`OPENAI-CONFIRMED\` | Element opisany publicznie przez OpenAI |\n" +
"| \`RECONSTRUCTED\` | Nasza konkretna implementacja publicznej zasady |\n" +
"| \`CURSOR-ADAPTER\` | Adaptacja do funkcji Cursor |\n" +
"| \`SELLGENIUS-EXTENSION\` | Rozszerzenie, np. Sentry i polityka produkcyjna |\n\n" +
"Nie twierdzimy, że Mermaid, dokładne progi liczbowe, Sentry albo nazwy pakietów są nieopublikowanymi szczegółami wewnętrznego systemu OpenAI.\n\n" +
"## Linki źródłowe\n\n- [OpenAI Harness Engineering](https://openai.com/index/harness-engineering/)\n" +
"- [OpenAI Codex ExecPlans](https://developers.openai.com/cookbook/articles/codex_exec_plans)\n" +
"- [Cursor Rules](https://cursor.com/docs/rules)\n" +
"- [Cursor Worktrees](https://cursor.com/docs/configuration/worktrees)\n" +
"- [Cursor Browser](https://cursor.com/docs/agent/tools/browser)\n" +
"- [Cursor Bugbot](https://cursor.com/docs/bugbot)\n" +
"- [Cursor Subagents](https://cursor.com/docs/subagents)\n" +
"- [Cursor Automations](https://cursor.com/docs/cloud-agent/automations)\n" +
"- [Sentry Cursor integration](https://docs.sentry.io/integrations/coding-agents/cursor/)\n" +
"- [Sentry MCP](https://docs.sentry.io/product/sentry-mcp/)\n\n" +
"---\n\n" +
"Ta dokumentacja jest materiałem pomocniczym. Nie zmienia kanonicznej struktury Docs w repozytorium \`blueprint_harness\`. Normatywnym źródłem prawdy dla implementacji pozostają \`AGENTS.md\`, \`ARCHITECTURE.md\` i \`docs/\` w repozytorium.\n";
