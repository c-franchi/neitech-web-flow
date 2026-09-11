const loadedFonts = new Set<string>();

export function loadGoogleFont(fontFamily: string) {
  if (!fontFamily) return;
  // Extract font name from CSS font-family value like "'Poppins', sans-serif"
  const match = fontFamily.match(/^'([^']+)'/);
  const fontName = match ? match[1] : fontFamily;
  if (loadedFonts.has(fontName)) return;
  loadedFonts.add(fontName);

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@300;400;500;600;700;800&display=swap`;
  document.head.appendChild(link);
}

export function loadSectionFonts(styles?: { fontFamily?: string; headingFontFamily?: string }) {
  if (!styles) return;
  if (styles.fontFamily) loadGoogleFont(styles.fontFamily);
  if (styles.headingFontFamily) loadGoogleFont(styles.headingFontFamily);
}
