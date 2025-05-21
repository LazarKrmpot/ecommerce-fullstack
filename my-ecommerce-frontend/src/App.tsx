import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "./store/authStore";
import Layout from "./components/Layout/Layout";

import { ErrorBoundary } from "./components/ErrorBoundary";
import { publicRoutes } from "./routes/publicRoutes";
import { protectedRoutes } from "./routes/protectedRoutes";

const App = () => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <ErrorBoundary>
        <div className="h-full bg-gray-50">
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* Public Routes */}
              {publicRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              ))}

              {/* Protected Routes */}
              {protectedRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              ))}
            </Route>
          </Routes>
        </div>
      </ErrorBoundary>
    </Router>
  );
};

export default App;
