import styled from "@emotion/styled";
import { Button } from ".";
import { colors } from "./colors";

export const ToolbarButton = styled(Button)`
  width: 32px;
  height: 32px;

  padding: 0.5rem;
  margin: 0;

  background-color: ${colors.toolbarBackground};

  :hover {
    background-color: ${colors.toolbarButtonHoverBackground};
  }

  :active {
    background-color: ${colors.toolbarButtonActiveBackgroudn};
  }

  border-radius: 4px;
`;
