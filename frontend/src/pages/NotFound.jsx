import { Link } from 'react-router-dom';

const NotFound = () => (
  <section className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
    <h2>Page not found</h2>
    <p style={{ color: '#6b7280' }}>The page you are looking for does not exist.</p>
    <Link to="/" style={{ color: '#2563eb', fontWeight: 600 }}>
      Go home
    </Link>
  </section>
);

export default NotFound;
