import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import CreatePostPage from './pages/CreatePostPage';
import PostDetailsPage from './pages/PostDetailsPage';
import DefaultLayout from './layout/DefaultLayout';
import EditPostPage from './pages/EditPostPage';

// Componente per le rotte protette
const ProtectedRoute = ({ children }) => {
  const { user, initialLoading } = useAuth();

  if (initialLoading) {
    return <div>Caricamento...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Componente per le rotte pubbliche
const PublicRoute = ({ children }) => {
  const { user, initialLoading } = useAuth();

  if (initialLoading) {
    return <div>Caricamento...</div>;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rotte pubbliche */}
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/" element={<DefaultLayout />}>
            {/* Rotte protette */}
            <Route index element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="create" element={<ProtectedRoute><CreatePostPage /></ProtectedRoute>} />
            <Route path="post/:id" element={<ProtectedRoute><PostDetailsPage /></ProtectedRoute>} />
            <Route path="edit-post/:id" element={<ProtectedRoute><EditPostPage /></ProtectedRoute>} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;