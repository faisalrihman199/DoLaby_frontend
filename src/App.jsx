import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Home from './Pages/Home';
import Signup from './Pages/Signup';
import VerifyEmail from './Pages/VerifyEmail';
import './App.css';
import Login from './Pages/Login';
import ForgotPassword from './Pages/ForgotPassword';
import ResetPassword from './Pages/ResetPassword';
import UserProfile from './Pages/UserProfile';
import Wardrobe from './Pages/Wardrobe';
import Favourites from './Pages/Favourites';
import AddCloth from './Pages/AddCloth';
import AddClothPreview from './components/Cloth/AddClothPreview';
import AdminLayout from './Pages/AdminLayout';
import AdminDashboard from './Pages/AdminDashboard';
import ManageUsers from './Pages/Admin/ManageUsers';
import ManageProducts from './Pages/Admin/ManageProducts';
import ManageOrders from './Pages/Admin/ManageOrders';
import ManageEvents from './Pages/Admin/ManageEvents';
import ManageCategories from './Pages/Admin/ManageCategories';
import AdminSettings from './Pages/Admin/AdminSettings';
import ManageHeroSection from './Pages/Admin/ManageHeroSection';
import RequireAuth from './components/Auth/RequireAuth';
import ScrollToTop from './components/Utils/ScrollToTop';
import VisitorTracker from './components/Utils/VisitorTracker';
import 'react-toastify/dist/ReactToastify.css';

// NEW PAGES
import Imprint from './Pages/Imprint';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Guidelines from './pages/Guidelines';
import About from './pages/About';
import Contact from './pages/Contact';
import ComingSoon from './pages/ComingSoon';
import NotFound from './pages/NotFound';

function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <VisitorTracker />
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="signup" element={<Signup />} />
            <Route path="verify-email" element={<VerifyEmail />} />
            <Route path="login" element={<Login />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="profile" element={<RequireAuth><UserProfile /></RequireAuth>} />
            <Route path="wardrobe" element={<RequireAuth><Wardrobe /></RequireAuth>} />
            <Route path="favorites" element={<RequireAuth><Favourites /></RequireAuth>} />
            <Route path="add-cloth" element={<RequireAuth><AddCloth /></RequireAuth>} />
            <Route path="add-cloth/preview" element={<RequireAuth><AddClothPreview /></RequireAuth>} />

            {/* Download/App Pages */}
            <Route path="download/app-store" element={<ComingSoon />} />
            <Route path="download/google-play" element={<ComingSoon />} />

            {/* New static pages */}
            <Route path="imprint" element={<Imprint />} />
            <Route path="terms" element={<Terms />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="guidelines" element={<Guidelines />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />

            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<RequireAuth adminOnly={true}><AdminLayout /></RequireAuth>}>
          <Route path="dashboard"element={<AdminDashboard />} />
           <Route path="users" element={<ManageUsers />} />
            <Route path="products" element={<ManageProducts />} />
            <Route path="orders" element={<ManageOrders />} />
            <Route path="events" element={<ManageEvents />} />
            <Route path="categories" element={<ManageCategories />} />
            <Route path="hero-section" element={<ManageHeroSection />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
