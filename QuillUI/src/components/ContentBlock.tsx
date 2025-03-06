import React, { forwardRef } from "react";
import { ContentBlockProps } from "../types";

/**
 * A component for displaying structured content within the editor
 */
const ContentBlock = forwardRef<HTMLDivElement, ContentBlockProps>((props, ref) => {
  const { id, className = "", style, children, contentEditable = false, dangerouslySetInnerHTML, ...rest } = props;

  // Build className
  const blockClassName = ["quill-ui-content-block", contentEditable ? "quill-ui-content-block-editable" : "", className].filter(Boolean).join(" ");

  return (
    <div id={id} ref={ref} className={blockClassName} style={style} contentEditable={contentEditable} dangerouslySetInnerHTML={dangerouslySetInnerHTML} {...rest}>
      {!dangerouslySetInnerHTML && children}
    </div>
  );
});

ContentBlock.displayName = "ContentBlock";

export default ContentBlock;
