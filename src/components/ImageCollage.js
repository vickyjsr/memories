import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import ImageModal from './ImageModal';
import { preloadImages } from '../utils/imagePreloader';

const CollageContainer = styled.section`
  width: 100%;
  max-width: 1200px;
  padding: 2rem;
  margin: 2rem auto;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2.5rem;
  padding: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2rem;
    padding: 1rem;
  }
`;

const BackgroundSVG = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
  opacity: 0.15;
  pointer-events: none;
  
  svg {
    width: 100%;
    height: 100%;
    fill: rgba(255, 182, 193, 0.8);
    transform-style: preserve-3d;
    animation: float 8s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateZ(0) rotate(0deg) scale(1); }
    25% { transform: translateZ(20px) rotate(5deg) scale(1.05); }
    75% { transform: translateZ(10px) rotate(-5deg) scale(0.95); }
  }
`;

const ImageCard = styled(motion.div)`
  position: relative;
  border-radius: 25px;
  overflow: hidden;
  cursor: pointer;
  aspect-ratio: 1;
  background: rgba(255, 192, 203, 0.15);
  backdrop-filter: blur(10px);
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.1),
    0 5px 15px rgba(255, 182, 193, 0.2);
  transform-style: preserve-3d;
  perspective: 1000px;
  border: 1px solid rgba(255, 255, 255, 0.2);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      45deg,
      rgba(255, 192, 203, 0.2),
      rgba(255, 255, 255, 0.1)
    );
    z-index: 1;
  }

  &:hover {
    box-shadow: 
      0 15px 40px rgba(0, 0, 0, 0.15),
      0 10px 20px rgba(255, 182, 193, 0.3);
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: rgba(255, 192, 203, 0.05);
  overflow: hidden;
  transition: transform 0.5s ease;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(255, 192, 203, 0.1) 100%
    );
    z-index: 2;
  }
`;

const OptimizedImage = styled(LazyLoadImage)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.6s ease;
  opacity: 0;
  transform: scale(1.05);
  
  &.lazy-load-image-loaded {
    opacity: 1;
    transform: scale(1);
  }
`;

const LoadingPlaceholder = styled(motion.div)`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.05),
    rgba(255, 255, 255, 0.1)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;

  &::after {
    content: '❤️';
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0% { transform: scale(1) rotate(0deg); }
    50% { transform: scale(1.2) rotate(10deg); }
    100% { transform: scale(1) rotate(0deg); }
  }
`;

const Overlay = styled(motion.div)`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(255, 182, 193, 0.2) 50%,
    rgba(0, 0, 0, 0.8) 100%
  );
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 2rem;
  color: white;
  z-index: 2;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.6rem;
  font-weight: 600;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  transform: translateY(20px);
  opacity: 0;
  animation: slideUp 0.5s ease forwards;

  @keyframes slideUp {
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const DateText = styled.p`
  margin: 0.5rem 0;
  opacity: 0;
  font-size: 1.1rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  animation: fadeIn 0.5s ease 0.2s forwards;

  @keyframes fadeIn {
    to {
      opacity: 1;
    }
  }
`;

const PhotoCount = styled.span`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(8px);
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transform: translateY(-20px);
  opacity: 0;
  animation: slideDown 0.5s ease 0.3s forwards;

  &::before {
    content: '📸';
    font-size: 1.1rem;
  }

  @keyframes slideDown {
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const patterns = {
  hearts: `
    <pattern id="hearts" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
      <path d="M25 39.7l-.6-.5C11.5 28.7 8 25 8 19c0-5 4-9 9-9 4.1 0 6.4 2.3 8 4.1 1.6-1.8 3.9-4.1 8-4.1 5 0 9 4 9 9 0 6-3.5 9.7-16.4 20.2l-.6.5z"/>
    </pattern>
  `,
  stars: `
    <pattern id="stars" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
      <path d="M25 1l6.18 12.52L44 15.27l-9.5 9.26L37.36 37 25 31.52 12.64 37l2.86-12.47L6 15.27l12.82-1.75z"/>
    </pattern>
  `,
  circles: `
    <pattern id="circles" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
      <circle cx="25" cy="25" r="20"/>
    </pattern>
  `
};

const getRandomPattern = () => {
  const patternKeys = Object.keys(patterns);
  return patternKeys[Math.floor(Math.random() * patternKeys.length)];
};

const CardBackground = ({ pattern }) => (
  <BackgroundSVG>
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <defs dangerouslySetInnerHTML={{ __html: patterns[pattern] }} />
      <rect width="100" height="100" fill={`url(#${pattern})`} />
    </svg>
  </BackgroundSVG>
);

function ImageCollage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const queryClient = useQueryClient();

  const dates = [
    {
      id: 1,
      title: "First Coffee Date ☕",
      date: "January 15, 2023",
      mainImage: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486",
      images: [
        { url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486", caption: "Coffee time" },
        { url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2", caption: "Laughs" },
        { url: "https://images.unsplash.com/photo-1503516459261-40c66117780a", caption: "Walk" },
        { url: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954", caption: "Evening" }
      ]
    },
    {
      id: 2,
      title: "Beach Sunset 🌅",
      date: "February 14, 2023",
      mainImage: "https://images.unsplash.com/photo-1515238152791-8216bfdf89a7",
      images: [
        { url: "https://images.unsplash.com/photo-1515238152791-8216bfdf89a7", caption: "Sunset view" },
        { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", caption: "Beach walk" },
        { url: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a", caption: "Together" }
      ]
    },
    {
      id: 3,
      title: "Movie Night 🎬",
      date: "March 1, 2023",
      mainImage: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c",
      images: [
        { url: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c", caption: "Movie time" },
        { url: "https://images.unsplash.com/photo-1585647347483-22b66260dfff", caption: "Popcorn" },
        { url: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1", caption: "Cinema" }
      ]
    },
    {
      id: 4,
      title: "Park Picnic 🧺",
      date: "April 5, 2023",
      mainImage: "https://images.unsplash.com/photo-1526401485004-46910ecc8e51",
      images: [
        { url: "https://images.unsplash.com/photo-1526401485004-46910ecc8e51", caption: "Picnic setup" },
        { url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18", caption: "Park views" },
        { url: "https://images.unsplash.com/photo-1540857890800-058ca4c7b464", caption: "Together" }
      ]
    },
    {
      id: 5,
      title: "Garden Walk 🌸",
      date: "May 20, 2023",
      mainImage: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07",
      images: [
        { url: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07", caption: "Spring flowers" },
        { url: "https://images.unsplash.com/photo-1557968897-c6cf8f5945d5", caption: "Garden path" },
        { url: "https://images.unsplash.com/photo-1504713215707-c0696311ff10", caption: "Together" }
      ]
    },
    {
      id: 6,
      title: "Dinner Date 🍝",
      date: "June 10, 2023",
      mainImage: "https://images.unsplash.com/photo-1529516548873-9ce57c8f155e",
      images: [
        { url: "https://images.unsplash.com/photo-1529516548873-9ce57c8f155e", caption: "Romantic dinner" },
        { url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0", caption: "Restaurant" },
        { url: "https://images.unsplash.com/photo-1470337458703-46ad1756a187", caption: "Cheers" }
      ]
    }
  ];

  // Preload images in smaller batches
  const { data: preloadedImages, isLoading } = useQuery({
    queryKey: ['preloadImages'],
    queryFn: async () => {
      const allImages = dates.flatMap(date => [date.mainImage]);
      const batchSize = 2;
      const batches = [];
      
      for (let i = 0; i < allImages.length; i += batchSize) {
        const batch = allImages.slice(i, i + batchSize);
        batches.push(preloadImages(batch));
      }
      
      return Promise.all(batches);
    },
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  const handleImageLoad = (imageUrl) => {
    setLoadedImages(prev => new Set([...prev, imageUrl]));
  };

  // Prefetch next batch of images
  const prefetchNextImages = (date) => {
    queryClient.prefetchQuery({
      queryKey: ['modalImages', date.id],
      queryFn: () => preloadImages(date.images.map(img => img.url)),
      staleTime: Infinity,
    });
  };

  const handleCardClick = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  return (
    <CollageContainer>
      <Grid>
        <AnimatePresence>
          {dates.map((date, index) => (
            <ImageCard
              key={date.id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ 
                y: -15,
                rotateX: 10,
                rotateY: 10,
                scale: 1.03,
                transition: { 
                  duration: 0.4,
                  ease: "easeOut"
                }
              }}
              viewport={{ once: true }}
              onClick={() => handleCardClick(date)}
              onMouseEnter={() => prefetchNextImages(date)}
            >
              <CardBackground pattern={getRandomPattern()} />
              <ImageWrapper>
                {(!loadedImages.has(date.mainImage) || isLoading) && (
                  <LoadingPlaceholder
                    animate={{
                      background: [
                        'rgba(255,255,255,0.05)',
                        'rgba(255,255,255,0.1)',
                        'rgba(255,255,255,0.05)'
                      ],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                )}
                <OptimizedImage
                  src={date.mainImage}
                  alt={date.title}
                  effect="blur"
                  afterLoad={() => handleImageLoad(date.mainImage)}
                  wrapperProps={{
                    style: { 
                      width: '100%', 
                      height: '100%',
                      display: 'block',
                      position: 'relative',
                      zIndex: 2
                    }
                  }}
                  threshold={100}
                  placeholderSrc={date.mainImage + '?w=10&q=10'}
                />
              </ImageWrapper>
              <Overlay
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Title>{date.title}</Title>
                <DateText>{date.date}</DateText>
                <PhotoCount>{date.images.length} photos</PhotoCount>
              </Overlay>
            </ImageCard>
          ))}
        </AnimatePresence>
      </Grid>
      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedDate}
      />
    </CollageContainer>
  );
}

export default ImageCollage; 