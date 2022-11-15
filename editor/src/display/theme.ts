/**
 * Electromatic - Web Editor
 * 
 * Copyright 2022 Chris Pikul. Licensed under GNU General Public License 3.0.
 * -----------------------------------------------------------------------------
 * 
 * Theme provides the colors and styling for the entire canvas.
 */

export const ThemeKeys:Record<string, string> = {
    HIGH_CONTRAST: 'high-contrast',
} as const;
export type EThemeID = typeof ThemeKeys[keyof typeof ThemeKeys];

export interface ThemeGrid {
    lineMinorColor:string;
    lineMinorWidth:number;

    lineMajorColor:string;
    lineMajorWidth:number;
};

export interface Theme {
    id:EThemeID;

    backgroundColor:string;

    grid:ThemeGrid;
};

const ThemeHighContrast:Theme = {
    id: ThemeKeys.HIGH_CONTRAST,

    backgroundColor: 'black',

    grid: {
        lineMinorColor: '#555',
        lineMinorWidth: 1,
        lineMajorColor: '#888',
        lineMajorWidth: 2,
    },
};

export const Themes:Record<EThemeID, Theme> = {
    [ThemeKeys.HIGH_CONTRAST]: ThemeHighContrast,
};
export default Themes;

export const DefaultThemeID:EThemeID = ThemeKeys.HIGH_CONTRAST;
