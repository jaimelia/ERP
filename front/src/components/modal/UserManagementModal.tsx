import {type FC, useMemo, useState} from "react";
import {useModal} from "../../contexts/ModalContext.tsx";
import {useFetch} from "../../hooks/useFetch.ts";
import {apiUrl} from "../../api/common.ts";
import {
    type AdminUserDTO,
    createUser,
    type CreateUserDTO,
    deleteUser,
    updateUser,
    type UpdateUserDTO
} from "../../api/userApi.ts";
import type {Role} from "../../types.ts";
import {ConfirmModal} from "./ConfirmModal.tsx";
import {FetchWrapper} from "../FetchWrapper.tsx";
import {Popup} from "../Popup.tsx";

interface UserManagementModalProps {
	currentUsername: string;
}

const roleLabels: Record<Role, string> = {
	manager: "Gerant",
	employee: "Employe",
};

const emptyCreateForm: CreateUserDTO = {
	username: "",
	email: "",
	password: "",
	role: "employee",
};

export const UserManagementModal: FC<UserManagementModalProps> = ({currentUsername}) => {
	const {openModal, closeModal} = useModal();
	const {data: users, setData: setUsers, loading, error} = useFetch<AdminUserDTO[]>(apiUrl("/users"));
	const [createForm, setCreateForm] = useState<CreateUserDTO>(emptyCreateForm);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [editForm, setEditForm] = useState<UpdateUserDTO>({});
	const [actionError, setActionError] = useState<string | null>(null);
	const [pendingId, setPendingId] = useState<number | "create" | null>(null);

	const sortedUsers = useMemo(() => {
		if (!users) return [];
		return [...users].sort((a, b) => a.username.localeCompare(b.username));
	}, [users]);

	const canCreate = createForm.username.trim().length > 0
		&& createForm.email.trim().length > 0
		&& createForm.password.trim().length > 0;

	const canSaveEdit = !!editForm.username?.trim() && !!editForm.email?.trim();

	const toErrorMessage = (err: unknown): string => {
		if (err && typeof err === "object" && "message" in err) {
			return String((err as {message: unknown}).message);
		}
		return "Erreur inconnue";
	};

	const startEdit = (user: AdminUserDTO) => {
		setActionError(null);
		setEditingId(user.id);
		setEditForm({
			username: user.username,
			email: user.email,
			role: user.role,
			password: "",
		});
	};

	const cancelEdit = () => {
		setEditingId(null);
		setEditForm({});
		setActionError(null);
	};

	const handleCreate = async () => {
		setActionError(null);
		setPendingId("create");
		try {
			const created = await createUser({
				username: createForm.username.trim(),
				email: createForm.email.trim(),
				password: createForm.password,
				role: createForm.role,
			});
			setUsers(prev => prev ? [...prev, created] : [created]);
			setCreateForm(emptyCreateForm);
		} catch (err) {
			setActionError(toErrorMessage(err));
		} finally {
			setPendingId(null);
		}
	};

	const handleUpdate = async () => {
		if (editingId === null) return;
		setActionError(null);
		setPendingId(editingId);
		try {
			const updated = await updateUser(editingId, {
				username: editForm.username?.trim(),
				email: editForm.email?.trim(),
				role: editForm.role,
				password: editForm.password?.trim() ? editForm.password : undefined,
			});
			setUsers(prev => prev
				? prev.map(user => user.id === editingId ? updated : user)
				: prev
			);
			setEditingId(null);
			setEditForm({});
		} catch (err) {
			setActionError(toErrorMessage(err));
		} finally {
			setPendingId(null);
		}
	};

	const handleDelete = async (user: AdminUserDTO) => {
		setActionError(null);
		setPendingId(user.id);
		try {
			await deleteUser(user.id);
			setUsers(prev => prev ? prev.filter(u => u.id !== user.id) : prev);
			if (editingId === user.id) {
				setEditingId(null);
				setEditForm({});
			}
		} catch (err) {
			setActionError(toErrorMessage(err));
		} finally {
			setPendingId(null);
		}
	};

		const confirmDelete = (user: AdminUserDTO) => {
			openModal(
				<ConfirmModal
					title="Supprimer l'utilisateur"
					message={`Supprimer ${user.username} ? Cette action est irreversible.`}
					confirmLabel="Supprimer"
					cancelLabel="Annuler"
					onConfirm={() => handleDelete(user)}
					danger
				/>,
				{boxed: false}
			);
		};

	return (
		<Popup
			className="modal-users"
			title="Gestion des utilisateurs"
			footer={
				<button type="button" className="popup-btn cancel" onClick={closeModal}>
					Fermer
				</button>
			}
		>

			{actionError && <div className="modal-error">{actionError}</div>}

			<section className="modal-section">
				<div className="modal-section-head">
					<div>
						<h3 className="modal-section-title">Ajouter un utilisateur</h3>
					</div>
				</div>
				<div className="modal-form">
					<div className="modal-grid">
						<label className="modal-field">
							Nom d'utilisateur
							<input
								type="text"
								value={createForm.username}
								onChange={e => setCreateForm(prev => ({...prev, username: e.target.value}))}
							/>
						</label>
						<label className="modal-field">
							Email
							<input
								type="email"
								value={createForm.email}
								onChange={e => setCreateForm(prev => ({...prev, email: e.target.value}))}
							/>
						</label>
						<label className="modal-field">
							Role
							<select
								value={createForm.role}
								onChange={e => setCreateForm(prev => ({...prev, role: e.target.value as Role}))}
							>
								<option value="employee">Employe</option>
								<option value="manager">Gerant</option>
							</select>
						</label>
						<label className="modal-field">
							Mot de passe
							<input
								type="password"
								value={createForm.password}
								onChange={e => setCreateForm(prev => ({...prev, password: e.target.value}))}
							/>
						</label>
					</div>
				</div>
				<div className="modal-actions modal-actions--between">
					<button
						type="button"
						className="modal-button modal-button--cancel"
						onClick={() => setCreateForm(emptyCreateForm)}
						disabled={pendingId === "create"}
					>
						Reinitialiser
					</button>
					<button
						type="button"
						className="modal-button modal-button--confirm"
						onClick={handleCreate}
						disabled={!canCreate || pendingId === "create"}
					>
						Ajouter
					</button>
				</div>
			</section>

			<section className="modal-section">
				<div className="modal-section-head">
					<h3 className="modal-section-title">Utilisateurs existants</h3>
				</div>
				<FetchWrapper loading={loading} error={error}>
					{sortedUsers.length === 0 ? (
						<div className="modal-empty">Aucun utilisateur.</div>
					) : (
						<div className="modal-user-list">
							{sortedUsers.map(user => {
								const isEditing = editingId === user.id;
								const isSelf = user.username === currentUsername;
								return (
									<div key={user.id} className={`modal-user-row ${isEditing ? "is-editing" : ""}`}>
										<div className="modal-user-main">
											<div className="modal-user-meta">
												<div className="modal-user-name">{user.username}</div>
												<div className="modal-user-email">{user.email}</div>
											</div>
											<span className={`modal-role-pill ${user.role === "manager" ? "is-manager" : "is-employee"}`}>
												{roleLabels[user.role]}
											</span>
											<div className="modal-user-actions">
												<button
													type="button"
													className="modal-action-button"
													onClick={() => startEdit(user)}
													disabled={pendingId !== null && pendingId !== user.id}
												>
													Modifier
												</button>
												<button
													type="button"
													className="modal-action-button modal-action-button--danger"
													onClick={() => confirmDelete(user)}
													disabled={isSelf || pendingId !== null}
													title={isSelf ? "Vous ne pouvez pas supprimer votre compte" : undefined}
												>
													Supprimer
												</button>
											</div>
										</div>

										{isEditing && (
											<div className="modal-user-edit">
												<div className="modal-grid">
													<label className="modal-field">
														Nom d'utilisateur
														<input
															type="text"
															value={editForm.username ?? ""}
															onChange={e => setEditForm(prev => ({...prev, username: e.target.value}))}
														/>
													</label>
													<label className="modal-field">
														Email
														<input
															type="email"
															value={editForm.email ?? ""}
															onChange={e => setEditForm(prev => ({...prev, email: e.target.value}))}
														/>
													</label>
													<label className="modal-field">
														Role
														<select
															value={editForm.role ?? user.role}
															onChange={e => setEditForm(prev => ({...prev, role: e.target.value as Role}))}
														>
															<option value="employee">Employe</option>
															<option value="manager">Gerant</option>
														</select>
													</label>
													<label className="modal-field">
														Nouveau mot de passe (optionnel)
														<input
															type="password"
															value={editForm.password ?? ""}
															onChange={e => setEditForm(prev => ({...prev, password: e.target.value}))}
														/>
													</label>
												</div>
												<div className="modal-actions">
													<button
														type="button"
														className="modal-button modal-button--cancel"
														onClick={cancelEdit}
														disabled={pendingId === user.id}
													>
														Annuler
													</button>
													<button
														type="button"
														className="modal-button modal-button--confirm"
														onClick={handleUpdate}
														disabled={!canSaveEdit || pendingId === user.id}
													>
														Enregistrer
													</button>
												</div>
											</div>
										)}
									</div>
								);
							})}
						</div>
					)}
				</FetchWrapper>
			</section>

		</Popup>
	);
};
