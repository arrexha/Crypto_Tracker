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
  <div className="min-h-screen bg-dark flex flex-col items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
      <p className="text-gray-300 text-lg">Loading...</p>
    </div>
  </div>
);

function App() {
  return (

      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Register />} />
              <Route path="/home" element={<Home />} />
              <Route path="/coin/:id" element={<CoinDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
  );
}

export default App;
