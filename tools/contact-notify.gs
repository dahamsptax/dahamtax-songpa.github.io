/**
 * 홈페이지 상담문의 → 구글 시트 저장 + 슬랙(선택: 이메일) 알림
 *
 * 설치: 구글 시트 새로 만들기 → 확장 프로그램 → Apps Script → 이 코드 전체 붙여넣기
 *   → 프로젝트 설정(톱니) → 스크립트 속성 추가
 *        SLACK_WEBHOOK_URL : 슬랙 Incoming Webhook 주소 (https://hooks.slack.com/services/...)
 *        NOTIFY_EMAIL      : (선택) 알림 받을 이메일, 여러 개면 쉼표로 구분
 *   → 배포 → 새 배포 → 유형: 웹 앱, 실행 사용자: 나, 액세스 권한: 모든 사용자 → 배포
 *   → 나오는 웹 앱 URL(https://script.google.com/macros/s/.../exec)을 js/config.js 의 formEndpoint 에 입력
 *
 * 웹훅 주소는 여기(스크립트 속성)에만 두고 홈페이지 코드에는 넣지 않습니다.
 */

const SHEET_NAME = '상담문의';
const HEADERS = ['접수시각', '성함', '연락처', '이메일', '사업자 구분', '문의 서비스', '문의 내용', '접수 페이지'];
const MAX_PER_MINUTE = 20; // 1분에 이 이상 들어오면 스팸으로 보고 무시

function doPost(e) {
  const p = (e && e.parameter) || {};

  // 스팸 방지: 사람에게 안 보이는 칸(website)에 값이 있으면 봇
  if (p.website) return json_({ ok: true });
  if (!p.name || !p.phone || !p.message) return json_({ ok: false, error: 'required' });
  if (tooMany_()) return json_({ ok: false, error: 'busy' });

  const d = {
    name: clip_(p.name, 50),
    phone: clip_(p.phone, 30),
    email: clip_(p.email, 100),
    type: clip_(p.type, 20),
    service: clip_(p.service, 50),
    message: clip_(p.message, 3000),
    page: clip_(p.page, 200),
  };

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    sheet_().appendRow([new Date(), d.name, d.phone, d.email, d.type, d.service, d.message, d.page].map(safeCell_));
  } finally {
    lock.releaseLock();
  }

  notifySlack_(d);
  notifyEmail_(d);
  return json_({ ok: true });
}

/* 브라우저에서 웹 앱 주소를 열었을 때 동작 확인용 */
function doGet() {
  return json_({ ok: true, message: '상담문의 수신기가 동작 중입니다.' });
}

/* Apps Script 편집기에서 실행해 슬랙·이메일 알림을 시험하는 함수 */
function testNotify() {
  const d = { name: '테스트', phone: '010-0000-0000', email: '', type: '개인사업자', service: '세무기장 / 자문', message: '알림 테스트입니다.', page: 'test' };
  notifySlack_(d);
  notifyEmail_(d);
}

function notifySlack_(d) {
  const url = PropertiesService.getScriptProperties().getProperty('SLACK_WEBHOOK_URL');
  if (!url) return;
  const lines = [
    ':bell: *새 상담문의가 접수되었습니다*',
    `*성함* ${d.name}   *연락처* ${d.phone}`,
    d.email ? `*이메일* ${d.email}` : '',
    `*구분* ${d.type || '-'}   *서비스* ${d.service || '-'}`,
    '*문의 내용*',
    '>' + d.message.replace(/\n/g, '\n>'),
  ].filter(Boolean);
  UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({ text: lines.join('\n') }),
    muteHttpExceptions: true,
  });
}

function notifyEmail_(d) {
  const to = PropertiesService.getScriptProperties().getProperty('NOTIFY_EMAIL');
  if (!to) return;
  MailApp.sendEmail({
    to: to,
    subject: `[홈페이지 상담문의] ${d.name} (${d.phone})`,
    body: [
      `성함: ${d.name}`, `연락처: ${d.phone}`, `이메일: ${d.email}`,
      `사업자 구분: ${d.type}`, `문의 서비스: ${d.service}`, '', d.message,
    ].join('\n'),
  });
}

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
  }
  return sh;
}

function tooMany_() {
  const cache = CacheService.getScriptCache();
  const key = 'n' + Math.floor(Date.now() / 60000);
  const n = Number(cache.get(key) || 0) + 1;
  cache.put(key, String(n), 120);
  return n > MAX_PER_MINUTE;
}

function clip_(v, n) {
  return String(v == null ? '' : v).trim().slice(0, n);
}

/* 시트에서 = + - @ 로 시작하는 값이 수식으로 실행되지 않도록 */
function safeCell_(v) {
  return typeof v === 'string' && /^[=+\-@]/.test(v) ? "'" + v : v;
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
