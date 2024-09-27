import "./MenuItem.css"

import remixiconUrl from "remixicon/fonts/remixicon.symbol.svg"

const MenuItem = ({ icon, title, action, isActive = null }) => {
  return (
    <div className="menu-item-wrapper">
      <button
        type="button"
        className={`menu-item${isActive && isActive() ? " is-active" : ""}`}
        onClick={action}
        aria-label={title}
      >
        <svg className="remix">
          <use xlinkHref={`${remixiconUrl}#ri-${icon}`} />
        </svg>
      </button>
      <div className="tooltip">{title}</div>
    </div>
  )
}

export default MenuItem;
