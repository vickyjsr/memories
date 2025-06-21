import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const HeaderWrapper = styled.div`
  width: 100%;
  padding: 1rem;
  position: relative;

  @media (max-width: 768px) {
    padding: 0.8rem;
  }
`;

const HeaderContainer = styled(motion.header)`
  padding: 1.5rem;
  text-align: center;
  color: white;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    padding: 1.2rem 1rem;
  }
`;

const LogoutButton = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: linear-gradient(135deg, #ff8da1 0%, #ffb3c1 100%);
  color: white;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  z-index: 10;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  box-shadow: 0 4px 15px rgba(255, 107, 139, 0.2);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.3);

  span:first-child {
    font-size: 1.1rem;
    margin-right: -2px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 107, 139, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    top: 1.3rem;
    right: 1.3rem;
    padding: 0.4rem 0.8rem;
    font-size: 0.75rem;
    min-height: 36px;
    gap: 0.25rem;
    border-radius: 18px;

    span:first-child {
      font-size: 0.85rem;
    }
  }
`;

const Title = styled(motion.h1)`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4);
  background: linear-gradient(45deg, #fff, #ffe6e6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  z-index: 1;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.2);
    filter: blur(8px);
    z-index: -1;
  }

  @media (max-width: 768px) {
    font-size: 2.2rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    background: linear-gradient(45deg, #fff 30%, #ffe6e6 70%);
    -webkit-background-clip: text;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.2rem;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  font-weight: 500;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0 1rem;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
    font-weight: 600;
  }
`;

function Header({ onLogout }) {
  const handleLogout = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Logout button touched/clicked");
    onLogout();
  };

  return (
    <HeaderWrapper>
      <LogoutButton onClick={handleLogout} onTouchEnd={handleLogout}>
        <span>🔒</span>
        <span>Logout</span>
      </LogoutButton>

      <HeaderContainer
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Title
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          Our Love Story
        </Title>
        <Subtitle>Cherishing moments together, one memory at a time</Subtitle>
      </HeaderContainer>
    </HeaderWrapper>
  );
}

export default Header; 