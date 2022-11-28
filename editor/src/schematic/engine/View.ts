/**
 * Electromatic - Web Editor
 * 
 * Copyright 2022 Chris Pikul. Licensed under GNU General Public License 3.0.
 * -----------------------------------------------------------------------------
 * 
 * View utility class for the viewport dimensions
 */
import { Rect } from './vectors/Rect';
import type { IRect } from './vectors/Rect';
import type { ISize } from './vectors/Size';
import type { IPoint } from './vectors/Point';

export interface IView extends IRect {
    zoom:number;    
}

export class View extends Rect implements IView {
    readonly zoom:number;

    constructor(arg0?:(number|IPoint|ISize|IRect|IView), arg1?:(number|IPoint|ISize), arg2?:number, arg3?:number, arg4?:number) {
        super(arg0, arg1, arg2, arg3);

        // Satisfy defaults
        this.zoom = 1;

        // Initialize by arguments
        if(arg0 && typeof (arg0 as any).zoom === 'number')
            this.zoom = (arg0 as any).zoom;
        if(typeof arg4 === 'number')
            this.zoom = arg4;
        else if(arguments.length === 3 && typeof arg0 === 'object' && typeof arg1 === 'object' && typeof arg2 === 'number')
            this.zoom = arg2;
    }

    get inverseZoom():number {
        return 1 / this.zoom;
    }

    public readonly setZoom = (factor:number):Rect => {
        return new Rect(
            this.position,
            this.size,
            factor,
        );
    }

    public readonly increaseZoom = (amount:number):Rect => {
        return new Rect(
            this.position,
            this.size,
            this.zoom + amount,
        );
    }
}
export default View;
