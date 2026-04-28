import { useEffect, useRef, useState } from "react";
import "../styles/Slider.css";

const SliderComponent = ({ children }) => {
  const sliderRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateButtons = () => {
    if (!sliderRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  useEffect(() => {
    updateButtons();
    const slider = sliderRef.current;
    if (!slider) return;

    slider.addEventListener("scroll", updateButtons);
    window.addEventListener("resize", updateButtons);

    return () => {
      slider.removeEventListener("scroll", updateButtons);
      window.removeEventListener("resize", updateButtons);
    };
  }, []);

  useEffect(() => {
    updateButtons();
  }, [children]);

  const handleScroll = (direction) => {
    if (!sliderRef.current) return;

    const width = sliderRef.current.clientWidth;
    const scrollAmount = Math.round(width * 0.8);
    const nextPosition =
      direction === "left"
        ? sliderRef.current.scrollLeft - scrollAmount
        : sliderRef.current.scrollLeft + scrollAmount;

    sliderRef.current.scrollTo({
      left: nextPosition,
      behavior: "smooth",
    });
  };

  return (
    <div className="slider-component">
      <button
        className="carousel-btn carousel-btn-left"
        onClick={() => handleScroll("left")}
        aria-label="Desplazar slider a la izquierda"
        disabled={!canScrollLeft}
      >
        ‹
      </button>

      <div ref={sliderRef} className="carousel">
        {children}
      </div>

      <button
        className="carousel-btn carousel-btn-right"
        onClick={() => handleScroll("right")}
        aria-label="Desplazar slider a la derecha"
        disabled={!canScrollRight}
      >
        ›
      </button>
    </div>
  );
};

export default SliderComponent;
