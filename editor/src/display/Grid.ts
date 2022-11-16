/**
 * Electromatic - Web Editor
 * 
 * Copyright 2022 Chris Pikul. Licensed under GNU General Public License 3.0.
 * -----------------------------------------------------------------------------
 * 
 * Provides an offscreen canvas for drawing the grid pattern to.
 */
import type { Theme } from './theme';
import { Rect } from './vectors';

export class Grid {
    #canvas:HTMLCanvasElement;
    #ctx:CanvasRenderingContext2D;

    #pattern?:CanvasPattern;

    #lastZoom?:number;
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
    }

    draw(ctx:CanvasRenderingContext2D, view:Rect, zoom:number, theme:Theme) {
        if(this.checkDirty(zoom, theme))
            this.#renderPattern(theme, zoom);

        if(!this.#pattern)
            return;

        const transform = new DOMMatrix();
        transform.translateSelf(-view.x, -view.y);
        this.#pattern.setTransform(transform);

        ctx.fillStyle = this.#pattern;
        ctx.fillRect(0, 0, view.width, view.height);
    }

    private checkDirty(zoom:number, theme:Theme):boolean {
        if(!this.#pattern)
            return true;
        let dirty = false;

        if(this.#lastZoom) {
            dirty ||= (zoom !== this.#lastZoom);
        }
        this.#lastZoom = zoom;

        if(this.#lastTheme) {
            dirty ||= Object.is(this.#lastTheme, theme);
        }
        this.#lastTheme = theme;

        return dirty;
    }
};
export default Grid;