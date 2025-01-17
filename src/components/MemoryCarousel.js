import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-cards';

const CarouselContainer = styled.div`
  width: 100%;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  perspective: 1000px;

  &::before {
    content: '';
    position: absolute;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle at center,
      rgba(255, 192, 203, 0.2) 0%,
      transparent 70%
    );
    animation: pulse 4s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.5; }
    50% { transform: scale(1.1); opacity: 0.3; }
  }
`;

const StyledSwiper = styled(Swiper)`
  width: 340px;
  padding: 2rem;

  .swiper-slide {
    background: transparent;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .swiper-slide-active {
    z-index: 2;
    transform: translateZ(100px);
  }
`;

const MemoryCard = styled(motion.div)`
  position: relative;
  width: 300px;
  height: 400px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  overflow: hidden;
  backdrop-filter: blur(12px);
  transform-style: preserve-3d;
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      165deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.05) 40%,
      transparent 100%
    );
    border-radius: 24px;
    z-index: 1;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    padding: 1px;
    border-radius: 24px;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.3) 0%,
      rgba(255, 255, 255, 0.1) 25%,
      transparent 50%
    );
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  &:hover {
    transform: translateZ(20px) rotateX(5deg);
    &::after {
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.4) 0%,
        rgba(255, 255, 255, 0.2) 25%,
        transparent 50%
      );
    }
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(0, 0, 0, 0.2) 50%,
      rgba(0, 0, 0, 0.8) 100%
    );
    z-index: 1;
    opacity: 1;
    transition: opacity 0.3s ease;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  filter: brightness(1.1) contrast(1.1) saturate(1.1);

  ${MemoryCard}:hover & {
    transform: scale(1.05);
    filter: brightness(1.2) contrast(1.15) saturate(1.15);
  }
`;

const Content = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  color: white;
  z-index: 2;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(0, 0, 0, 0.6) 50%,
    transparent 100%
  );
  transform: translateY(0);
  opacity: 1;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);

  ${MemoryCard}:hover & {
    transform: translateY(-5px);
  }
`;

const Title = styled(motion.h3)`
  font-size: 1.8rem;
  margin: 0;
  font-weight: 600;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  background: linear-gradient(45deg, #fff, #f0f0f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  opacity: 1;
  transform: translateY(0);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);

  ${MemoryCard}:hover & {
    transform: translateY(-5px);
  }
`;

const DateText = styled(motion.p)`
  font-size: 1.1rem;
  margin: 0.5rem 0;
  opacity: 0.9;
  transform: translateY(0);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);

  ${MemoryCard}:hover & {
    transform: translateY(-5px);
  }
`;

const MemoryDetails = styled(motion.div)`
  position: absolute;
  top: 1rem;
  right: 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  padding: 0.6rem 1.2rem;
  border-radius: 16px;
  font-size: 0.9rem;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 2;
  transform: translateY(0);
  opacity: 1;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);

  ${MemoryCard}:hover & {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.15);
  }
`;

const NavigationButton = styled(motion.button)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  z-index: 10;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-50%) scale(1.1);
  }

  &.prev { left: 1rem; }
  &.next { right: 1rem; }
`;

function MemoryCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const memories = [
    {
      id: 1,
      title: "First Coffee Date ☕",
      date: "January 15, 2023",
      image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486"
    },
    {
      id: 2,
      title: "Beach Sunset 🌅",
      date: "February 14, 2023",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
    },
    {
      id: 3,
      title: "Movie Night 🎬",
      date: "March 1, 2023",
      image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c"
    },
    {
      id: 4,
      title: "Park Picnic 🧺",
      date: "April 5, 2023",
      image: "https://images.unsplash.com/photo-1526401485004-46910ecc8e51"
    },
    {
      id: 5,
      title: "Garden Walk 🌸",
      date: "May 20, 2023",
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07"
    },
    {
      id: 6,
      title: "Stargazing Night ✨",
      date: "June 15, 2023",
      image: "https://images.unsplash.com/photo-1519681393784-d120267933ba"
    },
    {
      id: 7,
      title: "Ice Cream Date 🍦",
      date: "July 3, 2023",
      image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a"
    },
    {
      id: 8,
      title: "Ferris Wheel Fun 🎡",
      date: "August 12, 2023",
      image: "https://images.unsplash.com/photo-1533420896084-06d2bce5365f"
    },
    {
      id: 9,
      title: "Autumn Walk 🍂",
      date: "September 20, 2023",
      image: "https://images.unsplash.com/photo-1507371341959-9fb4080ddab3"
    },
    {
      id: 10,
      title: "Cozy Cafe Morning ☀️",
      date: "October 8, 2023",
      image: "https://images.unsplash.com/photo-1445116572660-236099ec97a0"
    },
    {
      id: 11,
      title: "City Lights 🌃",
      date: "October 15, 2023",
      image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390"
    },
    {
      id: 12,
      title: "Rainy Day Together 🌧️",
      date: "October 30, 2023",
      image: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0"
    },
    {
      id: 13,
      title: "First Snow ❄️",
      date: "November 5, 2023",
      image: "https://images.unsplash.com/photo-1491002052546-bf38f186af56"
    },
    {
      id: 14,
      title: "Holiday Lights 🎄",
      date: "December 1, 2023",
      image: "https://images.unsplash.com/photo-1543589077-47d81606c1bf"
    },
    {
      id: 15,
      title: "New Year's Eve 🎆",
      date: "December 31, 2023",
      image: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9"
    }
  ];

  return (
    <CarouselContainer>
      <StyledSwiper
        effect={'cards'}
        grabCursor={true}
        modules={[EffectCards, Navigation, Autoplay]}
        className="mySwiper"
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        cardsEffect={{
          perSlideOffset: 8,
          perSlideRotate: 2,
          rotate: true,
          slideShadows: false,
        }}
      >
        {memories.map((memory, index) => (
          <SwiperSlide key={memory.id}>
            <MemoryCard
              initial={{ opacity: 0, y: 30 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: {
                  duration: 0.6,
                  ease: [0.34, 1.56, 0.64, 1],
                  delay: index * 0.1
                }
              }}
            >
              <ImageContainer>
                <Image 
                  src={memory.image} 
                  alt={memory.title}
                  loading="lazy"
                />
              </ImageContainer>
              <Content>
                <Title>{memory.title}</Title>
                <DateText>{memory.date}</DateText>
              </Content>
              <MemoryDetails>
                <span>📍 Memory #{memory.id}</span>
              </MemoryDetails>
            </MemoryCard>
          </SwiperSlide>
        ))}
      </StyledSwiper>
    </CarouselContainer>
  );
}

export default MemoryCarousel; 