import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import Image from "@tiptap/extension-image";

const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "auto",
        parseHTML: (element) => element.getAttribute("width") || "auto",
        renderHTML: (attributes) => {
          return {
            width: attributes.width,
          };
        },
      },
      height: {
        default: "auto",
        parseHTML: (element) => element.getAttribute("height") || "auto",
        renderHTML: (attributes) => {
          return {
            height: attributes.height,
          };
        },
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(({ node, updateAttributes, deleteNode }) => {
      const { src, alt, title, width, height } = node.attrs;

      const handleMouseDown = (e) => {
        e.preventDefault();
        const startX = e.clientX;
        const startWidth = parseInt(
          document.defaultView.getComputedStyle(e.target.parentNode).width,
          10
        );

        const doDrag = (dragEvent) => {
          const newWidth = startWidth + dragEvent.clientX - startX;
          updateAttributes({
            width: `${newWidth}px`,
            height: `${(newWidth * parseInt(height)) / parseInt(width)}px`,
          });
        };

        const stopDrag = () => {
          document.removeEventListener("mousemove", doDrag);
          document.removeEventListener("mouseup", stopDrag);
        };

        document.addEventListener("mousemove", doDrag);
        document.addEventListener("mouseup", stopDrag);
      };

      const handleContextMenu = (e) => {
        e.preventDefault();
        const menu = document.createElement("div");
        menu.className = "context-menu";
        menu.style.position = "absolute";
        menu.style.left = `${e.clientX}px`;
        menu.style.top = `${e.clientY}px`;
        menu.innerHTML = `<div class="context-menu-item">Delete</div>`;
        document.body.appendChild(menu);

        const handleClickOutside = (event) => {
          if (!menu.contains(event.target)) {
            menu.remove();
            document.removeEventListener("click", handleClickOutside);
          }
        };

        menu
          .querySelector(".context-menu-item")
          .addEventListener("click", () => {
            deleteNode();
            menu.remove();
          });

        document.addEventListener("click", handleClickOutside);
      };

      const handleFocusClick = (e) => {
        const resizeHandle = e.target.nextElementSibling;
        if (e.target === document.activeElement) {
          e.target.blur(); // 포커스 해제
          resizeHandle.style.display = "none"; // 리사이즈 핸들 숨기기
        } else {
          e.target.focus(); // 포커스 설정
          resizeHandle.style.display = 'flex'; // 리사이즈 핸들 보이기
        }
      };

      return (
        <NodeViewWrapper
          className="resizable-image"
          style={{ display: "inline-block", position: "relative" }}
        >
          <img
            src={src}
            alt={alt}
            title={title}
            style={{ width: width, height: height }}
            draggable="false"
            onContextMenu={handleContextMenu}
            tabIndex="0" /* 이미지를 클릭할 때 포커스를 받을 수 있게 설정 */
            onClick={handleFocusClick} /* 클릭 시 포커스를 강제로 설정 */
          />
          <span className="resize-handle" onMouseDown={handleMouseDown} />
        </NodeViewWrapper>
      );
    });
  },
});

export default ResizableImage;
