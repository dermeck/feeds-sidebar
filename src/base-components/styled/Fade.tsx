import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

// use max-width because transition to width: auto does not work
const fadeIn = keyframes`
  from {
    max-width: 0;

    opacity: 0;
    visibility: hidden;

  }

  to {
    max-width: 999px;
    
    opacity: 1;
    visibility: visible;
  }
`;

const fadeOut = keyframes`
  from {
    max-width: 999px;
    
    opacity: 1;
    visibility: visible;
  }

  to {
    max-width: 0;
    
    opacity: 0;
    visibility: hidden;
  }
`;

interface FadeProps {
    in?: boolean;
}

export const Fade = styled.div<FadeProps>`
    display: ${(props) => (props.in ? 'block' : 'none')};
    animation: ${(props) => (props.in ? fadeIn : fadeOut)} 0.5s ease-out;
`;
