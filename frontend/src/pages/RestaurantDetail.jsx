import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRestaurant } from '../api/restaurants.js';
import { createOrder } from '../api/orders.js';
import { useAuth } from '../hooks/useAuth.jsx';
import OrderSummary from '../components/OrderSummary.jsx';

const RestaurantDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    getRestaurant(id)
      .then((data) => setRestaurant(data))
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((entry) => entry.menuItemId === item._id);
      if (existing) {
        return prev.map((entry) =>
          entry.menuItemId === item._id ? { ...entry, quantity: entry.quantity + 1 } : entry
        );
      }
      return [
        ...prev,
        {
          menuItemId: item._id,
          name: item.name,
          price: item.price,
          quantity: 1
        }
      ];
    });
  };

  const updateQuantity = (menuItemId, quantity) => {
    setCart((prev) =>
      prev
        .map((item) => (item.menuItemId === menuItemId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const total = useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cart]
  );

  const placeOrder = async () => {
    if (!user) {
      setError('Please login before placing an order.');
      return;
    }
    if (!cart.length) {
      setError('Add items to cart before placing an order.');
      return;
    }

    try {
      setPlacing(true);
      setError(null);
      setSuccess('');
      await createOrder({
        userId: user.id,
        restaurantId: restaurant._id,
        items: cart,
        totalAmount: total,
        paymentMethod: 'card'
      });
      setCart([]);
      setSuccess('Order placed successfully! Check My Orders for status.');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <section className="container" style={{ paddingTop: '3rem' }}>
        <p>Loading restaurant…</p>
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

  if (!restaurant) {
    return null;
  }

  const heroImage = restaurant.imageUrl?.trim()
    ? restaurant.imageUrl
    : 'https://dummyimage.com/1200x320/e5e7eb/374151&text=Restaurant';

  return (
    <section style={{ background: '#f8fafc' }}>
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem', display: 'grid', gap: '2rem' }}>
        <div
          style={{
            borderRadius: '24px',
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
            position: 'relative',
            boxShadow: '0 26px 40px -38px rgba(15, 23, 42, 0.6)'
          }}
        >
          <img src={heroImage} alt={restaurant.name} style={{ width: '100%', maxHeight: '360px', objectFit: 'cover', filter: 'brightness(0.9)' }} />
          <div
            style={{
              position: 'absolute',
              bottom: '24px',
              left: '24px',
              padding: '1.5rem 2rem',
              borderRadius: '20px',
              background: 'rgba(15, 23, 42, 0.75)',
              color: '#fff',
              display: 'grid',
              gap: '0.6rem',
              maxWidth: '520px'
            }}
          >
            <h1 style={{ margin: 0, fontSize: '2.2rem' }}>{restaurant.name}</h1>
            <span style={{ fontSize: '1rem', opacity: 0.85 }}>{restaurant.cuisine}</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', fontSize: '0.85rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <strong>★ {restaurant.rating?.toFixed(1) ?? 'N/A'}</strong>
                <span>Guest rating</span>
              </span>
              <span>{restaurant.location?.address}</span>
              <span>{restaurant.location?.city}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 360px)' }}>
          <div
            className="card"
            style={{
              padding: '2rem',
              display: 'grid',
              gap: '1.5rem',
              background: '#fff',
              borderRadius: '24px',
              boxShadow: '0 20px 40px -36px rgba(148, 163, 184, 0.8)'
            }}
          >
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ margin: 0, color: '#0f172a' }}>Chef's menu</h2>
                <p style={{ margin: '0.3rem 0 0', color: '#64748b' }}>Tap an item to adjust quantities</p>
              </div>
              <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '0.4rem 0.8rem', borderRadius: '999px', fontWeight: 600 }}>
                {restaurant.menu?.length ?? 0} dishes
              </span>
            </header>

            {restaurant.menu?.length ? (
              <div style={{ display: 'grid', gap: '1.2rem' }}>
                {restaurant.menu.map((item) => {
                  const inCart = cart.find((entry) => entry.menuItemId === item._id);
                  return (
                    <div
                      key={item._id}
                      style={{
                        display: 'grid',
                        gap: '0.6rem',
                        border: '1px solid #e2e8f0',
                        borderRadius: '16px',
                        padding: '1.2rem',
                        background: '#f8fafc'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                        <div>
                          <h3 style={{ margin: 0, color: '#0f172a' }}>{item.name}</h3>
                          <p style={{ margin: '0.3rem 0 0', color: '#64748b' }}>{item.description}</p>
                        </div>
                        <strong style={{ color: '#2563eb', fontSize: '1.1rem' }}>${item.price.toFixed(2)}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{item.isAvailable ? 'Available today' : 'Currently unavailable'}</span>
                        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                          {inCart ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item._id, inCart.quantity - 1)}
                                style={{
                                  width: '36px',
                                  height: '36px',
                                  borderRadius: '50%',
                                  border: '1px solid #cbd5f5',
                                  background: '#fff',
                                  fontSize: '1rem',
                                  cursor: 'pointer'
                                }}
                              >
                                −
                              </button>
                              <strong style={{ minWidth: '20px', textAlign: 'center', color: '#1e293b' }}>{inCart.quantity}</strong>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item._id, inCart.quantity + 1)}
                                style={{
                                  width: '36px',
                                  height: '36px',
                                  borderRadius: '50%',
                                  border: 'none',
                                  background: '#2563eb',
                                  color: '#fff',
                                  fontSize: '1rem',
                                  cursor: 'pointer'
                                }}
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => addToCart(item)}
                              style={{
                                padding: '0.55rem 1.4rem',
                                borderRadius: '999px',
                                border: 'none',
                                background: '#2563eb',
                                color: '#fff',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              Add to cart
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p>No menu items yet.</p>
            )}
          </div>

          <div style={{ display: 'grid', gap: '1.2rem' }}>
            {success && (
              <div style={{ borderRadius: '16px', padding: '1rem', background: '#dcfce7', color: '#166534' }}>{success}</div>
            )}
            {error && <div style={{ borderRadius: '16px', padding: '1rem', background: '#fee2e2', color: '#b91c1c' }}>{error}</div>}

            <div
              className="card"
              style={{
                borderRadius: '24px',
                padding: '1.8rem',
                display: 'grid',
                gap: '1.2rem',
                background: '#fff'
              }}
            >
              <h3 style={{ margin: 0, color: '#0f172a' }}>Order summary</h3>
              {cart.length === 0 ? (
                <p style={{ margin: 0, color: '#94a3b8' }}>Add dishes to start your order.</p>
              ) : (
                <OrderSummary items={cart} total={total} onSubmit={placeOrder} submitting={placing} />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RestaurantDetail;
