import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import CreatePostPage from './pages/CreatePostPage';
import PostDetailsPage from './pages/PostDetailsPage';
import EditPostPage from './pages/EditPostPage';
import DefaultLayout from './layout/DefaultLayout';

const Loader = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user, initialLoading } = useAuth();
  if (initialLoading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, initialLoading } = useAuth();
  if (initialLoading) return <Loader />;
  if (user) return <Navigate to="/dashboard" replace />;
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

          {/* Layout principale */}
          <Route path="/" element={<DefaultLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="create-post" element={<ProtectedRoute><CreatePostPage /></ProtectedRoute>} />
            <Route path="post/:id" element={<ProtectedRoute><PostDetailsPage /></ProtectedRoute>} />
            <Route path="edit-post/:id" element={<ProtectedRoute><EditPostPage /></ProtectedRoute>} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
