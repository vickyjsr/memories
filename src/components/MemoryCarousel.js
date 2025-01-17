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
  color: black;
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
      title: "OT Uniform",
      date: "Favorite",
      image: "https://firebasestorage.googleapis.com/v0/b/chatapp-46c14.appspot.com/o/Preeti%2Ffa687d8c-7556-4e5c-905b-b62d4c753a51.JPG?alt=media&token=31dc663c-13d7-4632-ad97-a181968577c8"
    },
    {
      id: 2,
      title: "Class 10",
      date: "Topper",
      image: "https://firebasestorage.googleapis.com/v0/b/chatapp-46c14.appspot.com/o/Preeti%2Ff54ba460-825d-4a9f-98e0-659da220d7f8.JPG?alt=media&token=99917a69-9871-4513-8f29-2ef257526102"
    },
    {
      id: 3,
      title: "Not so good restaurant",
      date: "But damn the vibe",
      image: "https://firebasestorage.googleapis.com/v0/b/chatapp-46c14.appspot.com/o/Preeti%2Fef616bd8-4574-4bc5-9a78-bf91659df763.JPG?alt=media&token=de677487-e496-4cf1-91cc-df84e8af09b7"
    },
    {
      id: 4,
      title: "It was Good",
      date: "should have/could have",
      image: "https://firebasestorage.googleapis.com/v0/b/chatapp-46c14.appspot.com/o/Preeti%2Fee534635-63e5-4b6b-b4b5-7f01d6715a53.JPG?alt=media&token=c0fd9bf4-78c7-4455-bf5a-f1acae9baf4e"
    },
    {
      id: 5,
      title: "A 'happy Gourav' Trip 🌸",
      date: "Take me with ya",
      image: "https://firebasestorage.googleapis.com/v0/b/chatapp-46c14.appspot.com/o/Preeti%2Fd93cee78-944e-4d6d-8a6f-5d5de4f0f1f6.JPG?alt=media&token=6dfed59a-9275-4d9c-9538-f98e77c2e71f"
    },
    {
      id: 6,
      title: "Stargazing Night ✨",
      date: "Night Dreaming",
      image: "https://firebasestorage.googleapis.com/v0/b/chatapp-46c14.appspot.com/o/Preeti%2Fc374b3cb-ccae-4884-bd7d-abc1f0d8476b.JPG?alt=media&token=d837838e-c679-4b9c-9fb8-f7c18c089f1a"
    },
    {
      id: 7,
      title: "Ice Cream 🍦",
      date: "Need more shaadi's like this",
      image: "https://firebasestorage.googleapis.com/v0/b/chatapp-46c14.appspot.com/o/Preeti%2Fc110656e-7a4a-4aa1-aa4c-5ce60d5ee9b6.JPG?alt=media&token=daed887c-708d-44e0-8943-689f720a398d"
    },
    {
      id: 8,
      title: "Mela 🎡",
      date: "Spider Man hoodie",
      image: "https://firebasestorage.googleapis.com/v0/b/chatapp-46c14.appspot.com/o/Preeti%2Fd04a7001-5634-433b-bf18-6515bc345fa3.JPG?alt=media&token=5149de05-f763-4fa3-a015-dede12dc189a"
    },
    {
      id: 9,
      title: "Birthday ☀️",
      date: "Mirror pic is all i want",
      image: "https://firebasestorage.googleapis.com/v0/b/chatapp-46c14.appspot.com/o/Preeti%2Fef4996cd-fdea-4761-976e-b263655e7f0f.JPG?alt=media&token=d2ca6f6e-0c4a-487b-bb71-185713be4b4c"
    },
    {
      id: 10,
      title: "Uniform pt 2",
      date: "This uniform is the best!!!",
      image: "https://firebasestorage.googleapis.com/v0/b/chatapp-46c14.appspot.com/o/Preeti%2Fa966e2c0-c1bb-43f9-b3a5-e0a805fbfb7c.JPG?alt=media&token=a00dd136-b642-4783-988a-06cd97424c6f"
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