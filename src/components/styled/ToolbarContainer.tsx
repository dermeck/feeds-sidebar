import styled from "@emotion/styled";
import { colors } from "./colors";

export const ToolbarContainer = styled.div`
  display: flex;

  background-color: ${colors.toolbarBackground};
  background-image: linear-gradient(
    rgba(255, 255, 255, 0.15),
    rgba(255, 255, 255, 0.15)
  );
  color: rgb(41, 41, 41);
  color: ${colors.toolbarFont};
  height: 3.6rem;

  margin-bottom: 0.8rem;
  padding-left: 0.3rem;
  padding-right: 0.3rem;
`;
