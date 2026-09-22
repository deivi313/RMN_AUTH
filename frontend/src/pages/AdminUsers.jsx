import { useCallback, useEffect, useState } from 'react';
import api, { getError } from '../api/axios';
import useAction from '../hooks/useAction';
import UserForm from '../components/UserForm';

// Admin: full CRUD on users, see each user's products, filter users by product name
export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      // `product` triggers the filtered JOIN on the backend (undefined = param is left out)
      const { data } = await api.get('/users', { params: { product: search || undefined } });
      setUsers(data);
    } catch (err) {
      setError(getError(err));
    }
  }, [search]);

  useEffect(() => {
    load();
  }, [load]);

  const run = useAction(load, setError);

  const save = (data) =>
    run(async () => {
      if (editing) await api.put(`/users/${editing.id}`, data);
      else await api.post('/users', data);
      setEditing(null);
    });

  const remove = (id) =>
    window.confirm('Delete this user and all their products?') && run(() => api.delete(`/users/${id}`));

  return (
    <>
      <h2>Users</h2>
      {error && <p className="error">{error}</p>}
      <UserForm key={editing?.id ?? 'new'} initial={editing} onSubmit={save} onCancel={() => setEditing(null)} />

      <input
        className="search"
        placeholder="Find users who own a product…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Products</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.products.map((p) => p.name).join(', ') || '—'}</td>
                <td className="actions">
                  <button className="secondary" onClick={() => setEditing(u)}>Edit</button>
                  <button className="danger" onClick={() => remove(u.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!users.length && <p className="muted">No users match.</p>}
    </>
  );
}
