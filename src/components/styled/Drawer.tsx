import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

// use max-width because transition to width: auto does not work
const show = keyframes`
  from {
    visibility: hidden;
    max-width: 0;
    width: 0;
    margin-left: -300px;
  }

  to {
    visibility: visible;
    width: 100%; 
    max-width: 999px;
    margin-left: 0;
  }
`;

const hide = keyframes`
  from {
    visibility: visible;
    width: 100%;
    max-width: 999px;
    margin-left: 0;
  }

  to {
    max-width: 0;
    width: 0;
    margin-left: -300px;
  }
`;

interface DrawerProps {
  show?: boolean;
}

export const Drawer = styled.div`
  background-color: #fff;
  position: absolute;
  height: 100%;
  animation: ${(props: DrawerProps) => (props.show ? show : hide)} 0.5s
    ease-in-out forwards;
`;
