import "./MenuItem.css"

import remixiconUrl from "remixicon/fonts/remixicon.symbol.svg"

const MenuItem = ({ icon, title, action, isActive = null }) => {
  return (
    // <button
    //   type="button" // 버튼 타입을 명시함으로 form 안에서 메뉴 버튼을 클릭 시 submit 되지 않도록 한다.
    //   className={`menu-item${isActive && isActive() ? " is-active" : ""}`}
    //   onClick={action}
    //   title={title}
    // >
    //   <svg className="remix">
    //     <use xlinkHref={`${remixiconUrl}#ri-${icon}`} />
    //   </svg>
    // </button>

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
