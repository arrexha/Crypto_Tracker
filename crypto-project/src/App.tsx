import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import { ErrorBoundary } from "./components/ErrorBoundary";

// Lazy load pages
const Home = lazy(() => import("./pages/Home").then(module => ({ default: module.Home })));
const CoinDetail = lazy(() => import("./pages/CoinDetail").then(module => ({ default: module.CoinDetail })));
const Login = lazy(() => import("./pages/auth/Login").then(module => ({ default: module.Login })));
const Register = lazy(() => import("./pages/auth/Register").then(module => ({ default: module.Register })));

const LoadingFallback = () => (
  <div className="app">
    <div className="loading">
      <div className="spinner" />
      <p>Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/coin/:id" element={<CoinDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
