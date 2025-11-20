import React, { useState, useEffect } from "react";
import Card from "../card-component/card.component";
import { supabase } from "../../lib/supabaseClient";

import { hardcodedTeams } from "../../lib/hardcoded-teams";
import styles from './mapa-bazi.module.css';

export default function MapaBazi({ filter = '', selectedTeam, onTeamHover, selectionColor, onFilterCountChange, onTeamSelected }) {
    const [allTeams, setAllTeams] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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
                    // Inclui todos os outros dados do time para o cálculo e exibição
                    ...team,
                    img: team.img, // Assumindo que 'img' é a URL da imagem
                    // Adicione outros campos se necessário, com valores padrão
                    // arvore: '', fogo: '', terra: '', metal: '', agua: '',
                }));

                // Combina os times estáticos com os do Supabase
                setAllTeams([...hardcodedTeams, ...formattedSupabaseTeams]);
            }

            setIsLoading(false);
        };

        fetchTeams();
    // Adicionamos onDataLoaded como dependência
    }, []); // O array vazio faz com que o useEffect rode apenas uma vez, quando o componente monta.

    const filteredTeams = allTeams.filter((t) => {
        if (!filter) return true;
        return t.nome.toLowerCase().includes(filter.toLowerCase());
    });

    useEffect(() => {
        // Informa o componente pai sobre a contagem de times filtrados.
        if (onFilterCountChange) {
            onFilterCountChange(filteredTeams.length);
        }

        // Se houver exatamente um time filtrado, informa o componente pai.
        // Isso "salva" a seleção para o cálculo.
        if (onTeamSelected) {
            if (filteredTeams.length === 1) {
                onTeamSelected(filteredTeams[0]);
            } else {
                onTeamSelected(null);
            }
        }
    }, [filteredTeams, onFilterCountChange, onTeamSelected]);

    return (
        <div className="w-full flex flex-col items-center p-12">
            {isLoading && <p>Carregando times...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className={styles.cardList}>
                {!isLoading && filteredTeams.map((t, i) => {
                        // O estilo de seleção é aplicado quando há apenas um card na lista
                        const isSelected = selectedTeam && selectedTeam.nome === t.nome;
                        // adapt team shape expected by Card component
                        const team = {
                            id: i,
                            name: t.nome, // O componente Card espera 'name', então mantemos a tradução aqui
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