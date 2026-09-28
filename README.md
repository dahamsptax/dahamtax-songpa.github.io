# 세무회계 홈페이지 (GitHub Pages용)

HTML/CSS/JS만으로 만든 정적 사이트입니다. 서버·빌드가 필요 없습니다.

## 1. GitHub에 올리기 (git 설치 없이)

1. https://github.com 로그인 → 오른쪽 위 **+** → **New repository**
2. Repository name: 예) `homepage` → **Public** 선택 → **Create repository**
3. 생성된 화면에서 **uploading an existing file** 클릭
4. 이 폴더 **안의 파일·폴더 전부**(index.html, css, js 등)를 드래그 → **Commit changes**
5. 저장소 **Settings → Pages** → Source: `Deploy from a branch`, Branch: `main` / `/(root)` → **Save**
6. 1~2분 뒤 `https://<아이디>.github.io/homepage/` 에서 확인

> 저장소 이름을 `<아이디>.github.io` 로 만들면 주소가 `https://<아이디>.github.io/` 가 됩니다.

## 2. 도메인 연결 (나중에)

1. `CNAME.example` 파일 이름을 `CNAME` 으로 바꾸고, 안의 내용을 실제 도메인(예: `www.mytax.kr`)으로 수정
2. 도메인 구입처(가비아 등) DNS 설정
   - `www` → **CNAME** 레코드 → `<아이디>.github.io`
   - 루트 도메인(`mytax.kr`) → **A** 레코드 4개: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
3. GitHub **Settings → Pages → Custom domain** 에 도메인 입력 → **Enforce HTTPS** 체크
4. `js/config.js` 의 `domain`, 각 HTML의 `og:url` 도 실제 도메인으로 변경

## 3. 내용 수정 위치

| 수정할 것 | 파일 |
|---|---|
| 사무소명, 주소, 전화, 이메일, 운영시간 | `js/config.js` (헤더·푸터·오시는 길 전체 반영) |
| 서비스 목록/설명 | `js/config.js` 의 `SERVICES` |
| 칼럼 글 추가/수정 | `js/posts.js` (블록 하나 복사해서 맨 위에 추가) |
| 홈 문구 | `index.html` |
| 세무사 소개·경력·사진 | `about.html` |
| 자주 묻는 질문 | `faq.html` |
| 포인트 색상 | `css/style.css` 맨 위 `--primary` |
| 상담 폼 전송 방식 | `contact.html` 주석 참고 (기본: 메일 앱으로 전송) |

GitHub 웹에서 파일을 열고 연필(✏️) 아이콘으로 바로 수정 → Commit 하면 1~2분 뒤 사이트에 반영됩니다.
