export const UI_CONSTANTS = {
  // Animation durations
  ANIMATION: {
    FAST: '150ms',
    NORMAL: '200ms',
    SLOW: '300ms',
    VERY_SLOW: '500ms'
  },
  
  // Breakpoints
  BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
    '2XL': '1536px'
  },
  
  // Z-index layers
  Z_INDEX: {
    DROPDOWN: 10,
    STICKY: 20,
    FIXED: 30,
    MODAL_BACKDROP: 40,
    MODAL: 50,
    POPOVER: 60,
    TOOLTIP: 70,
    TOAST: 80,
    CONTEXT_MENU: 90,
    MAX: 100
  },
  
  // Common spacing
  SPACING: {
    XS: '0.25rem',
    SM: '0.5rem',
    MD: '1rem',
    LG: '1.5rem',
    XL: '2rem',
    '2XL': '3rem',
    '3XL': '4rem'
  },
  
  // Typography
  TYPOGRAPHY: {
    FONT_SIZES: {
      XS: '0.75rem',
      SM: '0.875rem',
      BASE: '1rem',
      LG: '1.125rem',
      XL: '1.25rem',
      '2XL': '1.5rem',
      '3XL': '1.875rem',
      '4XL': '2.25rem',
      '5XL': '3rem'
    },
    LINE_HEIGHTS: {
      TIGHT: '1.25',
      NORMAL: '1.5',
      RELAXED: '1.75'
    }
  },
  
  // Component sizes
  COMPONENT_SIZES: {
    BUTTON: {
      SM: 'h-8 px-3 text-xs',
      DEFAULT: 'h-9 px-4 py-2',
      LG: 'h-10 px-8',
      XL: 'h-12 px-10 text-base'
    },
    INPUT: {
      SM: 'h-8 text-sm',
      DEFAULT: 'h-9',
      LG: 'h-10 text-base'
    },
    AVATAR: {
      SM: 'h-8 w-8',
      DEFAULT: 'h-10 w-10',
      LG: 'h-12 w-12',
      XL: 'h-16 w-16'
    }
  }
} as const;

export const SIDEBAR_CONSTANTS = {
  COOKIE_NAME: 'sidebar:state',
  COOKIE_MAX_AGE: 60 * 60 * 24 * 7, // 7 days
  WIDTH: '16rem',
  WIDTH_MOBILE: '18rem',
  WIDTH_ICON: '3rem',
  KEYBOARD_SHORTCUT: 'b'
} as const;
