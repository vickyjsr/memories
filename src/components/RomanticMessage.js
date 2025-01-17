import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const MessageContainer = styled(motion.div)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  border-radius: 20px;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  z-index: 100;

  @media (max-width: 768px) {
    bottom: 1rem;
    right: 1rem;
    padding: 0.8rem 1.5rem;
  }
`;

const Message = styled.p`
  margin: 0;
  font-weight: 500;
`;

function RomanticMessage() {
  const messages = [
    "Every moment with you is magical ✨",
    "You make my heart skip a beat 💓",
    "Forever yours 💖",
    "You're my everything 🌟"
  ];

  const [messageIndex, setMessageIndex] = React.useState(0);

  const cycleMessage = () => {
    setMessageIndex((prev) => (prev + 1) % messages.length);
  };

  return (
    <MessageContainer
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={cycleMessage}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Message>{messages[messageIndex]}</Message>
    </MessageContainer>
  );
}

export default RomanticMessage; 