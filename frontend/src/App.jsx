import { Route, Routes } from 'react-router';

import RoleSelectionPage from './pages/RoleSelectionPage.jsx';
import CustomerPage from './pages/CustomerPage.jsx';
import OfficerPage from './pages/OfficerPage.jsx';
import ManagerPage from './pages/ManagerPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import DisplayPage from './pages/DisplayPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<RoleSelectionPage />} />

      <Route path="/customer" element={<CustomerPage />} />
      <Route path="/officer" element={<OfficerPage />} />
      <Route path="/manager" element={<ManagerPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/display" element={<DisplayPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;