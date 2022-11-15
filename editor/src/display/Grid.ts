/**
 * Electromatic - Web Editor
 * 
 * Copyright 2022 Chris Pikul. Licensed under GNU General Public License 3.0.
 * -----------------------------------------------------------------------------
 * 
 * Provides an offscreen canvas for drawing the grid pattern to.
 */
import type { Theme } from './theme';
import type { View } from './utils';

export class Grid {
    #canvas:HTMLCanvasElement;
    #ctx:CanvasRenderingContext2D;

    #pattern?:CanvasPattern;

    #lastView?:View;
    #lastTheme?:Theme;

    constructor() {
        this.draw = this.draw.bind(this);
        this.checkDirty = this.checkDirty.bind(this);

        this.#canvas = document.createElement('canvas');
        this.#canvas.width = 128;
        this.#canvas.height = 128;

        const context = this.#canvas.getContext('2d');
        if(!context)
            throw new Error(`Failed to get 2d context for grid sub-canvas`);
        this.#ctx = context;
    }

    #renderPattern(theme:Theme, zoom:number = 1) {
        const MINOR_SPACING = 20;
        const MAJOR_SPACING = MINOR_SPACING * 5;

        const getClosestDivisible = (dim:number, spacing:number):number => (
            dim - (dim % spacing)
        );

        const size = (MAJOR_SPACING * 4) * zoom;
        this.#canvas.width = size;
        this.#canvas.height = size;

        const ctx = this.#ctx;
        const width = this.#canvas.width;
        const height = this.#canvas.height;

        ctx.fillStyle = theme.backgroundColor;
        ctx.fillRect(0, 0, width, height);

        // Draw minor lines
        ctx.beginPath();
        for(let x=0; x <= size; x += (MINOR_SPACING * zoom)) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
        }
        for(let y=0; y <= size; y+= (MINOR_SPACING * zoom)) {
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
        }
        ctx.lineWidth = theme.grid.lineMinorWidth;
        ctx.strokeStyle = theme.grid.lineMinorColor;
        ctx.stroke();

        // Draw major lines
        ctx.beginPath();
        for(let x=0; x <= size; x += (MAJOR_SPACING * zoom)) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
        }
        for(let y=0; y <= size; y+= (MAJOR_SPACING * zoom)) {
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
        }
        ctx.lineWidth = theme.grid.lineMajorWidth;
        ctx.strokeStyle = theme.grid.lineMajorColor;
        ctx.stroke();

        const pattern = ctx.createPattern(this.#canvas, 'repeat');
        if(!pattern) 
            return console.error(`Failed to create grid pattern`);
        this.#pattern = pattern;

        console.info('rendered grid pattern', width, height);
    }

    draw(ctx:CanvasRenderingContext2D, view:View, theme:Theme) {
        if(this.checkDirty(view, theme))
            this.#renderPattern(theme, view.zoom);

        if(!this.#pattern)
            return;

        ctx.fillStyle = this.#pattern;
        ctx.fillRect(0, 0, view.width, view.height);
    }

    private checkDirty(view:View, theme:Theme):boolean {
        if(!this.#pattern)
            return true;
        let dirty = false;

        if(this.#lastView) {
            dirty ||= (view.zoom !== this.#lastView.zoom) ||
                (view.x !== this.#lastView.x) ||
                (view.y !== this.#lastView.y);
        }
        this.#lastView = view;

        if(this.#lastTheme) {
            dirty ||= Object.is(this.#lastTheme, theme);
        }
        this.#lastTheme = theme;

        return dirty;
    }
};
export default Grid;