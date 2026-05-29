import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import MainLayout from './layouts/MainLayout/MainLayout';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import CandidateRegistry from './pages/Candidates/CandidateRegistry';
import CandidateProfile from './pages/CandidateProfile/CandidateProfile';
import PaymentRegistry from './pages/Payments/PaymentRegistry';
import DocumentCenter from './pages/Documents/DocumentCenter';
import { Prilog3, Prilog4, Prilog5 } from './pages/PrintableDocuments/DocumentTemplates';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={user ? <Navigate to="/" replace /> : <Login />} 
      />
      <Route path="/print/prilog3/:id" element={<Prilog3 />} />
      <Route path="/print/prilog4/:id" element={<Prilog4 />} />
      <Route path="/print/prilog5/:id" element={<Prilog5 />} />
      
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="candidates" element={<CandidateRegistry />} />
        <Route path="candidates/:id" element={<CandidateProfile />} />
        {/* Placeholder routes for future implementation */}
        <Route path="payments" element={<PaymentRegistry />} />
        <Route path="documents" element={<DocumentCenter />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
