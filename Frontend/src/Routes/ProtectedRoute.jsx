import React from "react";
import { Navigate } from "react-router-dom";
import GetCookie from "../Context/cookie";

const ProtectedRoute = ({ children }) => {
  const isCookie = GetCookie();

  return isCookie ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
