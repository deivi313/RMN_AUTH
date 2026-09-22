import { useState } from 'react';

const empty = { name: '', email: '', password: '', role: 'user' };

// Admin form to create a user or edit one (leave the password empty to keep it)
export default function UserForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(
    initial ? { name: initial.name, email: initial.email, password: '', role: initial.role } : empty
  );

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await onSubmit(form);
    if (ok && !initial) setForm(empty);
  };

  return (
    <form className="panel form" onSubmit={handleSubmit}>
      <h3>{initial ? 'Edit user' : 'Add user'}</h3>
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
      <input
        name="password"
        type="password"
        placeholder={initial ? 'New password (optional)' : 'Password'}
        value={form.password}
        onChange={handleChange}
        minLength={6}
        required={!initial}
      />
      <select name="role" value={form.role} onChange={handleChange}>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <div className="actions">
        <button type="submit">{initial ? 'Save changes' : 'Add user'}</button>
        {initial && <button type="button" className="secondary" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
