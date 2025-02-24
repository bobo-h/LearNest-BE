# 📌 백엔드 프로젝트 (BE)

이 프로젝트는 Express.js와 TypeScript를 기반으로 하는 백엔드 애플리케이션입니다. MySQL을 사용하여 데이터를 관리하며, JWT를 활용한 인증 시스템이 포함되어 있습니다.

## 🚀 기술 스택

- **언어**: TypeScript
- **프레임워크**: Express.js
- **데이터베이스**: MySQL (mysql2, Sequelize 사용)
- **인증**: JSON Web Token (jsonwebtoken)
- **보안**: bcryptjs, helmet, cors
- **환경변수 관리**: dotenv
- **날짜 관리**: dayjs

## 📂 프로젝트 구조

```
📦 프로젝트 루트
├── 📁 src               # 소스 코드 폴더
│   ├── 📁 config        # 환경 설정 파일
│   ├── 📁 controllers   # 컨트롤러 (비즈니스 로직 처리)
│   ├── 📁 models        # 데이터베이스 모델
│   ├── 📁 routes        # API 라우트 정의
│   ├── 📁 middlewares   # 미들웨어 정의
│   ├── 📁 utils         # 유틸리티 함수
│   ├── app.ts          # Express 앱 설정
│   ├── server.ts       # 서버 실행 파일
├── 📁 dist              # TypeScript 컴파일 후 생성된 파일 (빌드된 코드)
├── .env                 # 환경변수 파일 (Git에서 제외 필요)
├── package.json         # 프로젝트 설정 및 종속성 목록
├── tsconfig.json        # TypeScript 설정 파일
├── README.md            # 프로젝트 문서
```

## ⚙️ 환경변수 설정 (.env 예시)

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=yourdatabase
JWT_SECRET=your_jwt_secret
```

## 📌 설치 및 실행

### 1. 패키지 설치

```sh
npm install
```

### 2. 개발 서버 실행

```sh
npm run dev
```

### 3. 빌드 및 실행

```sh
npm run build
npm start
```

## 📡 API 엔드포인트 예시

### ✅ 유저 회원가입

```http
POST /api/auth/signup
```

**요청 바디:**

```json
{
  "name": "홍길동",
  "email": "test@example.com",
  "password": "password123"
}
```

### ✅ 유저 로그인

```http
POST /api/auth/login
```

**요청 바디:**

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

### ✅ 유저 정보 조회 (JWT 필요)

```http
GET /api/users/me
```

**헤더:**

```json
{
  "Authorization": "Bearer your_jwt_token"
}
```

## 🛠 주요 기능

- **사용자 인증**: JWT를 활용한 로그인 및 인증 시스템
- **보안 강화**: bcrypt를 이용한 비밀번호 해싱, helmet 및 CORS 설정
- **MySQL 데이터베이스 연동**: Sequelize ORM을 사용한 데이터 관리
- **환경 변수 사용**: dotenv를 활용한 환경 변수 관리

## 🏗 배포

배포 시에는 `dist` 폴더에 빌드된 코드를 실행해야 합니다.

```sh
npm run build
npm start
```

