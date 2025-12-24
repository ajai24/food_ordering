const currency = (value) => `$${value.toFixed(2)}`;

const OrderSummary = ({ items, total, onSubmit, submitting }) => {
  return (
    <div className="card" style={{ marginTop: '1.5rem' }}>
      <h3 style={{ marginTop: 0 }}>Order Summary</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {items.map((item) => (
          <li key={item.menuItemId} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>{currency(item.price * item.quantity)}</span>
          </li>
        ))}
      </ul>
      <hr style={{ margin: '1rem 0', borderColor: '#e5e7eb' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
        <span>Total</span>
        <span>{currency(total)}</span>
      </div>
      <button type="button" onClick={onSubmit} disabled={submitting} style={{ marginTop: '1rem' }}>
        {submitting ? 'Placing order...' : 'Place Order'}
      </button>
    </div>
  );
};

export default OrderSummary;
