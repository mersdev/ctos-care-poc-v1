import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard/CentralizedFinancialDashboard";
import CreditReport from "./components/CreditReport/CreditReport";
import TodoList from "./components/Todo/TodoList";
import Profile from "./components/Profile/Profile";
import ConsentForm from "./components/ConsentForm/ConsentForm";
import { Toaster } from "./components/ui/toaster";
import mockData from "./mockData";
import Chatbox from "./components/Chat/Chatbox";

const App: React.FC = () => {
  const [reportData] = React.useState(mockData);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/credit-report"
            element={<CreditReport data={reportData} />}
          />
          <Route path="/todo" element={<TodoList />} />
          <Route path="/chat" element={<Chatbox />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<ConsentForm />} />
        </Routes>
        <Toaster />
      </Layout>
    </Router>
  );
};

export default App;
