
// ── COMPONENTE ──────────────────────────────────────────────────────────────
/**
 * SearchSidebar — buscador + filtros laterales reutilizable.
 *
 * Props:
 *  · searchTerm       {string}   — valor actual del buscador
 *  · onSearchChange   {fn}       — callback(valor) al escribir en el buscador
 *  · searchPlaceholder{string}   — placeholder del input de búsqueda
 *  · filterGroups     {Array}    — lista de grupos de filtros:
 *      [{ label, key, options: [{label, value}] }]
 *      Cada grupo genera una sección con título, botones (desktop) y <select> (móvil).
 *  · activeFilters    {Object}   — { [key]: valorActivo }
 *  · onFilterChange   {fn}       — callback(key, valor) al cambiar un filtro
 *  · onClearAll       {fn}       — callback al pulsar "Limpiar filtros"
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
  return (
    <aside className="search-sidebar">
      {/* ── Buscador ─────────────────────────────────────────────────── */}
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

      {/* ── Grupos de filtros ─────────────────────────────────────────── */}
      {filterGroups.map((group) => (
        <div key={group.key} className="ss-filter-group">
          <h3 className="ss-group-title">{group.label}</h3>

          {/* Versión desktop: lista de botones */}
          <ul className="ss-btn-list">
            {group.options.map((opt) => {
              const isActive =
                activeFilters[group.key] === opt.value ||
                (!activeFilters[group.key] && opt.value === "");
              return (
                <li key={opt.value}>
                  <button
                    className={`ss-filter-btn${isActive ? " ss-active" : ""}`}
                    onClick={() => onFilterChange?.(group.key, opt.value)}
                  >
                    {opt.label}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Versión móvil: select compacto */}
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

      {/* ── Limpiar filtros ───────────────────────────────────────────── */}
      <button className="ss-clear-btn" onClick={onClearAll}>
        ✕ Limpiar filtros
      </button>
    </aside>
  );
}

export default SearchSidebar;
