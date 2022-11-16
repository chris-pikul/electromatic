/**
 * Electromatic - Web Editor
 * 
 * Copyright 2022 Chris Pikul. Licensed under GNU General Public License 3.0.
 * -----------------------------------------------------------------------------
 * 
 * Provides a location based vector
 */

 export interface IPoint {
    x:number;
    y:number;
}

export class Point implements IPoint {
    readonly x:number;
    readonly y:number;

    constructor(arg0?:(number|IPoint|Point), arg1?:(number)) {
        // Bind methods
        for(const prop in this) {
            if(typeof this[prop] === 'function' && prop !== 'constructor')
                this[prop] = (this[prop] as Function).bind(this);
        }

        // Satisfy defaults
        this.x = 0;
        this.y = 0;

        // Initialize by arguments
        if(typeof arg0 !== 'undefined') {
            if(typeof arg0 === 'number') {
                this.x = arg0;
                this.y = arg0;
            } else {
                if(typeof arg0.x === 'number')
                    this.x = arg0.x;
                if(typeof arg0.y === 'number')
                    this.y = arg0.y;
            }

            if(typeof arg1 === 'number')
                this.y = arg1;
        }
    }

    add(arg0:(number|IPoint|Point), arg1?:number):Point {
        const pnt = new Point(arg0, arg1);
        return new Point(this.x + pnt.x, this.y + pnt.y);
    }

    subtract(arg0:(number|IPoint|Point), arg1?:number):Point {
        const pnt = new Point(arg0, arg1);
        return new Point(this.x - pnt.x, this.y - pnt.y);
    }

    multiply(arg0:(number|IPoint|Point), arg1?:number):Point {
        const pnt = new Point(arg0, arg1);
        return new Point(this.x * pnt.x, this.y * pnt.y);
    }

    divide(arg0:(number|IPoint|Point), arg1?:number):Point {
        const pnt = new Point(arg0, arg1);
        return new Point(this.x / pnt.x, this.y / pnt.y);
    }

    invert():Point {
        return new Point(-this.x, -this.y);
    }

    min(arg0:(number|IPoint|Point), arg1?:number):Point {
        const pnt = new Point(arg0, arg1);
        return new Point(Math.min(this.x, pnt.x), Math.min(this.y, pnt.y));
    }

    max(arg0:(number|IPoint|Point), arg1?:number):Point {
        const pnt = new Point(arg0, arg1);
        return new Point(Math.max(this.x, pnt.x), Math.max(this.y, pnt.y));
    }

    abs():Point {
        return new Point(Math.abs(this.x), Math.abs(this.y));
    }

    trunc():Point {
        return new Point(Math.trunc(this.x), Math.trunc(this.y));
    }

    toString():string {
        return `Point(${this.x}, ${this.y})`;
    }

    toArray():[number, number] {
        return [ this.x, this.y ];
    }

    map(cb:(val:number, ind:number, pnt:Point)=>number):Point {
        return new Point(
            cb(this.x, 0, this),
            cb(this.y, 1, this),
        );
    }
}
export default Point;
