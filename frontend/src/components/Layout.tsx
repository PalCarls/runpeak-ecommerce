import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import SearchModal from './SearchModal';

export default function Layout() {
  return (
    <div className="rp-app">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <SearchModal />
    </div>
  );
}
