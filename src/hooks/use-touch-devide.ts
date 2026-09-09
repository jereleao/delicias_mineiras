import { useState, useEffect } from "react";

export const useTouchDevice = () => {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Ensure this only runs on the client side
    const checkTouch = () => {
      return (
        "ontouchstart" in window ||
        (!!navigator.maxTouchPoints && navigator.maxTouchPoints > 0)
      );
    };

    setIsTouch(checkTouch());
  }, []);

  return isTouch;
};
