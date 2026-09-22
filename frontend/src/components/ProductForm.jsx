import { useState } from 'react';

const empty = { name: '', description: '', price: '', userId: '' };

// Used for: user adds a product, admin creates one, admin edits one.
// Pass `users` to show the "owner" dropdown (admin only). Pass `initial` to edit.
// The parent gives this component a `key` so it resets when switching between products.
export default function ProductForm({ initial, users, onSubmit, onCancel }) {
  const [form, setForm] = useState(
    initial
      ? { name: initial.name, description: initial.description || '', price: initial.price, userId: initial.userId }
      : empty
  );

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await onSubmit(form);
    if (ok && !initial) setForm(empty);
  };

  return (
    <form className="panel form" onSubmit={handleSubmit}>
      <h3>{initial ? 'Edit product' : 'Add product'}</h3>
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
      <input name="description" placeholder="Description (optional)" value={form.description} onChange={handleChange} />
      <input name="price" type="number" min="0" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} required />
      {users && (
        <select name="userId" value={form.userId} onChange={handleChange}>
          {!initial && <option value="">Owner: me</option>}
          {users.map((u) => (
            <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
          ))}
        </select>
      )}
      <div className="actions">
        <button type="submit">{initial ? 'Save changes' : 'Add product'}</button>
        {initial && <button type="button" className="secondary" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
