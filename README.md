# 🥘 Przepiśnik

Aplikacja webowa do zarządzania przepisami kulinarnymi z obliczaniem wartości odżywczych (B/T/W) i wskaźnika ŻO

**Praca dyplomowa — studia podyplomowe „Java Web Developer”**

Akademia Techniczno-Informatyczna w Naukach Stosowanych we Wrocławie

---
## 🚀 CI/CD

| Pipeline | Status |
|---------|--------|
| Build & Test | [![Build](https://github.com/ziemastz/przepisnik/actions/workflows/build.yml/badge.svg)](https://github.com/ziemastz/przepisnik/actions/workflows/build.yml) |
| Coverage | ![Coverage](https://sonarcloud.io/api/project_badges/measure?project=ziemastz_przepisnik&metric=coverage) |
| Deploy to Azure | [![Deploy](https://github.com/ziemastz/przepisnik/actions/workflows/main_przepisnik-web.yml/badge.svg)](https://github.com/ziemastz/przepisnik/actions/workflows/main_przepisnik-web.yml) |

### 🌍 Live deployment
https://przepisnik-web-dmbwcwe2etdke5ge.westeurope-01.azurewebsites.net/

---

## 📌 Opis projektu
**Przepiśnik** to aplikacja do przechowywania, organizowania i wyszukiwania przepisów kulinarnych.

Projekt został zrealizowany jako praca dyplomowa na kierunku „Java Web Developer” i stanowi praktyczną implementację pełnego procesu wytwarzania aplikacji webowej: od modelu domenowego i warstwy REST API, przez frontend SPA, po testy automatyczne i wdrożenie CI/CD.

Aktualnie zaimplementowane funkcjonalności:
- rejestracja i logowanie użytkowników (JWT),
- dodawanie, edycja i usuwanie przepisów,
- lista „Moje przepisy” dla zalogowanego użytkownika,
- obsługa przepisów publicznych i prywatnych,
- publiczna strona główna z wyszukiwarką przepisów (`GET /api/recipes/public`),
- publiczny podgląd szczegółów przepisu (`GET /api/recipes/public/{id}`),
- zarządzanie składnikami (CRUD), wyszukiwarka i paginacja listy składników,
- podpowiedzi składników podczas tworzenia/edycji przepisu,
- automatyczne wyliczanie wartości odżywczych B/T/W dla składników i całego przepisu,
- wyliczanie wskaźnika ŻO oraz oceny (IDEAL/GOOD/AVERAGE/POOR),
- dedykowana strona informacyjna „Zasady żywienia optymalnego”,
- obsługa błędów i walidacji po stronie backendu i frontendu.

Funkcjonalności planowane / w trakcie rozwoju:
- kategorie przepisów,
- zdjęcia potraw,
- dalsze rozbudowanie filtrowania i wyszukiwania.

Projekt został zrealizowany w ramach pracy dyplomowej i stanowi praktyczne zastosowanie technologii Java (Spring Boot) oraz React.

---

## 📚 Zakres pracy dyplomowej

Zakres zrealizowany:
- zaprojektowanie i implementacja warstwowej architektury aplikacji (Controller → Service → Repository → Entity/DTO),
- implementacja autentykacji i autoryzacji (JWT + Spring Security),
- model danych dla przepisów, składników i wartości odżywczych,
- implementacja mechanizmu publicznych i prywatnych przepisów,
- budowa frontendowego interfejsu SPA z routingiem i formularzami,
- przygotowanie testów jednostkowych, integracyjnych i komponentowych,
- konfiguracja pipeline CI (lint/test/build/analiza jakości) oraz wdrożenia na Azure.

Zakres planowany w kolejnych iteracjach:
- kategoryzacja przepisów,
- obsługa zdjęć potraw,
- dalsze rozszerzenie filtrów i wyszukiwania.

---

## 🛠️ Technologie

| Warstwa        | Zastosowane technologie |
|----------------|------------------------|
| 🔙 Backend    | Java 25, Spring Boot 3.5, Spring Web, Spring Data JPA, Hibernate, Flyway |
| 🎨 Frontend       | React 19 + TypeScript, React Router |
| 🗄️ Baza danych    | H2 (local/test), PostgreSQL (prod) |
| 🔐 Bezpieczeństwo | Spring Security, JWT Authentication |
| ⚙️ Budowanie      | Maven, npm, frontend-maven-plugin |
| 🧪 Testy | JUnit 5, Mockito, Spring Test, Testcontainers, React Testing Library, Jest |
| 📊 Analiza jakości kodu | SonarCloud |
| 🧹 Formatowanie & Linting| ESLint, Prettier|
| 🚀 CI/CD          | GitHub Actions, SonarCloud Scan, Azure Web App Deployment, walidacja Flyway + Hibernate na PostgreSQL |
| 🎨 UI | własne style CSS/SCSS, FontAwesome |
| 📦 Kontrola wersji| Git, GitHub |
| 🧰 Narzędzia developerskie | Visual Studio Code, IntelliJ IDEA |
| 🤖 AI / Asystenci | ChatGPT (OpenAI), Codex — pomoc w dokumentacji, debugowaniu i refaktoryzacji |
| 🔍 API Testy | Postman |

---

## 🧱 Architektura aplikacji
Aplikacja składa się z dwóch warstw:
- **Backend (REST API)** napisany w Spring Boot, obsługuje logikę biznesową i komunikację z bazą danych
- **Frontend (SPA)** napisany w React, renderowany po stronie klienta i kompilowany do statycznych plików serwowanych przez Spring Boot

Podejście: architektura warstwowa (Controller → Service → Repository → Entity/DTO)

Kluczowe decyzje architektoniczne:
- rozdzielenie konfiguracji środowisk (`local`/`prod`) z domyślnym profilem lokalnym,
- migracje schematu bazy danych przez Flyway,
- stateless security oparte o JWT,
- publiczne endpointy tylko dla odczytu danych niechronionych (lista/podgląd publicznych przepisów),
- automatyczne budowanie frontendu i osadzanie artefaktów w aplikacji Spring Boot.

---

## 🧪 Jakość i testy

Aktualny stan testów:
- backend: **20 klas testowych**, łącznie **126 testów** (JUnit 5 / Mockito / Spring Test),
- frontend: **26 plików testowych** (Jest / React Testing Library),
- dodatkowo test walidujący zgodność Flyway + Hibernate dla PostgreSQL uruchamiany w CI.

Walidacja jakości:
- analiza jakości i pokrycia kodu przez SonarCloud,
- linting i formatowanie frontendu (ESLint + Prettier),
- automatyczny build i testy w GitHub Actions.

---

## 🚧 Postęp prac (to-do / done)

Stan na 2026-06-16

| Etap | Opis | Status |
|------|------|--------|
| Utworzenie repozytorium projektu i README.md | Założenie repo i wstępny opis projektu | ✅ Zrobione |
| Utworzenie aplikacji Spring Boot | Dodanie podstawowych modułów (Web, JPA, Security, Validation) | ✅ Zrobione |
| Konfiguracja baz danych | Modele, repozytoria, migracje Flyway (V1-V6), profile local/prod | ✅ Zrobione |
| Stworzenie podstawowego CRUD (przepisy) | Endpoints REST + testy kontrolerów i serwisów | ✅ Zrobione |
| Dodanie logowania i rejestracji użytkownika | Spring Security + JWT | ✅ Zrobione |
| Konfiguracja GitHub Actions (CI) | Automatyczne budowanie projektu, Integracja CI z SonarCloud | ✅ Zrobione |
| Publikacja aplikacji na Azure | Build i deploy artefaktu JAR do Azure Web App | ✅ Zrobione |
| Stworzenie projektu React | Inicjalizacja projektu + routing + widoki auth, przepisy, składniki | ✅ Zrobione |
| Integracja backend ↔ frontend | Integracja API (auth, user, recipes, ingredients, public recipes) | ✅ Zrobione |
| Budowanie frontendu wewnątrz Spring Boot | Włączenie React `npm build` → `static/` w Spring | ✅ Zrobione |
| Testy automatyczne | Testy backendu (JUnit/Mockito) i frontendu (Jest/RTL) | ✅ Zrobione |
| Publiczna część aplikacji | `GET /api/recipes/public` + `GET /api/recipes/public/{id}`, strona główna i podgląd przepisu bez logowania | ✅ Zrobione |
| Moduł składników | Lista, wyszukiwarka, paginacja, CRUD + podpowiedzi składników | ✅ Zrobione |
| Wartości odżywcze | B/T/W per składnik i per przepis + wskaźnik ŻO i ocena | ✅ Zrobione |
| Finalne testy i optymalizacje UX/UI | Dopracowanie interfejsu i flow użytkownika | ⏳ |
| Funkcje rozszerzone | Kategorie, zdjęcia, dalsze filtry i wyszukiwanie | ⬜ |
| Dokumentacja do pracy dyplomowej | Opis architektury, technologii, wniosków | ⏳ |

Legenda:  
✅ Zrobione | ⏳ W trakcie | ⬜ Do zrobienia

---

## 🎯 Cele projektu
- Stworzenie aplikacji CRUD opartej o REST/Spring MVC
- Zastosowanie autentykacji i autoryzacji
- Integracja z relacyjną bazą danych
- Utrwalenie architektury warstwowej (Controller → Service → Repository → Entity)

---

## 🚀 Uruchamianie aplikacji

```bash
# Klonowanie repozytorium
git clone https://github.com/ziemastz/przepisnik.git

cd przepisnik

# Uruchomienie backendu na profilu lokalnym (H2)
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

Domyślny profil aplikacji to `local` (H2). W środowisku produkcyjnym należy ustawić:

```bash
SPRING_PROFILES_ACTIVE=prod
```

Frontend znajduje się w folderze `/frontend`:
```bash
# Uruchamianie aplikacji frontend (React.js)
cd frontend
npm install
npm start
```

Aplikacja będzie dostępna pod adresem: 
👉 http://localhost:8080

(lub http://localhost:3000
 dla samego frontendu w trybie dev)

# 👤 Autor

Tomasz Z

Praca dyplomowa — studia podyplomowe „Java Web Developer”
