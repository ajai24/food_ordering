import { useEffect, useMemo, useState } from 'react';
import { createRestaurant, listRestaurants, updateRestaurantMenu } from '../api/restaurants.js';

const blankRestaurant = {
  name: '',
  cuisine: '',
  rating: '',
  address: '',
  city: '',
  postalCode: '',
  imageUrl: ''
};

const emptyMenuItem = {
  name: '',
  description: '',
  price: '',
  isAvailable: true
};

const AdminRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [menuSaving, setMenuSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [form, setForm] = useState(blankRestaurant);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState('');
  const [menuDraft, setMenuDraft] = useState([{ ...emptyMenuItem }]);
  const previewImage = form.imageUrl ? form.imageUrl.trim() : '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await listRestaurants();
        setRestaurants(data);
        setSelectedRestaurantId((prev) => {
          if (prev) {
            return prev;
          }
          return data[0]?._id || '';
        });
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Unable to load restaurants');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const selectedRestaurant = useMemo(
    () => restaurants.find((restaurant) => restaurant._id === selectedRestaurantId) || null,
    [restaurants, selectedRestaurantId]
  );

  useEffect(() => {
    if (!selectedRestaurant) {
      setMenuDraft([{ ...emptyMenuItem }]);
      return;
    }

    if (Array.isArray(selectedRestaurant.menu) && selectedRestaurant.menu.length > 0) {
      setMenuDraft(
        selectedRestaurant.menu.map((item) => ({
          name: item.name || '',
          description: item.description || '',
          price: item.price?.toString() || '',
          isAvailable: item.isAvailable !== false
        }))
      );
    } else {
      setMenuDraft([{ ...emptyMenuItem }]);
    }
  }, [selectedRestaurant]);

  const handleRestaurantChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateRestaurant = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setMessage('');
      setError('');

      const payload = {
        name: form.name,
        cuisine: form.cuisine,
        location: {
          address: form.address,
          city: form.city,
          postalCode: form.postalCode
        }
      };

      if (form.rating) {
        payload.rating = Number(form.rating);
      }

      if (form.imageUrl) {
        payload.imageUrl = form.imageUrl.trim();
      }

      const created = await createRestaurant(payload);
      setForm(blankRestaurant);
      setMessage('Restaurant created successfully.');
      setSelectedRestaurantId(created?._id || '');

      const updated = await listRestaurants();
      setRestaurants(updated);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create restaurant');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleSelectRestaurant = (event) => {
    setSelectedRestaurantId(event.target.value);
    setMessage('');
    setError('');
  };

  const handleMenuFieldChange = (index, field, value) => {
    setMenuDraft((prev) =>
      prev.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: field === 'price' ? value.replace(/[^0-9.]/g, '') : value
            }
          : item
      )
    );
  };

  const handleToggleAvailability = (index) => {
    setMenuDraft((prev) => prev.map((item, itemIndex) => (itemIndex === index ? { ...item, isAvailable: !item.isAvailable } : item)));
  };

  const handleAddMenuItem = () => {
    setMenuDraft((prev) => [...prev, { ...emptyMenuItem }]);
  };

  const handleRemoveMenuItem = (index) => {
    setMenuDraft((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const handleSaveMenu = async (event) => {
    event.preventDefault();

    if (!selectedRestaurantId) {
      setError('Select a restaurant before updating its menu.');
      return;
    }

    try {
      setMenuSaving(true);
      setMessage('');
      setError('');

      const formattedMenu = menuDraft
        .filter((item) => item.name && item.price)
        .map((item) => ({
          name: item.name,
          description: item.description,
          price: Number(item.price),
          isAvailable: item.isAvailable !== false
        }));

      await updateRestaurantMenu(selectedRestaurantId, formattedMenu);
      setMessage('Menu updated successfully.');

      const updated = await listRestaurants();
      setRestaurants(updated);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update menu');
    } finally {
      setMenuSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="container" style={{ paddingTop: '3rem' }}>
        <p>Loading partner data…</p>
      </section>
    );
  }

  return (
    <section className="container" style={{ paddingTop: '3rem', display: 'grid', gap: '1.5rem' }}>
      <h2 style={{ marginBottom: 0 }}>Partner Management</h2>

      {message && <p style={{ color: '#16a34a' }}>{message}</p>}
      {error && <p style={{ color: '#dc2626' }}>{error}</p>}

      <form className="card" onSubmit={handleCreateRestaurant} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <h3 style={{ margin: 0 }}>Create Restaurant</h3>
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          <div className="input-group">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" value={form.name} onChange={handleRestaurantChange} required />
          </div>
          <div className="input-group">
            <label htmlFor="cuisine">Cuisine</label>
            <input id="cuisine" name="cuisine" value={form.cuisine} onChange={handleRestaurantChange} />
          </div>
          <div className="input-group">
            <label htmlFor="rating">Rating (0-5)</label>
            <input id="rating" name="rating" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={handleRestaurantChange} />
          </div>
          <div className="input-group">
            <label htmlFor="imageUrl">Hero Image URL</label>
            <input id="imageUrl" name="imageUrl" value={form.imageUrl} onChange={handleRestaurantChange} placeholder="https://example.com/restaurant.jpg" />
          </div>
          <div className="input-group">
            <label htmlFor="address">Address</label>
            <input id="address" name="address" value={form.address} onChange={handleRestaurantChange} />
          </div>
          <div className="input-group">
            <label htmlFor="city">City</label>
            <input id="city" name="city" value={form.city} onChange={handleRestaurantChange} />
          </div>
          <div className="input-group">
            <label htmlFor="postalCode">Postal Code</label>
            <input id="postalCode" name="postalCode" value={form.postalCode} onChange={handleRestaurantChange} />
          </div>
        </div>
        {previewImage && (
          <img
            src={previewImage}
            alt="Restaurant preview"
            style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', borderRadius: '12px', border: '1px solid #e5e7eb' }}
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
        )}
        <button type="submit" disabled={submitting}>
          {submitting ? 'Creating…' : 'Create Restaurant'}
        </button>
      </form>

      {restaurants.length > 0 && (
        <div className="card" style={{ display: 'grid', gap: '1rem' }}>
          <h3 style={{ margin: 0 }}>Existing Restaurants</h3>
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            {restaurants.map((restaurant) => {
              const image = restaurant.imageUrl?.trim()
                ? restaurant.imageUrl
                : 'https://dummyimage.com/320x200/e5e7eb/374151&text=No+Image';
              return (
                <div
                  key={restaurant._id}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    background: '#fff'
                  }}
                >
                  <img src={image} alt={restaurant.name} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                  <div style={{ padding: '0.8rem', display: 'grid', gap: '0.4rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong>{restaurant.name}</strong>
                      {typeof restaurant.rating === 'number' && (
                        <span style={{ fontSize: '0.85rem', color: '#2563eb' }}>
                          ★ {restaurant.rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>{restaurant.cuisine || 'Cuisine TBD'}</span>
                    <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                      {restaurant.location?.city || 'City'}, {restaurant.location?.postalCode || 'Postal'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedRestaurantId(restaurant._id)}
                      style={{ justifySelf: 'flex-start' }}
                    >
                      Manage Menu
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <form className="card" onSubmit={handleSaveMenu} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ margin: 0 }}>Manage Menu</h3>
        <div className="input-group">
          <label htmlFor="restaurantSelect">Restaurant</label>
          <select id="restaurantSelect" value={selectedRestaurantId} onChange={handleSelectRestaurant}>
            <option value="">Select a restaurant</option>
            {restaurants.map((restaurant) => (
              <option key={restaurant._id} value={restaurant._id}>
                {restaurant.name}
              </option>
            ))}
          </select>
        </div>

        {selectedRestaurant && (
          <div style={{ display: 'grid', gap: '0.8rem', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <img
                src={selectedRestaurant.imageUrl?.trim() || 'https://dummyimage.com/160x120/e5e7eb/374151&text=No+Image'}
                alt={selectedRestaurant.name}
                style={{ width: '160px', height: '120px', objectFit: 'cover', borderRadius: '12px' }}
              />
              <div style={{ display: 'grid', gap: '0.3rem' }}>
                <strong>{selectedRestaurant.name}</strong>
                <span style={{ color: '#6b7280' }}>{selectedRestaurant.cuisine || 'Cuisine TBD'}</span>
                <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                  {selectedRestaurant.location?.address || 'Address TBD'}
                </span>
              </div>
            </div>
          </div>
        )}

        {menuDraft.map((item, index) => (
          <div key={`menu-item-${index}`} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1rem', display: 'grid', gap: '0.6rem' }}>
            <div className="input-group">
              <label htmlFor={`menu-name-${index}`}>Name</label>
              <input id={`menu-name-${index}`} value={item.name} onChange={(event) => handleMenuFieldChange(index, 'name', event.target.value)} required />
            </div>
            <div className="input-group">
              <label htmlFor={`menu-description-${index}`}>Description</label>
              <textarea id={`menu-description-${index}`} value={item.description} onChange={(event) => handleMenuFieldChange(index, 'description', event.target.value)} />
            </div>
            <div className="input-group">
              <label htmlFor={`menu-price-${index}`}>Price</label>
              <input id={`menu-price-${index}`} type="number" min="0" step="0.01" value={item.price} onChange={(event) => handleMenuFieldChange(index, 'price', event.target.value)} required />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <input type="checkbox" checked={item.isAvailable} onChange={() => handleToggleAvailability(index)} />
                Available
              </label>
              {menuDraft.length > 1 && (
                <button type="button" onClick={() => handleRemoveMenuItem(index)}>
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}

        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button type="button" onClick={handleAddMenuItem}>
            Add Menu Item
          </button>
          <button type="submit" disabled={menuSaving}>
            {menuSaving ? 'Saving…' : 'Save Menu'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AdminRestaurants;
