import React, { useState, useEffect } from 'react';
import { getBaziForDate } from '../src/lib/bazi-calculator';

// fallback arrays (in case the library returns non-string forms)
const stems = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const branches = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

export default function BaziPage({ initialDateTime, onBaziCalculated }) {
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

/**
 * Computa os Quatro Pilares (Bazi) usando métodos determinísticos baseados em Ganzhi.
 * A conversão Mês/Ano usa uma aproximação padrão (simplificada).
 *
 * @param {string | Date} isoDatetime Uma string no formato ISO 8601 (e.g., "2025-11-18T23:00:00.000Z") ou um objeto Date.
 */
function computeBazi(isoDatetime) {
    const baziResultData = getBaziForDate(isoDatetime);
    if (!baziResultData) return;

    const dt = typeof isoDatetime === 'string' ? new Date(isoDatetime) : isoDatetime;
    const finalResult = { dt, ...baziResultData };

    setResult(finalResult);
    if (onBaziCalculated) {
      onBaziCalculated(baziResultData);
    }
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
                            </div>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td style={labelCellStyle}>Animais</td>
                        {cols.map((c) => (
                          <td key={c.label} style={cellStyle}>
                            <div style={{ padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', boxSizing: 'border-box' }}>
                              <div style={{ lineHeight: 1.15 }}>{branchToAnimal(toBranch(c.gz)) }</div>
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
