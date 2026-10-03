// Theme Generator - Streak-Based 9 Theme System
// All themes mapped to flame colors (Dead → Black progression)
// 
// Flame Progression:
// 0 days: Dead/Brown → Graphite
// 1-100: Red → Elegant Luxury
// 101-200: Orange → Amber Minimal
// 201-300: Yellow → Doom 64
// 301-400: Green → Nature
// 401-500: White → Vercel
// 501-600: Blue → Bold Tech
// 601-700: Violet → Quantum Rose
// 701+: Black → Mono

export interface Theme {
  name: string;
  fontFamily: string;
  fontName: string;
  fontUrl: string;
  radius: string;
  letterSpacing: string;
  flameColor: string;
  colors: {
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    popover: string;
    popoverForeground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    destructive: string;
    destructiveForeground: string;
    border: string;
    input: string;
    ring: string;
    chart1: string;
    chart2: string;
    chart3: string;
    chart4: string;
    chart5: string;
  };
}

// 9 themes mapped to flame progression (tweakcn.com sources)
const themes: Theme[] = [
  // THEME 1: Graphite (0 days - Dead Flame)
  {
    name: 'Graphite',
    fontFamily: 'Inter, Georgia, "Fira Code", sans-serif',
    fontName: 'Inter',
    fontUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Fira+Code:wght@300;400;500;600;700&display=swap',
    radius: '0.5rem',
    letterSpacing: '0em',
    flameColor: '#4a0000',
    colors: {
      background: 'oklch(0.2178 0 0)',
      foreground: 'oklch(0.8853 0 0)',
      card: 'oklch(0.2435 0 0)',
      cardForeground: 'oklch(0.8853 0 0)',
      popover: 'oklch(0.2435 0 0)',
      popoverForeground: 'oklch(0.8853 0 0)',
      primary: 'oklch(0.7058 0 0)',
      primaryForeground: 'oklch(0.2178 0 0)',
      secondary: 'oklch(0.3092 0 0)',
      secondaryForeground: 'oklch(0.8853 0 0)',
      muted: 'oklch(0.2850 0 0)',
      mutedForeground: 'oklch(0.5999 0 0)',
      accent: 'oklch(0.3715 0 0)',
      accentForeground: 'oklch(0.8853 0 0)',
      destructive: 'oklch(0.6591 0.1530 22.1703)',
      destructiveForeground: 'oklch(1.0000 0 0)',
      border: 'oklch(0.3290 0 0)',
      input: 'oklch(0.3092 0 0)',
      ring: 'oklch(0.7058 0 0)',
      chart1: 'oklch(0.7058 0 0)',
      chart2: 'oklch(0.6714 0.0339 206.3482)',
      chart3: 'oklch(0.5452 0 0)',
      chart4: 'oklch(0.4604 0 0)',
      chart5: 'oklch(0.3715 0 0)'
    }
  },
  // THEME 2: Elegant Luxury (1-100 days - Red Flame)
  {
    name: 'Elegant Luxury',
    fontFamily: 'Poppins, "Libre Baskerville", "IBM Plex Mono", sans-serif',
    fontName: 'Poppins',
    fontUrl: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Libre+Baskerville:wght@400;700&family=IBM+Plex+Mono:wght@300;400;500;600;700&display=swap',
    radius: '0.75rem',
    letterSpacing: '0em',
    flameColor: '#DC143C',
    colors: {
      background: 'oklch(0.1804 0.0079 294.1931)',
      foreground: 'oklch(0.9804 0.0079 294.1931)',
      card: 'oklch(0.2304 0.0157 298.7942)',
      cardForeground: 'oklch(0.9804 0.0079 294.1931)',
      popover: 'oklch(0.2304 0.0157 298.7942)',
      popoverForeground: 'oklch(0.9804 0.0079 294.1931)',
      primary: 'oklch(0.4549 0.1765 319.9839)',
      primaryForeground: 'oklch(0.9804 0.0079 294.1931)',
      secondary: 'oklch(0.2804 0.0157 298.7942)',
      secondaryForeground: 'oklch(0.9804 0.0079 294.1931)',
      muted: 'oklch(0.2554 0.0118 298.7942)',
      mutedForeground: 'oklch(0.7176 0.0118 298.7942)',
      accent: 'oklch(0.3304 0.0235 298.7942)',
      accentForeground: 'oklch(0.9804 0.0079 294.1931)',
      destructive: 'oklch(0.6063 0.2270 23.8836)',
      destructiveForeground: 'oklch(0.9804 0.0079 294.1931)',
      border: 'oklch(0.3554 0.0118 298.7942)',
      input: 'oklch(0.3554 0.0118 298.7942)',
      ring: 'oklch(0.4549 0.1765 319.9839)',
      chart1: 'oklch(0.6863 0.1490 319.9839)',
      chart2: 'oklch(0.7843 0.1098 319.9839)',
      chart3: 'oklch(0.5882 0.1843 319.9839)',
      chart4: 'oklch(0.4902 0.2020 319.9839)',
      chart5: 'oklch(0.3922 0.2157 319.9839)'
    }
  },
  // THEME 3: Amber Minimal (101-200 days - Orange Flame)
  {
    name: 'Amber Minimal',
    fontFamily: 'Inter, "Source Serif 4", "JetBrains Mono", sans-serif',
    fontName: 'Inter',
    fontUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Source+Serif+4:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500;600;700;800&display=swap',
    radius: '0.5rem',
    letterSpacing: '0em',
    flameColor: '#FF6347',
    colors: {
      background: 'oklch(0.1804 0.0079 94.1931)',
      foreground: 'oklch(0.9804 0.0079 94.1931)',
      card: 'oklch(0.2304 0.0118 48.7942)',
      cardForeground: 'oklch(0.9804 0.0079 94.1931)',
      popover: 'oklch(0.2304 0.0118 48.7942)',
      popoverForeground: 'oklch(0.9804 0.0079 94.1931)',
      primary: 'oklch(0.5529 0.1620 53.3305)',
      primaryForeground: 'oklch(0.9804 0.0079 94.1931)',
      secondary: 'oklch(0.2804 0.0118 48.7942)',
      secondaryForeground: 'oklch(0.9804 0.0079 94.1931)',
      muted: 'oklch(0.2554 0.0079 48.7942)',
      mutedForeground: 'oklch(0.7294 0.0118 48.7942)',
      accent: 'oklch(0.3304 0.0118 48.7942)',
      accentForeground: 'oklch(0.9804 0.0079 94.1931)',
      destructive: 'oklch(0.6063 0.2270 23.8836)',
      destructiveForeground: 'oklch(0.9804 0.0079 94.1931)',
      border: 'oklch(0.3554 0.0079 48.7942)',
      input: 'oklch(0.3554 0.0079 48.7942)',
      ring: 'oklch(0.5529 0.1620 53.3305)',
      chart1: 'oklch(0.7137 0.1296 53.3305)',
      chart2: 'oklch(0.8039 0.0972 53.3305)',
      chart3: 'oklch(0.6235 0.1620 53.3305)',
      chart4: 'oklch(0.5333 0.1944 53.3305)',
      chart5: 'oklch(0.4431 0.2268 53.3305)'
    }
  },
  // THEME 4: Doom 64 (201-300 days - Yellow Flame)
  {
    name: 'Doom 64',
    fontFamily: 'Oxanium, "Source Code Pro", sans-serif',
    fontName: 'Oxanium',
    fontUrl: 'https://fonts.googleapis.com/css2?family=Oxanium:wght@300;400;500;600;700;800&family=Source+Code+Pro:wght@300;400;500;600;700;800&display=swap',
    radius: '0px',
    letterSpacing: '0em',
    flameColor: '#FFA500',
    colors: {
      background: 'oklch(0.2178 0 0)',
      foreground: 'oklch(0.9067 0 0)',
      card: 'oklch(0.2850 0 0)',
      cardForeground: 'oklch(0.9067 0 0)',
      popover: 'oklch(0.2850 0 0)',
      popoverForeground: 'oklch(0.9067 0 0)',
      primary: 'oklch(0.6083 0.2090 27.0276)',
      primaryForeground: 'oklch(1.0000 0 0)',
      secondary: 'oklch(0.6423 0.1467 133.0145)',
      secondaryForeground: 'oklch(0 0 0)',
      muted: 'oklch(0.2645 0 0)',
      mutedForeground: 'oklch(0.7058 0 0)',
      accent: 'oklch(0.7482 0.1235 244.7492)',
      accentForeground: 'oklch(0 0 0)',
      destructive: 'oklch(0.7839 0.1719 68.0943)',
      destructiveForeground: 'oklch(0 0 0)',
      border: 'oklch(0.4091 0 0)',
      input: 'oklch(0.4091 0 0)',
      ring: 'oklch(0.6083 0.2090 27.0276)',
      chart1: 'oklch(0.6083 0.2090 27.0276)',
      chart2: 'oklch(0.6423 0.1467 133.0145)',
      chart3: 'oklch(0.7482 0.1235 244.7492)',
      chart4: 'oklch(0.7839 0.1719 68.0943)',
      chart5: 'oklch(0.6471 0.0334 40.7963)'
    }
  },
  // THEME 5: Nature (301-400 days - Green Flame)
  {
    name: 'Nature',
    fontFamily: 'Montserrat, sans-serif',
    fontName: 'Montserrat',
    fontUrl: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap',
    radius: '0.5rem',
    letterSpacing: '0em',
    flameColor: '#9ACD32',
    colors: {
      background: 'oklch(0.2683 0.0279 150.7681)',
      foreground: 'oklch(0.9423 0.0097 72.6595)',
      card: 'oklch(0.3327 0.0271 146.9867)',
      cardForeground: 'oklch(0.9423 0.0097 72.6595)',
      popover: 'oklch(0.3327 0.0271 146.9867)',
      popoverForeground: 'oklch(0.9423 0.0097 72.6595)',
      primary: 'oklch(0.6731 0.1624 144.2083)',
      primaryForeground: 'oklch(0.2157 0.0453 145.7256)',
      secondary: 'oklch(0.3942 0.0265 142.9926)',
      secondaryForeground: 'oklch(0.8970 0.0166 142.5518)',
      muted: 'oklch(0.2926 0.0212 147.7496)',
      mutedForeground: 'oklch(0.8579 0.0174 76.0955)',
      accent: 'oklch(0.5752 0.1446 144.1813)',
      accentForeground: 'oklch(0.9423 0.0097 72.6595)',
      destructive: 'oklch(0.5386 0.1937 26.7249)',
      destructiveForeground: 'oklch(0.9423 0.0097 72.6595)',
      border: 'oklch(0.3942 0.0265 142.9926)',
      input: 'oklch(0.3942 0.0265 142.9926)',
      ring: 'oklch(0.6731 0.1624 144.2083)',
      chart1: 'oklch(0.7660 0.1179 145.2950)',
      chart2: 'oklch(0.7185 0.1417 144.8887)',
      chart3: 'oklch(0.6731 0.1624 144.2083)',
      chart4: 'oklch(0.6291 0.1543 144.2031)',
      chart5: 'oklch(0.5752 0.1446 144.1813)'
    }
  },
  // THEME 6: Vercel (401-500 days - White Flame)
  {
    name: 'Vercel',
    fontFamily: '"Geist Sans", Georgia, "Geist Mono", sans-serif',
    fontName: 'Geist Sans',
    fontUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap', // Using Inter as Geist fallback
    radius: '0.5rem',
    letterSpacing: '-0.02em',
    flameColor: '#F0F8FF',
    colors: {
      background: 'oklch(0.1500 0 0)',
      foreground: 'oklch(0.9804 0 0)',
      card: 'oklch(0.1800 0 0)',
      cardForeground: 'oklch(0.9804 0 0)',
      popover: 'oklch(0.1800 0 0)',
      popoverForeground: 'oklch(0.9804 0 0)',
      primary: 'oklch(0.9804 0 0)',
      primaryForeground: 'oklch(0.0980 0 0)',
      secondary: 'oklch(0.2500 0 0)',
      secondaryForeground: 'oklch(0.9804 0 0)',
      muted: 'oklch(0.2200 0 0)',
      mutedForeground: 'oklch(0.7000 0 0)',
      accent: 'oklch(0.2800 0 0)',
      accentForeground: 'oklch(0.9804 0 0)',
      destructive: 'oklch(0.5922 0.2441 27.3249)',
      destructiveForeground: 'oklch(0.9804 0 0)',
      border: 'oklch(0.2500 0 0)',
      input: 'oklch(0.2500 0 0)',
      ring: 'oklch(0.9804 0 0)',
      chart1: 'oklch(0.9000 0 0)',
      chart2: 'oklch(0.7500 0 0)',
      chart3: 'oklch(0.6000 0 0)',
      chart4: 'oklch(0.4500 0 0)',
      chart5: 'oklch(0.3000 0 0)'
    }
  },
  // THEME 7: Bold Tech (501-600 days - Blue Flame) - Reuse Bold Tech
  {
    name: 'Bold Tech',
    fontFamily: 'Roboto, sans-serif',
    fontName: 'Roboto',
    fontUrl: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap',
    radius: '0.625rem',
    letterSpacing: '0em',
    flameColor: '#1E90FF',
    colors: {
      background: 'oklch(0.2077 0.0398 265.7549)',
      foreground: 'oklch(0.9299 0.0334 272.7879)',
      card: 'oklch(0.2573 0.0861 281.2883)',
      cardForeground: 'oklch(0.9299 0.0334 272.7879)',
      popover: 'oklch(0.2573 0.0861 281.2883)',
      popoverForeground: 'oklch(0.9299 0.0334 272.7879)',
      primary: 'oklch(0.6056 0.2189 292.7172)',
      primaryForeground: 'oklch(1.0000 0 0)',
      secondary: 'oklch(0.2573 0.0861 281.2883)',
      secondaryForeground: 'oklch(0.9299 0.0334 272.7879)',
      muted: 'oklch(0.2329 0.0919 279.1398)',
      mutedForeground: 'oklch(0.8112 0.1013 293.5712)',
      accent: 'oklch(0.4568 0.2146 277.0229)',
      accentForeground: 'oklch(0.9299 0.0334 272.7879)',
      destructive: 'oklch(0.6368 0.2078 25.3313)',
      destructiveForeground: 'oklch(1.0000 0 0)',
      border: 'oklch(0.2827 0.1351 291.0894)',
      input: 'oklch(0.2827 0.1351 291.0894)',
      ring: 'oklch(0.6056 0.2189 292.7172)',
      chart1: 'oklch(0.7090 0.1592 293.5412)',
      chart2: 'oklch(0.6056 0.2189 292.7172)',
      chart3: 'oklch(0.5413 0.2466 293.0090)',
      chart4: 'oklch(0.4907 0.2412 292.5809)',
      chart5: 'oklch(0.4320 0.2106 292.7591)'
    }
  },
  // THEME 8: Quantum Rose (601-700 days - Violet Flame)
  {
    name: 'Quantum Rose',
    fontFamily: 'Quicksand, sans-serif',
    fontName: 'Quicksand',
    fontUrl: 'https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap',
    radius: '0.5rem',
    letterSpacing: '0em',
    flameColor: '#8B00FF',
    colors: {
      background: 'oklch(0.1808 0.0535 313.7159)',
      foreground: 'oklch(0.8624 0.1307 326.6356)',
      card: 'oklch(0.2398 0.0661 313.2337)',
      cardForeground: 'oklch(0.8624 0.1307 326.6356)',
      popover: 'oklch(0.2398 0.0661 313.2337)',
      popoverForeground: 'oklch(0.8624 0.1307 326.6356)',
      primary: 'oklch(0.7543 0.2319 332.0212)',
      primaryForeground: 'oklch(0.1608 0.0493 327.5673)',
      secondary: 'oklch(0.3184 0.0915 319.6465)',
      secondaryForeground: 'oklch(0.8624 0.1307 326.6356)',
      muted: 'oklch(0.2701 0.0770 312.3525)',
      mutedForeground: 'oklch(0.7116 0.1623 327.1132)',
      accent: 'oklch(0.3558 0.1201 325.7655)',
      accentForeground: 'oklch(0.8624 0.1307 326.6356)',
      destructive: 'oklch(0.6539 0.2441 7.1740)',
      destructiveForeground: 'oklch(0.9821 0 0)',
      border: 'oklch(0.3280 0.1202 313.5393)',
      input: 'oklch(0.3184 0.0915 319.6465)',
      ring: 'oklch(0.7543 0.2319 332.0212)',
      chart1: 'oklch(0.7543 0.2319 332.0212)',
      chart2: 'oklch(0.6508 0.2159 317.6331)',
      chart3: 'oklch(0.6249 0.2233 292.7656)',
      chart4: 'oklch(0.6067 0.1649 278.7172)',
      chart5: 'oklch(0.6235 0.2019 268.0521)'
    }
  },
  // THEME 9: Mono (701+ days - Black Flame)
  {
    name: 'Mono',
    fontFamily: '"Geist Mono", monospace',
    fontName: 'Geist Mono',
    fontUrl: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700;800&display=swap', // Using JetBrains Mono as Geist Mono fallback
    radius: '0rem',
    letterSpacing: '0em',
    flameColor: '#1C1C1C',
    colors: {
      background: 'oklch(0.1000 0 0)',
      foreground: 'oklch(1.0000 0 0)',
      card: 'oklch(0.1200 0 0)',
      cardForeground: 'oklch(1.0000 0 0)',
      popover: 'oklch(0.1200 0 0)',
      popoverForeground: 'oklch(1.0000 0 0)',
      primary: 'oklch(1.0000 0 0)',
      primaryForeground: 'oklch(0.0000 0 0)',
      secondary: 'oklch(0.2000 0 0)',
      secondaryForeground: 'oklch(1.0000 0 0)',
      muted: 'oklch(0.1500 0 0)',
      mutedForeground: 'oklch(0.6000 0 0)',
      accent: 'oklch(0.2500 0 0)',
      accentForeground: 'oklch(1.0000 0 0)',
      destructive: 'oklch(0.3000 0 0)',
      destructiveForeground: 'oklch(1.0000 0 0)',
      border: 'oklch(0.2000 0 0)',
      input: 'oklch(0.2000 0 0)',
      ring: 'oklch(1.0000 0 0)',
      chart1: 'oklch(0.9000 0 0)',
      chart2: 'oklch(0.7000 0 0)',
      chart3: 'oklch(0.5000 0 0)',
      chart4: 'oklch(0.3000 0 0)',
      chart5: 'oklch(0.1500 0 0)'
    }
  }
];

// Map streak days to theme index (9 themes total)
function getThemeIndexByStreak(streakDays: number): number {
  if (streakDays === 0) return 0;        // Graphite (Dead)
  if (streakDays <= 100) return 1;       // Elegant Luxury (Red)
  if (streakDays <= 200) return 2;       // Amber Minimal (Orange)
  if (streakDays <= 300) return 3;       // Bold Tech (Yellow)
  if (streakDays <= 400) return 4;       // Nature (Green)
  if (streakDays <= 500) return 5;       // Vercel (White)
  if (streakDays <= 600) return 6;       // Bold Tech (Blue)
  if (streakDays <= 700) return 7;       // Quantum Rose (Violet)
  return 8;                               // Mono (Black)
}

// Get theme based on streak
export function getThemeByStreak(streakDays: number): Theme {
  return themes[getThemeIndexByStreak(streakDays)];
}

// Get a random theme from the 5 available
export function generateRandomTheme(): Theme {
  const randomIndex = Math.floor(Math.random() * themes.length);
  return themes[randomIndex];
}

// Load Google Font dynamically
function loadFont(fontUrl: string, fontName: string): void {
  // Check if font link already exists
  const existingLink = document.querySelector(`link[href="${fontUrl}"]`);
  if (existingLink) {
    console.log(`✅ Font already loaded: ${fontName}`);
    return;
  }

  // Create and append font link
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = fontUrl;
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
  console.log(`📥 Loading font: ${fontName} from ${fontUrl}`);
}

// Apply theme to the document
export function applyTheme(theme: Theme): void {
  const root = document.documentElement;

  // Load the font first
  loadFont(theme.fontUrl, theme.fontName);

  // Remove existing dynamic theme style if it exists
  const existingStyle = document.getElementById('dynamic-theme');
  if (existingStyle) {
    existingStyle.remove();
  }

  // Create a style element with high specificity for dark mode
  const styleEl = document.createElement('style');
  styleEl.id = 'dynamic-theme';
  styleEl.textContent = `
    .dark {
      --background: ${theme.colors.background} !important;
      --foreground: ${theme.colors.foreground} !important;
      --card: ${theme.colors.card} !important;
      --card-foreground: ${theme.colors.cardForeground} !important;
      --popover: ${theme.colors.popover} !important;
      --popover-foreground: ${theme.colors.popoverForeground} !important;
      --primary: ${theme.colors.primary} !important;
      --primary-foreground: ${theme.colors.primaryForeground} !important;
      --secondary: ${theme.colors.secondary} !important;
      --secondary-foreground: ${theme.colors.secondaryForeground} !important;
      --muted: ${theme.colors.muted} !important;
      --muted-foreground: ${theme.colors.mutedForeground} !important;
      --accent: ${theme.colors.accent} !important;
      --accent-foreground: ${theme.colors.accentForeground} !important;
      --destructive: ${theme.colors.destructive} !important;
      --destructive-foreground: ${theme.colors.destructiveForeground} !important;
      --border: ${theme.colors.border} !important;
      --input: ${theme.colors.input} !important;
      --ring: ${theme.colors.ring} !important;
      --chart-1: ${theme.colors.chart1} !important;
      --chart-2: ${theme.colors.chart2} !important;
      --chart-3: ${theme.colors.chart3} !important;
      --chart-4: ${theme.colors.chart4} !important;
      --chart-5: ${theme.colors.chart5} !important;
      --radius: ${theme.radius} !important;
      --font-family: ${theme.fontFamily} !important;
      --letter-spacing: ${theme.letterSpacing} !important;
    }
    
    body, body * {
      font-family: ${theme.fontFamily} !important;
      letter-spacing: ${theme.letterSpacing};
    }
  `;
  document.head.appendChild(styleEl);

  // Also apply to root for immediate effect
  root.style.setProperty('--background', theme.colors.background);
  root.style.setProperty('--foreground', theme.colors.foreground);
  root.style.setProperty('--card', theme.colors.card);
  root.style.setProperty('--card-foreground', theme.colors.cardForeground);
  root.style.setProperty('--popover', theme.colors.popover);
  root.style.setProperty('--popover-foreground', theme.colors.popoverForeground);
  root.style.setProperty('--primary', theme.colors.primary);
  root.style.setProperty('--primary-foreground', theme.colors.primaryForeground);
  root.style.setProperty('--secondary', theme.colors.secondary);
  root.style.setProperty('--secondary-foreground', theme.colors.secondaryForeground);
  root.style.setProperty('--muted', theme.colors.muted);
  root.style.setProperty('--muted-foreground', theme.colors.mutedForeground);
  root.style.setProperty('--accent', theme.colors.accent);
  root.style.setProperty('--accent-foreground', theme.colors.accentForeground);
  root.style.setProperty('--destructive', theme.colors.destructive);
  root.style.setProperty('--destructive-foreground', theme.colors.destructiveForeground);
  root.style.setProperty('--border', theme.colors.border);
  root.style.setProperty('--input', theme.colors.input);
  root.style.setProperty('--ring', theme.colors.ring);
  root.style.setProperty('--chart-1', theme.colors.chart1);
  root.style.setProperty('--chart-2', theme.colors.chart2);
  root.style.setProperty('--chart-3', theme.colors.chart3);
  root.style.setProperty('--chart-4', theme.colors.chart4);
  root.style.setProperty('--chart-5', theme.colors.chart5);
  root.style.setProperty('--radius', theme.radius);
  root.style.setProperty('--font-family', theme.fontFamily);
  root.style.setProperty('--letter-spacing', theme.letterSpacing);

  // Apply to body immediately with !important override
  document.body.style.setProperty('font-family', theme.fontFamily, 'important');
  document.body.style.letterSpacing = theme.letterSpacing;

  // Log theme change for debugging
  console.log(`🎨 Theme applied: ${theme.name} with ${theme.fontName} font`);
  console.log(`🔥 Colors: bg=${theme.colors.background}, primary=${theme.colors.primary}`);
  console.log(`📝 Font: ${theme.fontFamily}`);
}

// Refresh theme - generates and applies a new random theme
export function refreshTheme(): Theme {
  const newTheme = generateRandomTheme();
  applyTheme(newTheme);
  return newTheme;
}
