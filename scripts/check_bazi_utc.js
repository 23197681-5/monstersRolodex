// Quick check script: compute JDN-based day Ganzhi and hour Ganzhi for a UTC datetime
const stems = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const branches = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

function jdFromDateUTC(y, m, d) {
  const a = Math.floor((14 - m) / 12);
  const y2 = y + 4800 - a;
  const m2 = m + 12 * a - 3;
  const jd = d + Math.floor((153 * m2 + 2) / 5) + 365 * y2 + Math.floor(y2 / 4) - Math.floor(y2 / 100) + Math.floor(y2 / 400) - 32045;
  return jd;
}

function computeDayGanzhiFromUTC(y, m1to12, d) {
  const jd = jdFromDateUTC(y, m1to12, d);
  const sIdx = (jd + 9) % 10;
  const bIdx = (jd + 1) % 12;
  const s = stems[(sIdx + 10) % 10];
  const b = branches[(bIdx + 12) % 12];
  return { gz: s + b, jd, sIdx: (sIdx+10)%10, bIdx: (bIdx+12)%12 };
}

function computeHourGanzhiFromDayAndHour(dayGz, hour) {
  const hourBranchIndex = Math.floor((hour + 1) / 2) % 12;
  const dayStemChar = dayGz.charAt(0);
  const dayStemIndex = stems.indexOf(dayStemChar);
  const hourStemIndex = (dayStemIndex * 2 + hourBranchIndex) % 10;
  return stems[(hourStemIndex+10)%10] + branches[(hourBranchIndex+12)%12];
}

// Year ganzhi (simple astronomical mapping: (year - 4) mod 10/12)
function computeYearGanzhi(year) {
  const sIdx = (year - 4) % 10;
  const bIdx = (year - 4) % 12;
  const s = stems[(sIdx + 10) % 10];
  const b = branches[(bIdx + 12) % 12];
  return s + b;
}

// Month ganzhi approximation using lunarMonth (1..12) and year stem
function computeMonthGanzhiFromLunar(lunarMonth, gzYearStr) {
  let lm = Number(lunarMonth);
  if (Number.isNaN(lm)) lm = 1;
  if (lm >= 0 && lm <= 11) lm = lm + 1;
  lm = ((lm - 1) % 12) + 1;
  const bIdx = (lm + 1) % 12;
  const yearStemChar = gzYearStr && gzYearStr.length ? gzYearStr.charAt(0) : null;
  let yStemIdx = 0;
  if (yearStemChar) {
    const idx = stems.indexOf(yearStemChar);
    yStemIdx = idx >= 0 ? idx : 0;
  }
  const sIdx = (yStemIdx * 2 + lm) % 10;
  const s = stems[(sIdx + 10) % 10];
  const b = branches[(bIdx + 12) % 12];
  return s + b;
}

// Target: 2025-11-18 19:00 UTC
const y = 2025;
const m = 11; // November
const d = 18;
const hour = 19;

const day = computeDayGanzhiFromUTC(y, m, d);
const hourGz = computeHourGanzhiFromDayAndHour(day.gz, hour);

console.log('UTC datetime: %s-%02d-%02d %02d:00', y, m, d, hour);
console.log('JDN (UTC 00:00):', day.jd);
console.log('Day Ganzhi:', day.gz, `(stemIdx=${day.sIdx}, branchIdx=${day.bIdx})`);
console.log('Hour Ganzhi (@ hour', hour + '):', hourGz);

// Also print the underlying stem/branch separately
console.log('Day stem:', day.gz.charAt(0), 'Day branch:', day.gz.charAt(1));
console.log('Hour stem:', hourGz.charAt(0), 'Hour branch:', hourGz.charAt(1));


const yearGz = computeYearGanzhi(y);
// For this quick check we'll use the Gregorian month as a fallback lunar month
const lunarMonthFallback = m;
const monthGz = computeMonthGanzhiFromLunar(lunarMonthFallback, yearGz);
console.log('Year Ganzhi:', yearGz);
console.log('Month Ganzhi (approx, lunarMonth fallback=' + lunarMonthFallback + '):', monthGz);
