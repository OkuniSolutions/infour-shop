import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Layout Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Search from './pages/Search';
import Login from './pages/Login';
import Register from './pages/Register';

// Protected Pages
import Checkout from './pages/Checkout';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import MyOrders from './pages/MyOrders';
import OrderSuccess from './pages/OrderSuccess';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ProductManager from './pages/admin/ProductManager';
import CategoryManager from './pages/admin/CategoryManager';
import UserManager from './pages/admin/UserManager';
import SalesReport from './pages/admin/SalesReport';

import './App.css';

// Layout para páginas públicas con Navbar
const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    <main>{children}</main>
  </>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Routes>
              {/* Rutas Públicas */}
              <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
              <Route path="/products" element={<PublicLayout><Products /></PublicLayout>} />
              <Route path="/products/:id" element={<PublicLayout><ProductDetail /></PublicLayout>} />
              <Route path="/cart" element={<PublicLayout><Cart /></PublicLayout>} />
              <Route path="/search" element={<PublicLayout><Search /></PublicLayout>} />
              <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
              <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />

              {/* Rutas Protegidas (requieren autenticación) */}
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <PublicLayout><Checkout /></PublicLayout>
                </ProtectedRoute>
              } />
              <Route path="/wishlist" element={
                <ProtectedRoute>
                  <PublicLayout><Wishlist /></PublicLayout>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <PublicLayout><Profile /></PublicLayout>
                </ProtectedRoute>
              } />
              <Route path="/my-orders" element={
                <ProtectedRoute>
                  <PublicLayout><MyOrders /></PublicLayout>
                </ProtectedRoute>
              } />
              <Route path="/order-success" element={
                <ProtectedRoute>
                  <PublicLayout><OrderSuccess /></PublicLayout>
                </ProtectedRoute>
              } />

              {/* Rutas de Admin */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<ProductManager />} />
                <Route path="categories" element={<CategoryManager />} />
                <Route path="users" element={<UserManager />} />
                <Route path="sales" element={<SalesReport />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={
                <PublicLayout>
                  <div className="container py-5 text-center">
                    <i className="bi bi-emoji-frown display-1 text-muted"></i>
                    <h1 className="mt-3">404 - Página no encontrada</h1>
                    <p className="text-muted">La página que buscas no existe</p>
                    <a href="/" className="btn btn-primary">Volver al inicio</a>
                  </div>
                </PublicLayout>
              } />
            </Routes>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;