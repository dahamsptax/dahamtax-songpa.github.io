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

## 2. 도메인 연결 (songpa.dahamtax.com)

- 주소(연결 예정): https://songpa.dahamtax.com (관리자: https://songpa.dahamtax.com/admin/)
- 본사 DNS 등록 전이라 보류 중: 등록되면 "도메인 연결 보류" 커밋을 git revert 하면 CNAME·도메인 설정이 복구됨
- `CNAME` 파일에 도메인이 적혀 있음
- DNS: dahamtax.com 은 AWS Route 53 에서 관리 (본사 담당). 레코드 `songpa` CNAME → `dahamsptax.github.io`
- GitHub 저장소 Settings → Pages → Custom domain 에 `songpa.dahamtax.com` 입력 → Enforce HTTPS 체크
- www.dahamtax.com 은 본사 사이트이므로 건드리지 않음

본사 도메인 담당자에게 요청할 내용: 아래를 그대로 보내시면 됩니다.

Route 53 의 dahamtax.com 호스팅 영역에 레코드 1개 추가 부탁드립니다.

레코드 이름: songpa
유형: CNAME
값: dahamsptax.github.io
TTL: 300 (기본값)

레코드가 추가된 다음 할 일

제가 할 일: 홈페이지에 songpa.dahamtax.com이 적힌 CNAME 파일을 넣고, 도메인과 관리자 화면 설정을 바꾼 뒤 푸시합니다.

직접 하실 일: GitHub 저장소 Settings → Pages → Custom domain에 songpa.dahamtax.com을 입력하고 Save를 누릅니다. 확인이 끝나면 Enforce HTTPS에 체크합니다. 몇 분에서 몇 시간 걸릴 수 있습니다.

그러면 홈페이지는 https://songpa.dahamtax.com, 관리자 화면은 https://songpa.dahamtax.com/admin/ 으로 열립니다. 예전 github.io 주소는 새 주소로 자동으로 넘어갑니다.


## 3. 내용 수정 위치

| 수정할 것 | 파일 |
|---|---|
| 사무소명, 주소, 전화, 이메일, 운영시간 | `js/config.js` (헤더·푸터·오시는 길 전체 반영) |
| 서비스 목록/설명 | `js/config.js` 의 `SERVICES` |
| 칼럼 글 추가/수정 | 관리자 페이지 `/admin/` (Sveltia CMS, 액세스 토큰 로그인) → `data/posts.json` 에 저장 |
| 홈 문구 | `index.html` |
| 세무사 소개·경력·사진 | `about.html` |
| 자주 묻는 질문 | `faq.html` |
| 포인트 색상 | `css/style.css` 맨 위 `--primary` |
| 상담 폼 전송 방식 | `contact.html` 주석 참고 (기본: 메일 앱으로 전송) |

GitHub 웹에서 파일을 열고 연필(✏️) 아이콘으로 바로 수정 → Commit 하면 1~2분 뒤 사이트에 반영됩니다.



지금 쓸 수 있는 주소는 이렇습니다.

홈페이지: https://dahamsptax.github.io/dahamtax-songpa.github.io/
칼럼 관리자: https://dahamsptax.github.io/dahamtax-songpa.github.io/admin/

본사가 DNS 레코드를 추가하고 제가 푸시하면 아래 주소로 바뀝니다.

홈페이지: https://songpa.dahamtax.com
칼럼 관리자: https://songpa.dahamtax.com/admin/