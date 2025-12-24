import { useEffect, useState } from 'react';
import { listOrders } from '../api/orders.js';
import { useAuth } from '../hooks/useAuth.jsx';

const statusColor = {
  pending: '#f97316',
  confirmed: '#2563eb',
  preparing: '#7c3aed',
  completed: '#16a34a',
  cancelled: '#dc2626'
};

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      return;
    }
    listOrders(user.id)
      .then((data) => setOrders(data))
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return (
      <section className="container" style={{ paddingTop: '3rem' }}>
        <p>Loading orders…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container" style={{ paddingTop: '3rem' }}>
        <p style={{ color: '#dc2626' }}>{error}</p>
      </section>
    );
  }

  return (
    <section className="container" style={{ paddingTop: '3rem', display: 'grid', gap: '1.5rem' }}>
      <h2 style={{ marginBottom: 0 }}>My Orders</h2>
      {orders.length === 0 && <p>No orders yet. Visit restaurants to start ordering.</p>}
      {orders.map((order) => (
        <div key={order._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 600 }}>Order #{order._id.slice(-6)}</span>
            <span style={{ fontWeight: 700, color: statusColor[order.status] || '#111827' }}>{order.status.toUpperCase()}</span>
          </div>
          <div>
            {order.items.map((item) => (
              <div key={item.menuItemId} style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563' }}>
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
            <span>Total</span>
            <span>${order.totalAmount.toFixed(2)}</span>
          </div>
          {order.paymentId && (
            <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Payment ref: {order.paymentId}</span>
          )}
        </div>
      ))}
    </section>
  );
};

export default Orders;
