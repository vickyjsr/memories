import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const HeaderContainer = styled(motion.header)`
  padding: 2rem;
  text-align: center;
  color: white;
  margin: 2rem 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin: 1rem;
    background: rgba(0, 0, 0, 0.35);
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
    font-size: 2.5rem;
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
    font-size: 1rem;
    padding: 0 1rem;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
    font-weight: 600;
  }
`;

function Header() {
  return (
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
        Our Story
      </Title>
      <Subtitle>Cherishing moments together, one memory at a time</Subtitle>
    </HeaderContainer>
  );
}

export default Header; 