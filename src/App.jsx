
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Home from './Pages/Home';
import Signup from './Pages/Signup';
import './App.css';
import Login from './Pages/Login';
import Wardrobe from './Pages/Wardrobe';
import Favourites from './Pages/Favourites';
import AddCloth from './Pages/AddCloth';
import AddClothPreview from './components/Cloth/AddClothPreview';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />
          <Route path="wardrobe" element={<Wardrobe />} />
          <Route path="favorites" element={<Favourites />} />
          <Route path="add-cloth" element={<AddCloth />} />
          <Route path="/add-cloth/preview" element={<AddClothPreview />} />
          {/* Add more child routes here */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
