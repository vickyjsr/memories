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
      title: "Dates <3",
      mainImage: "https://firebasestorage.googleapis.com/v0/b/chatapp-46c14.appspot.com/o/Preeti%2Fa9dd8c6b-f858-4fab-a19a-4cf13a399442.jpg?alt=media&token=f236f970-85d4-44de-b25d-0fa3f520968e",
      images: [
        { url: "https://firebasestorage.googleapis.com/v0/b/chatapp-46c14.appspot.com/o/Preeti%2FIMG_4326.jpg?alt=media&token=3a7161ba-9ef6-490e-a071-4dbc417b50f7", caption: "Marcony" },
        { url: "https://firebasestorage.googleapis.com/v0/b/chatapp-46c14.appspot.com/o/Preeti%2FIMG_9959.JPG?alt=media&token=14d9cf49-bbcf-4f93-9991-7a3d86b2855a", caption: "Cofeeeeeeee" },
        { url: "https://firebasestorage.googleapis.com/v0/b/chatapp-46c14.appspot.com/o/Preeti%2FIMG_9431.jpg?alt=media&token=a260497b-89af-445a-84b1-7778ddc67792", caption: "Paneeeerr" },
        { url: "https://firebasestorage.googleapis.com/v0/b/chatapp-46c14.appspot.com/o/Preeti%2Fa9dd8c6b-f858-4fab-a19a-4cf13a399442.jpg?alt=media&token=f236f970-85d4-44de-b25d-0fa3f520968e", caption: "Pijjjjaaaaaaa" }
      ]
    },
    {
      id: 2,
      title: "Smiling Preeti 🌅",
      mainImage: "https://firebasestorage.googleapis.com/v0/b/chatapp-46c14.appspot.com/o/Preeti%2FIMG_8998.JPG?alt=media&token=c552830a-fa25-44c1-b35a-b6dca67b5623",
      images: [
        { url: "https://firebasestorage.googleapis.com/v0/b/chatapp-46c14.appspot.com/o/Preeti%2FIMG_9690.JPG?alt=media&token=f08cfe66-3e81-4f1c-98b1-1f7d6e6debd4", caption: "College" },
        { url: "https://firebasestorage.googleapis.com/v0/b/chatapp-46c14.appspot.com/o/Preeti%2Fc6a69a15-88b6-4084-b81c-7307db81a2a1.JPG?alt=media&token=c3cfd2d7-148a-49e2-bc71-9bc2b11819ba", caption: "home" },
        { url: "https://firebasestorage.googleapis.com/v0/b/chatapp-46c14.appspot.com/o/Preeti%2Fc374b3cb-ccae-4884-bd7d-abc1f0d8476b.JPG?alt=media&token=d837838e-c679-4b9c-9fb8-f7c18c089f1a", caption: "" },
        { url: "https://firebasestorage.googleapis.com/v0/b/chatapp-46c14.appspot.com/o/Preeti%2FIMG_3080.PNG?alt=media&token=83cb25a5-f543-4797-a607-3855018667b7", caption: "10th" },
        { url: "https://firebasestorage.googleapis.com/v0/b/chatapp-46c14.appspot.com/o/Preeti%2FIMG_0093.JPG?alt=media&token=da64877b-d9ca-4202-8f32-e279fff5420a", caption: "10th" },
        { url: "https://firebasestorage.googleapis.com/v0/b/chatapp-46c14.appspot.com/o/Preeti%2FIMG_3080.PNG?alt=media&token=83cb25a5-f543-4797-a607-3855018667b7", caption: "10th" }
      ]
    },
    {
      id: 3,
      title: "Mirror Pic 🌸",
      mainImage: "https://firebasestorage.googleapis.com/v0/b/chatapp-46c14.appspot.com/o/Preeti%2Fa5505b27-a787-4444-a84a-56a28e0f10c3.JPG?alt=media&token=6d71c439-deec-4b22-bdb8-72feefcdabbf",
      images: [
        { url: "https://firebasestorage.googleapis.com/v0/b/chatapp-46c14.appspot.com/o/Preeti%2Fef4996cd-fdea-4761-976e-b263655e7f0f.JPG?alt=media&token=d2ca6f6e-0c4a-487b-bb71-185713be4b4c", caption: "" },
        { url: "https://firebasestorage.googleapis.com/v0/b/chatapp-46c14.appspot.com/o/Preeti%2Fd405f4d9-3ca7-4d64-84a1-fc6e050895e9.JPG?alt=media&token=7f217e43-aefd-416f-b167-9b7be736abf8", caption: "" }      ]
    },
    {
      id: 4,
      title: "Trips 🧺",
      mainImage: "https://firebasestorage.googleapis.com/v0/b/chatapp-46c14.appspot.com/o/Preeti%2F1bb9dbcb-3f26-4799-a8a5-7ada9b30b0f0.JPG?alt=media&token=e0a9714c-fb5b-4d73-b99b-fa5dcb8cf270",
      images: [
        {url: "https://firebasestorage.googleapis.com/v0/b/chatapp-46c14.appspot.com/o/Preeti%2F72038cb2-3e99-464b-aebd-c4eb04314b44.JPG?alt=media&token=cb21a297-68de-4991-b7b2-8893d0aa9dbe", caption: ""},
        { url: "https://firebasestorage.googleapis.com/v0/b/chatapp-46c14.appspot.com/o/Preeti%2F55e1c3d2-bba8-4cc4-a5b2-7da87b750581.JPG?alt=media&token=d4c8092a-ce94-4a64-a17e-87d66ecb7cec", caption: "" },
        { url: "https://firebasestorage.googleapis.com/v0/b/chatapp-46c14.appspot.com/o/Preeti%2F79b50a71-61ed-4b33-8a21-9450a62ef2d8.JPG?alt=media&token=46548dc0-b322-44ec-97db-b2fa03d62d29", caption: "" },
        { url: "https://firebasestorage.googleapis.com/v0/b/chatapp-46c14.appspot.com/o/Preeti%2F6b96dd58-3198-4c5e-846b-5529337ca7fb.JPG?alt=media&token=8a54da1b-eaa7-4dca-be2a-c3f1d304bf13", caption: "" },
        { url: "https://firebasestorage.googleapis.com/v0/b/chatapp-46c14.appspot.com/o/Preeti%2Fc6a69a15-88b6-4084-b81c-7307db81a2a1.JPG?alt=media&token=c3cfd2d7-148a-49e2-bc71-9bc2b11819ba", caption: "Darjeeling" },
        {url: "https://firebasestorage.googleapis.com/v0/b/chatapp-46c14.appspot.com/o/Preeti%2FIMG_0093.JPG?alt=media&token=da64877b-d9ca-4202-8f32-e279fff5420a", caption: ""},
        {url: "https://firebasestorage.googleapis.com/v0/b/chatapp-46c14.appspot.com/o/Preeti%2F9ca4fb42-3b14-4505-97d0-6c33ea0dfaed.JPG?alt=media&token=fedb8a86-d271-4a6d-b6ed-81ef7c71a832", caption: ""},
        {url: "https://firebasestorage.googleapis.com/v0/b/chatapp-46c14.appspot.com/o/Preeti%2Fd93cee78-944e-4d6d-8a6f-5d5de4f0f1f6.JPG?alt=media&token=6dfed59a-9275-4d9c-9538-f98e77c2e71f", caption: ""},
      ]
    },
    {
      id: 5,
      title: "My Favorites 🧺",
      mainImage: "https://firebasestorage.googleapis.com/v0/b/chatapp-46c14.appspot.com/o/Preeti%2F7c1a3848-5867-4e03-a16a-8a6424c384b9.JPG?alt=media&token=3c3ee592-a8b4-4820-902e-7fa47b45e3de",
      images: [
        { url: "https://firebasestorage.googleapis.com/v0/b/chatapp-46c14.appspot.com/o/Preeti%2FIMG_9431.jpg?alt=media&token=a260497b-89af-445a-84b1-7778ddc67792", caption: "" },
        { url: "https://firebasestorage.googleapis.com/v0/b/chatapp-46c14.appspot.com/o/Preeti%2Fc374b3cb-ccae-4884-bd7d-abc1f0d8476b.JPG?alt=media&token=d837838e-c679-4b9c-9fb8-f7c18c089f1a", caption: "" },
        { url: "https://firebasestorage.googleapis.com/v0/b/chatapp-46c14.appspot.com/o/Preeti%2Fe71d9d5e-99a9-4afb-8fab-6183596be1b6.jpg?alt=media&token=55edaf56-f17f-4dfb-98d5-c0a38b9f2887", caption: "" },
        { url: "https://firebasestorage.googleapis.com/v0/b/chatapp-46c14.appspot.com/o/Preeti%2FIMG_1636.jpg?alt=media&token=a951f6c2-ad3d-4789-b42c-13212aa18938", caption: "Snapchat" },
        { url: "https://firebasestorage.googleapis.com/v0/b/chatapp-46c14.appspot.com/o/Preeti%2FIMG_0099.JPG?alt=media&token=55546c21-c9e6-45b0-b8c5-e439a77bb64d", caption: "Mukutmanipur" }
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