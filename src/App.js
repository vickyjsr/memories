import React from 'react';
import styled from 'styled-components';
import MemoryCarousel from './components/MemoryCarousel';
import ImageCollage from './components/ImageCollage';
import AbstractGallery from './components/AbstractGallery';
import Timeline from './components/Timeline';
import Header from './components/Header';
import FloatingElements from './components/FloatingElements';
import RomanticMessage from './components/RomanticMessage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(
    45deg,
    #ff6b8b 0%,
    #ff8da1 25%,
    #ffa1c5 50%,
    #ff8da1 75%,
    #ff6b8b 100%
  );
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      circle at center,
      rgba(0, 0, 0, 0.1) 0%,
      rgba(0, 0, 0, 0.2) 70%
    );
    pointer-events: none;
  }

  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @media (max-width: 768px) {
    padding: 0;
  }
`;

const Section = styled.section`
  width: 100%;
  max-width: 1200px;
  margin: 2rem 0;
  
  @media (max-width: 768px) {
    margin: 1rem 0;
  }
`;

const Divider = styled.div`
  width: 100%;
  height: 2px;
  background: linear-gradient(
    to right,
    transparent,
    rgba(255, 255, 255, 0.5),
    transparent
  );
  margin: 2rem 0;
`;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContainer>
        <FloatingElements />
        <Header />
        <Section>
          <MemoryCarousel />
        </Section>
        <Divider />
        <Section>
          <AbstractGallery />
        </Section>
        <Divider />
        <Section>
          <ImageCollage />
        </Section>
        <Divider />
        <Section>
          <Timeline />
        </Section>
        <RomanticMessage />
      </AppContainer>
    </QueryClientProvider>
  );
}

export default App;
