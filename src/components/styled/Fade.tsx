import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

// use max-width because transition to width: auto does not work
const fadeIn = keyframes`
  from {
    visibility: hidden;
    opacity: 0;
    max-width: 0;

  }

  to {
    visibility: visible;
    opacity: 1;
    max-width: 999px;
  }
`;

const fadeOut = keyframes`
  from {
    visibility: visible;
    opacity: 1;
    max-width: 999px;
  }

  to {
    visibility: hidden;
    opacity: 0;
    max-width: 0;
  }
`;

interface FadeProps {
  in?: boolean;
}

export const Fade = styled.div`
  display: ${(props: FadeProps) => (props.in ? "block" : "none")};
  animation: ${(props: FadeProps) => (props.in ? fadeIn : fadeOut)} 0.5s
    ease-out;
`;
