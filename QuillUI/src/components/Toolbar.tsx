import React, { forwardRef } from "react";
import { ToolbarProps } from "../types";

/**
 * A customizable toolbar component for the Quill editor
 */
const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>((props, ref) => {
  const { id, className = "", style, options, position = "top", sticky = false, disabled = false, ...rest } = props;

  // Generate the toolbar ID
  const toolbarId = id || `quill-ui-toolbar-${Math.random().toString(36).substr(2, 9)}`;

  // Build className
  const toolbarClassName = [
    "quill-ui-toolbar",
    position === "bottom" ? "quill-ui-toolbar-bottom" : "quill-ui-toolbar-top",
    sticky ? "quill-ui-toolbar-sticky" : "",
    disabled ? "quill-ui-toolbar-disabled" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <div id={toolbarId} ref={ref} className={toolbarClassName} style={style} {...rest} />;
});

Toolbar.displayName = "Toolbar";

export default Toolbar;
