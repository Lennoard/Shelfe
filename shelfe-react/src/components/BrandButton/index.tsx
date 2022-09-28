import { Button, styled } from "@mui/material";

export default function BrandButton(props: BrandButtonProps) {
  const StyledButton = styled(Button)`
    transition: 400ms;
    &:hover {
      background-color: ${props.hoverColor ?? "#00bfa5"};
    }
  `;

  return (
    <StyledButton
      onClick={props.onClick}
      endIcon={props.endIcon}
      variant="contained"
      disableElevation
      sx={{
        borderRadius: "24px",
        textTransform: "none",
        fontWeight: "600",
        backgroundColor: props.backgroundColor
          ? props.backgroundColor
          : "#8CF9DC",
        color: props.textColor ? props.textColor : "#000000",
      }}
    >
      {props.text}
    </StyledButton>
  );
}

export interface BrandButtonProps {
  text: string;
  backgroundColor?: string;
  hoverColor?: string;
  textColor?: string;
  endIcon?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}
