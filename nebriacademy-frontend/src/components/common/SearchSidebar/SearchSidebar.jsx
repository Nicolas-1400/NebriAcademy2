// ── COMPONENTE ──────────────────────────────────────────────────────────────
/**
 * Componente reutilizable para menús laterales de filtrado.
 * Implementa un buscador de texto y múltiples grupos de selectores (categoría, nivel, etc.).
 * Adapta su vista dinámicamente: usa botones en Desktop y elementos <select> en Mobile.
 */
function SearchSidebar({
  searchTerm = "",
  onSearchChange,
  searchPlaceholder = "Buscar...",
  filterGroups = [],
  activeFilters = {},
  onFilterChange,
  onClearAll,
}) {
  // ── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <aside className="search-sidebar">
      {/* Caja de búsqueda por texto libre */}
      <div className="ss-search-box">
        <span className="ss-search-icon">🔍</span>
        <input
          type="search"
          className="ss-search-input"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>

      {/* Renderizado iterativo de grupos de filtros pasados por props */}
      {filterGroups.map((group) => (
        <div key={group.key} className="ss-filter-group">
          <h3 className="ss-group-title">{group.label}</h3>

          {/* Versión desktop: lista de botones tipo toggle */}
          <ul className="ss-button-list">
            {group.options.map((opt) => {
              const isActive =
                activeFilters[group.key] === opt.value ||
                (!activeFilters[group.key] && opt.value === "");
              return (
                <li key={opt.value}>
                  <button
                    className={`ss-filter-button${isActive ? " ss-active" : ""}`}
                    onClick={() => onFilterChange?.(group.key, opt.value)}
                  >
                    {opt.label}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Versión móvil: select tradicional para ahorrar espacio */}
          <select
            className="ss-select"
            value={activeFilters[group.key] || ""}
            onChange={(e) => onFilterChange?.(group.key, e.target.value)}
          >
            {group.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      ))}

      {/* Botón global para resetear todos los filtros simultáneamente */}
      <button className="ss-clear-button" onClick={onClearAll}>
        ✕ Limpiar filtros
      </button>
    </aside>
  );
}

export default SearchSidebar;
