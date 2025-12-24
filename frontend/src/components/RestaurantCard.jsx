const RestaurantCard = ({ restaurant, onSelect }) => {
  const image = restaurant.imageUrl?.trim()
    ? restaurant.imageUrl
    : 'https://dummyimage.com/320x200/e5e7eb/374151&text=No+Image';
  const heroMenuItems = Array.isArray(restaurant.menu) ? restaurant.menu.slice(0, 3) : [];

  return (
    <div
      className="card"
      style={{
        display: 'grid',
        gridTemplateRows: '180px 1fr auto',
        padding: 0,
        overflow: 'hidden',
        borderRadius: '20px',
        border: '1px solid #e2e8f0'
      }}
    >
      <div style={{ position: 'relative' }}>
        <img src={image} alt={restaurant.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <span
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'rgba(15,23,42,0.85)',
            color: '#fff',
            padding: '0.35rem 0.75rem',
            borderRadius: '999px',
            fontSize: '0.8rem',
            fontWeight: 600
          }}
        >
          ★ {restaurant.rating?.toFixed(1) ?? 'N/A'}
        </span>
      </div>
      <div style={{ padding: '1.2rem', display: 'grid', gap: '0.6rem' }}>
        <div style={{ display: 'grid', gap: '0.3rem' }}>
          <h3 style={{ margin: 0, color: '#0f172a' }}>{restaurant.name}</h3>
          <span style={{ fontSize: '0.9rem', color: '#2563eb', fontWeight: 600 }}>{restaurant.cuisine || 'Cuisine TBD'}</span>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem' }}>
            {restaurant.location?.address}, {restaurant.location?.city}
          </p>
        </div>
        {heroMenuItems.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
            {heroMenuItems.map((item) => (
              <span
                key={`${restaurant._id}-${item.name}`}
                style={{
                  background: '#f1f5f9',
                  color: '#475569',
                  borderRadius: '999px',
                  padding: '0.35rem 0.7rem',
                  fontSize: '0.75rem',
                  fontWeight: 500
                }}
              >
                {item.name}
              </span>
            ))}
          </div>
        )}
      </div>
      <div style={{ padding: '0 1.2rem 1.2rem 1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.75rem', color: '#94a3b8' }}>
          <span>Average ticket</span>
          <strong style={{ color: '#2563eb', fontSize: '0.95rem' }}>
            {heroMenuItems.length ? `~$${heroMenuItems[0].price.toFixed(2)}` : '—'}
          </strong>
        </div>
        <button
          type="button"
          onClick={() => onSelect(restaurant)}
          style={{
            padding: '0.55rem 1.2rem',
            borderRadius: '999px',
            border: 'none',
            background: 'linear-gradient(135deg, #2563eb, #1e40af)',
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 12px 22px -18px rgba(37,99,235,0.9)'
          }}
        >
          View Menu
        </button>
      </div>
    </div>
  );
};

export default RestaurantCard;
