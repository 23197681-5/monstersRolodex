import React, { useState, useEffect } from 'react';
import {
  solar2Lunar,
  getYearStemBranch,
  getMonthStemBranch,
  getDayStemBranch,
  getHourStemBranch,
} from '@lich-nhu-y/lunar';

// fallback arrays (in case the library returns non-string forms)
const stems = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const branches = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

export default function BaziPage({ initialDateTime }) {
  // default: today at 19:00
  const getDefaultDateTime = () => {
    const dt = initialDateTime ? new Date(initialDateTime) : new Date();
    if (!initialDateTime) {
      dt.setHours(19, 0, 0, 0);
    }
    return dt;
  };

  const _defaultDt = getDefaultDateTime();
  const [datetime, setDatetime] = useState(formatDateTime(_defaultDt));
  const [result, setResult] = useState(null);

  useEffect(() => {
    computeBazi(initialDateTime || _defaultDt);
  }, [initialDateTime]);


function computeHourGanzhiFromDayAndHour(dayGz, hour) {
  const hourBranchIndex = Math.floor((hour + 1) / 2) % 12;
  const dayStemChar = dayGz?.charAt(0);
  const dayStemIndex = stems.indexOf(dayStemChar);
  const hourStemIndex = (dayStemIndex * 2 + hourBranchIndex) % 10;
  return stems[(hourStemIndex+10)%10] + branches[(hourBranchIndex+12)%12];
}

/**
 * Computa os Quatro Pilares (Bazi) usando métodos determinísticos baseados em Ganzhi.
 * A conversão Mês/Ano usa uma aproximação padrão (simplificada).
 *
 * @param {string | Date} isoDatetime Uma string no formato ISO 8601 (e.g., "2025-11-18T23:00:00.000Z") ou um objeto Date.
 */
function computeBazi(isoDatetime) {
    console.log('computeBazi for input:', isoDatetime);

    // 1. Cria e valida o objeto Date
    const dt = typeof isoDatetime === 'string' 
        ? new Date(isoDatetime) 
        : isoDatetime;

    if (isNaN(dt.getTime())) {
        console.error("Erro: A data de entrada é inválida.");
        return null; 
    }
// const year = 2025;
// const month = 11; // November
// const day = 18;
// const hour = 19;

    // 2. Extrai componentes UTC
    const year = dt.getUTCFullYear();

    let month = dt.getUTCMonth() +1;   // 0 (Jan) a 11 (Dez)
    const day = dt.getUTCDate();      // 1 a 31
    if(month == 10 && day >= 20){
      month = 11;
    }
    const hour = dt.getHours();    // 0 a 23, in local time

    // 3. Log da data/hora formatada (Correção de formatação de console)
    const formattedMonth = String(month).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const formattedHour = String(hour).padStart(2, '0');
    console.log(`UTC datetime: ${year}-${formattedMonth}-${formattedDay} ${formattedHour}:00`);

    // --- CÁLCULO DOS PILARES (Ganzhi) ---

    // ** Dia **
    // Usa 'month + 1' porque computeDayGanzhiFromUTC espera mês 1-12
    const dayData = computeDayGanzhiFromUTC(year, month, day);
    const gzDay = dayData.gz;
    
    if (!gzDay) {
        console.error("Erro ao calcular Ganzhi do dia.");
        return null;
    }

    // ** Hora **
    const gzHour = computeHourGanzhiFromDayAndHour(gzDay, hour);

    // ** Ano (Aproximação Simples) **
    const gzYear = computeYearGanzhi(year);
    
    // ** Mês (Aproximação Lunar Fallback) **
    // Usamos o mês Gregoriano (m + 1) como fallback para lunarMonth
    const lunarMonthFallback = month; 
    const gzMonth = computeMonthGanzhiFromLunar(lunarMonthFallback, gzYear);


    // --- SAÍDA E RESULTADOS ---

    console.log('--- Resultados dos Pilares (Ganzhi) ---');
    console.log('JDN (UTC 00:00):', dayData.jd);
    console.log('Pilar do Dia (UTC):', gzDay, `(stemIdx=${dayData.sIdx}, branchIdx=${dayData.bIdx})`);
    console.log('Pilar da Hora (UTC):', gzHour);
    console.log(`Pilar do Ano (${year}):`, gzYear);
    console.log(`Pilar do Mês (Aprox. Lunar ${lunarMonthFallback}):`, gzMonth);
    
    // Set final result
    setResult({ dt, gzYear, gzMonth, gzDay, gzHour });
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

  // Julian Day for a UTC date/time (with fractional day)
  function jdFromDateTimeUTC(y, m, d, hh, min) {
    const jd0 = jdFromDateUTC(y, m, d);
    return jd0 + (hh || 0) / 24 + (min || 0) / 1440;
  }

  // Compute apparent ecliptic longitude of the Sun (degrees) from JD (approx, Meeus)
  function sunEclipticLongitudeDeg(jd) {
    const T = (jd - 2451545.0) / 36525.0;
    // mean longitude, degrees
    let L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
    L0 = ((L0 % 360) + 360) % 360;
    // mean anomaly
    let M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
    M = (M * Math.PI) / 180;
    // equation of center
    const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M) + (0.019993 - 0.000101 * T) * Math.sin(2 * M) + 0.000289 * Math.sin(3 * M);
    // true longitude
    let lambda = L0 + C;
    // normalize
    lambda = ((lambda % 360) + 360) % 360;
    return lambda;
  }

  // Determine lunar month number (1..12) from solar longitude using LiChun anchor (315°)
  // We map longitude sectors of 30° starting at 315° -> month 1 (寅)
  function lunarMonthFromSolarLongitude(jd) {
    const lambda = sunEclipticLongitudeDeg(jd);
    // offset so that 315..345 -> month 1, 345..15 -> month2 etc.
    const offset = ((lambda - 315) % 360 + 360) % 360;
    const m = Math.floor(offset / 30) + 1; // 1..12
    return ((m - 1) % 12) + 1;
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


  // format a Date object as YYYY-MM-DDTHH:mm for datetime-local input (values are UTC 0)
  function formatDateTime(d) {
    if (!d) return '';
    try {
      const yyyy = d.getUTCFullYear();
      const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
      const dd = String(d.getUTCDate()).padStart(2, '0');
      const hh = String(d.getUTCHours()).padStart(2, '0');
      const min = String(d.getUTCMinutes()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
    } catch (e) {
      return '';
    }
  }

  return (
    <div style={{ padding: 24 }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 12 }}>
        <input
          type="datetime-local"
          value={datetime}
          onChange={(e) => setDatetime(e.target.value)}
          style={{
            padding: '10px 12px',
            fontSize: 16,
            borderRadius: 10,
            border: '1px solid #d0d0d0',
            outline: 'none',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            width: 260,
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)'
          }}
        />
        <button
          onClick={() => computeBazi(datetime)}
          style={{
            padding: '10px 18px',
            fontSize: 16,
            borderRadius: 12,
            background: '#007aff',
            color: '#fff',
            border: 'none',
            boxShadow: '0 6px 14px rgba(0,122,255,0.2)',
            cursor: 'pointer',
            fontWeight: 600,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
          }}
        >
          Calcular
        </button>
      </div>

      {result && (
        <div style={{ marginTop: 20 }}>

          {/* Table: Hora | Dia | Mês | Ano with rows Elementos and Animais */}
          <div style={{ marginTop: 16 }}>
            {/** helper: extract stem/branch and map to element/animal **/}
            {(() => {
              // Robust extractors: find Chinese stem/branch inside string or map common latin transliterations
              const normalizeText = (s) => {
                if (!s || typeof s !== 'string') return '';
                try {
                  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
                } catch (e) {
                  return s.toLowerCase();
                }
              };

              const stemNameMap = { giap: '甲', at: '乙', binh: '丙', dinh: '丁', mau: '戊', ky: '己', canh: '庚', tan: '辛', nham: '壬', quy: '癸' };
              const branchNameMap = { ty: '子', suu: '丑', dan: '寅', mao: '卯', thin: '辰', ti: '巳', ngo: '午', mui: '未', than: '申', dau: '酉', tuat: '戌', hoi: '亥' };

              const toStem = (gz) => {
                if (!gz || typeof gz !== 'string') return null;
                for (let i = 0; i < stems.length; i++) if (gz.indexOf(stems[i]) !== -1) return stems[i];
                const norm = normalizeText(gz);
                const tokens = norm.split(/[^a-z0-9]+/);
                for (const t of tokens) if (t && stemNameMap[t]) return stemNameMap[t];
                return null;
              };

              const toBranch = (gz) => {
                if (!gz || typeof gz !== 'string') return null;
                for (let i = 0; i < branches.length; i++) if (gz.indexOf(branches[i]) !== -1) return branches[i];
                const norm = normalizeText(gz);
                const tokens = norm.split(/[^a-z0-9]+/);
                for (const t of tokens) if (t && branchNameMap[t]) return branchNameMap[t];
                return null;
              };

              const stemToElement = (s) => {
                if (!s) return '';
                // determine polarity: stems array even index = Yang(+), odd index = Yin(-)
                const idx = stems.indexOf(s);
                const polarity = idx >= 0 ? (idx % 2 === 0 ? ' +' : ' -') : '';
                // return Portuguese name with Chinese element character and a +/- polarity sign
                if (['甲','乙'].includes(s)) return `Madeira (木)${polarity}`;
                if (['丙','丁'].includes(s)) return `Fogo (火)${polarity}`;
                if (['戊','己'].includes(s)) return `Terra (土)${polarity}`;
                if (['庚','辛'].includes(s)) return `Metal (金)${polarity}`;
                if (['壬','癸'].includes(s)) return `Água (水)${polarity}`;
                return '';
              };

              const branchToAnimal = (b) => {
                if (!b) return '';
                const map = {
                  '子': 'Rato',
                  '丑': 'Boi',
                  '寅': 'Tigre',
                  '卯': 'Coelho',
                  '辰': 'Dragão',
                  '巳': 'Serpente',
                  '午': 'Cavalo',
                  '未': 'Cabra',
                  '申': 'Macaco',
                  '酉': 'Galo',
                  '戌': 'Cão',
                  '亥': 'Porco',
                };
                const pt = map[b] || '';
                // show Portuguese name plus the Chinese branch character
                return pt ? `${pt} (${b})` : '';
              };
              console.log(result);
              const cols = [
                { label: 'Hora', gz: result.gzHour },
                { label: 'Dia', gz: result.gzDay },
                { label: 'Mês', gz: result.gzMonth },
                { label: 'Ano', gz: result.gzYear },
              ];

              // Styles: Mac-like font stack, larger table, white background, square non-header cells
              const containerStyle = {
                backgroundColor: '#ffffff',
                padding: 14,
                borderRadius: 8,
                boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                color: '#111',
                maxWidth: 980,
                margin: '12px auto'
              };

              const tableStyle = {
                width: '100%',
                borderCollapse: 'separate',
                borderSpacing: 0,
                marginTop: 8,
                fontSize: 18
              };

              const thStyle = { border: '1px solid #e6e6e6', padding: '14px', background: '#f5f5f7', textAlign: 'center' };
              const labelCellStyle = { border: '1px solid #e6e6e6', padding: 0, fontWeight: '700', background: '#fafafa', textAlign: 'center', width: 160, height: 160, verticalAlign: 'middle' };
              const cellStyle = { border: '1px solid #e6e6e6', padding: 0, textAlign: 'center', width: 160, height: 160, verticalAlign: 'middle' };

              return (
                <div style={containerStyle}>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={thStyle}></th>
                        {cols.map((c) => (
                          <th key={c.label} style={thStyle}>{c.label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={labelCellStyle}>Elementos</td>
                        {cols.map((c) => (
                          <td key={c.label} style={cellStyle}>
                            <div style={{ padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', boxSizing: 'border-box' }}>
                              <div style={{ lineHeight: 1.15 }}>{stemToElement(toStem(c.gz)) || (c.gz || '')}</div>
                              <div style={{ fontSize: 12, color: '#666', marginTop: 6 }}>{c.gz || ''}</div>
                            </div>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td style={labelCellStyle}>Animais</td>
                        {cols.map((c) => (
                          <td key={c.label} style={cellStyle}>
                            <div style={{ padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', boxSizing: 'border-box' }}>
                              <div style={{ lineHeight: 1.15 }}>{branchToAnimal(toBranch(c.gz)) || (c.gz || '')}</div>
                              <div style={{ fontSize: 12, color: '#666', marginTop: 6 }}>{c.gz || ''}</div>
                            </div>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              );
            })()}
          </div>


        </div>
      )}
    </div>
  );
}
