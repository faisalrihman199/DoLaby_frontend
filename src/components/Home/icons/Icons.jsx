import React from "react";

/* Keep strokes + rounded to match your mock */

export const TopIcon = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...props}>
    <path d="M9 3c1.2 1.1 2.34 1.66 3 1.9.66-.24 1.8-.8 3-1.9l3 2.2-2 3V21H5V8.2l-2-3L9 3z"
      fill="currentColor"/>
  </svg>
);

export const BottomIcon = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...props}>
    <path d="M8 3h8l1 5-3 1v12h-2V12h-2v9H7V9L6 8l2-5z" fill="currentColor"/>
  </svg>
);

export const ShoesIcon = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...props}>
    <path d="M3 15c4 0 6-2 8-2s3 2 10 2v3H3v-3z" fill="currentColor"/>
  </svg>
);

export const SelectIcon = (props) => (
  <svg viewBox="0 0 48 48" width="1em" height="1em" {...props}>
    <path d="M15 10c3 3 6 4.5 9 5.3 3-.8 6-2.3 9-5.3l8 6-5 7v15H12V23l-5-7 8-6z"
      fill="none" stroke="currentColor" strokeWidth="2" />
    <circle cx="34" cy="34" r="5" fill="currentColor"/>
    <path d="M33 34h4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const CameraIcon = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...props}>
    <path d="M9 4h6l1 2h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3l1-2z"
      fill="currentColor"/>
    <circle cx="12" cy="13" r="4.5" fill="#fff"/>
    <circle cx="12" cy="13" r="2.5" fill="currentColor"/>
  </svg>
);

export const SparklesIcon = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...props}>
    <path d="M8 2l1.5 3.5L13 7l-3.5 1.5L8 12 6.5 8.5 3 7l3.5-1.5L8 2zm9 6l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2zM13 16l1.2 2.8L19 21l-4.8 1.2L13 27l-1.2-4.8L7 21l4.8-1.2L13 16z"
      fill="currentColor"/>
  </svg>
);
