import React from 'react';
import styled, { keyframes } from 'styled-components';

const float = keyframes`
  0% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(10px, -10px) rotate(5deg); }
  50% { transform: translate(0, -20px) rotate(0deg); }
  75% { transform: translate(-10px, -10px) rotate(-5deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
`;

const floatWithScale = keyframes`
  0% { transform: translate(0, 0) rotate(0deg) scale(1); }
  25% { transform: translate(10px, -10px) rotate(5deg) scale(1.1); }
  50% { transform: translate(0, -20px) rotate(0deg) scale(1); }
  75% { transform: translate(-10px, -10px) rotate(-5deg) scale(1.1); }
  100% { transform: translate(0, 0) rotate(0deg) scale(1); }
`;

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
`;

const FloatingElement = styled.div`
  position: absolute;
  animation: ${props => props.$animation === 'scale' ? floatWithScale : float} ${props => props.$duration || '6s'} ease-in-out infinite;
  animation-delay: ${props => props.$delay || '0s'};
  opacity: 0.6;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.2));

  svg {
    width: ${props => props.$size || '40px'};
    height: ${props => props.$size || '40px'};
    fill: ${props => props.$color || '#fff'};
  }
`;

function FloatingElements() {
  const elements = [
    {
      id: 1,
      top: '10%',
      left: '10%',
      size: '30px',
      duration: '7s',
      delay: '0s',
      color: 'rgba(255, 255, 255, 0.8)',
      type: 'heart',
      animation: 'scale'
    },
    {
      id: 2,
      top: '20%',
      right: '20%',
      size: '40px',
      duration: '8s',
      delay: '1s',
      color: 'rgba(255, 182, 193, 0.3)',
      type: 'star'
    },
    {
      id: 3,
      bottom: '15%',
      left: '15%',
      size: '35px',
      duration: '6s',
      delay: '2s',
      color: 'rgba(255, 255, 255, 0.2)',
      type: 'heart'
    },
    {
      id: 4,
      top: '40%',
      right: '10%',
      size: '25px',
      duration: '9s',
      delay: '1.5s',
      color: 'rgba(255, 182, 193, 0.25)',
      type: 'heart'
    },
    {
      id: 5,
      top: '60%',
      left: '5%',
      size: '45px',
      duration: '7.5s',
      delay: '0.5s',
      color: 'rgba(255, 255, 255, 0.2)',
      type: 'star'
    },
    {
      id: 6,
      bottom: '20%',
      right: '15%',
      size: '35px',
      duration: '8.5s',
      delay: '2.5s',
      color: 'rgba(255, 192, 203, 0.3)',
      type: 'heart'
    },
    {
      id: 7,
      top: '30%',
      left: '50%',
      size: '30px',
      duration: '10s',
      delay: '1s',
      color: 'rgba(255, 182, 193, 0.2)',
      type: 'star'
    },
    {
      id: 8,
      top: '45%',
      right: '25%',
      size: '50px',
      duration: '9s',
      delay: '1.2s',
      color: 'rgba(255, 255, 255, 0.9)',
      type: 'heart',
      animation: 'scale'
    }
  ];

  const getSvgPath = (type) => {
    switch (type) {
      case 'heart':
        return (
          <svg viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        );
      case 'star':
        return (
          <svg viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <Container>
      {elements.map((element) => (
        <FloatingElement
          key={element.id}
          style={{
            top: element.top,
            left: element.left,
            right: element.right,
            bottom: element.bottom
          }}
          $size={element.size}
          $duration={element.duration}
          $delay={element.delay}
          $color={element.color}
          $animation={element.animation}
        >
          {getSvgPath(element.type)}
        </FloatingElement>
      ))}
    </Container>
  );
}

export default FloatingElements; 