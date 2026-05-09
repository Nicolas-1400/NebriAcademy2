import { useEffect, useRef, useState } from "react";

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
        className="carousel-button carousel-button-left"
        onClick={() => handleScroll("left")}
        aria-label="Desplazar slider a la izquierda"
        disabled={!canScrollLeft}
      >
        ‹
      </button>

      <div
        className={`carousel-wrapper${canScrollRight ? " fade-right" : ""}${!canScrollRight && canScrollLeft ? " fade-left" : ""}`}
      >
        <div ref={sliderRef} className="carousel">
          {children}
        </div>
      </div>

      <button
        className="carousel-button carousel-button-right"
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
