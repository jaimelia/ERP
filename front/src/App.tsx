import {useState, type FC} from "react";
import {Dashboard} from "./components/Dashboard";
import {Login} from "./components/Login";
import type {ThemeKey, User} from "./types";
import "./App.css";

const App: FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [level, setLevel] = useState<number>(1);
    const [theme, setTheme] = useState<ThemeKey>("light");

    const toggleTheme = (): void => setTheme(previous => previous === "dark" ? "light" : "dark");

    return (
        <div className="app-shell" data-theme={theme}>
            {!user ? (
                <Login
                    onLogin={nextUser => {
                        setUser(nextUser);
                        setLevel(1);
                    }}
                    theme={theme}
                    toggleTheme={toggleTheme}
                />
            ) : (
                <Dashboard
                    key={`${user.role}_${level}`}
                    screenKey={`${user.role}_${level}`}
                    user={user}
                    level={level}
                    onLevel={setLevel}
                    onLogout={() => {
                        setUser(null);
                        setLevel(1);
                    }}
                    theme={theme}
                    toggleTheme={toggleTheme}
                />
            )}
        </div>
    );
};

export default App;
