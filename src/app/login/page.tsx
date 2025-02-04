import React from "react";
import Navbar from "../../components/Navbar";
import LoginForm from "../../components/auth/LoginForm";

const LoginPage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <LoginForm />
    </div>
  );
};

export default LoginPage;
