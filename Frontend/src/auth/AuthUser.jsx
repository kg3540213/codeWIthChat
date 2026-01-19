import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useState } from "react";
import { useEffect } from "react";

const AuthUser = ({ children }) => {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) setLoading(false);
    if (!token || !user) navigate("/login");
  }, []);

  if (loading) return <div>Loading...</div>;

  return <div>{children}</div>;
};

export default AuthUser;
