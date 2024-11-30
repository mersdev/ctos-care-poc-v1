import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard/CentralizedFinancialDashboard";
import TodoList from "./components/Todo/TodoList";
import Profile from "./components/Profile/Profile";
import { Toaster } from "./components/ui/toaster";
import { Login } from "./components/Auth/Login";
import { Register } from "./components/Auth/Register";
import { ProtectedRoute } from "./components/Auth/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import Chatbox from "./components/Chat/Chatbox";
import FullTodoList from "./components/Todo/FullTodoList";
import JobMarketTrend from "./components/JobMarketTrend/jobMarketTrend";
import FtosReport from "./components/FTOSReport/ftosReport";

const App: React.FC = () => {
  // const [reportData] = React.useState(mockData);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/jobs"
              element={
                <ProtectedRoute>
                  <JobMarketTrend />
                </ProtectedRoute>
              }
            />
            <Route
              path="/credit-report"
              element={
                <ProtectedRoute>
                  <FtosReport />
                </ProtectedRoute>
              }
            />
            <Route
              path="/todo"
              element={
                <ProtectedRoute>
                  <TodoList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <Chatbox />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />{" "}
            <Route
              path="/todo-list"
              element={
                <ProtectedRoute>
                  <FullTodoList />
                </ProtectedRoute>
              }
            />
            {/* Catch all route - redirect to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
};

export default App;
