import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const FloatingEmoji = styled.div`
  position: absolute;
  font-size: ${props => props.size};
  top: ${props => props.top};
  left: ${props => props.left};
  right: ${props => props.right};
  bottom: ${props => props.bottom};
  animation: ${float} ${props => props.duration} ease-in-out infinite;
  animation-delay: ${props => props.delay};
  opacity: 0.8;
  text-shadow: 0 5px 15px rgba(0,0,0,0.1);
`;

const PasscodeContainer = styled.div`
  min-height: 100vh;
  background: #FFF0F5; // Light pink background
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const PasscodeCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  text-align: center;
  max-width: 400px;
  width: 90%;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 2rem;
    margin: 1rem;
  }
`;

const Title = styled.h1`
  color: #E91E63; // Hot pink color for the title
  margin-bottom: 1rem;
  font-size: 2rem;
  font-weight: 700;
`;

const Subtitle = styled.p`
  color: #666;
  margin-bottom: 2rem;
  font-size: 1.1rem;
`;

const InputContainer = styled.div`
  display: flex;
  border: 1px solid #FAD0E2;
  border-radius: 50px;
  padding: 0.5rem;
  background: #FFF8FB;
  transition: all 0.3s ease;

  &:focus-within {
    border-color: #E91E63;
    box-shadow: 0 0 0 3px rgba(233, 30, 99, 0.1);
  }
`;

const PasscodeInput = styled.input`
  flex-grow: 1;
  border: none;
  background: transparent;
  padding: 0.8rem 1rem;
  color: #333;
  font-size: 1.1rem;

  &::placeholder {
    color: #BBB;
  }

  &:focus {
    outline: none;
  }
`;

const SubmitButton = styled(motion.button)`
  background: linear-gradient(45deg, #FF6B8B, #E91E63);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 5px 15px rgba(233, 30, 99, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ErrorMessage = styled(motion.div)`
  color: #D32F2F;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  background: rgba(211, 47, 47, 0.05);
  padding: 0.7rem;
  border-radius: 10px;
  border: 1px solid rgba(211, 47, 47, 0.1);
`;

const HeartIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #E91E63;
`;

const floatingEmojis = [
  { id: 1, emoji: '🌺', size: '40px', top: '10%', left: '10%', duration: '8s', delay: '0s' },
  { id: 2, emoji: '🦋', size: '30px', top: '15%', right: '15%', duration: '6s', delay: '1s' },
  { id: 3, emoji: '💕', size: '35px', top: '70%', left: '20%', duration: '7s', delay: '2s' },
  { id: 4, emoji: '📷', size: '30px', top: '80%', right: '10%', duration: '9s', delay: '0.5s' },
  { id: 5, emoji: '💖', size: '25px', top: '40%', left: '5%', duration: '10s', delay: '1.5s' },
  { id: 6, emoji: '✨', size: '25px', top: '50%', right: '25%', duration: '5s', delay: '2.5s' },
];

function PasscodeScreen({ onAuthenticated }) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Get passcodes from environment variable or use a default
  const getValidPasscodes = () => {
    // In React (created with Create React App), env vars must start with REACT_APP_
    const envPasscodes = process.env.REACT_APP_PASSCODES;
    
    console.log('Reading environment variable REACT_APP_PASSCODES:', envPasscodes);
    
    if (envPasscodes) {
      // Split by comma and trim whitespace to handle array of passcodes
      const passcodes = envPasscodes.split(',').map(code => code.trim()).filter(code => code.length > 0);
      console.log('Valid passcodes loaded from .env:', passcodes);
      return passcodes;
    }
    
    // Default passcode if no environment variable is set
    console.log('No .env variable found, using default passcode: [\'birthday2024\']');
    return ['birthday2024'];
  };

  const validPasscodes = getValidPasscodes();

  // Log passcodes on component mount
  useEffect(() => {
    console.log('PasscodeScreen mounted. Valid passcodes:', validPasscodes);
  }, [validPasscodes]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    console.log('Attempting to validate passcode:', passcode);
    console.log('Against valid passcodes:', validPasscodes);

    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check if the entered passcode matches any of the valid passcodes
    const isValidPasscode = validPasscodes.some(validCode => 
      passcode.trim() === validCode
    );

    console.log('Passcode validation result:', isValidPasscode);

    if (isValidPasscode) {
      // Store authentication in localStorage
      localStorage.setItem('birthdayWebsiteAuthenticated', 'true');
      localStorage.setItem('birthdayWebsiteAuthTime', Date.now().toString());
      onAuthenticated();
    } else {
      setError('Incorrect passcode. Please try again.');
      setPasscode('');
    }
    
    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <PasscodeContainer>
      {floatingEmojis.map(item => (
        <FloatingEmoji key={item.id} {...item}>
          {item.emoji}
        </FloatingEmoji>
      ))}
      <PasscodeCard
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring' }}
      >
        <HeartIcon>💕</HeartIcon>
        <Title>Welcome to Our Special Place</Title>
        <Subtitle>Enter the secret passcode to continue</Subtitle>
        
        <form onSubmit={handleSubmit}>
          <InputContainer>
            <PasscodeInput
              type="password"
              placeholder="Enter passcode..."
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              onKeyPress={handleKeyPress}
              autoFocus
            />
            <SubmitButton
              type="submit"
              disabled={isLoading || !passcode.trim()}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              →
            </SubmitButton>
          </InputContainer>
        </form>

        {error && (
          <ErrorMessage
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </ErrorMessage>
        )}
      </PasscodeCard>
    </PasscodeContainer>
  );
}

export default PasscodeScreen; 