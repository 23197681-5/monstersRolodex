import React, { useState } from 'react';
import { supabase } from './supabaseClient';

const heavenlyStems = [
  { value: '甲', label: '甲 (jiǎ) - Madeira Yang' },
  { value: '乙', label: '乙 (yǐ) - Madeira Yin' },
  { value: '丙', label: '丙 (bǐng) - Fogo Yang' },
  { value: '丁', label: '丁 (dīng) - Fogo Yin' },
  { value: '戊', label: '戊 (wù) - Terra Yang' },
  { value: '己', label: '己 (jǐ) - Terra Yin' },
  { value: '庚', label: '庚 (gēng) - Metal Yang' },
  { value: '辛', label: '辛 (xīn) - Metal Yin' },
  { value: '壬', label: '壬 (rén) - Água Yang' },
  { value: '癸', label: '癸 (guǐ) - Água Yin' },
];

const earthlyBranches = [
  { value: '子', label: '子 (zǐ) - Rato' },
  { value: '丑', label: '丑 (chǒu) - Boi' },
  { value: '寅', label: '寅 (yín) - Tigre' },
  { value: '卯', label: '卯 (mǎo) - Coelho' },
  { value: '辰', label: '辰 (chén) - Dragão' },
  { value: '巳', label: '巳 (sì) - Serpente' },
  { value: '午', label: '午 (wǔ) - Cavalo' },
  { value: '未', label: '未 (wèi) - Cabra' },
  { value: '申', label: '申 (shēn) - Macaco' },
  { value: '酉', label: '酉 (yǒu) - Galo' },
  { value: '戌', label: '戌 (xū) - Cão' },
  { value: '亥', label: '亥 (hài) - Porco' },
];

const formContainerStyle = {
  padding: '2rem',
  maxWidth: '800px',
  margin: '2rem auto',  
  backgroundColor: '#f5f5f7',
  borderRadius: '12px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  color: '#111',
};

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  marginBottom: '1rem',
  borderRadius: '8px',
  border: '1px solid #d1d1d1',
  fontSize: '16px',
  backgroundColor: '#fff',
  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)',
  outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle = {
  display: 'block',
  marginBottom: '0.5rem',
  fontWeight: 'bold',
  color: '#333',
};

const buttonStyle = {
  padding: '12px 18px',
  border: 'none',
  background: '#007aff',
  color: '#fff',
  borderRadius: '10px',
  cursor: 'pointer',
  fontSize: '16px',
  width: '100%',
  fontWeight: '600',
  boxShadow: '0 4px 12px rgba(0,122,255,0.25)',
  transition: 'background 0.2s ease, transform 0.1s ease',
};

const pillarStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '1rem',
  marginBottom: '1rem',
  border: '1px solid #ddd',
  padding: '1rem',
  borderRadius: '4px',
};

export default function CadastrarTime() {
  const [formData, setFormData] = useState({
    nome: '',
    data_fundacao: '',
    historia: '',
    elemento_ano: '',
    animal_ano: '',
    elemento_mes: '',
    animal_mes: '',
    elemento_dia: '',
    animal_dia: '',
    elemento_hora: '',
    animal_hora: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    let imageUrl = null;
    if (imageFile) {
      const fileName = `${Date.now()}_${imageFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('imagens_times') // Crie um bucket 'imagens_times' no seu Supabase
        .upload(fileName, imageFile);

      if (uploadError) {
        setMessage(`Erro no upload da imagem: ${uploadError.message}`);
        setIsSubmitting(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('imagens_times')
        .getPublicUrl(fileName);
      
      imageUrl = publicUrlData.publicUrl;
    }

    const dataToInsert = { ...formData, img: imageUrl };

    const { error } = await supabase.from('times').insert([dataToInsert]);

    if (error) {
      setMessage(`Erro ao cadastrar time: ${error.message}`);
    } else {
      setMessage('Time cadastrado com sucesso!');
      // Limpar formulário
      setFormData({
        nome: '', data_fundacao: '', historia: '',
        elemento_ano: '', animal_ano: '', elemento_mes: '', animal_mes: '',
        elemento_dia: '', animal_dia: '', elemento_hora: '', animal_hora: '',
      });
      setImageFile(null);
      e.target.reset();
    }
    setIsSubmitting(false);
  };

  const renderPillar = (pillarName) => (
    <div style={pillarStyle}>
      <div>
        <label style={labelStyle}>Elemento {pillarName}</label>
        <select name={`elemento_${pillarName.toLowerCase()}`} onChange={handleChange} value={formData[`elemento_${pillarName.toLowerCase()}`]} style={inputStyle}>
          <option value="">Selecione</option>
          {heavenlyStems.map(stem => <option key={stem.value} value={stem.value}>{stem.label}</option>)}
        </select>
      </div>
      <div>
        <label style={labelStyle}>Animal {pillarName}</label>
        <select name={`animal_${pillarName.toLowerCase()}`} onChange={handleChange} value={formData[`animal_${pillarName.toLowerCase()}`]} style={inputStyle}>
          <option value="">Selecione</option>
          {earthlyBranches.map(branch => <option key={branch.value} value={branch.value}>{branch.label}</option>)}
        </select>
      </div>
    </div>
  );

  return (
    <div style={formContainerStyle}>
      <h1>Cadastrar Novo Time</h1>
      <form onSubmit={handleSubmit}>
        <label style={labelStyle}>Nome do Time</label>
        <input type="text" name="nome" onChange={handleChange} value={formData.nome} required style={inputStyle} />

        <label style={labelStyle}>Data de Fundação</label>
        <input type="date" name="data_fundacao" onChange={handleChange} value={formData.data_fundacao} style={inputStyle} />

        <label style={labelStyle}>História</label>
        <textarea name="historia" onChange={handleChange} value={formData.historia} style={inputStyle} rows="4"></textarea>

        <label style={labelStyle}>Escudo do Time</label>
        <input type="file" name="img" onChange={handleFileChange} accept="image/*" style={inputStyle} />

        <h3>Pilares do Destino (Bazi)</h3>
        {renderPillar('Ano')}
        {renderPillar('Mês')}
        {renderPillar('Dia')}
        {renderPillar('Hora')}

        <button type="submit" disabled={isSubmitting} style={buttonStyle}>
          {isSubmitting ? 'Cadastrando...' : 'Cadastrar Time'}
        </button>
      </form>
      {message && <p style={{ marginTop: '1rem', color: message.includes('Erro') ? 'red' : 'green' }}>{message}</p>}
    </div>
  );
}