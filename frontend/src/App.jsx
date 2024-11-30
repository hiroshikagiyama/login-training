import { Route, Routes } from 'react-router-dom';
import UserList from './pages/UserList.jsx';
import Notfound from './pages/Notfound.jsx';
import ProtectedRoute from './auths/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/user_list"
        element={
          <ProtectedRoute>
            <UserList />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Notfound />} />
    </Routes>
  );
}

export default App;
