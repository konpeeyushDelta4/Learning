import React from "react";
import Quill from "quill";
import { EditorProps } from "../types";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import "../styles/editor.css";
export interface QuillInstance extends Quill {
}
/**
 * A customizable rich text editor component based on Quill.js
 */
declare const Editor: React.ForwardRefExoticComponent<Omit<EditorProps, "ref"> & React.RefAttributes<HTMLDivElement>>;
export default Editor;
