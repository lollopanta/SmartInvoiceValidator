# Smart Invoice Validator – Frontend

Vue frontend for the **invoice validation** feature of the Smart Invoice Validator SaaS. It simulates the pre-submission validation UI of an electronic invoicing platform.

**Design:** The UI uses a modern Bootstrap-based design system with custom refinements for an intelligent invoicing experience. Cards, buttons, form controls, colors (primary `#1bad97`, text-main `#6d7791`), and spacing follow consistent UX patterns for financial applications.

---

## 1. Purpose of the UI

The interface lets users **validate invoice data before sending it** to the SDI (Sistema di Interscambio). They enter Partita IVA, imponibile, aliquota IVA and totale dichiarato, then trigger a check against the backend. The UI shows:

- **Valid** – data accepted (optional warnings)
- **Invalid** – structural or calculation errors
- **Valid with warnings** – e.g. small rounding differences

This mirrors a real SaaS flow where validation happens **before** submission to reduce rejections and support issues. The design is kept calm and focused so it can sit inside a larger product (e.g. next to “Invia fattura” or “Anteprima”).

---

## 2. Architectural decisions

- **Vue 3 (Composition API)** – Reactive form and result state, clear component boundaries, and a single place (the API service) for all backend calls. Composition API keeps logic colocated and easy to test.

- **jQuery used on purpose** – jQuery is not used for state or rendering. It is used only for:
  - **Form enhancement**: restricting Partita IVA input to 11 digits (input formatting).
  - **Smooth scroll** to the result block after validation.
  - **Reveal animation**: the result card is shown with `.slideDown()` for a light transition.

  All of this runs **after** Vue has updated the DOM (e.g. in a handler after `nextTick()`), so it does not conflict with Vue’s reactivity.

- **Separation between components and API** – All calls to `POST /api/v1/invoices/validate` go through `src/services/api.js`. Components emit events or call methods that in turn call the service. This keeps:
  - A single place for the API base URL and error handling.
  - Components free of `fetch` and URL logic.
  - Room to add retries, logging, or a different client later without touching the UI.

---

## 3. How to run

```bash
npm install
npm run dev
```

- Frontend: **http://localhost:5173**
- Backend (must be running for validation): **http://localhost:8080**

Configure the API base URL with a `.env` file (see `.env.example`):

```bash
VITE_API_BASE_URL=http://localhost:8080
```

Build for production:

```bash
npm run build
```

Output is in `dist/`. The API URL is set at build time via `VITE_API_BASE_URL`.

### Run with Docker (Bun)

From the **project root** (not `frontend/`):

```bash
docker compose up --build frontend
```

Frontend will be at **http://localhost:5173**. It uses [Bun](https://bun.sh) inside the container. Override the API URL if needed:

```yaml
# docker-compose.yml
frontend:
  environment:
    - VITE_API_BASE_URL=http://host.docker.internal:8080   # if backend runs on host
```
