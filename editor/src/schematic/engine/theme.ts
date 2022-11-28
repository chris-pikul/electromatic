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

    showDocumentAxis:boolean;
    documentAxisWidth:number;
    documentAxisColor:string;

    grid:ThemeGrid;

    showMouseCrosshair:boolean;
    mouseCrosshairColor:string;

    boxSelectBorderWidth:number;
    boxSelectBorderColor:string;
    boxSelectFillColor:string;
};

const ThemeHighContrast:Theme = {
    id: ThemeKeys.HIGH_CONTRAST,

    backgroundColor: 'black',

    showDocumentAxis: true,
    documentAxisWidth: 2,
    documentAxisColor: '#FFF',

    grid: {
        lineMinorColor: '#333',
        lineMinorWidth: 1,
        lineMajorColor: '#555',
        lineMajorWidth: 2,
    },

    showMouseCrosshair: true,
    mouseCrosshairColor: '#0000FF',

    boxSelectBorderWidth: 1,
    boxSelectBorderColor: '#FF00FF',
    boxSelectFillColor: 'rgba(255, 0, 255, 0.1)',
};

export const Themes:Record<EThemeID, Theme> = {
    [ThemeKeys.HIGH_CONTRAST]: ThemeHighContrast,
};
export default Themes;

export const DefaultThemeID:EThemeID = ThemeKeys.HIGH_CONTRAST;
