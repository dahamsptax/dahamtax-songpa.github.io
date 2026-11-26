/* =========================================================
   사이트 기본 정보 — 여기만 고치면 전체 페이지에 반영됩니다.
   ========================================================= */
window.SITE = {
  name: "다함세무법인 송파지점",      // 사무소 이름
  nameEn: "Daham Tax Corp. Songpa Branch",
  logoText: "다함세무법인",             // 로고 이미지가 없을 때 표시할 글자 (푸터에도 사용)
  logoImage: "images/logo2.png",     // 헤더 로고 이미지 (비워두면 logoText 표시)
  branch: "송파지점",                  // 로고 옆에 표시할 지점명
  domain: "https://songpa.dahamtax.com", // 홈페이지 주소 (CNAME 파일과 같게)
  tagline: "정확한 신고를 넘어, 절세의 기준을 만듭니다",
  description: "회계장부 작성부터 경정청구, 세무조사 대응까지 기업 세무 전반을 관리합니다.",
  address: "서울특별시 송파구 토성로15길 3-3, 201호",
  phone: "02-477-7042",                // 사무실 전화
  mobile: "010-8674-9260",             // 휴대폰 (비워두면 표시 안 함)
  email: "dahamsp@naver.com",
  formEndpoint: "https://script.google.com/macros/s/AKfycbxEdIkGsUrdRWanlnozqa1YareOuiz5EIErmBR1UoCU8tl8qGEqLSjWiAaXjJppusJh/exec",               // 상담문의 수신 주소 (구글 Apps Script 웹 앱 URL, tools/contact-notify.gs 참고). 비워두면 메일 앱으로 전송
  kakao: "https://pf.kakao.com/_HGdEn/chat", // 카카오톡 채널 1:1 채팅 링크 (상담문의 빠른 문의 버튼)
  blog: "#",                         // 네이버 블로그 링크
  mapLink: "https://map.naver.com/p/search/%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C%20%EC%86%A1%ED%8C%8C%EA%B5%AC%20%ED%86%A0%EC%84%B1%EB%A1%9C15%EA%B8%B8%203-3", // 지도 클릭 시 열리는 네이버 지도 (주소 검색)
  hours: ["평일 09:00 – 18:00", "주말·공휴일 휴무"]
};

/* 서비스 목록 (홈 · 서비스 페이지 · 메뉴에서 공통 사용) */
window.SERVICES = [
  { id: "bookkeeping", title: "기장대리",
    desc: "법인세·부가세·원천세 신고와 장부 관리, 급여·4대보험까지 맡길 수 있습니다.",
    tags: "세무기장 · 세금신고 · 급여·4대보험" },
  { id: "outsourcing", title: "경리 아웃소싱",
    desc: "전자세금계산서 발행, 근로계약서 전자서명, 월 결산과 채권·채무 관리를 대신 처리합니다.",
    tags: "세금계산서 · 전자서명 · 월 결산" },
  { id: "cases", title: "업무사례",
    desc: "연매출 200억 건축자재 도소매업의 경영 아웃소싱을 실제로 운영하고 있습니다.",
    tags: "실제 운영 사례 · 유통업 관리 포인트" },
  { id: "client-web", title: "client 웹",
    desc: "세금계산서 발행, 근로계약서 전자서명, 실시간 손익을 대표님이 웹에서 직접 확인합니다.",
    tags: "실시간 손익 · 전자서명" },
  { id: "pricing", title: "요금 안내",
    desc: "회사 규모와 필요에 맞는 LITE · STANDARD · CUSTOMIZED 플랜을 안내합니다.",
    tags: "월 13만원~ · 월 15만원~" },
  { id: "process", title: "진행 절차",
    desc: "상담부터 서비스 시작까지, 기존 세무대리인 자료 이관도 저희가 처리합니다.",
    tags: "전자 계약 · 자료 이관" }
];

/* 칼럼 카테고리 (칼럼 목록 필터 버튼 순서)
   ※ 바꾸면 .pages.yml 의 category values 도 똑같이 맞춰 주세요. */
window.CATEGORIES = ["세무기장", "경정청구", "아웃소싱", "세무조사", "법인전환", "세무노트"];
