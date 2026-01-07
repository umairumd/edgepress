/**
 * Inline SVG icons to replace Font Awesome
 * Saves ~82 KiB by not loading fontawesome-all.min.css
 */

import { CSSProperties, memo } from "react";

interface IconProps {
  className?: string;
  style?: CSSProperties;
  "aria-hidden"?: boolean | "true" | "false";
}

// Helper to merge className with default classes
const iconClass = (base: string, className?: string) =>
  className ? `${base} ${className}` : base;

// ============================================
// Solid Icons (fa-solid)
// ============================================

export const IconBullseye = memo(function IconBullseye({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="currentColor"
      className={iconClass("svg-icon", className)}
      {...props}
    >
      <path d="M448 256A192 192 0 1 0 64 256a192 192 0 1 0 384 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 80a80 80 0 1 0 0-160 80 80 0 1 0 0 160zm0-224a144 144 0 1 1 0 288 144 144 0 1 1 0-288zM224 256a32 32 0 1 1 64 0 32 32 0 1 1-64 0z" />
    </svg>
  );
});

export const IconUsers = memo(function IconUsers({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 512"
      fill="currentColor"
      className={iconClass("svg-icon", className)}
      {...props}
    >
      <path d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192l42.7 0c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0L106.7 320C47.8 320 0 272.2 0 213.3L0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7l42.7 0C592.2 192 640 239.8 640 298.7l0-85.3c0 58.9-47.8 106.7-106.7 106.7l-128 0zM320 256a96 96 0 1 0 0-192 96 96 0 1 0 0 192zm-58.7 64l117.3 0c64.7 0 117.3 52.6 117.3 117.3c0 29.1-23.6 52.7-52.7 52.7l-246.3 0c-29.1 0-52.7-23.6-52.7-52.7C144.3 372.6 196.9 320 261.3 320z" />
    </svg>
  );
});

export const IconGears = memo(function IconGears({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="currentColor"
      className={iconClass("svg-icon", className)}
      {...props}
    >
      <path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z" />
    </svg>
  );
});

export const IconPhone = memo(function IconPhone({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="currentColor"
      className={iconClass("svg-icon", className)}
      {...props}
    >
      <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" />
    </svg>
  );
});

export const IconEnvelope = memo(function IconEnvelope({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="currentColor"
      className={iconClass("svg-icon", className)}
      {...props}
    >
      <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48L48 64zM0 176L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-208L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
    </svg>
  );
});

export const IconXmark = memo(function IconXmark({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 384 512"
      fill="currentColor"
      className={iconClass("svg-icon", className)}
      {...props}
    >
      <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
    </svg>
  );
});

export const IconSearch = memo(function IconSearch({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="currentColor"
      className={iconClass("svg-icon", className)}
      {...props}
    >
      <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
    </svg>
  );
});

export const IconArrowUp = memo(function IconArrowUp({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 384 512"
      fill="currentColor"
      className={iconClass("svg-icon", className)}
      {...props}
    >
      <path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z" />
    </svg>
  );
});

export const IconArrowRight = memo(function IconArrowRight({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      fill="currentColor"
      className={iconClass("svg-icon", className)}
      {...props}
    >
      <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
    </svg>
  );
});

export const IconArrowLeft = memo(function IconArrowLeft({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      fill="currentColor"
      className={iconClass("svg-icon", className)}
      {...props}
    >
      <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
    </svg>
  );
});

export const IconStar = memo(function IconStar({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 576 512"
      fill="currentColor"
      className={iconClass("svg-icon", className)}
      {...props}
    >
      <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
    </svg>
  );
});

export const IconChessKnight = memo(function IconChessKnight({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      fill="currentColor"
      className={iconClass("svg-icon", className)}
      {...props}
    >
      {/* Font Awesome 6 chess-knight solid */}
      <path d="M96 48L82.7 61.3C70.7 73.3 64 89.5 64 106.5V238.9c0 10.7 5.3 20.7 14.2 26.6l10.6 7c14.3 9.5 32.7 10.7 48.1 3l3.2-1.6c2.6-1.3 5-2.8 7.3-4.5l49.4-37c6.6-5 15.7-5 22.3 0c10.2 7.7 9.9 23.1-.7 30.3L90.4 350.9c-6.1 4.1-9.2 11.5-7.5 18.6l38.3 159c2.4 10.1 11.4 17.3 21.8 17.5H400c8.8 0 16-7.2 16-16V480c0-17.7-14.3-32-32-32H347.4c-11.3 0-21.6-6.2-26.9-16.1l-50.1-93.4c-3.4-6.3-1.4-14.1 4.6-18c6.1-3.9 14.2-2.5 18.6 3.2l66.8 87c4.5 5.9 11.5 9.3 18.9 9.3H416c17.7 0 32-14.3 32-32V266.5c0-13.5-4.4-26.6-12.6-37.4l-27-35.7c-7.6-10.1-19.5-16-32.1-16H352V128h32c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32H300c-15.1 0-29 8.4-36 21.8L244.7 87.2c-2.2 4.2-6.1 7.2-10.7 8.2s-9.4 .1-13.1-2.6l-17.6-12.7c-5.5-4-7.5-11.2-4.8-17.4L216 16H170.7c-15.8 0-30.5 8.3-38.6 21.8L118.6 60C109.2 75.6 99.7 91.4 96 104.2V48zm80 80a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/>
    </svg>
  );
});

export const IconCompassDrafting = memo(function IconCompassDrafting({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="currentColor"
      className={iconClass("svg-icon", className)}
      {...props}
    >
      {/* Font Awesome 6 compass-drafting solid */}
      <path d="M352 96c0 14.3-3.1 27.9-8.8 40.2L396 227.4c-23.7 25.3-54.2 44.1-88.5 53.6L256 192h0l-51.5 89c-34.3-9.5-64.8-28.3-88.5-53.6l52.8-91.2c-5.7-12.3-8.8-25.9-8.8-40.2c0-53 43-96 96-96s96 43 96 96zM128 256l-20.1 34.9c-4.8 8.4-4.5 18.8 .9 26.8s14.7 12.3 24.3 11.2l36.6-4.1l-18.5 32c-4.8 8.3-4.6 18.5 .5 26.6s14.3 12.6 23.8 11.8l40.8-3.4l-22.4 38.7c-4.9 8.4-4.5 18.9 .9 26.9s14.8 12.2 24.4 11l41.4-5.4l-19.5 33.8c-4.9 8.5-4.4 19.1 1.3 27.1S261.3 544 270.8 544h42.4c9.5 0 18.2-5.2 22.7-13.6l19.5-33.8l41.4 5.4c9.6 1.2 18.9-2.9 24.4-11s5.8-18.5 .9-26.9l-22.4-38.7l40.8 3.4c9.5 .8 18.5-3.7 23.8-11.8s5.3-18.3 .5-26.6l-18.5-32l36.6 4.1c9.6 1.1 18.9-3.2 24.3-11.2s5.7-18.4 .9-26.8L384 256l22.4-38.7c4.9-8.4 4.5-18.9-.9-26.9s-14.8-12.2-24.4-11l-41.4 5.4l19.5-33.8c4.9-8.5 4.4-19.1-1.3-27.1S339.7 112 330.2 112h-42.4c-9.5 0-18.2 5.2-22.7 13.6L256 144l-9.1-18.4c-4.5-8.4-13.2-13.6-22.7-13.6h-42.4c-9.5 0-18.2 5.2-22.7 13.6s-6.2 18.6-1.3 27.1l19.5 33.8l-41.4-5.4c-9.6-1.2-18.9 2.9-24.4 11s-5.8 18.5-.9 26.9L128 256zm128-64a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/>
    </svg>
  );
});

export const IconDatabase = memo(function IconDatabase({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      fill="currentColor"
      className={iconClass("svg-icon", className)}
      {...props}
    >
      <path d="M448 80v48c0 44.2-100.3 80-224 80S0 172.2 0 128V80C0 35.8 100.3 0 224 0S448 35.8 448 80zM393.2 214.7c20.8-7.4 39.9-16.9 54.8-28.6V288c0 44.2-100.3 80-224 80S0 332.2 0 288V186.1c14.9 11.8 34 21.2 54.8 28.6C99.7 230.7 159.5 240 224 240s124.3-9.3 169.2-25.3zM0 346.1c14.9 11.8 34 21.2 54.8 28.6C99.7 390.7 159.5 400 224 400s124.3-9.3 169.2-25.3c20.8-7.4 39.9-16.9 54.8-28.6V432c0 44.2-100.3 80-224 80S0 476.2 0 432V346.1z" />
    </svg>
  );
});

export const IconCartShopping = memo(function IconCartShopping({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 576 512"
      fill="currentColor"
      className={iconClass("svg-icon", className)}
      {...props}
    >
      <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
    </svg>
  );
});

export const IconPalette = memo(function IconPalette({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="currentColor"
      className={iconClass("svg-icon", className)}
      {...props}
    >
      <path d="M512 256c0 .9 0 1.8 0 2.7c-.4 36.5-33.6 61.3-70.1 61.3H344c-26.5 0-48 21.5-48 48c0 3.4 .4 6.7 1 9.9c2.1 10.2 6.5 20 10.8 29.9c6.1 13.8 12.1 27.5 12.1 42c0 31.8-21.6 60.7-53.4 62c-3.5 .1-7 .2-10.6 .2C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm0-96a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM288 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm96 96a32 32 0 1 0 0-64 32 32 0 1 0 0 64z" />
    </svg>
  );
});

export const IconBullhorn = memo(function IconBullhorn({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="currentColor"
      className={iconClass("svg-icon", className)}
      {...props}
    >
      {/* Font Awesome 6 bullhorn solid */}
      <path d="M480 32c0-12.9-7.8-24.6-19.8-29.6s-25.7-2.2-34.9 6.9L381.7 53c-48 48-113.1 75-181 75H192 160 64c-35.3 0-64 28.7-64 64v96c0 35.3 28.7 64 64 64l0 128c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32V352l8.7 0c67.9 0 133 27 181 75l43.6 43.6c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V300.4c18.6-8.8 32-32.5 32-60.4s-13.4-51.6-32-60.4V32zM160 192v128H96V192h64zm320-4.8V292.8c-8.1-10.4-13-23.3-13-37.4s4.9-27 13-37.4z"/>
    </svg>
  );
});

export const IconMagnifyingGlass = memo(function IconMagnifyingGlass({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="currentColor"
      className={iconClass("svg-icon", className)}
      {...props}
    >
      <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
    </svg>
  );
});

export const IconMobileScreenButton = memo(function IconMobileScreenButton({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 384 512"
      fill="currentColor"
      className={iconClass("svg-icon", className)}
      {...props}
    >
      <path d="M16 64C16 28.7 44.7 0 80 0H304c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H80c-35.3 0-64-28.7-64-64V64zM144 448c0 8.8 7.2 16 16 16h64c8.8 0 16-7.2 16-16s-7.2-16-16-16H160c-8.8 0-16 7.2-16 16zM304 64H80V384H304V64z" />
    </svg>
  );
});

export const IconLocationDot = memo(function IconLocationDot({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 384 512"
      fill="currentColor"
      className={iconClass("svg-icon", className)}
      {...props}
    >
      <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
    </svg>
  );
});

// ============================================
// Service Page Icons (Custom)
// ============================================

export const IconBusinessStrategy = memo(function IconBusinessStrategy({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 511.997 511.997"
      fill="currentColor"
      className={iconClass("svg-icon", className)}
      {...props}
    >
      <path d="M439.208,162.493c-42.656-33.504-84.672-66.976-127.168-100.48c-18.432-14.176-27.392-32.192-23.648-55.488 c0.64-5.792-2.592-7.744-8.96-5.792c-14.656,4.48-26.752,12.896-33.76,26.432c-9.6,19.328-24.8,26.432-44,25.792 c-28.704-1.312-46.496,14.208-61.792,36.16c-16.64,23.296-24.8,50.368-31.168,77.472c-7.008,29.056-10.272,58.144-11.424,87.712 c-1.312,22.624-0.64,44.576-1.312,67.072c0,1.312,0,1.984,0,2.624v60h281.632v-45.248c0,0,2.272-19.04-11.808-32.992 c-14.08-13.952-29.024-27.008-29.024-27.008c-7.2-5.888-13.76-12.608-19.424-19.936l-51.936-67.2 c3.232,2.624,6.368,5.12,9.6,7.744c15.968,12.224,33.12,17.376,52.832,12.224c11.424-2.624,22.976-1.312,33.12,5.12 c5.664,3.776,11.936,7.04,18.24,10.304c14.816,7.68,33.056,4.16,43.712-8.64c6.56-7.872,13.12-15.744,19.68-23.488 C450.952,184.989,449.416,170.493,439.208,162.493z"></path>
      <path d="M414.312,488.861l-32-64.032c-2.72-5.408-8.256-8.832-14.304-8.832h-256c-6.048,0-11.584,3.424-14.304,8.832l-32,64 c-2.496,4.96-2.208,10.848,0.704,15.552c2.912,4.704,8.064,7.616,13.6,7.616h320c5.536,0,10.688-2.88,13.632-7.584 C416.552,499.709,416.808,493.821,414.312,488.861z"></path>
    </svg>
  );
});

export const IconPenTool = memo(function IconPenTool({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 14 14"
      fill="currentColor"
      className={iconClass("svg-icon", className)}
      {...props}
    >
      <path d="m9.637 7.793-3.43-3.43a1.006 1.006 0 0 0 -.96-.263l-3.133.82a.993.993 0 0 0 -.747.977 19.436 19.436 0 0 1 -1.323 7.203.663.663 0 0 0 .853.853 19.436 19.436 0 0 1 7.203-1.32.993.993 0 0 0 .977-.747l.823-3.133a1.006 1.006 0 0 0 -.263-.96zm-3.107 2.05a1.678 1.678 0 1 1 0-2.373 1.68 1.68 0 0 1 0 2.373z"></path>
      <rect height="4.016" rx="1" transform="matrix(.707 .707 -.707 .707 5.64 -6.183)" width="7.667" x="6.451" y="1.708"></rect>
    </svg>
  );
});

export const IconWebDev = memo(function IconWebDev({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={iconClass("svg-icon", className)}
      {...props}
    >
      <path d="m22.75 4v1.25h-21.5v-1.25c0-1.52 1.23-2.75 2.75-2.75h16c1.52 0 2.75 1.23 2.75 2.75zm0 2.75v13.25c0 1.52-1.23 2.75-2.75 2.75h-16c-1.52 0-2.75-1.23-2.75-2.75v-13.25zm-15.86 7.25 1.97-1.97c.3-.29.3-.77 0-1.06-.29-.29-.76-.29-1.06 0l-2.5 2.5c-.29.29-.29.77 0 1.06l2.5 2.5c.15.15.34.22.53.22s.39-.07.53-.22c.3-.29.3-.77 0-1.06zm6.55-4.72c-.4-.12-.81.11-.93.5l-2.45 8c-.12.4.1.82.5.94.07.02.14.03.22.03.32 0 .62-.21.71-.53l2.45-8c.12-.4-.1-.82-.5-.94zm5.26 4.19-2.5-2.5c-.3-.29-.77-.29-1.06 0-.3.29-.3.77 0 1.06l1.97 1.97-1.97 1.97c-.3.29-.3.77 0 1.06.14.15.33.22.53.22s.38-.07.53-.22l2.5-2.5c.29-.29.29-.77 0-1.06z"></path>
    </svg>
  );
});

export const IconEcommerce = memo(function IconEcommerce({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={iconClass("svg-icon", className)}
      {...props}
    >
      <path d="m1 1c-.55228475 0-1 .44771525-1 1s.44771525 1 1 1h1.7792969a.69367162.69367162 35.784145 0 1 .65808707.47435058l3.2969911 9.8928369c.14641172.43923517.16502704.91215746.05273437 1.3613281l-.27148437 1.0878906c-.39834445 1.5933778.84195876 3.1835938 2.484375 3.1835938h12c.55228475 0 1-.44771525 1-1s-.44771525-1-1-1h-12c-.38938619 0-.6393619-.31950554-.54492188-.69726562l.20473297-.81770594a.64062109.64062109 142.02823 0 1 .6214389-.48502844h10.71875c.43057012.00022511.81295428-.27515444.94921875-.68359375l2.6660156-8c.21596464-.64778704-.26638007-1.3167178-.94921876-1.3164062h-16.111328a.69371294.69371294 35.782526 0 1 -.65811388-.47434165l-.94735487-2.8420646c-.13626447-.40843931-.51864863-.68381886-.94921875-.68359375zm7 19c-1.1045695 0-2 .8954305-2 2s.8954305 2 2 2 2-.8954305 2-2-.8954305-2-2-2zm12 0c-1.1045695 0-2 .8954305-2 2s.8954305 2 2 2 2-.8954305 2-2-.8954305-2-2-2z"></path>
    </svg>
  );
});

export const IconGraphicsDesign = memo(function IconGraphicsDesign({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 444.892 444.892"
      fill="currentColor"
      className={iconClass("svg-icon", className)}
      {...props}
    >
      <path d="M440.498,173.103c5.858-5.857,5.858-15.355,0-21.213l-22.511-22.511c-5.091-5.091-13.084-5.846-19.038-1.8 l-47.332,32.17l31.975-47.652c3.993-5.951,3.219-13.897-1.85-18.964l-48.83-48.83c-4.508-4.508-11.372-5.675-17.114-2.908 l-8.443,4.065l4.043-8.97c2.563-5.685,1.341-12.361-3.068-16.771L293.002,4.393c-5.857-5.857-15.355-5.857-21.213,0 l-119.06,119.059l168.71,168.71L440.498,173.103z"></path>
      <path d="M130.56,145.622l-34.466,34.466c-2.813,2.813-4.394,6.628-4.394,10.606s1.58,7.794,4.394,10.606 l32.694,32.694c6.299,6.299,9.354,14.992,8.382,23.849c-0.971,8.851-5.843,16.677-13.366,21.473 C27.736,340.554,18.781,349.51,15.839,352.453c-21.119,21.118-21.119,55.48,0,76.6c21.14,21.14,55.504,21.098,76.6,0 c2.944-2.943,11.902-11.902,73.136-107.965c4.784-7.505,12.607-12.366,21.462-13.339c8.883-0.969,17.575,2.071,23.859,8.354 l32.694,32.694c5.857,5.857,15.356,5.857,21.213,0l34.467-34.467L130.56,145.622z M70.05,404.825c-8.28,8.28-21.704,8.28-29.983,0 c-8.28-8.28-8.28-21.704,0-29.983c8.28-8.28,21.704-8.28,29.983,0C78.33,383.121,78.33,396.545,70.05,404.825z"></path>
    </svg>
  );
});

export const IconDigitalMarketing = memo(function IconDigitalMarketing({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 486.742 486.742"
      fill="currentColor"
      className={iconClass("svg-icon", className)}
      {...props}
    >
      <path d="M33,362.371v78.9c0,4.8,3.9,8.8,8.8,8.8h61c4.8,0,8.8-3.9,8.8-8.8v-138.8l-44.3,44.3 C57.9,356.071,45.9,361.471,33,362.371z"></path>
      <path d="M142,301.471v139.8c0,4.8,3.9,8.8,8.8,8.8h61c4.8,0,8.8-3.9,8.8-8.8v-82.3c-13.9-0.3-26.9-5.8-36.7-15.6L142,301.471z"></path>
      <path d="M251,350.271v91c0,4.8,3.9,8.8,8.8,8.8h61c4.8,0,8.8-3.9,8.8-8.8v-167.9l-69.9,69.9 C257,345.971,254.1,348.271,251,350.271z"></path>
      <path d="M432.7,170.171l-72.7,72.7v198.4c0,4.8,3.9,8.8,8.8,8.8h61c4.8,0,8.8-3.9,8.8-8.8v-265.6c-2-1.7-3.5-3.2-4.6-4.2 L432.7,170.171z"></path>
      <path d="M482.6,41.371c-2.9-3.1-7.3-4.7-12.9-4.7c-0.5,0-1.1,0-1.6,0c-28.4,1.3-56.7,2.7-85.1,4c-3.8,0.2-9,0.4-13.1,4.5 c-1.3,1.3-2.3,2.8-3.1,4.6c-4.2,9.1,1.7,15,4.5,17.8l7.1,7.2c4.9,5,9.9,10,14.9,14.9l-171.6,171.7l-77.1-77.1 c-4.6-4.6-10.8-7.2-17.4-7.2c-6.6,0-12.7,2.6-17.3,7.2L7.2,286.871c-9.6,9.6-9.6,25.1,0,34.7l4.6,4.6c4.6,4.6,10.8,7.2,17.4,7.2 s12.7-2.6,17.3-7.2l80.7-80.7l77.1,77.1c4.6,4.6,10.8,7.2,17.4,7.2c6.6,0,12.7-2.6,17.4-7.2l193.6-193.6l21.9,21.8 c2.6,2.6,6.2,6.2,11.7,6.2c2.3,0,4.6-0.6,7-1.9c1.6-0.9,3-1.9,4.2-3.1c4.3-4.3,5.1-9.8,5.3-14.1c0.8-18.4,1.7-36.8,2.6-55.3 l1.3-27.7C487,49.071,485.7,44.571,482.6,41.371z"></path>
    </svg>
  );
});

export const IconSeoServices = memo(function IconSeoServices({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="currentColor"
      className={iconClass("svg-icon", className)}
      {...props}
    >
      <path d="M492.912,50.288l-36.399,5.201l5.201-36.399c2.261-15.821-17.009-25.491-28.328-14.161l-66.778,66.778 c-2.554,2.554-4.211,5.869-4.722,9.445l-7.56,52.92l-82.447,82.447c-6.529-3.124-13.75-5.018-21.458-5.018 c-27.617,0-50.083,22.466-50.083,50.083s22.466,50.083,50.083,50.083c27.617,0,50.083-22.466,50.083-50.083 c0-7.708-1.894-14.929-5.018-21.458l82.447-82.447l52.92-7.56c3.576-0.511,6.89-2.168,9.445-4.722l66.778-66.778 C518.36,67.332,508.806,48.061,492.912,50.288z"></path>
      <path d="M385.86,196.97l-52.89,52.886c0.544,3.842,0.923,7.737,0.923,11.727c0,46.029-37.443,83.472-83.472,83.472 c-46.029,0-83.472-37.443-83.472-83.472c0-46.029,37.442-83.472,83.472-83.472c3.989,0,7.883,0.378,11.724,0.922l52.889-52.889 c-19.605-9.392-41.462-14.81-64.613-14.81c-82.847,0-150.25,67.403-150.25,150.25s67.403,150.25,150.25,150.25 c82.847,0,150.25-67.403,150.25-150.25C400.67,238.432,395.254,216.575,385.86,196.97z"></path>
      <path d="M477.243,155.664l-13.339,13.339c-7.608,7.614-17.673,12.646-28.329,14.167l-18.1,2.587 c10.551,23.148,16.584,48.771,16.584,75.826c0,101.259-82.38,183.639-183.639,183.639S66.781,362.842,66.781,261.583 S149.162,77.944,250.42,77.944c27.055,0,52.678,6.033,75.826,16.584l2.586-18.1c1.521-10.657,6.554-20.721,14.167-28.335 l13.336-13.334c-32.897-15.407-68.761-23.593-105.916-23.593c-138.082,0-250.416,112.335-250.416,250.417S112.338,512,250.42,512 s250.417-112.335,250.417-250.417C500.837,224.427,492.651,188.561,477.243,155.664z"></path>
    </svg>
  );
});

export const IconAppDev = memo(function IconAppDev({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-106 0 469 469.33333"
      fill="currentColor"
      className={iconClass("svg-icon", className)}
      {...props}
    >
      <path d="m206.246094 0h-156.160156c-27.558594.03125-49.890626 22.363281-49.917969 49.921875v369.492187c.027343 27.558594 22.359375 49.890626 49.917969 49.917969h156.160156c27.558594-.027343 49.890625-22.359375 49.921875-49.917969v-369.492187c-.03125-27.558594-22.363281-49.890625-49.921875-49.921875zm-78.078125 426.667969c-11.785157 0-21.335938-9.550781-21.335938-21.335938 0-11.78125 9.550781-21.332031 21.335938-21.332031 11.78125 0 21.332031 9.550781 21.332031 21.332031 0 11.785157-9.550781 21.335938-21.332031 21.335938zm32-362.667969h-64c-5.890625 0-10.667969-4.777344-10.667969-10.667969s4.777344-10.664062 10.667969-10.664062h64c5.890625 0 10.664062 4.773437 10.664062 10.664062s-4.773437 10.667969-10.664062 10.667969zm0 0"></path>
    </svg>
  );
});

// ============================================
// Regular Icons (fa-regular)
// ============================================

export const IconAngleDown = memo(function IconAngleDown({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      fill="currentColor"
      className={iconClass("svg-icon", className)}
      {...props}
    >
      <path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
    </svg>
  );
});

export const IconAngleRight = memo(function IconAngleRight({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 512"
      fill="currentColor"
      className={iconClass("svg-icon", className)}
      {...props}
    >
      <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" />
    </svg>
  );
});

// ============================================
// Brand Icons (fa-brands)
// ============================================

export const IconFacebookF = memo(function IconFacebookF({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 512"
      fill="currentColor"
      className={iconClass("svg-icon", className)}
      {...props}
    >
      <path d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z" />
    </svg>
  );
});

export const IconTwitter = memo(function IconTwitter({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="currentColor"
      className={iconClass("svg-icon", className)}
      {...props}
    >
      <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" />
    </svg>
  );
});

export const IconInstagram = memo(function IconInstagram({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      fill="currentColor"
      className={iconClass("svg-icon", className)}
      {...props}
    >
      <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
    </svg>
  );
});

export const IconLinkedinIn = memo(function IconLinkedinIn({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      fill="currentColor"
      className={iconClass("svg-icon", className)}
      {...props}
    >
      <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
    </svg>
  );
});

export const IconYoutube = memo(function IconYoutube({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 576 512"
      fill="currentColor"
      className={iconClass("svg-icon", className)}
      {...props}
    >
      <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z" />
    </svg>
  );
});

export const IconBehance = memo(function IconBehance({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 576 512"
      fill="currentColor"
      className={iconClass("svg-icon", className)}
      {...props}
    >
      <path d="M232 237.2c31.8-15.2 48.4-38.2 48.4-74 0-70.6-52.6-87.8-113.3-87.8H0v354.4h171.8c64.4 0 124.9-30.9 124.9-102.9 0-44.5-21.1-77.4-64.7-89.7zM77.9 135.9H151c28.1 0 53.4 7.9 53.4 40.5 0 30.1-19.7 42.2-47.5 42.2h-79v-82.7zm83.3 233.7H77.9V272h84.9c34.3 0 56 14.3 56 50.6 0 35.8-25.9 47-57.6 47zm358.5-240.7H376V94h143.7v34.9zM576 305.2c0-75.9-44.4-139.2-124.9-139.2-78.2 0-131.3 58.8-131.3 135.8 0 79.9 50.3 134.7 131.3 134.7 61.3 0 101-27.6 120.1-86.3H509c-6.7 21.9-34.3 33.5-55.7 33.5-41.3 0-63-24.2-63-65.3h185.1c.3-4.2 .6-8.7 .6-13.2zM390.4 274c2.3-33.7 24.7-54.8 58.5-54.8 35.4 0 53.2 20.8 56.2 54.8H390.4z" />
    </svg>
  );
});

export const IconWhatsapp = memo(function IconWhatsapp({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      fill="currentColor"
      className={iconClass("svg-icon", className)}
      {...props}
    >
      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
    </svg>
  );
});

// ============================================
// Icon Component (lookup by name)
// ============================================

const iconMap = {
  // Solid
  bullseye: IconBullseye,
  users: IconUsers,
  gears: IconGears,
  phone: IconPhone,
  envelope: IconEnvelope,
  xmark: IconXmark,
  search: IconSearch,
  "arrow-up": IconArrowUp,
  "arrow-right": IconArrowRight,
  "arrow-left": IconArrowLeft,
  star: IconStar,
  "chess-knight": IconChessKnight,
  "compass-drafting": IconCompassDrafting,
  database: IconDatabase,
  "cart-shopping": IconCartShopping,
  palette: IconPalette,
  bullhorn: IconBullhorn,
  "magnifying-glass": IconMagnifyingGlass,
  "mobile-screen-button": IconMobileScreenButton,
  "location-dot": IconLocationDot,
  // Service Page Icons
  "business-strategy": IconBusinessStrategy,
  "pen-tool": IconPenTool,
  "web-dev": IconWebDev,
  ecommerce: IconEcommerce,
  "graphics-design": IconGraphicsDesign,
  "digital-marketing": IconDigitalMarketing,
  "seo-services": IconSeoServices,
  "app-dev": IconAppDev,
  // Regular
  "angle-down": IconAngleDown,
  "angle-right": IconAngleRight,
  // Brands
  "facebook-f": IconFacebookF,
  twitter: IconTwitter,
  instagram: IconInstagram,
  "linkedin-in": IconLinkedinIn,
  youtube: IconYoutube,
  behance: IconBehance,
  whatsapp: IconWhatsapp,
} as const;

export type IconName = keyof typeof iconMap;

interface IconComponentProps extends IconProps {
  name: IconName;
}

export const Icon = memo(function Icon({ name, ...props }: IconComponentProps) {
  const IconComponent = iconMap[name];
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }
  return <IconComponent {...props} />;
});

export default Icon;

