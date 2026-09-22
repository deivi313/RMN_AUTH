export default function ProductTable({ products, onDelete, onEdit, showOwner = false }) {
  if (!products.length) return <p className="muted">No products yet. Add the first one above.</p>;

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            {showOwner && <th>Owner</th>}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.description}</td>
              <td>${p.price}</td>
              {showOwner && <td>{p.owner?.name}</td>}
              <td className="actions">
                {onEdit && <button className="secondary" onClick={() => onEdit(p)}>Edit</button>}
                <button className="danger" onClick={() => onDelete(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
