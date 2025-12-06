import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navigation from "./Navigation";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import Footer from "./Footer";

const Layout = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const handleLoginClick = () => {
    if (isHomePage) {
      setIsLoginModalOpen(true);
    }
  };

  const handleRegisterClick = () => {
    if (isHomePage) {
      setIsRegisterModalOpen(true);
    }
  };

  const handleSwitchToRegister = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const handleSwitchToLogin = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation
        onLoginClick={isHomePage ? handleLoginClick : undefined}
        onRegisterClick={isHomePage ? handleRegisterClick : undefined}
      />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />

      {isHomePage && (
        <>
          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            onSwitchToRegister={handleSwitchToRegister}
          />
          <RegisterModal
            isOpen={isRegisterModalOpen}
            onClose={() => setIsRegisterModalOpen(false)}
            onSwitchToLogin={handleSwitchToLogin}
          />
        </>
      )}
    </div>
  );
};

export default Layout;
