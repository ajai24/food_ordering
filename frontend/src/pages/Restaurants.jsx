import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listRestaurants } from '../api/restaurants.js';
import RestaurantCard from '../components/RestaurantCard.jsx';

const Restaurants = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [cuisine, setCuisine] = useState('all');
  const [sort, setSort] = useState('featured');

  useEffect(() => {
    listRestaurants()
      .then((data) => setRestaurants(data))
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, []);

  const goToRestaurant = (restaurant) => {
    navigate(`/restaurants/${restaurant._id}`);
  };

  const cuisines = useMemo(() => {
    const all = restaurants
      .map((restaurant) => (restaurant.cuisine ? restaurant.cuisine.trim() : ''))
      .filter(Boolean);
    return Array.from(new Set(all)).sort();
  }, [restaurants]);

  const filteredRestaurants = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    let result = restaurants.filter((restaurant) => {
      const matchesCuisine = cuisine === 'all' || (restaurant.cuisine ? restaurant.cuisine.toLowerCase() === cuisine : false);
      const matchesSearch = !normalizedSearch
        ? true
        : [restaurant.name, restaurant.cuisine, restaurant.location?.city]
            .filter(Boolean)
            .some((field) => field.toLowerCase().includes(normalizedSearch));

      return matchesCuisine && matchesSearch;
    });

    if (sort === 'rating') {
      result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sort === 'name') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [restaurants, search, cuisine, sort]);

  if (loading) {
    return (
      <section className="container" style={{ paddingTop: '3rem' }}>
        <p>Loading restaurants…</p>
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
    <section style={{ background: '#f8fafc' }}>
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem', display: 'grid', gap: '2rem' }}>
        <header
          style={{
            display: 'grid',
            gap: '1.2rem',
            padding: '2.4rem',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(37,99,235,0.12), rgba(59,130,246,0.05))',
            border: '1px solid rgba(37, 99, 235, 0.15)'
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ textTransform: 'uppercase', letterSpacing: '0.22em', fontSize: '0.75rem', color: '#2563eb', margin: 0 }}>Discover</p>
              <h1 style={{ margin: '0.4rem 0 0', fontSize: '2.2rem', lineHeight: 1.2, color: '#0f172a' }}>Restaurants for every craving</h1>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', color: '#1e293b', fontSize: '0.95rem' }}>
              <span><strong>{restaurants.length}</strong> curated partners</span>
              <span><strong>{cuisines.length}</strong> cuisines</span>
              <span><strong>{filteredRestaurants.length}</strong> match your filters</span>
            </div>
          </div>
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: '#fff', borderRadius: '999px', padding: '0.4rem 1rem', border: '1px solid #e2e8f0' }}>
              <svg width="18" height="18" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" />
                <line x1="20" y1="20" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="search"
                placeholder="Search by name or city"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.95rem' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setCuisine('all')}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '999px',
                  border: '1px solid',
                  borderColor: cuisine === 'all' ? '#2563eb' : '#cbd5f5',
                  background: cuisine === 'all' ? '#2563eb' : '#fff',
                  color: cuisine === 'all' ? '#fff' : '#334155',
                  cursor: 'pointer',
                  fontWeight: cuisine === 'all' ? 600 : 500
                }}
              >
                All cuisines
              </button>
              {cuisines.map((item) => {
                const active = cuisine === item.toLowerCase();
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCuisine(item.toLowerCase())}
                    style={{
                      padding: '0.45rem 1rem',
                      borderRadius: '999px',
                      border: '1px solid',
                      borderColor: active ? '#2563eb' : '#e2e8f0',
                      background: active ? '#2563eb' : '#fff',
                      color: active ? '#fff' : '#475569',
                      cursor: 'pointer',
                      fontWeight: active ? 600 : 500
                    }}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', justifyContent: 'flex-end' }}>
              <label htmlFor="sort" style={{ color: '#475569', fontSize: '0.9rem' }}>Sort by:</label>
              <select
                id="sort"
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                style={{
                  borderRadius: '999px',
                  padding: '0.45rem 1rem',
                  border: '1px solid #cbd5f5',
                  background: '#fff',
                  color: '#334155'
                }}
              >
                <option value="featured">Featured</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Alphabetical</option>
              </select>
            </div>
          </div>
        </header>

        <div style={{ display: 'grid', gap: '1.8rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant._id} restaurant={restaurant} onSelect={goToRestaurant} />
          ))}
        </div>

        {filteredRestaurants.length === 0 && (
          <div
            style={{
              border: '1px dashed #cbd5f5',
              borderRadius: '16px',
              padding: '2rem',
              textAlign: 'center',
              background: '#fff'
            }}
          >
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#0f172a' }}>No restaurants found</h3>
            <p style={{ margin: 0, color: '#64748b' }}>Try removing some filters or exploring a different cuisine.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Restaurants;
