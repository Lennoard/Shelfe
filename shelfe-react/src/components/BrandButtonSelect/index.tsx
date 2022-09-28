import { Button, Divider, Menu, MenuItem } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { BrandButtonProps } from "../BrandButton";

export default function BrandButtonSelect(props: BrandButtonSelectProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (index: number, text: string) => {
    props.onMenuItemSelected(index, text);
    setAnchorEl(null);
  };
  
  return (
    <div>
      <Button
        endIcon={props.endIcon}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
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
        onClick={handleClick}
      >
        {props.text}
      </Button>
      <Menu
        elevation={8}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
      >
        {props.items.map((item, index) => {
          return (
            <Box key={item}>
              <MenuItem
                onClick={() => handleClose(index, item)}
                sx={{ minWidth: "152px" }}
              >
                {item}
              </MenuItem>
              {index === props.items.length - 1 ? <span></span> : <Divider />}
            </Box>
          );
        })}
      </Menu>
    </div>
  );
}

interface BrandButtonSelectProps extends BrandButtonProps {
  items: Array<string>;
  onMenuItemSelected: (index: number, item: string) => void;
}
