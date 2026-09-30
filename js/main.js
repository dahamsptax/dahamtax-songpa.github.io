/* 공통: 헤더/푸터 삽입, 칼럼 카드, 페이지별 기능 */
(function () {
  const S = window.SITE, SV = window.SERVICES || [];
  const page = document.body.dataset.page || "";
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmtDate = d => { const [y, m, dd] = d.split("-"); return `${y}년 ${m}월 ${dd}일`; };
  const catColor = c => ({ "세무기장": "#2b6cd4", "경정청구": "#1f9d74", "아웃소싱": "#7a5af5",
    "세무조사": "#d4502b", "법인전환": "#0f7c9c", "세무노트": "#b8862b" }[c] || "#2b6cd4");

  /* ---------- 헤더 ---------- */
  const nav = [
    ["services.html", "서비스", "services"],
    ["about.html", "세무사 소개", "about"],
    ["column.html", "칼럼", "column"],
    ["faq.html", "자주 묻는 질문", "faq"]
  ];
  const header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML = `
    <div class="container header-inner">
      ${S.logoImage
        ? `<a class="logo logo-img" href="index.html"><img src="${esc(S.logoImage)}" alt="${esc(S.logoText)}"><span class="logo-branch">${esc(S.branch || "")}</span></a>`
        : `<a class="logo" href="index.html"><span class="logo-mark">${esc(S.logoText)}</span><span class="logo-sub">${esc(S.name)}</span></a>`}
      <button class="menu-btn" aria-label="메뉴 열기" aria-expanded="false"><span></span><span></span><span></span></button>
      <nav class="nav">
        <div class="nav-item has-sub">
          <a href="services.html" class="${page === "services" ? "active" : ""}">서비스</a>
          <div class="sub">${SV.map(s => `<a href="services.html#${s.id}">${esc(s.title)}</a>`).join("")}</div>
        </div>
        ${nav.slice(1).map(([h, t, k]) => `<a href="${h}" class="${page === k ? "active" : ""}">${t}</a>`).join("")}
        <a href="contact.html" class="btn btn-primary btn-sm">상담 신청</a>
      </nav>
    </div>`;
  document.body.prepend(header);
  const menuBtn = header.querySelector(".menu-btn");
  menuBtn.addEventListener("click", () => {
    const open = header.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
  });
  window.addEventListener("scroll", () => header.classList.toggle("scrolled", scrollY > 8), { passive: true });

  /* ---------- 푸터 ---------- */
  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `
    <div class="container footer-grid">
      <div>
        <div class="logo logo-footer"><span class="logo-mark">${esc(S.logoText)}</span></div>
        <p class="muted">${esc(S.description)}</p>
      </div>
      <div><h4>서비스</h4>${SV.map(s => `<a href="services.html#${s.id}">${esc(s.title)}</a>`).join("")}</div>
      <div><h4>바로가기</h4>
        <a href="index.html">홈</a><a href="about.html">세무사 소개</a><a href="column.html">칼럼</a>
        <a href="faq.html">자주 묻는 질문</a><a href="contact.html">상담문의</a><a href="${esc(S.blog)}">블로그</a>
      </div>
      <div><h4>사무소 안내</h4>
        <p>${esc(S.address)}</p>
        <p><a href="tel:${esc(S.phone)}">${esc(S.phone)}</a>${S.mobile ? ` / <a href="tel:${esc(S.mobile)}">${esc(S.mobile)}</a>` : ""}<br><a href="mailto:${esc(S.email)}">${esc(S.email)}</a></p>
        <p class="muted">${S.hours.map(esc).join("<br>")}</p>
        <a class="btn btn-primary btn-sm" href="contact.html">상담 신청하기</a>
      </div>
    </div>
    <div class="container footer-bottom">
      <span>© ${new Date().getFullYear()} ${esc(S.name)} (${esc(S.nameEn)}). All rights reserved.</span>
      <a href="privacy.html">개인정보처리방침</a>
    </div>`;
  document.body.append(footer);

  /* ---------- 공통 치환: data-site="phone" 등 ---------- */
  document.querySelectorAll("[data-site]").forEach(el => {
    const key = el.dataset.site, v = S[key];
    if (v == null || v === "") {  // 값이 없으면 dt/dd 줄째로 숨김
      if (el.tagName === "DD" && el.previousElementSibling?.tagName === "DT") el.previousElementSibling.hidden = true;
      el.hidden = true;
      return;
    }
    if (el.tagName === "A" && el.dataset.href) el.href = el.dataset.href + v;
    if ((key === "phone" || key === "mobile") && el.tagName !== "A") {
      el.innerHTML = `<a href="tel:${esc(v)}">${esc(v)}</a>`;
      return;
    }
    el.textContent = Array.isArray(v) ? v.join(" / ") : v;
  });

  /* 홈: 서비스 카드 */
  const svcGrid = document.getElementById("service-grid");
  if (svcGrid) svcGrid.innerHTML = SV.map(s => `
    <a class="svc-card" href="services.html#${s.id}">
      <h3>${esc(s.title)}</h3><p>${esc(s.desc)}</p>
      <span class="tags">${esc(s.tags)}</span><span class="more">자세히 보기 →</span>
    </a>`).join("");

  /* ---------- 칼럼: data/posts.json 에서 불러옴 (관리자 페이지 Pages CMS 로 수정) ---------- */
  const latest = document.getElementById("latest-posts");
  const list = document.getElementById("post-list");
  const article = document.getElementById("post-article");
  if (latest || list || article) {
    fetch("data/posts.json", { cache: "no-cache" })
      .then(r => r.json())
      .catch(() => [])
      .then(renderPosts);
  }

  /* 본문: 관리자(Sveltia CMS)가 저장한 마크다운 → HTML.
     이미지 주소 /images/... 는 하위 경로 사이트에서도 보이도록 상대경로로 바꿈 */
  function bodyHtml(md) {
    const html = window.marked ? window.marked.parse(md || "") : md || "";
    return html.replace(/(src|href)="\/images\//g, '$1="images/');
  }

  /* id 를 비워두면 날짜+제목으로 자동 생성 */
  function postId(p) {
    if (p.id) return String(p.id);
    let h = 0;
    for (const ch of p.title || "") h = (h * 31 + ch.codePointAt(0)) >>> 0;
    return `${p.date}-${h.toString(36)}`;
  }

  function renderPosts(data) {
  const posts = (Array.isArray(data) ? data : [])
    .filter(p => p && p.title && p.date)
    .map(p => ({ category: "", summary: "", body: "", ...p, date: String(p.date).slice(0, 10), id: postId(p) }))
    .sort((a, b) => b.date.localeCompare(a.date));
  const card = p => `
    <a class="post-card" href="post.html?id=${encodeURIComponent(p.id)}">
      <div class="thumb" style="--c:${catColor(p.category)}">
        <span class="thumb-cat">${esc(p.category)}</span>
        <strong>${esc(p.title.split("—")[0].trim())}</strong>
        <span class="thumb-logo">${esc(S.logoText)}</span>
      </div>
      <div class="post-meta">
        <span class="cat" style="color:${catColor(p.category)}">${esc(p.category)}</span>
        <h3>${esc(p.title)}</h3>
        <time>${fmtDate(p.date)}</time>
      </div>
    </a>`;

  /* 홈: 최신 칼럼 3개 */
  if (latest) latest.innerHTML = posts.slice(0, 3).map(card).join("");

  /* 칼럼 목록: 카테고리 필터 + 검색 + 페이지네이션 */
  if (list) {
    const PER = 9;
    const params = new URLSearchParams(location.search);
    let cat = params.get("cat") || "전체", q = "", pg = 1;
    const chips = document.getElementById("chips");
    const pager = document.getElementById("pager");
    chips.innerHTML = ["전체", ...window.CATEGORIES].map(c => `<button class="chip" data-c="${esc(c)}">${esc(c)}</button>`).join("");
    const render = () => {
      chips.querySelectorAll(".chip").forEach(b => b.classList.toggle("on", b.dataset.c === cat));
      const f = posts.filter(p => (cat === "전체" || p.category === cat) &&
        (!q || (p.title + p.summary).toLowerCase().includes(q)));
      const pages = Math.max(1, Math.ceil(f.length / PER));
      pg = Math.min(pg, pages);
      list.innerHTML = f.length ? f.slice((pg - 1) * PER, pg * PER).map(card).join("")
        : `<p class="empty">검색 결과가 없습니다.</p>`;
      pager.innerHTML = pages > 1 ? Array.from({ length: pages }, (_, i) =>
        `<button class="${i + 1 === pg ? "on" : ""}" data-p="${i + 1}">${i + 1}</button>`).join("") : "";
    };
    chips.addEventListener("click", e => { const b = e.target.closest(".chip"); if (b) { cat = b.dataset.c; pg = 1; render(); } });
    pager.addEventListener("click", e => { const b = e.target.closest("button"); if (b) { pg = +b.dataset.p; render(); scrollTo({ top: list.offsetTop - 120, behavior: "smooth" }); } });
    document.getElementById("search").addEventListener("input", e => { q = e.target.value.trim().toLowerCase(); pg = 1; render(); });
    render();
  }

  /* 칼럼 상세 */
  if (article) {
    const id = new URLSearchParams(location.search).get("id");
    const i = posts.findIndex(p => p.id === id);
    const p = posts[i];
    if (!p) {
      article.innerHTML = `<p class="empty">글을 찾을 수 없습니다. <a href="column.html">칼럼 목록으로</a></p>`;
    } else {
      document.title = `${p.title} | ${S.name}`;
      const prev = posts[i + 1], next = posts[i - 1];
      article.innerHTML = `
        <a class="back" href="column.html">← 칼럼 목록</a>
        <span class="cat" style="color:${catColor(p.category)}">${esc(p.category)}</span>
        <h1>${esc(p.title)}</h1>
        <time>${fmtDate(p.date)}</time>
        <div class="post-body">${bodyHtml(p.body)}</div>
        <div class="post-cta">
          <p><strong>비슷한 상황이신가요?</strong><br>사업장 상황에 맞춰 직접 안내드립니다.</p>
          <a class="btn btn-primary" href="contact.html">상담 신청하기</a>
        </div>
        <nav class="post-nav">
          ${prev ? `<a href="post.html?id=${encodeURIComponent(prev.id)}"><small>이전 글</small>${esc(prev.title)}</a>` : "<span></span>"}
          ${next ? `<a class="r" href="post.html?id=${encodeURIComponent(next.id)}"><small>다음 글</small>${esc(next.title)}</a>` : "<span></span>"}
        </nav>`;
    }
  }
  } /* renderPosts */

  /* 서비스 상세 */
  const svcList = document.getElementById("service-list");
  if (svcList) svcList.innerHTML = SV.map((s, n) => `
    <section class="svc-detail" id="${s.id}">
      <span class="num">0${n + 1}</span>
      <div><h2>${esc(s.title)}</h2><p>${esc(s.desc)}</p>
        <p class="muted">여기에 서비스 상세 설명(진행 절차, 대상, 비용 안내 등)을 추가하세요. — 임시 내용</p>
        <span class="tags">${esc(s.tags)}</span></div>
    </section>`).join("");

  /* 상담문의: 빠른 문의(전화·카카오톡) */
  const qc = document.getElementById("quick-contact");
  if (qc) {
    const telIcon = `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/></svg>`;
    const talkIcon = `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M12 3C6.5 3 2 6.6 2 11c0 2.8 1.8 5.3 4.6 6.7L5.7 21a.4.4 0 0 0 .6.4l4-2.6c.6.1 1.1.1 1.7.1 5.5 0 10-3.6 10-8S17.5 3 12 3z"/></svg>`;
    qc.innerHTML = `
      <h3>빠른 문의가 필요하신가요?</h3>
      <a class="qc-btn qc-tel" href="tel:${esc(S.phone)}">${telIcon}<span>${esc(S.phone)}</span></a>
      ${S.kakao && S.kakao !== "#" ? `<a class="qc-btn qc-kakao" href="${esc(S.kakao)}" target="_blank" rel="noopener">${talkIcon}<span>카카오톡으로 문의하기</span></a>` : ""}
      <p class="qc-hours">업무 시간: ${S.hours.map(esc).join(" · ")}</p>`;
  }

  /* FAQ 아코디언 */
  document.querySelectorAll(".faq-q").forEach(b => b.addEventListener("click", () => b.parentElement.classList.toggle("open")));

  /* 상담 폼: 정적 사이트이므로 메일 앱으로 보냄 (Formspree 등으로 교체 가능) */
  const form = document.getElementById("contact-form");
  if (form) {
    const sel = form.querySelector("[name=service]");
    sel.innerHTML += SV.map(s => `<option>${esc(s.title)}</option>`).join("") + "<option>기타 문의</option>";
    const status = form.querySelector(".form-status");
    const btn = form.querySelector("[type=submit]");
    const say = (msg, kind) => { if (status) { status.textContent = msg; status.className = "form-status " + (kind || ""); } };
    form.addEventListener("submit", e => {
      if (form.getAttribute("action")) return; // action 이 설정되어 있으면 그대로 전송
      e.preventDefault();
      const d = new FormData(form);

      /* 구글 Apps Script 로 전송 → 시트 저장 + 슬랙 알림 */
      if (S.formEndpoint) {
        d.append("page", location.href);
        btn.disabled = true;
        say("보내는 중입니다…");
        fetch(S.formEndpoint, { method: "POST", body: new URLSearchParams(d) })
          .then(r => r.json())
          .then(res => {
            if (!res.ok) throw new Error(res.error || "fail");
            form.reset();
            say("상담 문의가 접수되었습니다. 확인 후 빠르게 연락드리겠습니다.", "ok");
          })
          .catch(() => say(`전송에 실패했습니다. 잠시 후 다시 시도하시거나 ${S.phone} 로 전화 주세요.`, "err"))
          .finally(() => { btn.disabled = false; });
        return;
      }

      /* formEndpoint 가 없으면 메일 앱으로 */
      const body = ["성함", "연락처", "이메일", "사업자 구분", "문의 서비스", "문의 내용"]
        .map((k, j) => `${k}: ${d.get(["name", "phone", "email", "type", "service", "message"][j]) || ""}`).join("\n");
      location.href = `mailto:${S.email}?subject=${encodeURIComponent("[홈페이지 상담문의] " + d.get("name"))}&body=${encodeURIComponent(body)}`;
    });
  }
})();
