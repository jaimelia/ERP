import {type FC, useState} from "react";
import {Dashboard} from "./components/Dashboard";
import {Login} from "./components/Login";
import {isLayoutValid, type Levels, type Role, type ThemeKey, type TileLayoutPayload, type TileLayouts, type User} from "./types";
import "./App.css";
import {DEFAULT_LEVELS} from "./data/stationConfig.tsx";
import {savePreferences} from "./api/userApi.ts";
import {ToastProvider} from "./contexts/ToastContext.tsx";
import {ToastContainer} from "./components/ToastContainer.tsx";
import {ModalProvider} from "./contexts/ModalContext.tsx";

const App: FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [level, setLevel] = useState<number>(1);
    const [theme, setTheme] = useState<ThemeKey>("light");
    const [editingLayout, setEditingLayout] = useState<boolean>(false)
	const [viewRole, setViewRole] = useState<Role>("employee");
	const [levelsByRole, setLevelsByRole] = useState<Record<Role, Levels>>({
		employee: DEFAULT_LEVELS.employee,
		manager: DEFAULT_LEVELS.manager,
	});

	const activeLevels = levelsByRole[viewRole];

	const normalizeLayouts = (payload: TileLayoutPayload | undefined, role: Role): TileLayouts => {
		const next: TileLayouts = {
			employee: DEFAULT_LEVELS.employee,
			manager: DEFAULT_LEVELS.manager,
		};
		if (!payload) return next;

		if (Array.isArray(payload)) {
			if (isLayoutValid(role, payload)) {
				next[role] = payload;
			}
			return next;
		}

		if (payload.employee && isLayoutValid("employee", payload.employee)) {
			next.employee = payload.employee;
		}
		if (payload.manager && isLayoutValid("manager", payload.manager)) {
			next.manager = payload.manager;
		}
		return next;
	};

    const toggleTheme = (): void => {
		const newTheme = theme === "dark" ? "light" : "dark";
		setTheme(newTheme);
		if (user !== null) {
			savePreferences({ darkMode: newTheme === "dark" });
		}
	}

    return (
        <ToastProvider>
        <div className="app-shell" data-theme={theme}>
            {!user ? (
                <Login
                    onLogin={nextUser => {
                        setUser(nextUser);
                        setLevel(1);
						setEditingLayout(false);
						setTheme(nextUser.usesDarkMode ? "dark" : "light");
						setViewRole(nextUser.role);
						setLevelsByRole(normalizeLayouts(nextUser.tileLayout, nextUser.role));
                    }}
                    theme={theme}
                    toggleTheme={toggleTheme}
                />
            ) : (
                <ModalProvider>
                    <Dashboard
                        key={`${viewRole}_${level}`}
                        user={user}
                        viewRole={viewRole}
                        level={level}
                        levels={activeLevels}
                        onSaveLevels={(nextLevels) => {
							setLevelsByRole(prev => {
								const next = {...prev, [viewRole]: nextLevels};
								savePreferences({ tileLayout: next });
								return next;
							});
						}}
                        onLevel={setLevel}
                        onLogout={() => {
                            setUser(null);
                            setLevel(1);
                            window.localStorage.removeItem("token");
                        }}
                        editingLayout={editingLayout}
                        onEditLayout={setEditingLayout}
                        onToggleViewRole={() => {
							if (user.role !== "manager") return;
							const nextRole: Role = viewRole === "employee" ? "manager" : "employee";
							setViewRole(nextRole);
							setEditingLayout(false);
							if (level > levelsByRole[nextRole].length) {
								setLevel(1);
							}
						}}
                        canEditLayout={user.role === "manager" || user.role === "employee"}
                        theme={theme}
                        toggleTheme={toggleTheme}
                    />
                </ModalProvider>
            )}
        </div>
        <ToastContainer />
        </ToastProvider>
    );
};

export default App;
