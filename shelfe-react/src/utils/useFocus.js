import React from "react";

export const useFocus = () => {
  const ref = React.createRef()
  const setFocus = () => { ref.current && ref.current.focus() }

  return { setFocus, ref }
}