# Node.js demo for Allure + Jenkins

Project nho de demo flow:

Code -> Build -> Test -> Generate Allure Report -> Review Result

## 1) Cai dependency

```bash
npm ci
```

## 2) Chay test va tao allure-results

```bash
npm run test:ci
```

Sau khi chay xong, ban se co:

- `allure-results/` (du lieu cho Allure)
- `junit/junit.xml` (bao cao JUnit cho Jenkins)

## 3) Tao va mo Allure report local

```bash
npm run allure:generate
npm run allure:open
```

## 4) Demo Jenkins

- Tao Pipeline job va tro den project nay (co `Jenkinsfile`).
- Chay build.
- Sau build:
  - Jenkins doc `junit/junit.xml` de hien thi ket qua test.
  - Neu da cai Allure plugin, Jenkins doc `allure-results/` de render Allure report.

## 5) Jenkins bang Docker (tuy chon)

Tu thu muc `demo`:

```bash
docker compose up -d
```

Jenkins se chay o `http://localhost:8080`.
