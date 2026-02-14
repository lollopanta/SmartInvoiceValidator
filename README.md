# Smart Invoice Validator

Production-minded micro-feature for **intelligent invoice validation** inside a SaaS electronic invoicing system. Provides a versioned REST API to validate invoice data before submission and a modern Vue 3 frontend for interactive validation.

**Stack:**
- **Backend:** PHP 8.2+, CakePHP 5, MySQL 8
- **Frontend:** Vue 3, Vite, Bootstrap 5, Font Awesome 6
- **Infrastructure:** Docker, Nginx

---

## 1. Why this feature matters

- **Preventing invoice rejection by SDI** — Italian e-invoicing (Fatturazione Elettronica) requires data to be correct before submission. Pre-validation reduces the chance of SDI (Sistema di Interscambio) rejecting invoices.
- **Immediate User Feedback** — The frontend provides real-time validation and a "Fix" tool to auto-calculate totals and correct VAT check digits.

---

## 2. Features & Implementation

- **API V1**: Versioned REST API under `/api/v1/invoices/validate`.
- **PIVA Checksum**: Full implementation of the Italian Partita IVA algorithm (Luhn-like checksum).
- **Auto-Correction**: Frontend "Calculator" tool to:
    - Recalculate `totale_dichiarato` based on `imponibile` and `aliquota_iva`.
    - Fix/Generate the correct check digit for a 10-digit Partita IVA.
- **Service Layer**: All business logic lives in `InvoiceValidatorService`, separate from controllers.
- **CORS Support**: Configured via middleware to allow seamless frontend integration.

---

## 3. How to run

### Quick Start (Docker)

```bash
cp .env.example .env
# Edit .env if needed (SECURITY_SALT, passwords)

docker compose up --build
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **API**: [http://localhost:8080](http://localhost:8080)
- **MySQL**: port `3306`

### Manual Development Setup

#### Backend
```bash
composer install
bin/cake server -p 8080
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 4. API Specification

**Endpoint:** `POST /api/v1/invoices/validate`

**Request:**
```json
{
  "partita_iva": "12345678901",
  "imponibile": 1000.00,
  "aliquota_iva": 22,
  "totale_dichiarato": 1220.00
}
```

**Response (200 OK):**
```json
{
  "valid": true,
  "total_calculated": 1220,
  "errors": [],
  "warnings": []
}
```

---

## 5. Development & Testing

### Backend Tests
```bash
composer test
```

### Project Structure
```
├── config/             # CakePHP configuration
├── docker/             # Docker configuration
├── frontend/           # Vue 3 application
├── src/
│   ├── Controller/     # API Controllers
│   ├── Service/        # Business Logic (ValidatorService)
│   └── Middleware/     # CORS & Error handling
├── tests/              # PHPUnit tests
└── webroot/            # Backend entry point
```

---

## License

MIT.

