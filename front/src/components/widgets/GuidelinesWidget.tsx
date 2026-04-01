import type { FC } from "react";
import { useFetch } from "../../hooks/useFetch.ts";
import { FetchWrapper } from "../FetchWrapper.tsx";
import { apiUrl } from "../../api/common.ts";

interface RegionalGuidelineDTO {
    id: number;
    object: string;
    content: string;
}

export const GuidelinesWidget: FC = () => {
    const { data: guidelines, loading, error } = useFetch<RegionalGuidelineDTO[]>(
        apiUrl("/guidelines"),
        60_000
    );

    return (
        <FetchWrapper loading={loading} error={error}>
            <div className="widget-container">
                <div className="widget-toolbar">
                    <span className="widget-toolbar-title">Dernières directives régionales</span>
                </div>

                <div className="guidelines-list">
                    {guidelines && guidelines.length === 0 && (
                        <p className="guidelines-empty">Aucune directive disponible.</p>
                    )}
                    {guidelines?.map(g => (
                        <div key={g.id} className="guideline-item">
                            <h4 className="guideline-object">{g.object}</h4>
                            <p className="guideline-content">{g.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </FetchWrapper>
    );
};
