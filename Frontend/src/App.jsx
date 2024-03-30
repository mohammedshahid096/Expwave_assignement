import "./App.css";
import React, { useState, createContext, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Componets/Login";
import Home from "./Componets/Home";
import Toast from "./Componets/Toast";
import ProtectedRoute from "./Routes/ProtectedRoute";
import GetCookie from "./Context/cookie";
import Navbar from "./Componets/Navbar";
import AddEmp from "./Componets/AddEmp";
import Dashboard from "./Componets/Dashboard";

export const Store = createContext();

function App() {
  const [message, setmessage] = useState(null);
  const [notificationtype, setnotificationtype] = useState("success");
  const [isAuth, setisAuth] = useState(false);
  const isCookie = GetCookie();

  useEffect(() => {
    if (isCookie) {
      setisAuth(true);
    }
  }, []);
  return (
    <Store.Provider
      value={{
        message,
        setmessage,
        notificationtype,
        setnotificationtype,
        setisAuth,
      }}
    >
      <div className="App">
        <BrowserRouter>
          {isAuth && <Navbar />}
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route
              path="/add"
              element={
                <ProtectedRoute>
                  <AddEmp />
                </ProtectedRoute>
              }
            />
            <Route
              path="/single/:id"
              element={
                <ProtectedRoute>
                  <AddEmp />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
        <Toast />
      </div>
    </Store.Provider>
  );
}

export default App;
