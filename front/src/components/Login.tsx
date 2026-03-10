import {useState, type FC, type FormEvent} from "react";
import {USERS} from "../data/stationConfig";
import type {ThemeKey, User} from "../types";

interface LoginProps {
    onLogin: (user: User) => void;
    theme: ThemeKey;
    toggleTheme: () => void;
}

export const Login: FC<LoginProps> = ({onLogin, theme, toggleTheme}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);

    const submit = (): void => {
        if (busy) {
            return;
        }

        setBusy(true);
        setError("");

        setTimeout(() => {
            const user = USERS.find(candidate => candidate.username === username && candidate.password === password);
            if (user) {
                onLogin(user);
            } else {
                setError("Identifiants incorrects.");
            }
            setBusy(false);
        }, 400);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        submit();
    };

    return (
        <div className="login-screen">
            <button
                type="button"
                className="login-theme-button"
                onClick={toggleTheme}
                aria-label={theme === "dark" ? "Activer le mode clair" : "Activer le mode sombre"}
            >
                {theme === "dark" ? "☀️" : "🌙"}
            </button>
            <section className="login-card">
                <div className="login-brand">
                    <div className="login-brand-icon">⛽</div>
                    <h1 className="login-brand-title">StationOS</h1>
                    <p className="login-brand-subtitle">Gestion de station service</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="login-form-field">
                        <label htmlFor="username">Identifiant</label>
                        <input
                            id="username"
                            type="text"
                            placeholder="employe1"
                            value={username}
                            onChange={event => setUsername(event.target.value)}
                            autoComplete="username"
                        />
                    </div>

                    <div className="login-form-field">
                        <label htmlFor="password">Mot de passe</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••"
                            value={password}
                            onChange={event => setPassword(event.target.value)}
                            autoComplete="current-password"
                        />
                    </div>

                    {error && <div className="login-error">{error}</div>}

                    <button type="submit" className="login-submit-button" disabled={busy}>
                        {busy ? "Connexion..." : "Se connecter"}
                    </button>
                </form>

                <p className="login-demo">
                    <strong>Comptes demo:</strong>
                    <br/>
                    employe1 / 1234 · employe2 / 1234 · gerant1 / admin
                </p>
            </section>
        </div>
    );
};
