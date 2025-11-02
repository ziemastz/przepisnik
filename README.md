# 🥘 Przepiśnik

Projekt aplikacji webowej do zarządzania przepisami kulinarnymi z kalkulatorem skłądników odżywczysz BTW

**Praca dyplomowa — studia podyplomowe „Java Web Developer”** na Akademia Techniczno-Informatyczna w Naukach Stosowanych we Wrocławie

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
**Przepiśnik** to aplikacja, która pozwala na łatwe przechowywanie, organizowanie i wyszukiwanie przepisów kulinarnych. 

Główne funkcjonalności:
- dodawanie własnych przepisów,
- edycja i usuwanie istniejących przepisów,
- wyszukiwanie po nazwie lub składnikach,
- podział na kategorie,
- możliwość dodawania zdjęć potraw,
- rejestracja i logowanie użytkowników.

Projekt został zrealizowany jako część pracy dyplomowej i ma na celu praktyczne zastosowanie technologii Java oraz podejścia wielowarstwowego w tworzeniu aplikacji webowych.

---

## 🛠️ Technologie

| Warstwa        | Zastosowane technologie |
|----------------|------------------------|
| Backend        | Java 17, Spring Boot, Spring Web, Spring Data JPA, Hibernate |
| Frontend       | React + Vite / Create React App *(dopasuj do projektu)* |
| Baza danych    | PostgreSQL *(lub MySQL → dopasuj)* |
| Bezpieczeństwo | Spring Security + BCrypt |
| Budowanie      | Maven |
| CI/CD          | GitHub Actions + Azure Web App / Azure Spring Apps *(jeśli będzie użyte)* |
| UI (opcjonalnie)| Bootstrap / Tailwind / własne style CSS |

---

## 🧱 Architektura aplikacji
Aplikacja składa się z dwóch warstw:
- **Backend (REST API)** napisany w Spring Boot
- **Frontend (SPA)** napisany w React, kompilowany do statycznych plików i serwowany przez backend

Podejście: architektura warstwowa (Controller → Service → Repository → Entity/DTO)

---

## 🚧 Postęp prac (to-do / done)

| Etap | Opis | Status |
|------|------|--------|
| Utworzenie repozytorium projektu i README.md | Założenie repo i wstępny opis projektu | ✅ Zrobione |
| Utworzenie aplikacji Spring Boot | Dodanie podstawowych modułów (Web, JPA, Security, Validation) | ⏳ W trakcie / do zrobienia |
| Konfiguracja baz danych | Utworzenie modeli, repozytoriów, migracji (Flyway/Liquibase – opcjonalnie) | ⏳ |
| Stworzenie podstawowego CRUD (przepisy) | Endpoints REST + testy podstawowe | ⏳ |
| Dodanie logowania i rejestracji użytkownika | Spring Security + BCrypt | ⏳ |
| Konfiguracja GitHub Actions (CI) | Automatyczne budowanie projektu | ⏳ |
| Publikacja backendu na Azure | Azure Web App / Azure Spring Apps | ⏳ |
| Stworzenie projektu React | Inicjalizacja projektu + routing + UI listy przepisów | ⏳ |
| Integracja backend ↔ frontend | Wyświetlanie danych API w React | ⏳ |
| Budowanie frontendu wewnątrz Spring Boot | Włączenie React `npm build` → `static/` w Spring | ⏳ |
| Finalne testy i optymalizacje | UX, poprawki wizualne, walidacje | ⏳ |
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
git clone https://github.com/<twoje-konto>/<nazwa-repo>.git

cd <nazwa-repo>

# Uruchomienie aplikacji backend (Spring Boot)
mvn spring-boot:run

# Uruchamianie aplikacji fronted (React.js)
cd frontend
npm install
npm start
```

Aplikacja będzie dostępna pod adresem: http://localhost:8080

# 👤 Autor

Tomasz Z

Studia podyplomowe „Java Web Developer”
