import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const TimelineContainer = styled.section`
  width: 100%;
  max-width: 1200px;
  padding: 4rem 2rem;
  margin: 2rem auto;
`;

const TimelinePath = styled.div`
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 0;

  &::before {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 100%;
    background: rgba(255, 255, 255, 0.2);

    @media (max-width: 768px) {
      left: 20px;
    }
  }
`;

const TimelineItem = styled(motion.div)`
  display: flex;
  justify-content: ${props => props.align === 'right' ? 'flex-start' : 'flex-end'};
  padding: 2rem 0;
  width: 100%;
  position: relative;

  @media (max-width: 768px) {
    justify-content: flex-start;
    padding-left: 50px;
    margin-left: 0;
  }
`;

const TimelineContent = styled(motion.div)`
  width: 45%;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    width: calc(100% - 40px);
    padding: 1rem;
  }
`;

const Date = styled.span`
  color: #ffd93d;
  font-weight: 500;
`;

const Title = styled.h3`
  color: white;
  margin: 0.5rem 0;
`;

const Description = styled.p`
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
`;

// Add a dot indicator for timeline items
const TimelineDot = styled.div`
  position: absolute;
  width: 12px;
  height: 12px;
  background: #ffd93d;
  border-radius: 50%;
  left: 50%;
  transform: translateX(-50%);
  top: 50%;

  @media (max-width: 768px) {
    left: 20px;
  }
`;

function Timeline() {
  const events = [
    {
      id: 1,
      // date: 'January 15, 2023',
      title: 'First Meeting',
      description: 'The day our eyes met and hearts connected.',
      align: 'left'
    },
    {
      id: 2,
      // date: 'February 14, 2023',
      title: 'First Date',
      description: 'A magical evening with laughters and past regrets',
      align: 'right'
    },
    {
      id: 3,
      // date: 'June 15, 2023',
      title: 'Darjeeling trip',
      description: 'Got photo everyday, that was the best.',
      align: 'left'
    },
    {
      id: 4,
      // date: 'April 1, 2023',
      title: 'Long Distance',
      description: 'We decided that distance really sucks, but we are good lovers <3.',
      align: 'right'
    },
    {
      id: 5,
      // date: 'April 1, 2023',
      title: 'sath Bhaagne ka plan',
      description: 'We should try to kill the distance, and go to the mountains forever <3.',
      align: 'left'
    },
    {
      id: 6,
      // date: 'April 1, 2023',
      title: 'Dream to Travel',
      description: 'I want to travel all the places with you(mostly Europe).',
      align: 'right'
    },
    {
      id: 7,
      // date: 'April 1, 2023',
      title: 'At Last, I wanna do toit nups with ya',
      description: 'Lemme pick you up, lets goooo',
      align: 'left'
    }
  ];

  return (
    <TimelineContainer>
      <TimelinePath>
        {events.map((event) => (
          <TimelineItem
            key={event.id}
            align={event.align}
            initial={{ opacity: 0, x: event.align === 'left' ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <TimelineDot />
            <TimelineContent>
              <Date>{event.date}</Date>
              <Title>{event.title}</Title>
              <Description>{event.description}</Description>
            </TimelineContent>
          </TimelineItem>
        ))}
      </TimelinePath>
    </TimelineContainer>
  );
}

export default Timeline; 