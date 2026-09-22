import { useCallback, useEffect, useState } from 'react';
import api, { getError } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import useAction from '../hooks/useAction';
import ProductForm from '../components/ProductForm';
import ProductTable from '../components/ProductTable';

// A normal user can only add and delete their own products
export default function Dashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (err) {
      setError(getError(err));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const run = useAction(load, setError);

  const addProduct = (data) => run(() => api.post('/products', data));
  const deleteProduct = (id) =>
    window.confirm('Delete this product?') && run(() => api.delete(`/products/${id}`));

  return (
    <>
      <h2>Hi, {user.name}</h2>
      {error && <p className="error">{error}</p>}
      <ProductForm onSubmit={addProduct} />
      <ProductTable products={products} onDelete={deleteProduct} />
    </>
  );
}
