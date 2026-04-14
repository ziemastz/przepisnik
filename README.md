# 🥘 Przepiśnik

Aplikacja webowa do zarządzania przepisami kulinarnymi z wbudowanym kalkulatorem wartości odżywczych (B/T/W)

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
**Przepiśnik** to aplikacja, która pozwala na łatwe przechowywanie, organizowanie i wyszukiwanie przepisów kulinarnych. 

Główne funkcjonalności:
- dodawanie własnych przepisów,
- edycja i usuwanie istniejących przepisów,
- wyszukiwanie po nazwie lub składnikach,
- podział na kategorie,
- możliwość dodawania zdjęć potraw,
- rejestracja i logowanie użytkowników.

Projekt został zrealizowany w ramach pracy dyplomowej i stanowi praktyczne zastosowanie technologii Java (Spring Boot) oraz React.

---

## 🛠️ Technologie

| Warstwa        | Zastosowane technologie |
|----------------|------------------------|
| 🔙 Backend    | Java 21, Spring Boot, Spring Web, Spring Data JPA, Hibernate |
| 🎨 Frontend       | React (TypeScript/JavaScript) |
| 🗄️ Baza danych    | H2 |
| 🔐 Bezpieczeństwo | Spring Security, JWT Authentication |
| ⚙️ Budowanie      | Maven, npm |
| 🧪 Testy | React Testing Library, Jest, Mockito, JUnit 5| 
| 📊 Analiza jakości kodu | SonarCloud |
| 🧹 Formatowanie & Linting| ESLint, Prettier|
| 🚀 CI/CD          | GitHub Actions, SonarCloud Scan, Azure Web App Deployment |
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

---

## 🚧 Postęp prac (to-do / done)

| Etap | Opis | Status |
|------|------|--------|
| Utworzenie repozytorium projektu i README.md | Założenie repo i wstępny opis projektu | ✅ Zrobione |
| Utworzenie aplikacji Spring Boot | Dodanie podstawowych modułów (Web, JPA, Security, Validation) | ✅ Zrobione|
| Konfiguracja baz danych | Utworzenie modeli, repozytoriów, migracji (Flyway/Liquibase – opcjonalnie) | ⏳ |
| Stworzenie podstawowego CRUD (przepisy) | Endpoints REST + testy podstawowe | ⏳ |
| Dodanie logowania i rejestracji użytkownika | Spring Security + BCrypt | ⏳ |
| Konfiguracja GitHub Actions (CI) | Automatyczne budowanie projektu, Integracja CI z SonarCloud | ✅ Zrobione |
| Publikacja backendu na Azure | Azure Web App / Azure Spring Apps | ✅ Zrobione |
| Stworzenie projektu React | Inicjalizacja projektu + routing + UI listy przepisów | ⏳ |
| Integracja backend ↔ frontend | Wyświetlanie danych API w React | ⏳ |
| Budowanie frontendu wewnątrz Spring Boot | Włączenie React `npm build` → `static/` w Spring | ✅ Zrobione |
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
git clone https://github.com/ziemastz/przepisnik.git

cd przepisnik

# Uruchomienie aplikacji backend (Spring Boot)
mvn spring-boot:run
```
Frontend znajduje się w folderze `/frontend`:
```bash
# Uruchamianie aplikacji fronted (React.js)
cd frontend
npm install
npm start
```

Aplikacja będzie dostępna pod adresem: 
👉 http://localhost:8080

(lub http://localhost:3000
 dla samego frontendu w trybie dev)

## Produkcja na Azure

Lokalnie i produkcyjnie aplikacja używa teraz tego samego pliku `application.properties` i plikowej bazy H2.

Domyślny URL bazy:

```text
jdbc:h2:file:${HOME:./data}/przepisnikdb;DB_CLOSE_ON_EXIT=FALSE
```

W Azure App Service nie musisz ustawiać profilu ani osobnego URL bazy, jeśli chcesz użyć domyślnej konfiguracji z `application.properties`.

To oznacza:
- restart aplikacji na Azure nie powinien usuwać danych,
- redeploy nie powinien usuwać danych, o ile App Service zachowuje storage `HOME`,
- aplikacja powinna działać na jednej instancji App Service, bo plikowa H2 nie jest dobrym wyborem dla scale-out na wiele instancji.

# 👤 Autor

Tomasz Z

Praca dyplomowa — studia podyplomowe „Java Web Developer”
