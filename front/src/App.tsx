import {type FC, useState} from "react";
import {Dashboard} from "./components/Dashboard";
import {Login} from "./components/Login";
import {isLayoutValid, type Levels, type ThemeKey, type User} from "./types";
import "./App.css";
import {DEFAULT_LEVELS} from "./data/stationConfig.tsx";
import {savePreferences} from "./api/userApi.ts";
import {ModalProvider} from "./context/ModalContext.tsx";

const App: FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [level, setLevel] = useState<number>(1);
    const [theme, setTheme] = useState<ThemeKey>("light");
    const [editingLayout, setEditingLayout] = useState<boolean>(false)
	const [levels, setLevels] = useState<Levels>(DEFAULT_LEVELS["employe"])

    const toggleTheme = (): void => {
		const newTheme = theme === "dark" ? "light" : "dark";
		setTheme(newTheme);
		if (user !== null) {
			savePreferences({ darkMode: newTheme === "dark" });
		}
	}

    return (
        <div className="app-shell" data-theme={theme}>
            {!user ? (
                <Login
                    onLogin={nextUser => {
                        setUser(nextUser);
                        setLevel(1);
						setTheme(nextUser.usesDarkMode ? "dark" : "light");
						const grids = nextUser.tileLayout && isLayoutValid(nextUser.role, nextUser.tileLayout)
							? nextUser.tileLayout
							: DEFAULT_LEVELS[nextUser.role]; 
						setLevels(grids);
                    }}
                    theme={theme}
                    toggleTheme={toggleTheme}
                />
            ) : (
                <ModalProvider>
                    <Dashboard
                        key={`${user.role}_${level}`}
                        user={user}
                        level={level}
                        levels={levels}
                        onSaveLevels={setLevels}
                        onLevel={setLevel}
                        onLogout={() => {
                            setUser(null);
                            setLevel(1);
                            window.localStorage.removeItem("token");
                        }}
                        editingLayout={editingLayout}
                        onEditLayout={setEditingLayout}
                        theme={theme}
                        toggleTheme={toggleTheme}
                    />
                </ModalProvider>
            )}
        </div>
    );
};

export default App;
