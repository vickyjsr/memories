import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { useQuery } from '@tanstack/react-query';
import { preloadImages } from '../utils/imagePreloader';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const ModalContent = styled(motion.div)`
  width: 100%;
  max-width: 1200px;
  max-height: 90vh;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 30px;
  overflow: hidden;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
    transform: scale(1.1);
  }
`;

const ModalHeader = styled.div`
  padding: 2rem;
  color: white;
  text-align: center;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 2rem;
  font-weight: 600;
  background: linear-gradient(45deg, #fff, #ffe6e6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const ModalDate = styled.p`
  margin: 0.5rem 0;
  font-size: 1.1rem;
  opacity: 0.9;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  padding: 0 2rem 2rem;
  overflow-y: auto;
  max-height: calc(90vh - 150px);

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
  }
`;

const ModalImage = styled(motion.div)`
  position: relative;
  aspect-ratio: 1;
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;

  .lazy-load-image-background {
    width: 100%;
    height: 100%;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

function ImageModal({ isOpen, onClose, data }) {
  const { data: modalImages } = useQuery({
    queryKey: ['modalImages', data?.id],
    queryFn: () => preloadImages(data.images.map(img => img.url)),
    enabled: isOpen && !!data,
    staleTime: Infinity,
  });

  if (!data) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalContent
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <CloseButton onClick={onClose}>×</CloseButton>
            <ModalHeader>
              <ModalTitle>{data.title}</ModalTitle>
              <ModalDate>{data.date}</ModalDate>
            </ModalHeader>
            <ImageGrid>
              {data.images.map((image, index) => (
                <ModalImage
                  key={index}
                  whileHover={{ y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <LazyLoadImage
                    src={image.url}
                    alt={image.caption}
                    effect="blur"
                    wrapperProps={{
                      style: { width: '100%', height: '100%' }
                    }}
                  />
                </ModalImage>
              ))}
            </ImageGrid>
          </ModalContent>
        </Overlay>
      )}
    </AnimatePresence>
  );
}

export default ImageModal; 