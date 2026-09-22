import { useCallback, useEffect, useState } from 'react';
import api, { getError } from '../api/axios';
import useAction from '../hooks/useAction';
import ProductForm from '../components/ProductForm';
import ProductTable from '../components/ProductTable';

// Admin: full CRUD on every product, and assigning a product to any user
export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const [productsRes, usersRes] = await Promise.all([api.get('/products/all'), api.get('/users')]);
      setProducts(productsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      setError(getError(err));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const run = useAction(load, setError);

  const save = (data) =>
    run(async () => {
      if (editing) await api.put(`/products/${editing.id}`, data);
      else await api.post('/products', data);
      setEditing(null);
    });

  const remove = (id) =>
    window.confirm('Delete this product?') && run(() => api.delete(`/products/${id}`));

  return (
    <>
      <h2>All products</h2>
      {error && <p className="error">{error}</p>}
      <ProductForm
        key={editing?.id ?? 'new'}
        initial={editing}
        users={users}
        onSubmit={save}
        onCancel={() => setEditing(null)}
      />
      <ProductTable products={products} onEdit={setEditing} onDelete={remove} showOwner />
    </>
  );
}
