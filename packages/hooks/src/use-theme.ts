import { useEffect } from 'react';

// Assuming these types align with what is defined in shared package or similar structure
interface ThemeColors {
  brand50?: string;
  brand500?: string;
  brand900?: string;
  surface?: string;
  surfaceElevated?: string;
  textPrimary?: string;
  textSecondary?: string;
}

interface ThemeTypography {
  display?: string;
  body?: string;
}

interface ThemeBorders {
  cardRadius?: string;
  buttonRadius?: string;
}

export interface ThemeConfig {
  colors: ThemeColors;
  typography: ThemeTypography;
  borders: ThemeBorders;
}

export function useTheme(theme: ThemeConfig | null | undefined) {
  useEffect(() => {
    if (!theme) return;
    
    const root = document.documentElement;
    
    // Colors
    if (theme.colors.brand50) root.style.setProperty('--restaurant-brand-50', theme.colors.brand50);
    if (theme.colors.brand500) root.style.setProperty('--restaurant-brand-500', theme.colors.brand500);
    if (theme.colors.brand900) root.style.setProperty('--restaurant-brand-900', theme.colors.brand900);
    if (theme.colors.surface) root.style.setProperty('--restaurant-surface', theme.colors.surface);
    if (theme.colors.surfaceElevated) root.style.setProperty('--restaurant-surface-elevated', theme.colors.surfaceElevated);
    if (theme.colors.textPrimary) root.style.setProperty('--restaurant-text-primary', theme.colors.textPrimary);
    if (theme.colors.textSecondary) root.style.setProperty('--restaurant-text-secondary', theme.colors.textSecondary);
    
    // Typography
    if (theme.typography.display) root.style.setProperty('--restaurant-font-display', theme.typography.display);
    if (theme.typography.body) root.style.setProperty('--restaurant-font-body', theme.typography.body);
    
    // Borders
    if (theme.borders.cardRadius) root.style.setProperty('--restaurant-radius-card', theme.borders.cardRadius);
    if (theme.borders.buttonRadius) root.style.setProperty('--restaurant-radius-button', theme.borders.buttonRadius);
    
  }, [theme]);
}
