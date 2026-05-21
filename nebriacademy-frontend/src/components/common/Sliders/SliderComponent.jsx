// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { useEffect, useRef, useState } from "react";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Carrusel horizontal con flechas; espera `children` tipo tarjeta
const SliderComponent = ({ children }) => {
  // ── ESTADO ─────────────────────────────────────────────────────────────────
  const sliderRef = useRef(null); // Referencia al contenedor desplazable
  const [canScrollLeft, setCanScrollLeft] = useState(false);  // Flecha izquierda activa
  const [canScrollRight, setCanScrollRight] = useState(false); // Flecha derecha activa

  // ── FUNCIONES ──────────────────────────────────────────────────────────────────
  // Verifica la posición de scroll para habilitar/deshabilitar las flechas
  const updateButtons = () => {
    if (!sliderRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  // Maneja el desplazamiento del carrusel hacia la izquierda o derecha
  const handleScroll = (direction) => {
    if (!sliderRef.current) return;

    const width = sliderRef.current.clientWidth;
    // Desplaza aproximadamente el 80% del ancho visible
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

  // ── EFECTOS ───────────────────────────────────────────────────────────────────
  // Escucha el evento 'scroll' y el redimensionamiento de ventana para actualizar flechas
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

  // Actualiza los botones de scroll si cambian los hijos (nuevas tarjetas)
  useEffect(() => {
    updateButtons();
  }, [children]);

  // ── RENDER ───────────────────────────────────────────────────────────────────
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
