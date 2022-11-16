/**
 * Electromatic - Web Editor
 * 
 * Copyright 2022 Chris Pikul. Licensed under GNU General Public License 3.0.
 * -----------------------------------------------------------------------------
 * 
 * Provides a location based vector
 */
import { Point } from './Point';
import type { IPoint } from './Point';

import { Size } from './Size';
import type { ISize } from './Size';

export interface IRect extends IPoint, ISize {}

export class Rect implements IRect, IPoint, ISize {
    readonly x:number;
    readonly y:number;
    readonly width:number;
    readonly height:number;

    constructor(arg0?:(number|IPoint|ISize|IRect), arg1?:(number|IPoint|ISize), arg2?:number, arg3?:number) {
        // Bind methods
        for(const prop in this) {
            if(typeof this[prop] === 'function' && prop !== 'constructor')
                this[prop] = (this[prop] as Function).bind(this);
        }

        // Satisfy defaults
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;

        // Initialize by arguments
        if(arguments.length > 0) {
            switch(arguments.length) {
                case 1:
                    // Single argument should be rect copy

                    if(!arg0)
                        break;
                    
                    if(typeof arg0 === 'number')
                        throw new TypeError(`Rect must be constructed with at least 2 numbers`);
                    
                    if(typeof (arg0 as any).x === 'number')
                        this.x = (arg0 as any).x;
                    if(typeof (arg0 as any).y === 'number')
                        this.y = (arg0 as any).y;
                    if(typeof (arg0 as any).width === 'number')
                        this.width = (arg0 as any).width;
                    if(typeof (arg0 as any).height === 'number')
                        this.height = (arg0 as any).height;

                    break;
                case 2:
                    // Two arguments can be (Point,Size) | (number,number)
                    if(!arg0 || !arg1)
                        break;

                    if(typeof arg0 === 'number') {
                        this.x = arg0;
                        this.y = arg0;
                    } else {
                        if(typeof (arg0 as any).x === 'number')
                            this.x = (arg0 as any).x;
                        if(typeof (arg0 as any).y === 'number')
                            this.y = (arg0 as any).y;
                        if(typeof (arg0 as any).width === 'number')
                            this.x = (arg0 as any).width;
                        if(typeof (arg0 as any).height === 'number')
                            this.y = (arg0 as any).height;
                    }

                    if(typeof arg1 === 'number') {
                        this.width = arg1;
                        this.height = arg1;
                    } else {
                        if(typeof (arg0 as any).x === 'number')
                            this.width = (arg0 as any).x;
                        if(typeof (arg0 as any).y === 'number')
                            this.height = (arg0 as any).y;
                        if(typeof (arg0 as any).width === 'number')
                            this.width = (arg0 as any).width;
                        if(typeof (arg0 as any).height === 'number')
                            this.height = (arg0 as any).height;
                    }

                    break;
                case 3:
                    // Three arguments can be (X,Y,Size) | (Point,Width,Height)
                    if(!arg0 || !arg1 || !arg2)
                        break;

                    if(typeof arg0 === 'number') {
                        this.x = arg0;
                    } else {
                        if(typeof (arg0 as any).x === 'number')
                            this.x = (arg0 as any).x;
                        if(typeof (arg0 as any).y === 'number')
                            this.y = (arg0 as any).y;
                        if(typeof (arg0 as any).width === 'number')
                            this.x = (arg0 as any).width;
                        if(typeof (arg0 as any).height === 'number')
                            this.y = (arg0 as any).height;
                    }

                    if(typeof arg1 === 'number') {
                        if(typeof arg0 === 'number')
                            this.y = arg1;
                        else {
                            this.width = arg1;
                            this.height = arg2;
                        }
                    } else
                        throw new TypeError(`Rect constructed with 3 arguments requires argument #2 to be a number`);

                    break;
                case 4:
                    // Four arguments is only (X,Y,Width,Height)
                    if(typeof arg0 === 'number')
                        this.x = arg0;
                    if(typeof arg1 === 'number')
                        this.y = arg1;
                    if(typeof arg2 === 'number')
                        this.width = arg2;
                    if(typeof arg3 === 'number')
                        this.height = arg3;

                    break;
            }
        }
    }

    get position():Point {
        return new Point(this.x, this.y);
    }

    get topLeftPoint():Point {
        return new Point(this.x, this.y);
    }

    get bottomRightPoint():Point {
        return new Point(this.x + this.width, this.y + this.height);
    }

    get size():Size {
        return new Size(this.width, this.height);
    }

    get extents():[Point, Point] {
        return [ this.topLeftPoint, this.bottomRightPoint ];
    }

    withPosition(arg0:(number|IPoint|Point), arg1?:number):Rect {
        const point = new Point(arg0, arg1);
        return new Rect(point.x, point.y, this.width, this.height);
    }

    withSize(arg0:(number|ISize|Size), arg1?:number):Rect {
        const size = new Size(arg0, arg1);
        return new Rect(this.x, this.y, size.width, size.height);
    }

    translate(arg0:(number|IPoint|Point), arg1?:number):Rect {
        const point = new Point(arg0, arg1);
        return new Rect(
            this.x + point.x,
            this.y + point.y,
            this.width,
            this.height,
        );
    }

    enlarge(arg0:(number|ISize|Size), arg1?:number):Rect {
        const size = new Size(arg0, arg1);
        return new Rect(
            this.x,
            this.y,
            this.width + size.width,
            this.height + size.height,
        );
    }

    scale(arg0:number, arg1?:number):Rect {
        return new Rect(
            this.x,
            this.y,
            this.width * (arg0 ?? arg1),
            this.height * (arg1 ?? arg0),
        );
    }

    abs():Rect {
        return this.map(Math.abs);
    }

    trunc():Rect {
        return this.map(Math.trunc);
    }

    toString():string {
        return `Rect(x=${this.x}, y=${this.y}, width=${this.width}, height=${this.height})`;
    }

    toArray():[number, number, number, number] {
        return [ this.x, this.y, this.width, this.height ];
    }

    map(cb:(val:number, ind:number, rect:Rect)=>number):Rect {
        return new Rect(
            cb(this.x, 0, this),
            cb(this.y, 1, this),
            cb(this.width, 2, this),
            cb(this.height, 3, this),
        );
    }

    public static fromPoints(a:Point, b:Point):Rect {
        return new Rect(
            Math.min(a.x, b.x),
            Math.min(a.y, b.y),
            Math.abs(a.x - b.x),
            Math.abs(a.y - b.y),
        );
    }
}
export default Rect;
