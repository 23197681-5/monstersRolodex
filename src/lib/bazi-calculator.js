const stems = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const branches = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

function computeHourGanzhiFromDayAndHour(dayGz, hour) {
  const hourBranchIndex = Math.floor((hour + 1) / 2) % 12;
  const dayStemChar = dayGz?.charAt(0);
  const dayStemIndex = stems.indexOf(dayStemChar);
  const hourStemIndex = (dayStemIndex * 2 + hourBranchIndex) % 10;
  return stems[(hourStemIndex+10)%10] + branches[(hourBranchIndex+12)%12];
}

function computeYearGanzhi(year) {
  if (!year || year == undefined)
    return;
  // year stem/branch indexes: (year - 4) mod 10/12
  const sIdx = (year - 4) % 10;
  const bIdx = (year - 4) % 12;
  const s = stems[(sIdx + 10) % 10];
  const b = branches[(bIdx + 12) % 12];
  return s + b;
}

function computeMonthGanzhiFromLunar(lunarMonth, gzYearStr) {
  let lm = Number(lunarMonth -3);
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

// Julian Day Number for a Gregorian date (UTC) at 00:00 UT
function jdFromDateUTC(y, m, d) {
  // m is 1..12
  const a = Math.floor((14 - m) / 12);
  const y2 = y + 4800 - a;
  const m2 = m + 12 * a - 3;
  const jd = d + Math.floor((153 * m2 + 2) / 5) + 365 * y2 + Math.floor(y2 / 4) - Math.floor(y2 / 100) + Math.floor(y2 / 400) - 32045;
  return jd;
}

// Compute day Ganzhi (stem+branch) from UTC date using JDN anchor
function computeDayGanzhiFromUTC(y, m1to12, d) {
  const jd = jdFromDateUTC(y, m1to12, d);
  const sIdx = (jd + 9) % 10;
  const bIdx = (jd + 1) % 12;
  const s = stems[(sIdx + 10) % 10];
  const b = branches[(bIdx + 12) % 12];
  return { gz: s + b, jd, sIdx: (sIdx+10)%10, bIdx: (bIdx+12)%12 };
}

/**
 * Computa os Quatro Pilares (Bazi) para uma data específica.
 * @param {string | Date} isoDatetime Uma string no formato ISO 8601 ou um objeto Date.
 */
export function getBaziForDate(isoDatetime) {
    const dt = typeof isoDatetime === 'string' 
        ? new Date(isoDatetime) 
        : isoDatetime;

    if (isNaN(dt.getTime())) {
        console.error("Erro: A data de entrada é inválida para getBaziForDate.");
        return null; 
    }

    const year = dt.getFullYear();
    let month = dt.getMonth() + 1;
    let day = dt.getDate();
    const hour = dt.getHours();

    const dayData = computeDayGanzhiFromUTC(year, month, day);
    const gzDay = dayData.gz;
    
    if (!gzDay) {
        console.error("Erro ao calcular Ganzhi do dia.");
        return null;
    }

    const gzHour = computeHourGanzhiFromDayAndHour(gzDay, hour);
    const gzYear = computeYearGanzhi(year);
    
    if(month == 11 && day >= 20){
      month = 12;
    }
    const lunarMonthFallback = month; 
    const gzMonth = computeMonthGanzhiFromLunar(lunarMonthFallback, gzYear);

    return { gzYear, gzMonth, gzDay, gzHour };
}

export function parseGameDate(dateStr) {
    const [datePart, timePart] = dateStr.split(' ');
    const [day, month, year] = datePart.split('/');
    const [hour, minute] = timePart.split(':');
    // Formato ISO: YYYY-MM-DDTHH:mm:ss.sssZ
    return new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);
}