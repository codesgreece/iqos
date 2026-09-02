import type { SiteSettingsData } from "@/lib/settings";

interface ThemeProviderProps {
  appearance: SiteSettingsData["appearance"];
  children: React.ReactNode;
}

export function ThemeProvider({ appearance, children }: ThemeProviderProps) {
  const cssVars = `
    :root {
      --background: ${appearance.background};
      --surface: ${appearance.surface};
      --amethyst: ${appearance.amethyst};
      --violet: ${appearance.violet};
      --lavender: ${appearance.lavender};
      --white: ${appearance.white};
      --muted: ${appearance.muted};
      --border: ${appearance.borderColor};
      --border-hover: ${appearance.borderHover};
      --card-radius: ${appearance.cardRadius};
      --button-radius: ${appearance.buttonRadius};
    }
    ${appearance.customCss}
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssVars }} />
      {children}
    </>
  );
}
