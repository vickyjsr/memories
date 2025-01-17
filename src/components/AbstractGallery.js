import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';

const GalleryContainer = styled.section`
  min-height: 100vh;
  background: linear-gradient(to bottom, #0f1016 0%, #1a1b25 100%);
  padding: 4rem 2rem 6rem;
  position: relative;
  overflow: hidden;
`;

const BackgroundLayer = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
`;

const Moon = styled(motion.div)`
  position: absolute;
  top: 10%;
  right: 15%;
  width: 400px;
  height: 400px;
  background-image: url('https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?w=500');
  background-size: cover;
  background-position: center;
  mask-image: radial-gradient(circle at center, black 0%, black 70%, transparent 100%);
  -webkit-mask-image: radial-gradient(circle at center, black 0%, black 70%, transparent 100%);
  z-index: 0;
  filter: brightness(1) contrast(1.2);
  box-shadow: 
    0 0 120px rgba(255, 241, 118, 0.3),
    0 0 180px rgba(255, 241, 118, 0.2);
  transform-origin: center;
  opacity: 0.85;
  mix-blend-mode: screen;
  pointer-events: none;
  border-radius: 50%;
  mask-image: linear-gradient(black, transparent);
  -webkit-mask-image: linear-gradient(black, transparent);
  @media (max-width: 1200px) {
    width: 300px;
    height: 300px;
    top: 8%;
    right: 10%;
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    width: 250px;
    height: 250px;
    top: 5%;
    right: 8%;
    opacity: 0.75;
  }
`;

const ScrollContainer = styled.div`
  position: absolute;
  inset: 0;
  overflow-y: auto;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
`;

const MasonryGrid = styled(motion.div)`
  columns: 3;
  column-gap: 2rem;
  max-width: 1800px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  padding: 2rem;

  @media (max-width: 1200px) {
    columns: 2;
    padding: 1.5rem;
  }

  @media (max-width: 768px) {
    columns: 1;
    padding: 1rem;
  }
`;

const MemoryCard = styled(motion.div)`
  break-inside: avoid;
  margin-bottom: 2.5rem;
  position: relative;
  transform-origin: center;
  cursor: pointer;
  
  &:last-child {
    margin-bottom: 1rem;
  }
`;

const ImageContainer = styled(motion.div)`
  position: relative;
  border-radius: ${props => props.isExpanded ? '24px' : '16px'};
  overflow: hidden;
  transform-origin: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: border-radius 0.5s ease;
  background: rgba(0, 0, 0, 0.1);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      transparent 0%,
      transparent 50%,
      rgba(0, 0, 0, 0.8) 100%
    );
    opacity: ${props => (props.isHovered || props.isExpanded) ? 1 : 0};
    transition: opacity 0.3s ease;
    z-index: 1;

    @media (max-width: 768px) {
      opacity: 1;
      background: linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.2) 0%,
        rgba(0, 0, 0, 0.4) 50%,
        rgba(0, 0, 0, 0.8) 100%
      );
    }
  }
`;

const StyledImage = styled(motion.img)`
  width: 100%;
  height: auto;
  display: block;
  transform-origin: center;
  filter: brightness(1.15) contrast(1.1) saturate(1.1);
  transition: filter 0.3s ease;

  ${props => props.isHovered || props.isExpanded ? `
    filter: brightness(1.2) contrast(1.15) saturate(1.15);
  ` : ''}
`;

const ContentOverlay = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  color: white;
  z-index: 2;
  transform: translateY(${props => (props.isHovered || props.isExpanded) ? '0' : '20px'});
  opacity: ${props => (props.isHovered || props.isExpanded) ? 1 : 0};
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    opacity: 1;
    transform: translateY(0);
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.8) 0%,
      rgba(0, 0, 0, 0.6) 50%,
      transparent 100%
    );
  }
`;

const Title = styled.h3`
  font-size: ${props => props.isExpanded ? '2.5rem' : '1.8rem'};
  font-weight: 800;
  margin: 0;
  background: linear-gradient(45deg, #fff, #f0f0f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 2px 2px 20px rgba(0, 0, 0, 0.2);
  transition: font-size 0.5s ease;

  @media (max-width: 768px) {
    font-size: ${props => props.isExpanded ? '2rem' : '1.5rem'};
  }
`;

const Description = styled.p`
  font-size: ${props => props.isExpanded ? '1.2rem' : '1rem'};
  margin: 1rem 0;
  color: rgba(255, 255, 255, 0.9);
  max-width: 90%;
  line-height: 1.6;
  transition: font-size 0.5s ease;

  @media (max-width: 768px) {
    font-size: ${props => props.isExpanded ? '1.1rem' : '0.9rem'};
    margin: 0.5rem 0;
  }
`;

const CategoryTag = styled(motion.span)`
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  background: ${props => props.color || 'rgba(255, 255, 255, 0.1)'};
  padding: 0.5rem 1rem;
  border-radius: 15px;
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
  opacity: ${props => (props.isHovered || props.isExpanded) ? 1 : 0};
  transform: translateX(${props => (props.isHovered || props.isExpanded) ? '0' : '-10px'});
  transition: all 0.3s ease;
  z-index: 2;

  @media (max-width: 768px) {
    opacity: 1;
    transform: translateX(0);
    background: ${props => props.color || 'rgba(255, 255, 255, 0.15)'};
    backdrop-filter: blur(8px);
  }
`;

const DateChip = styled(motion.div)`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  opacity: ${props => (props.isHovered || props.isExpanded) ? 1 : 0};
  transform: translateY(${props => (props.isHovered || props.isExpanded) ? '0' : '-10px'});
  transition: all 0.3s ease;
  z-index: 2;

  @media (max-width: 768px) {
    opacity: 1;
    transform: translateY(0);
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(8px);
  }
`;

const StarField = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(1px 1px at 10px 10px, #ffffff, rgba(0, 0, 0, 0)),
      radial-gradient(1px 1px at 150px 150px, #ffffff, rgba(0, 0, 0, 0)),
      radial-gradient(1px 1px at 240px 100px, #ffffff, rgba(0, 0, 0, 0)),
      radial-gradient(2px 2px at 300px 250px, #ffffff, rgba(0, 0, 0, 0)),
      radial-gradient(1px 1px at 400px 150px, #ffffff, rgba(0, 0, 0, 0)),
      radial-gradient(1.5px 1.5px at 450px 50px, #ffffff, rgba(0, 0, 0, 0));
    background-repeat: repeat;
    animation: twinkleStars 5s ease-in-out infinite alternate;
  }

  @keyframes twinkleStars {
    0% {
      opacity: 0.5;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.7;
    }
  }
`;

function AbstractGallery() {
  const [hoveredId, setHoveredId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: contentRef,
    offset: ["start start", "end start"]
  });

  // Parallax effects
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const moonY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const moonRotate = useTransform(scrollYProgress, [0, 1], [0, 10]);
  const moonScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 0.98]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const memories = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486',
      title: 'First Coffee Date',
      description: 'The aroma of freshly brewed coffee and the sparkle in your eyes made this moment unforgettable.',
      date: 'Jan 15, 2023',
      category: 'First Moments',
      color: 'rgba(255, 99, 71, 0.3)'
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2',
      title: 'Starlit Cinema',
      description: 'Under a blanket of stars, we created our own movie magic.',
      date: 'Feb 14, 2023',
      category: 'Adventures',
      color: 'rgba(70, 130, 180, 0.3)'
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1503516459261-40c66117780a',
      title: 'Spring Blossoms',
      description: 'Cherry blossoms dancing in the wind, painting our world in soft pink hues.',
      date: 'Mar 20, 2023',
      category: 'Nature',
      color: 'rgba(144, 238, 144, 0.3)'
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954',
      title: 'Golden Hour',
      description: 'The sun painted the sky in shades of gold, just for us.',
      date: 'Apr 5, 2023',
      category: 'Sunsets',
      color: 'rgba(255, 165, 0, 0.3)'
    },
    {
      id: 5,
      url: 'https://images.unsplash.com/photo-1501426026826-31c667bdf23d',
      title: 'Ocean Whispers',
      description: 'Waves crashing at our feet, writing stories in the sand.',
      date: 'May 10, 2023',
      category: 'Beach Days',
      color: 'rgba(0, 191, 255, 0.3)'
    },
    {
      id: 6,
      url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
      title: 'Mountain Peak',
      description: 'Above the clouds, we found our piece of heaven.',
      date: 'Jun 15, 2023',
      category: 'Adventures',
      color: 'rgba(70, 130, 180, 0.3)'
    },
    {
      id: 7,
      url: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a',
      title: 'Ice Cream Dreams',
      description: 'Sweet treats and sweeter smiles on a warm summer day.',
      date: 'Jul 3, 2023',
      category: 'Summer Fun',
      color: 'rgba(255, 182, 193, 0.3)'
    },
    {
      id: 8,
      url: 'https://images.unsplash.com/photo-1533420896084-06d2bce5365f',
      title: 'Ferris Wheel Magic',
      description: 'City lights twinkling below as we touched the sky.',
      date: 'Jul 20, 2023',
      category: 'Night Out',
      color: 'rgba(138, 43, 226, 0.3)'
    },
    {
      id: 9,
      url: 'https://images.unsplash.com/photo-1507371341959-9fb4080ddab3',
      title: 'Autumn Picnic',
      description: 'Surrounded by falling leaves and your warm embrace.',
      date: 'Sep 15, 2023',
      category: 'Seasonal',
      color: 'rgba(205, 133, 63, 0.3)'
    },
    {
      id: 10,
      url: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0',
      title: 'Morning Bliss',
      description: 'Sunrise coffee dates and whispered dreams.',
      date: 'Sep 30, 2023',
      category: 'Mornings',
      color: 'rgba(255, 218, 185, 0.3)'
    },
    {
      id: 11,
      url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390',
      title: 'City Adventures',
      description: 'Getting lost in new streets and finding ourselves.',
      date: 'Oct 10, 2023',
      category: 'Urban',
      color: 'rgba(169, 169, 169, 0.3)'
    },
    {
      id: 12,
      url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0',
      title: 'Rainy Day Cuddles',
      description: 'The pitter-patter of rain making our hearts dance.',
      date: 'Oct 25, 2023',
      category: 'Cozy Days',
      color: 'rgba(176, 196, 222, 0.3)'
    },
    {
      id: 13,
      url: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56',
      title: 'First Snow Kiss',
      description: 'Snowflakes falling, hearts warming.',
      date: 'Nov 5, 2023',
      category: 'Winter',
      color: 'rgba(230, 230, 250, 0.3)'
    },
    {
      id: 14,
      url: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf',
      title: 'Holiday Magic',
      description: 'Twinkling lights reflecting in your eyes.',
      date: 'Dec 1, 2023',
      category: 'Holidays',
      color: 'rgba(255, 160, 122, 0.3)'
    },
    {
      id: 15,
      url: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9',
      title: 'New Year Dreams',
      description: 'Counting down to new beginnings with you.',
      date: 'Dec 31, 2023',
      category: 'Celebrations',
      color: 'rgba(218, 112, 214, 0.3)'
    },
    {
      id: 16,
      url: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814',
      title: 'Winter Wonderland',
      description: 'Making snow angels and warming hearts.',
      date: 'Jan 5, 2024',
      category: 'Winter',
      color: 'rgba(230, 230, 250, 0.3)'
    },
    {
      id: 17,
      url: 'https://images.unsplash.com/photo-1510797215324-95aa89f43c33',
      title: 'Candlelit Dinner',
      description: 'Romantic evening filled with soft whispers and gentle smiles.',
      date: 'Jan 20, 2024',
      category: 'Romance',
      color: 'rgba(255, 182, 193, 0.3)'
    },
    {
      id: 18,
      url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7',
      title: 'Bookstore Adventures',
      description: 'Getting lost in stories and finding our own.',
      date: 'Feb 1, 2024',
      category: 'Adventures',
      color: 'rgba(210, 180, 140, 0.3)'
    }
  ];

  const handleClick = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <GalleryContainer ref={containerRef}>
      <BackgroundLayer>
        <StarField />
        <Moon 
          style={{ 
            rotate: moonRotate,
            scale: moonScale
          }}
        />
      </BackgroundLayer>
      <ScrollContainer ref={contentRef}>
        <ContentWrapper>
          <MasonryGrid style={{ y }}>
            {memories.map((memory, index) => {
              const isHovered = hoveredId === memory.id;
              const isExpanded = expandedId === memory.id;
              const scale = isExpanded ? 1.02 : 1;
              
              return (
                <MemoryCard
                  key={memory.id}
                  onHoverStart={() => !isMobile && setHoveredId(memory.id)}
                  onHoverEnd={() => !isMobile && setHoveredId(null)}
                  onClick={() => {
                    handleClick(memory.id);
                    if (isMobile) {
                      setHoveredId(hoveredId === memory.id ? null : memory.id);
                    }
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    scale,
                    transition: { 
                      duration: 0.5,
                      delay: index * 0.1
                    }
                  }}
                >
                  <ImageContainer 
                    isHovered={isHovered} 
                    isExpanded={isExpanded}
                  >
                    <StyledImage
                      src={memory.url}
                      alt={memory.title}
                      isHovered={isHovered}
                      isExpanded={isExpanded}
                      animate={{
                        scale: (isHovered || isExpanded) ? 1.05 : 1,
                        transition: { duration: 0.3 }
                      }}
                    />
                    <CategoryTag
                      isHovered={isHovered}
                      isExpanded={isExpanded}
                      color={memory.color}
                    >
                      {memory.category}
                    </CategoryTag>
                    <DateChip 
                      isHovered={isHovered}
                      isExpanded={isExpanded}
                    >
                      📅 {memory.date}
                    </DateChip>
                    <ContentOverlay 
                      isHovered={isHovered}
                      isExpanded={isExpanded}
                    >
                      <Title isExpanded={isExpanded}>{memory.title}</Title>
                      <Description isExpanded={isExpanded}>{memory.description}</Description>
                    </ContentOverlay>
                  </ImageContainer>
                </MemoryCard>
              );
            })}
          </MasonryGrid>
        </ContentWrapper>
      </ScrollContainer>
    </GalleryContainer>
  );
}

export default AbstractGallery; 