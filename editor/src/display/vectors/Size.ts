/**
 * Electromatic - Web Editor
 * 
 * Copyright 2022 Chris Pikul. Licensed under GNU General Public License 3.0.
 * -----------------------------------------------------------------------------
 * 
 * Provides a size based vector
 */

export interface ISize {
    width:number;
    height:number;
}

export class Size implements ISize {
    readonly width:number;
    readonly height:number;

    constructor(arg0?:(number|ISize|Size), arg1?:(number)) {
        // Bind methods
        for(const prop in this) {
            if(typeof this[prop] === 'function' && prop !== 'constructor')
                this[prop] = (this[prop] as Function).bind(this);
        }

        // Satisfy defaults
        this.width = 0;
        this.height = 0;

        // Initialize by arguments
        if(typeof arg0 !== 'undefined') {
            if(typeof arg0 === 'number') {
                this.width = arg0;
                this.height = arg0;
            } else {
                if(typeof arg0.width === 'number')
                    this.width = arg0.width;
                if(typeof arg0.height === 'number')
                    this.height = arg0.height;
            }

            if(typeof arg1 === 'number')
                this.height = arg1;
        }
    }

    add(arg0:(number|ISize|Size), arg1?:number):Size {
        const pnt = new Size(arg0, arg1);
        return new Size(this.width + pnt.width, this.height + pnt.height);
    }

    subtract(arg0:(number|ISize|Size), arg1?:number):Size {
        const pnt = new Size(arg0, arg1);
        return new Size(this.width - pnt.width, this.height - pnt.height);
    }

    multiply(arg0:(number|ISize|Size), arg1?:number):Size {
        const pnt = new Size(arg0, arg1);
        return new Size(this.width * pnt.width, this.height * pnt.height);
    }

    divide(arg0:(number|ISize|Size), arg1?:number):Size {
        const pnt = new Size(arg0, arg1);
        return new Size(this.width / pnt.width, this.height / pnt.height);
    }

    invert():Size {
        return new Size(-this.width, -this.height);
    }

    min(arg0:(number|ISize|Size), arg1?:number):Size {
        const pnt = new Size(arg0, arg1);
        return new Size(Math.min(this.width, pnt.width), Math.min(this.height, pnt.height));
    }

    max(arg0:(number|ISize|Size), arg1?:number):Size {
        const pnt = new Size(arg0, arg1);
        return new Size(Math.max(this.width, pnt.width), Math.max(this.height, pnt.height));
    }

    abs():Size {
        return new Size(Math.abs(this.width), Math.abs(this.height));
    }

    trunc():Size {
        return new Size(Math.trunc(this.width), Math.trunc(this.height));
    }

    toArray():[number, number] {
        return [ this.width, this.height ];
    }

    map(cb:(val:number, ind:number, size:Size)=>number):Size {
        return new Size(
            cb(this.width, 0, this),
            cb(this.height, 1, this),
        );
    }
}
export default Size;
