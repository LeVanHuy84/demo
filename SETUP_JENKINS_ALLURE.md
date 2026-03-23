# Hướng Dẫn: Tích Hợp Jenkins + Allure Report (End-to-End)

## Mục tiêu

Khi developer push code lên Git, Jenkins sẽ **tự động**:

1. Lấy code
2. Chạy test
3. Tạo Allure Report
4. Hiển thị báo cáo trong Jenkins UI

---

## A. CHUẨN BỊ JENKINS

### 1. Cài đặt Allure Plugin

**B1:** Đăng nhập Jenkins

- URL: `http://localhost:8080` (hoặc IP của Jenkins server)

**B2:** Vào **Manage Jenkins** (hoặc ≡ > Manage Jenkins)

**B3:** Chọn **Manage Plugins**

**B4:** Tab **Available plugins**, search `allure`

**B5:** Tìm **Allure Plugin** (tác giả: Anton Esmukh) ✓ Tích chọn

**B6:** Nhấn **Install without restart** hoặc **Download and install after restart**

**B7:** Nếu chọn "after restart", Jenkins sẽ restart tự động

### 2. Cấu Hình Allure Commandline Tool

**B1:** Vào **Manage Jenkins** > **Tools**

**B2:** Scroll xuống tìm **Allure Commandline** (hoặc **Allure CLI**)

**B3:** Nhấn **Add Allure Commandline**

**B4:** Điền vào form:

```
Name:                allure              (hoặc tên khác)
Install automatically: ☑ (tích chọn)
Version:            2.34.1              (chọn version mới nhất)
```

**B5:** Nhấn **Save**

---

## B. CẤU HÌNH JENKINS PIPELINE JOB

### 1. Tạo New Pipeline Job

**B1:** Jenkins home page, nhấn **New Item**

**B2:** Nhập tên: `seminar-allure-demo` (hoặc tên khác)

**B3:** Chọn **Pipeline**

**B4:** Nhấn **OK**

### 2. Cấu Hình Pipeline

**B1:** Trong **Pipeline** section:

```
Definition: Pipeline script from SCM
SCM: Git
Repository URL: <GIT_REPO_URL>
Credentials: (nếu cần)
Branch: main (hoặc branch khác)
Script Path: demo/Jenkinsfile
```

Hoặc nếu test riêng:

```
Script Path: Jenkinsfile
```

**B2:** Nhấn **Save**

### 3. Build Test Lần Đầu

**B1:** Quay lại job, nhấn **Build Now** (hoặc **Build** từ menu side)

**B2:** Chờ build chạy (xem **Build History**)

**B3:** Nhấn vào build mới nhất xem **Console Output**

---

## C. KIỂM TRA KẾT QUẢ

### 1. Console Output

Build log sẽ hiển thị các stage:

```
...
[Pipeline] stage('Checkout')
[Pipeline] stage('Test')
[Pipeline] stage('Generate Allure Report')
...
```

Cuối log sẽ thấy:

```
=== Build Summary ===
allure-results contents:
-rw-r--r--  ...  abc123-result.json
...
```

### 2. Xem Allure Report trên Jenkins

**B1:** Quay lại build details page

**B2:** Scroll xuống, sẽ thấy **Allure Report** section hoặc link:

```
🔗 Allure Report
```

**B3:** Nhấn vào để xem báo cáo HTML

### 3. Cấu trúc Báo Cáo

Báo cáo Allure sẽ hiển thị:

- **Tổng quan**: Tổng test, pass/fail, tỷ lệ
- **Test Cases**: Danh sách chi tiết từng test
- **History**: Lịch sử kết quả qua các lần build
- **Attachments**: Log, screenshot (nếu có)

---

## D. TROUBLESHOOTING

### Vấn đề 1: Allure Report không xuất hiện

**Nguyên nhân:**

- Plugin chưa được cài đặt
- `allure-results` folder trống hoặc không có file

**Giải pháp:**

1. Kiểm tra plugin đã cài chưa: Manage Jenkins > Manage Plugins
2. Kiểm tra console log: có `allure-results contents` không?
3. Chạy lại build: `Build Now`

### Vấn đề 2: Build fail ở stage Test

**Nguyên nhân:**

- Test thất bại
- Jest config sai

**Giải pháp:**

1. Xem chi tiết trong **Console Output**
2. Kiểm tra `jest.config.cjs` có reporter `allure-jest` chưa
3. Chạy local test: `npm run test:ci`

### Vấn đề 3: `allure` command not found

**Nguyên nhân:**

- Global Tool Configuration chưa cấu hình

**Giải pháp:**

1. Vào Manage Jenkins > Tools
2. Thêm Allure Commandline (xem phần A.2)
3. Chạy lại build

---

## E. FLOW END-TO-END

```
Developer push code
        ↓
Git webhook triggers Jenkins
        ↓
Jenkins Pipeline Start
├─ Checkout: Lấy code từ Git
├─ Install: npm ci
├─ Test: npm run test:ci
│  ├─ Jest chạy test
│  ├─ Jest reporter tạo JUnit XML
│  └─ Allure reporter tạo JSON data → allure-results/
├─ Generate Allure Report:
│  └─ allure generate → allure-report/
└─ Post (always):
   ├─ Archive artifacts (allure-results, allure-report, junit)
   ├─ Publish JUnit results
   └─ Publish Allure Report
        ↓
Jenkins UI hiển thị:
├─ Test Results (from JUnit)
└─ 🔗 Allure Report (clickable)
        ↓
Developer/QA mở Allure Report
├─ Xem Overview (pass/fail %)
├─ Xem Chi tiết từng test
└─ Xem History & Trends
```

---

## F. CÀI ĐẶT WEBHOOK (Tự động build khi push)

### 1. GitLab / GitHub Webhook

**B1:** Repository settings > Webhooks

**B2:** Thêm webhook:

```
URL: http://JENKINS_URL/generic-webhook-trigger/invoke
     hoặc
     http://JENKINS_URL/github-webhook/
Trigger: Push events
```

**B3:** Save

### 2. Jenkins cấu hình nhận webhook

**B1:** Vào Jenkins job

**B2:** Config > Build Triggers

**B3:** Tích ☑ **GitHub hook trigger for GITscm polling**
hoặc ☑ **Trigger builds by generic webhook trigger**

**B4:** Save

---

## G. LỖI THƯỜNG GẶP TRONG JEST CONFIG

❌ **Sai** (không có reporter Allure):

```js
reporters: ['default', 'jest-junit'];
```

✅ **Đúng** (có Allure reporter):

```js
reporters: [
  'default',
  'jest-junit',
  [
    'allure-jest/reporter',
    {
      resultsDir: 'allure-results',
      suiteTitle: true,
    },
  ],
];
```

---

## H. KIỂM TRA BUILD CÓ ĐỦ DEPENDENCIES KHÔNG

Chạy local trước khi push:

```bash
# Cài dependencies
npm ci

# Chạy test với Allure reporter
npm run test:ci

# Generate Allure report
npm run allure:generate

# Xem báo cáo
npm run allure:open
```

Nếu tất cả ok, Jenkins sẽ cũng ok.

---

## I. TỰ ĐỘNG RESET ALLURE REPORT (TÙY CHỌN)

Nếu muốn mỗi build reset báo cáo cũ, thêm vào Jenkinsfile stage **Clean**:

```groovy
stage('Clean') {
  steps {
    sh '''
      rm -rf allure-results allure-report junit coverage || true
    '''
  }
}
```

Đặt trước stage **Install**.

---

## J. DEMO PRESENTATION FLOW

**Bước trình bày:**

1. **Giải thích:** "Hiện tại Jenkins chạy test tự động"
2. **Nhấn Build Now** → Build chạy
3. **Xem Console Output** → "Build hoàn thành, test data được tạo"
4. **Scroll xuống** → Nhấn **Allure Report**
5. **Allure UI hiểu ra** → "Đây là báo cáo tself-generated, không thủ công"
6. **Xem Dashboard** → Pass/fail %
7. **Click vào test case** → Chi tiết từng step
8. **Quay lại Jenkins** → "Lần tới chỉ cần push code, mọi thứ tự động"

---

## K. THAM KHẢO

- Allure Jenkins Plugin Docs: https://allurereport.org/docs/integrations-jenkins/
- Jenkins Declarative Pipeline: https://www.jenkins.io/doc/book/pipeline/
- Jest Allure Reporter: https://www.npmjs.com/package/allure-jest
