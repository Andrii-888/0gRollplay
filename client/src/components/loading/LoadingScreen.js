import React from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";

const StyledLandingPage = styled.div`
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
`;

const BackgroundVideo = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
`;

const FrostedOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(6px) brightness(0.6);
  background: rgba(0, 0, 0, 0.3);
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
`;

const Title = styled.h1`
  color: white;
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 10px;
  text-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.2rem;
  margin-bottom: 40px;
  letter-spacing: 2px;
`;

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 20px #00ffff, 0 0 40px #00ffff66; }
  50% { box-shadow: 0 0 30px #00ffff, 0 0 60px #00ffffaa; }
`;

const EnterButton = styled.button`
  padding: 18px 60px;
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #00b4d8 0%, #0077b6 100%);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: ${pulse} 2s ease-in-out infinite;

  &:hover {
    transform: scale(1.05);
  }
`;

const LandingPage = () => {
  const navigate = useNavigate();

  const handleEnter = () => {
    navigate("/wallet");
  };

  return (
    <StyledLandingPage>
      <BackgroundVideo
        autoPlay
        muted
        loop
        playsInline
        src="https://d1i6zd1p5d75mw.cloudfront.net/images/s/headervideo/1/3306010965.mp4"
        type="video/mp4"
      />
      <FrostedOverlay />
      <ContentWrapper>
        <Title>0G Rollplay</Title>
        <Subtitle>DECENTRALIZED POKER</Subtitle>
        <EnterButton onClick={handleEnter}>Enter Game</EnterButton>
      </ContentWrapper>
    </StyledLandingPage>
  );
};

export default LandingPage;
