
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="signup" element={<Signup />} />
          <Route path="verify-email" element={<VerifyEmail />} />
          <Route path="login" element={<Login />} />
          <Route path="wardrobe" element={<Wardrobe />} />
          <Route path="favorites" element={<Favourites />} />
          <Route path="add-cloth" element={<AddCloth />} />
          <Route path="/add-cloth/preview" element={<AddClothPreview />} />
          {/* Add more child routes here */}
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="products" element={<ManageProducts />} />
          <Route path="orders" element={<ManageOrders />} />
          <Route path="events" element={<ManageEvents />} />
          <Route path="categories" element={<ManageCategories />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
