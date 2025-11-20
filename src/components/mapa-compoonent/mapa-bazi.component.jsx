import React, { useState, useEffect } from "react";
import Card from "../card-component/card.component";
import { supabase } from "../../lib/supabaseClient";

import styles from './mapa-bazi.module.css';

export default function MapaBazi({ filter = '', selectedTeam, onTeamHover, selectionColor }) {
    const [allTeams, setAllTeams] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const hardcodedTeams = [
        {
            name: "Mirassol", img: "image001.png",
            arvore: "50 / 449 = 11,14% → Deficiente (<15%)",
            fogo: "162 / 449 = 36,08% → Dentro do equilíbrio (não é excesso >40%)",
            terra: "120 / 449 = 26,73% → Dentro do equilíbrio",
            metal: "105 / 449 = 23,39% → Dentro do equilíbrio",
            agua: "12 / 449 = 2,67% → Deficiente (<15%)"
        },
        {
            name: "Sport", img: "image002.png",
            arvore: "50 ÷ 405 = 0.12345679 → 12.35%",
            fogo: "120 ÷ 405 = 0.29629630 → 29.63%",
            terra: "15 ÷ 405 = 0.03703704 → 3.70%",
            metal: "120 ÷ 405 = 0.29629630 → 29.63%",
            agua: "100 ÷ 405 = 0.24691358 → 24.69%",
            Dia: "壬 (Rén) — Yang água / 子 (Zǐ) — Rato",
            Mês: " 辛 (Xīn) — Yin metal / 巳 (Sì) — Serpente",
            Ano: "乙 (Yǐ) — Yin madeira / 巳 (Sì) — Serpente"
        },
        {
            name: "Botafogo", img: "image003.png",
            arvore: "92 ÷ 411.5 = 0.22364 → 22.36%",
            fogo: "15 ÷ 411.5 = 0.03645 → 3.65%",
            terra: "135 ÷ 411.5 = 0.32798 → 32.80%",
            metal: "60 ÷ 411.5 = 0.14580 → 14.58%",
            agua: "109.5 ÷ 411.5 = 0.26613 → 26.61%"
        },
        { name: "Palmeiras", img: "image004.png" },
        { name: "Fortaleza", img: "image005.png" },
        { name: "Internacional", img: "image006.png" },
        { name: "Flamengo", img: "image007.png" },
        { name: "Flamengo 2", img: "image008.png" },
        { name: "São Paulo", img: "image011.png" },
        { name: "Cruzeiro", img: "image012.png" },
        { name: "Bahia", img: "image013.png" },
        { name: "Corinthians", img: "image014.png" },
        { name: "Vitória", img: "image015.png" },
        { name: "Vasco", img: "image016.png" },
        { name: "Juventude", img: "image017.png" },
        { name: "Grêmio", img: "image018.png" },
        { name: "Fluminense", img: "image019.png" },
        { name: "Atlético-MG", img: "image020.png" },
        { name: "RB Bragantino", img: "image021.png" },
        { name: "CEARÁ", img: "image022.png" },
        { name: "SANTOS", img: "image023.png" },
        { name: "Atlético-GO", img: "image024.png" },
        { name: "Criciúma", img: "image025.png" },
        { name: "Cuiabá", img: "image026.png" },
        { name: "Athletico-PR", img: "image027.png" },
        { name: "Volta Redonda", img: "image028.png" },
        { name: "Athletic", img: "image029.png" },
        { name: "Remo", img: "image030.png" },
        { name: "Ferroviária", img: "image031.png" },
        { name: "Amazonas", img: "image032.png" },
    ];

    useEffect(() => {
        const fetchTeams = async () => {
            setIsLoading(true);
            setError(null);

            const { data: supabaseTeams, error: supabaseError } = await supabase
                .from('times')
                .select('*');

            if (supabaseError) {
                console.error("Erro ao buscar times do Supabase:", supabaseError);
                setError("Não foi possível carregar os times cadastrados.");
                // Mesmo com erro, carregamos os times estáticos
                setAllTeams(hardcodedTeams);
            } else {
                // Mapeia os times do Supabase para o formato esperado pelo Card
                const formattedSupabaseTeams = supabaseTeams.map(team => ({
                    name: team.nome,
                    img: team.img, // Assumindo que 'img' é a URL da imagem
                    // Adicione outros campos se necessário, com valores padrão
                    arvore: '', fogo: '', terra: '', metal: '', agua: '',
                }));

                // Combina os times estáticos com os do Supabase
                setAllTeams([...hardcodedTeams, ...formattedSupabaseTeams]);
            }

            setIsLoading(false);
        };

        fetchTeams();
    }, []); // O array vazio faz com que o useEffect rode apenas uma vez, quando o componente monta.

    const filteredTeams = allTeams.filter((t) => {
        if (!filter) return true;
        return t.name.toLowerCase().includes(filter.toLowerCase());
    });

    return (
        <div className="w-full flex flex-col items-center p-12">
            {isLoading && <p>Carregando times...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className={styles.cardList}>
                {!isLoading && filteredTeams.map((t, i) => {
                        const isSelected = selectedTeam && selectedTeam.name === t.name;
                        // adapt team shape expected by Card component
                        const team = {
                            id: i,
                            name: t.name,
                            img: t.img,
                            terra: t.terra || '',
                            metal: t.metal || '',
                            agua: t.agua || '',
                            arvore: t.arvore || '',
                            fogo: t.fogo || '',
                            email: t.email || ''
                        };
                        return (
                            <div 
                                key={i} 
                                onMouseOver={() => onTeamHover && onTeamHover(t)}
                                style={isSelected ? { border: `2px solid ${selectionColor}`, backgroundColor: '#e6ffed', borderRadius: '14px' } : {}}
                            >
                                <Card team={team} />
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}