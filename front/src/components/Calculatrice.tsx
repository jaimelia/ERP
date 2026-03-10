import {useState, type FC} from "react";

export const Calculatrice: FC = () => {
    const [valeurCourante, setValeurCourante] = useState<string>("0");
    const [valeurPrecedente, setValeurPrecedente] = useState<string | null>(null);
    const [operateur, setOperateur] = useState<string | null>(null);
    const [attenteNouvelleValeur, setAttenteNouvelleValeur] = useState<boolean>(false);

    const ajouterChiffre = (chiffre: string): void => {
        if (attenteNouvelleValeur) {
            setValeurCourante(chiffre);
            setAttenteNouvelleValeur(false);
        } else {
            if (chiffre === "." && valeurCourante.includes(".")) {
                return;
            }

            if (valeurCourante === "0" && chiffre !== ".") {
                setValeurCourante(chiffre);
            } else {
                setValeurCourante(valeurCourante + chiffre);
            }
        }
    };

    const choisirOperateur = (op: string): void => {
        if (operateur && !attenteNouvelleValeur) {
            calculer();
        } else {
            setValeurPrecedente(valeurCourante);
        }
        setOperateur(op);
        setAttenteNouvelleValeur(true);
    };

    const calculer = (): void => {
        if (!operateur || !valeurPrecedente) return;

        const prev = parseFloat(valeurPrecedente);
        const current = parseFloat(valeurCourante);
        let resultat = 0;

        switch (operateur) {
            case "+":
                resultat = prev + current;
                break;
            case "-":
                resultat = prev - current;
                break;
            case "x":
                resultat = prev * current;
                break;
            case "÷":
                if (current === 0) {
                    setValeurCourante("Erreur");
                    setOperateur(null);
                    setValeurPrecedente(null);
                    setAttenteNouvelleValeur(true);
                    return;
                }
                resultat = prev / current;
                break;
            default:
                return;
        }

        setValeurCourante(String(Math.round(resultat * 10000000) / 10000000));
        setOperateur(null);
        setValeurPrecedente(null);
        setAttenteNouvelleValeur(true);
    };

    const effacerTout = (): void => {
        setValeurCourante("0");
        setValeurPrecedente(null);
        setOperateur(null);
        setAttenteNouvelleValeur(false);
    };

    const effacerDernier = (): void => {
        setValeurCourante(prev => (prev.length > 1 ? prev.slice(0, -1) : "0"));
    };

    const inverserSigne = (): void => {
        setValeurCourante(prev => String(parseFloat(prev) * -1));
    };

    const pourcentage = (): void => {
        setValeurCourante(prev => String(parseFloat(prev) / 100));
    };

    const touches = [
        "CE", "←", "%", "+",
        "7", "8", "9", "-",
        "4", "5", "6", "x",
        "1", "2", "3", "÷",
        "0", "±", ",", "="
    ];

    return (
        <div className="widget-calculatrice">
            <div className="calculatrice-ecran">{valeurCourante.replace(".", ",")}</div>
            <div className="calculatrice-grille">
                {touches.map(touche => (
                    <button
                        key={touche}
                        type="button"
                        onClick={() => {
                            if (touche === "CE") effacerTout();
                            else if (touche === "←") effacerDernier();
                            else if (touche === "±") inverserSigne();
                            else if (touche === "%") pourcentage();
                            else if (touche === "=") calculer();
                            else if (["+", "-", "x", "÷"].includes(touche)) choisirOperateur(touche);
                            else if (touche === ",") ajouterChiffre(".");
                            else ajouterChiffre(touche);
                        }}
                    >
                        {touche}
                    </button>
                ))}
            </div>
        </div>
    );
};