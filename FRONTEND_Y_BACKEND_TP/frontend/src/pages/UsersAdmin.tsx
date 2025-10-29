import { useEffect, useState } from 'react';
import api from '../api'; 
type User = {
  id: number;
  name?: string | null;
  email: string;
  role: string;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export default function UsersAdmin() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchUsers() {
    try {
      const res = await api.get<{ users: User[] }>('/users');
      setUsers(res.data.users);
    } catch (e) {
      console.error('Error al obtener usuarios:', e);
      alert('No se pudieron cargar los usuarios');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function handleDelete(id: number) {
    try {
      await api.delete(`/users/${id}`);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (e: unknown) {
      console.error('Error al eliminar usuario:', e);

      const maybeAxiosError = e as { response?: { status?: number } };
      const status = maybeAxiosError?.response?.status ?? null;

      if (status === 409) {
        const ok = confirm(
          'El usuario tiene reservas asociadas. ¿Querés eliminar reservas y el usuario?'
        );
        if (ok) {
          try {
            await api.delete(`/users/${id}?force=true`);
            setUsers(prev => prev.filter(u => u.id !== id));
          } catch (e2) {
            console.error('Error al forzar eliminación:', e2);
            alert('No se pudo forzar la eliminación.');
          }
        }
      } else {
        alert('No se pudo eliminar el usuario.');
      }
    }
  }

  async function handleRoleChange(id: number, role: string) {
    try {
      const res = await api.put<{ user: User }>(`/users/${id}`, { role });
      setUsers(prev => prev.map(u => (u.id === id ? res.data.user : u)));
    } catch (e) {
      console.error('Error al actualizar rol:', e);
      alert('No se pudo actualizar el rol.');
    }
  }

  if (loading) return <p>Cargando usuarios…</p>;

  return (
    <div className="card" style={{ overflowX: 'auto' }}>
      <h2>Usuarios</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f1f5f9' }}>
            <th style={{ textAlign: 'left', padding: 12 }}>ID</th>
            <th style={{ textAlign: 'left', padding: 12 }}>Nombre</th>
            <th style={{ textAlign: 'left', padding: 12 }}>Email</th>
            <th style={{ textAlign: 'left', padding: 12 }}>Rol</th>
            <th style={{ textAlign: 'left', padding: 12 }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td style={{ padding: 12, borderTop: '1px solid #e5e7eb' }}>{u.id}</td>
              <td style={{ padding: 12, borderTop: '1px solid #e5e7eb' }}>{u.name ?? '-'}</td>
              <td style={{ padding: 12, borderTop: '1px solid #e5e7eb' }}>{u.email}</td>
              <td style={{ padding: 12, borderTop: '1px solid #e5e7eb' }}>
                <select value={u.role} onChange={e => handleRoleChange(u.id, e.target.value)}>
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </td>
              <td style={{ padding: 12, borderTop: '1px solid #e5e7eb' }}>
                <button className="btn danger" onClick={() => handleDelete(u.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={5} style={{ padding: 12 }}>
                No hay usuarios
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}