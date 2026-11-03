import React from "react";
import { cn } from "../../utils/cn";

export interface ProviderLogoProps {
  source: string;
  className?: string;
  size?: number;
}

interface ProviderMeta {
  color: string;
  bg: string;
  darkBg: string;
  render: (size: number) => React.ReactNode;
}

const PROVIDERS: Record<string, ProviderMeta> = {
  Lucide: {
    color: "#F56565",
    bg: "#FFF5F5",
    darkBg: "#2D1D20",
    render: (s) => (
      <svg role="img" viewBox="0 0 24 24" width={s} height={s} fill="currentColor" aria-hidden="true">
        <path d="M18.483 1.123a1.09 1.09 0 0 0-.752.362 1.09 1.09 0 0 0 .088 1.54 11.956 11.956 0 0 1 4 8.946 7.62 7.62 0 0 1-7.637 7.636 7.62 7.62 0 0 1-7.637-7.636 3.255 3.255 0 0 1 3.273-3.273c1.82 0 3.273 1.45 3.273 3.273a1.09 1.09 0 0 0 1.09 1.09 1.09 1.09 0 0 0 1.092-1.09c0-3-2.455-5.455-5.455-5.455s-5.454 2.455-5.454 5.455c0 5.408 4.408 9.818 9.818 9.818 5.41 0 9.818-4.41 9.818-9.818A14.16 14.16 0 0 0 19.272 1.4a1.09 1.09 0 0 0-.789-.277ZM9.818 2.15C4.408 2.151 0 6.561 0 11.97a14.16 14.16 0 0 0 4.8 10.637 1.09 1.09 0 0 0 1.54-.096 1.09 1.09 0 0 0-.095-1.54 11.957 11.957 0 0 1-4.063-9 7.62 7.62 0 0 1 7.636-7.637 7.62 7.62 0 0 1 7.637 7.636 3.256 3.256 0 0 1-3.273 3.273 3.256 3.256 0 0 1-3.273-3.273 1.09 1.09 0 0 0-1.09-1.09 1.09 1.09 0 0 0-1.092 1.09c0 3 2.455 5.455 5.455 5.455s5.454-2.455 5.454-5.455c0-5.408-4.408-9.818-9.818-9.818z" />
      </svg>
    ),
  },

  Phosphor: {
    color: "#4F46E5",
    bg: "#EEF2FF",
    darkBg: "#1E1F3D",
    render: (s) => (
      <svg role="img" viewBox="0 0 24 24" width={s} height={s} fill="currentColor" aria-hidden="true">
        <path d="M12.404.001H3.866a.618.618 0 0 0-.619.619v15.173A8.217 8.217 0 0 0 11.449 24a.617.617 0 0 0 .618-.619v-6.969h.332a8.204 8.204 0 0 0 7.715-5.031 8.216 8.216 0 0 0 0-6.349A8.214 8.214 0 0 0 12.399.001h.005Zm-1.579 22.736a6.98 6.98 0 0 1-6.317-6.317h6.317v6.317Zm0-9.562L4.869 1.238h5.967l-.011 11.937Zm1.579 2h-.331V1.238h.331a6.975 6.975 0 0 1 5.016 1.993 6.986 6.986 0 0 1 1.546 2.277 6.987 6.987 0 0 1 0 5.397 6.975 6.975 0 0 1-6.562 4.27Z" />
      </svg>
    ),
  },

  Tabler: {
    color: "#2563EB",
    bg: "#EFF6FF",
    darkBg: "#1A253E",
    render: (s) => (
      <svg role="img" viewBox="0 0 24 24" width={s} height={s} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M8 9l3 3l-3 3" />
        <path d="M13 15h3" />
        <path d="M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4l0 -10" />
      </svg>
    ),
  },

  Heroicons: {
    color: "#8B5CF6",
    bg: "#F5F3FF",
    darkBg: "#281D3D",
    render: (s) => (
      <svg role="img" viewBox="0 0 157 166" width={s} height={s} fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" clipRule="evenodd" d="m78.091 0 5.967 5.676c15.038 14.306 35.323 23.067 57.663 23.067.356 0 .711-.002 1.065-.006l6.363-.08 1.988 6.072a102.026 102.026 0 0 1 5.045 31.782c0 47.391-32.269 87.19-75.928 98.477l-2.163.559-2.163-.559C32.27 153.701 0 113.902 0 66.511c0-11.085 1.769-21.772 5.045-31.782l1.988-6.072 6.363.08c.354.004.71.006 1.065.006 22.34 0 42.625-8.761 57.664-23.067L78.09 0ZM19.846 46.033a84.814 84.814 0 0 0-2.492 20.478c0 38.459 25.662 70.919 60.737 81.006 35.075-10.087 60.738-42.547 60.738-81.006 0-7.071-.866-13.93-2.493-20.478-22.009-1.16-42.166-9.387-58.245-22.453-16.079 13.066-36.235 21.293-58.245 22.453Z" />
      </svg>
    ),
  },

  "Simple Icons": {
    color: "#111827",
    bg: "#F3F4F6",
    darkBg: "#22252E",
    render: (s) => (
      <svg role="img" viewBox="0 0 24 24" width={s} height={s} fill="currentColor" aria-hidden="true">
        <path d="M18 6a6 6 0 10-6 6 6 6 0 015.35 9h1.5A7.5 7.5 0 0012 10.5 4.5 4.5 0 1116.5 6Zm-6-3a3 3 0 000 6 1 1 0 000-6m0 1.5a1.5 1.5 0 010 3 1 1 0 010-3M7.5 15v1.5H9v6H4.5V24h15v-1.5H15v-6h1.5V15Zm3 1.5h3v6h-3zm-6 1.5a7.5 7.5 0 00.7 3h1.5a6 6 0 01-.7-3Z" />
      </svg>
    ),
  },

  "Feather Icons": {
    color: "#0F766E",
    bg: "#ECFDF5",
    darkBg: "#142D2B",
    render: (s) => (
      <svg role="img" viewBox="0 0 24 24" width={s} height={s} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
        <line x1="16" y1="8" x2="2" y2="22" />
        <line x1="17.5" y1="15" x2="9" y2="15" />
      </svg>
    ),
  },

  "Remix Icon": {
    color: "#E11D48",
    bg: "#FFF1F2",
    darkBg: "#321A22",
    render: (s) => (
      <svg role="img" viewBox="0 0 24 24" width={s} height={s} fill="currentColor" aria-hidden="true">
        <path d="M21.511 18.508c.216 2.773.216 4.073.216 5.492H15.31c0-.309.006-.592.011-.878.018-.892.036-1.821-.109-3.698-.19-2.747-1.374-3.358-3.55-3.358H1.574v-5h10.396c2.748 0 4.122-.835 4.122-3.049 0-1.946-1.374-3.125-4.122-3.125H1.573V0h11.541c6.221 0 9.313 2.938 9.313 7.632 0 3.511-2.176 5.8-5.114 6.182 2.48.497 3.93 1.909 4.198 4.694ZM1.573 24v-3.727h6.784c1.133 0 1.379.84 1.379 1.342V24Z" />
      </svg>
    ),
  },

  Lineicons: {
    color: "#3758F9",
    bg: "#EFF6FF",
    darkBg: "#1C2442",
    render: (s) => (
      <svg role="img" viewBox="0 0 24 24" width={s} height={s} fill="currentColor" aria-hidden="true">
        <path d="M7.496 7.558a.952.952 0 0 0-.88-.245.96.96 0 0 0-.671.626L2.045 20.081a.955.955 0 0 0 .227.943c.181.182.417.273.662.273a.85.85 0 0 0 .281-.045l12.152-3.9a.952.952 0 0 0 .626-.671.956.956 0 0 0-.245-.88L7.496 7.558Zm-3.12 11.372 2.875-8.969 6.094 6.094-8.969 2.875Z" />
        <path d="M12.502 9.57c.063.472.463.817.925.817.407 0 .822-.092 1.224-.145 1.17-.154 2.059-1.161 2.05-2.34v-.29a1.01 1.01 0 0 1 .49-.89 1.01 1.01 0 0 1 .986 0h.554c.517 0 .934-.417.934-.934s-.417-.934-.934-.934h-1.542a2.35 2.35 0 0 0-2.348 2.358v.29c0 .245-.181.454-.426.481l-1.107.145c-.508.064-.87.535-.806 1.043Z" />
        <path d="M21.634 10.877c-2.358-1.805-4.907-.209-5.931.889a.95.95 0 0 0 .045 1.315.952.952 0 0 0 1.315-.036c.073-.082 1.841-1.914 3.438-.69a.954.954 0 0 0 1.306-.172.954.954 0 0 0-.173-1.306Z" />
        <path d="M11.422 7.612c1.043-.798 2.095-2.666.726-4.525a.954.954 0 0 0-1.306-.308.954.954 0 0 0-.308 1.306c.716.97.091 1.741-.172 1.95a.954.954 0 0 0-.172 1.306.953.953 0 0 0 1.232.271Z" />
      </svg>
    ),
  },

  "Material Symbols": {
    color: "#1A73E8",
    bg: "#E8F0FE",
    darkBg: "#172844",
    render: (s) => (
      <svg role="img" viewBox="0 0 24 24" width={s} height={s} fill="currentColor" aria-hidden="true">
        <path d="M12 24c-1.655 0-3.218-.309-4.691-.927-1.454-.636-2.727-1.491-3.818-2.564-1.073-1.09-1.927-2.363-2.563-3.818C.309 15.218 0 13.655 0 12c0-1.673.309-3.236.927-4.691.637-1.455 1.491-2.718 2.564-3.791C4.582 2.428 5.854 1.573 7.309.955 8.782.318 10.345 0 12 0c1.673 0 3.236.318 4.691.955 1.454.618 2.718 1.473 3.791 2.563 1.091 1.073 1.945 2.336 2.563 3.791.637 1.455.955 3.018.955 4.691 0 1.655-.318 3.218-.955 4.691-.618 1.455-1.472 2.727-2.563 3.818-1.073 1.073-2.337 1.927-3.791 2.564-1.455.618-3.018.927-4.691.927Zm-7.636-5.863V5.864A9.484 9.484 0 0 0 2.755 8.7C2.373 9.736 2.182 10.836 2.182 12s.191 2.273.573 3.327a9.571 9.571 0 0 0 1.609 2.81Zm1.5-13.773h12.3a9.485 9.485 0 0 0-2.836-1.609C14.273 2.373 13.164 2.182 12 2.182c-1.164 0-2.273.191-3.327.573a9.571 9.571 0 0 0-2.809 1.609Zm6.136 10.364 4.118-8.182H7.909Zm1.091 2.727h4.363V8.728Zm-6.545 0h4.363L6.545 8.728Zm8.781 3.791c1.055-.382 2-.918 2.836-1.609H5.863a9.571 9.571 0 0 0 2.809 1.609c1.055.382 2.164.573 3.328.573 1.054 0 2.182-.158 3.327-.573Zm4.309-3.109a9.571 9.571 0 0 0 1.609-2.81c.382-1.054.573-2.163.573-3.327 0-1.163-.191-2.263-.573-3.3a9.57 9.57 0 0 0-1.609-2.836Z" />
      </svg>
    ),
  },

  "Fluent System Icons": {
    color: "#0078D4",
    bg: "#EFF6FC",
    darkBg: "#17243B",
    render: (s) => (
      <svg role="img" viewBox="0 0 24 24" width={s} height={s} fill="currentColor" aria-hidden="true">
        <path d="M12.585 2.082a.75.75 0 0 0-.67 0l-6 3a.75.75 0 0 0-.415.67V17.48a.75.75 0 0 0 .351.636l6 3.77A.75.75 0 0 0 13 21.25v-6.034l5.585-2.793a.75.75 0 0 0 0-1.341l-4.658-2.33l4.658-2.329a.75.75 0 0 0 0-1.341z" />
      </svg>
    ),
  },

  "Carbon Icons": {
    color: "#0F62FE",
    bg: "#EDF5FF",
    darkBg: "#16223D",
    render: (s) => (
      <svg role="img" viewBox="0 0 32 32" width={s} height={s} fill="currentColor" aria-hidden="true">
        <path d="M13.5 30.815a1 1 0 0 1-.493-.13l-8.5-4.815A1 1 0 0 1 4 25V15a1 1 0 0 1 .507-.87l8.5-4.815a1 1 0 0 1 .986 0l8.5 4.815A1 1 0 0 1 23 15v10a1 1 0 0 1-.507.87l-8.5 4.815a1 1 0 0 1-.493.13M6 24.417l7.5 4.249l7.5-4.249v-8.834l-7.5-4.248L6 15.583Z" />
        <path d="M28 17h-2V7.583l-7.5-4.248l-8.007 4.535l-.986-1.74l8.5-4.815a1 1 0 0 1 .986 0l8.5 4.815A1 1 0 0 1 28 7Z" />
      </svg>
    ),
  },

  "Bootstrap Icons": {
    color: "#7952B3",
    bg: "#F3E8FF",
    darkBg: "#2B1C3E",
    render: (s) => (
      <svg role="img" viewBox="0 0 24 24" width={s} height={s} fill="currentColor" aria-hidden="true">
        <path d="M11.77 11.24H9.956V8.202h2.152c1.17 0 1.834.522 1.834 1.466 0 1.008-.773 1.572-2.174 1.572zm.324 1.206H9.957v3.348h2.231c1.459 0 2.232-.585 2.232-1.685s-.795-1.663-2.326-1.663zM24 11.39v1.218c-1.128.108-1.817.944-2.226 2.268-.407 1.319-.463 2.937-.42 4.186.045 1.3-.968 2.5-2.337 2.5H4.985c-1.37 0-2.383-1.2-2.337-2.5.043-1.249-.013-2.867-.42-4.186-.41-1.324-1.1-2.16-2.228-2.268V11.39c1.128-.108 1.819-.944 2.227-2.268.408-1.319.464-2.937.42-4.186-.045-1.3.968-2.5 2.338-2.5h14.032c1.37 0 2.382 1.2 2.337 2.5-.043 1.249.013 2.867.42 4.186.409 1.324 1.098 2.16 2.226 2.268zm-7.927 2.817c0-1.354-.953-2.333-2.368-2.488v-.057c1.04-.169 1.856-1.135 1.856-2.213 0-1.537-1.213-2.538-3.062-2.538h-4.16v10.172h4.181c2.218 0 3.553-1.086 3.553-2.876z" />
      </svg>
    ),
  },

  "MingCute Icons": {
    color: "#5E5CE6",
    bg: "#F0EFFF",
    darkBg: "#221F3D",
    render: (s) => (
      <svg role="img" viewBox="0 0 24 24" width={s} height={s} fill="currentColor" aria-hidden="true">
        <path d="M2.787 4.585a.55.55 0 0 1 .795-.461L8.015 6.34a.55.55 0 0 1 .304.515l-.43 10.309a.55.55 0 0 1-.319.476l-4.823 2.226a.55.55 0 0 1-.78-.53zm18.426 0a.55.55 0 0 0-.795-.461L15.985 6.34a.55.55 0 0 0-.303.515l.43 10.309a.55.55 0 0 0 .318.476l4.823 2.226a.55.55 0 0 0 .78-.53zM9.222 7.208a.458.458 0 0 1 .663-.391l1.705.853a.92.92 0 0 0 .82 0l1.706-.853a.457.457 0 0 1 .662.391l.41 10.255a.92.92 0 0 1-.383.783L12.32 20.02a.55.55 0 0 1-.64 0l-2.485-1.775a.92.92 0 0 1-.383-.783z" />
      </svg>
    ),
  },

  "Glass Icons": {
    color: "#0891B2",
    bg: "#ECFEFF",
    darkBg: "#142F38",
    render: (s) => (
      <svg role="img" viewBox="0 0 24 24" width={s} height={s} fill="none" aria-hidden="true">
        <path d="M12 2L3 7v10l9 5 9-5V7l-9-5Z" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M12 2v20M3 7l9 5 9-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7.5 4.5l9 5" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.8" strokeLinecap="round" />
      </svg>
    ),
  },

  "Open Doodles": {
    color: "#7C3AED",
    bg: "#F5F3FF",
    darkBg: "#251B3B",
    render: (s) => (
      <svg role="img" viewBox="0 0 24 24" width={s} height={s} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {/* Playful sketched figure */}
        <circle cx="12" cy="7" r="3.5" />
        <path d="M10.5 6.5a.5.5 0 1 1 0-.01M13.5 6.5a.5.5 0 1 1 0-.01" fill="currentColor" strokeWidth="0" />
        <path d="M10.8 8.5c.6.6 1.8.6 2.4 0" />
        <path d="M6 14c1.5-1 3.5.5 5 1 2 .6 4.5-.5 7-1.5" />
        <path d="M12 10.5v8c0 1.5-1 3.5-3 3.5M12 18.5c1 0 3-1 3-3" />
      </svg>
    ),
  },

  "Open Peeps": {
    color: "#C2410C",
    bg: "#FFF7ED",
    darkBg: "#332018",
    render: (s) => (
      <svg role="img" viewBox="0 0 24 24" width={s} height={s} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {/* Pablo Stanley Open Peeps head & glasses */}
        <path d="M7 8.5c0-3 2.2-5.5 5-5.5s5 2.5 5 5.5v2c0 3.3-2.2 6-5 6s-5-2.7-5-6v-2Z" />
        <path d="M6.5 7.5c1.5-3 4-4.5 7-4 1.5.2 3.5 1.5 4 3" />
        <circle cx="9.5" cy="10" r="1.5" />
        <circle cx="14.5" cy="10" r="1.5" />
        <path d="M11 10h2" />
        <path d="M10.5 13.5c.9.6 2.1.6 3 0" />
        <path d="M5.5 21c1-2.5 3.5-4 6.5-4s5.5 1.5 6.5 4" />
      </svg>
    ),
  },

  "Fluent Emoji": {
    color: "#B45309",
    bg: "#FFFBEB",
    darkBg: "#342618",
    render: (s) => (
      <svg role="img" viewBox="0 0 32 32" width={s} height={s} fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="14" fill="#FFB02E" />
        <circle cx="11" cy="11.5" r="2.2" fill="#402A32" />
        <circle cx="21" cy="11.5" r="2.2" fill="#402A32" />
        <path d="M8 17h16c0 5-3.5 8.5-8 8.5S8 22 8 17Z" fill="#BB1D80" />
        <path d="M8 17h16v1.2c0 .8-.6 1.4-1.4 1.4H9.4A1.4 1.4 0 0 1 8 18.2V17Z" fill="#FFFFFF" />
      </svg>
    ),
  },

  "Flowbite Illustrations": {
    color: "#1C64F2",
    bg: "#EFF6FF",
    darkBg: "#172342",
    render: (s) => (
      <svg role="img" viewBox="0 0 32 33" width={s} height={s} fill="none" aria-hidden="true">
        <path d="M24.52 13.44c-.07.51-.41 1.2-.8 1.81-.48.76-1.26 1.29-2.14 1.48l-3.9.81c-.63.13-1.2.46-1.62.94l-2.56 2.86c-.48.53-.82.4-.82-.32 0 .03-1.26 3.29 2.08 5.22 1.29.74 3.14.47 4.43-.27l6.81-3.93c2.55-1.47 4.35-3.96 4.94-6.83.03-.12.05-.23.07-.35l-6.49-1.42Z" fill="#1C64F2" />
        <path d="M22.75 9.52c1.29.74 1.81 1.84 1.81 3.33 0 .2-.01.4-.04.6l2.74 1.17 3.74.25c.48-2.77-.46-5.63-2.14-7.89a14.7 14.7 0 0 0-4.85-4.32c-1.59-.92-3.25-1.52-4.91-1.85l-1.87 2.41-.59 2.78 6.11 3.52Z" fill="#0092FF" />
        <path d="M.78 11.55c.15-.43.33-.91.56-1.43C2.52 7.43 4.79 5.64 7.58 4.73c2.79-.92 5.84-.6 8.38.87l.69.4 2.45-5.2C11.29-.76 3.31 3.83.8 11.52l-.02.03Z" fill="#45B2FF" />
        <path d="M14.27 25.63c-.99-.78-1.58-1.98-1.58-3.26v-10.8c0-.6.18-.7.7-.4 0 0-2.67-1.6-4.97-.27-1.28.74-2.34 2.38-2.34 3.86v7.86c0 2.94 1.52 6 3.72 7.96l4.47-5.15Z" fill="#1724C9" />
      </svg>
    ),
  },

  Bioicons: {
    color: "#059669",
    bg: "#ECFDF5",
    darkBg: "#142F26",
    render: (s) => (
      <svg role="img" viewBox="0 0 24 24" width={s} height={s} fill="none" aria-hidden="true">
        {/* Bioicons green hexagon with lowercase b */}
        <polygon points="12,2 21,7.2 21,16.8 12,22 3,16.8 3,7.2" fill="currentColor" />
        <path d="M10 6.5v11h2.2v-4.2a2.8 2.8 0 0 0 2.8-2.8c0-1.8-1.2-2.8-2.8-2.8H10Zm2.2 2.2h.5c.7 0 1.2.4 1.2 1.2s-.5 1.2-1.2 1.2h-.5v-2.4Z" fill="#FFFFFF" />
      </svg>
    ),
  },
};

export const ProviderLogo: React.FC<ProviderLogoProps> = ({ source, className, size = 16 }) => {
  const meta = PROVIDERS[source];

  if (!meta) {
    return (
      <span
        aria-hidden="true"
        className={cn(
          "grid size-7 shrink-0 place-items-center rounded-md text-[10px] font-bold tracking-tight bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
          className
        )}
      >
        {source.slice(0, 2).toUpperCase()}
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid size-7 shrink-0 place-items-center rounded-md transition-transform duration-100 group-hover:scale-105",
        className
      )}
      style={{
        color: meta.color,
        backgroundColor: meta.bg,
      }}
    >
      {meta.render(size)}
    </span>
  );
};

