import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { AuthProvider } from "./context/AuthContext";

const Home = lazy(() => import("./pages/Home").then(module => ({ default: module.Home })));
const CoinDetail = lazy(() => import("./pages/CoinDetail").then(module => ({ default: module.CoinDetail })));
const Login = lazy(() => import("./pages/Auth/Login").then(module => ({ default: module.Login })));
const Register = lazy(() => import("./pages/Auth/Register").then(module => ({ default: module.Register })));

const LoadingFallback = () => null;

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
