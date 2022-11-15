/**
 * Electromatic - Web Editor
 * 
 * Copyright 2022 Chris Pikul. Licensed under GNU General Public License 3.0.
 * -----------------------------------------------------------------------------
 * 
 * Provides the canvas rendering for the main schematic display.
 * 
 * This is agnostic of the front-end UI system (React).
 */
import { Themes, DefaultThemeID } from './theme';
import type { Theme, EThemeID } from './theme';

import { throttle, clamp } from './utils';
import type { Point, View, ViewProp } from './utils';

import Grid from './Grid';

const ActionTypes:Readonly<Array<string>> = [
    'move-left',
    'move-right',
    'move-up',
    'move-down',
    'zoom-in',
    'zoom-out',
    'mouse-move',
] as const;
type EActionType = typeof ActionTypes[number];

const ZOOM_MIN = 0.1;
const ZOOM_MAX = 5;
const ZOOM_SPEED = 0.1;
const ZOOM_KBD_SPEED = 0.01;

export class SchematicDisplay {
    public readonly parent:HTMLElement;
    public readonly canvas:HTMLCanvasElement;
    public readonly ctx:CanvasRenderingContext2D;

    #theme:Theme;
    #view:View;
    #dirty:boolean;
    #lastUpdate:number;
    #animHandle?:ReturnType<typeof requestAnimationFrame>;
    #actions:Set<EActionType>;

    #grid:Grid;
    #mouseOver:boolean;
    #mousePosition:Point;
    #mouseMoveStart?:Point;
    #mouseMoveOriginalView?:Point;

    constructor(parent:HTMLElement, themeID?:EThemeID) {
        this.destroy = this.destroy.bind(this);
        this.update = this.update.bind(this);
        this.draw = this.draw.bind(this);

        this.pushAction = this.pushAction.bind(this);
        this.removeAction = this.removeAction.bind(this);
        this.handleResize = throttle(this.handleResize, 250).bind(this);
        this.zoom = this.zoom.bind(this);

        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseWheel = this.onMouseWheel.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);

        this.parent = parent;

        const parentRect = parent.getBoundingClientRect();
        this.#view = {
            x: 0,
            y: 0,
            width: parentRect.width,
            height: parentRect.height,
            zoom: 1,
        };

        this.canvas = document.createElement('canvas');
        this.canvas.width = this.#view.width;
        this.canvas.height = this.#view.height;
        this.parent.appendChild(this.canvas);

        const context = this.canvas.getContext('2d', {
            alpha: false,
            desynchronized: true,
        });
        if(!context)
            throw new Error(`Failed to get context of newly created canvas for SchematicDisplay`);
        this.ctx = context;

        this.#theme = Themes[themeID ?? DefaultThemeID];

        this.#grid = new Grid();

        window.addEventListener('resize', this.handleResize);
        this.handleResize();

        this.canvas.addEventListener('mouseenter', this.onMouseEnter);
        this.canvas.addEventListener('mouseleave', this.onMouseLeave);

        this.#dirty = true;
        this.#lastUpdate = 0;
        this.#actions = new Set<EActionType>();

        this.#mouseOver = false;
        this.#mousePosition = { x: 0, y: 0 };

        this.update();
    }

    get theme():Theme {
        return { ...this.#theme };
    }

    set theme(theme:Theme) {
        this.#theme = {
            ...this.#theme,
            ...theme,
        };
    }

    get view():View {
        return { ...this.#view };
    }

    destroy() {
        console.log(`destroying schematic canvas`);

        if(this.#animHandle)
            window.cancelAnimationFrame(this.#animHandle);

        window.removeEventListener('resize', this.handleResize);
        this.canvas.removeEventListener('mouseenter', this.onMouseEnter);
        this.canvas.removeEventListener('mouseleave', this.onMouseLeave);

        this.onMouseLeave();
    }

    update() {
        const deltaTime = this.#lastUpdate > 0 ? Date.now() - this.#lastUpdate : 1;
        this.#lastUpdate = Date.now();
        
        if(this.#dirty || this.#actions.size) {
            this.#actions.forEach(action => {
                switch(action) {
                    case 'move-left':
                        this.#view.x -= deltaTime * 0.2;
                        break;
                    case 'move-right':
                        this.#view.x += deltaTime * 0.2;
                        break;
                    case 'move-up':
                        this.#view.y -= deltaTime * 0.2;
                        break;
                    case 'move-down':
                        this.#view.y += deltaTime * 0.2;
                        break;
                    case 'zoom-in':
                        this.zoom(deltaTime * ZOOM_KBD_SPEED);
                        break;
                    case 'zoom-out':
                        this.zoom(-(deltaTime * ZOOM_KBD_SPEED));
                        break;
                    case 'mouse-move':
                        if(!this.#mouseMoveStart || !this.#mouseMoveOriginalView)
                            break;
                        
                        this.#view.x = this.#mouseMoveOriginalView.x - (this.#mousePosition.x - this.#mouseMoveStart.x);
                        this.#view.y = this.#mouseMoveOriginalView.y - (this.#mousePosition.y - this.#mouseMoveStart.y);

                        break;
                }
            });

            this.draw();
            this.#dirty = false;
        }

        this.#animHandle = window.requestAnimationFrame(this.update);
    }

    draw() {
        this.#grid.draw(
            this.ctx,
            this.view,
            this.theme,
        );

        // Mouse axis
        if(this.#mouseOver && this.#theme.showMouseCrosshair) {
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = this.#theme.mouseCrosshairColor;

            this.ctx.beginPath();
            this.ctx.moveTo(this.#mousePosition.x, 0);
            this.ctx.lineTo(this.#mousePosition.x, this.#view.height);
            this.ctx.moveTo(0, this.#mousePosition.y);
            this.ctx.lineTo(this.#view.width, this.#mousePosition.y);
            this.ctx.stroke();
        }

        // Document axis
        if(this.#view.x <= 0 && this.#view.x >= -this.#view.width) {
            this.ctx.beginPath();
            this.ctx.moveTo(-this.#view.x, 0);
            this.ctx.lineTo(-this.#view.x, this.#view.height);
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = '#FF00FF';
            this.ctx.stroke();
        }
        if(this.#view.y <= 0 && this.#view.y >= -this.#view.height) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, -this.#view.y);
            this.ctx.lineTo(this.#view.width, -this.#view.y);
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = '#FF00FF';
            this.ctx.stroke();
        }
    }

    private pushAction(action:EActionType) {
        this.#actions.add(action);
    }

    private removeAction(action:EActionType) {
        this.#actions.delete(action);
    }

    private setViewProperty(prop:ViewProp, value:any) {
        this.#dirty = this.#view[prop] !== value;
        this.#view[prop] = value;
    }

    private handleResize() {
        const { width, height } = this.parent.getBoundingClientRect();

        this.#dirty = this.#dirty || (this.#view.width !== width || this.#view.height !== height);

        this.canvas.width = this.#view.width = width;
        this.canvas.height = this.#view.height = height;
    }

    private zoom(amount:number) {
        const oldZoom = this.#view.zoom;
        const actAmount = clamp(amount, -1, 1) * ZOOM_SPEED;
        const newZoom = clamp(oldZoom + actAmount, ZOOM_MIN, ZOOM_MAX);

        this.#view.zoom = newZoom;
        this.#dirty = true;

        // Calculate offset from mouse so it zooms centered on cursor
        const dx = (this.#view.x + this.#mousePosition.x) * actAmount;
        const dy = (this.#view.y + this.#mousePosition.y) * actAmount;

        this.#view.x += Math.trunc(dx);
        this.#view.y += Math.trunc(dy);

        console.log(`zoomed: amount=${actAmount}, zoom=${newZoom}, delta=${dx}, ${dy}`);
    }

    private onMouseEnter() {
        console.info('mouse entered schematic canvas');

        
        this.canvas.addEventListener('mousemove', this.onMouseMove);
        this.canvas.addEventListener('mousedown', this.onMouseDown);
        this.canvas.addEventListener('mouseup', this.onMouseUp);
        this.canvas.addEventListener('wheel', this.onMouseWheel);

        document.addEventListener('keydown', this.onKeyDown);
        document.addEventListener('keyup', this.onKeyUp);

        this.#mouseOver = true;
    }

    private onMouseLeave() {
        console.info('mouse left schematic canvas');

        this.canvas.removeEventListener('mousemove', this.onMouseMove);
        this.canvas.removeEventListener('mousedown', this.onMouseDown);
        this.canvas.removeEventListener('mouseup', this.onMouseUp);
        this.canvas.removeEventListener('wheel', this.onMouseWheel);

        document.removeEventListener('keydown', this.onKeyDown);
        document.removeEventListener('keyup', this.onKeyUp);

        this.#mouseOver = false;
    }

    private onMouseMove(evt:MouseEvent) {
        this.#mousePosition = {
            x: evt.offsetX,
            y: evt.offsetY,
        };

        this.#dirty = true;
    }

    private onMouseDown(evt:MouseEvent) {
        if(evt.button === 1) {
            if(!this.#actions.has('mouse-move')) {
                this.#mouseMoveStart = this.#mousePosition;
                this.#mouseMoveOriginalView = {
                    x: this.#view.x,
                    y: this.#view.y,
                };
                console.info('set starting mouse for move', this.#mouseMoveStart, this.#mouseMoveOriginalView);
            }
            this.pushAction('mouse-move');
            evt.preventDefault();
        }
    }

    private onMouseUp(evt:MouseEvent) {
        if(evt.button === 1) {
            this.removeAction('mouse-move');
            evt.preventDefault();
        }
    }

    private onMouseWheel(evt:WheelEvent) {
        this.zoom(-(evt.deltaY / 100));
    }

    private onKeyDown(evt:KeyboardEvent) {
        const { key } = evt;
        switch(key) {
            case 'ArrowLeft':
                this.pushAction('move-left');
                evt.preventDefault();
                break;
            case 'ArrowRight':
                this.pushAction('move-right');
                evt.preventDefault();
                break;
            case 'ArrowUp':
                this.pushAction('move-up');
                evt.preventDefault();
                break;
            case 'ArrowDown':
                this.pushAction('move-down');
                evt.preventDefault();
                break;
            case '+':
                this.pushAction('zoom-in');
                evt.preventDefault();
                break;
            case '-':
                this.pushAction('zoom-out');
                evt.preventDefault();
                break;
        }
        //console.log('key down', key);
    }

    private onKeyUp(evt:KeyboardEvent) {
        const { key } = evt;
        switch(key) {
            case 'ArrowLeft':
                this.removeAction('move-left');
                evt.preventDefault();
                break;
            case 'ArrowRight':
                this.removeAction('move-right');
                evt.preventDefault();
                break;
            case 'ArrowUp':
                this.removeAction('move-up');
                evt.preventDefault();
                break;
            case 'ArrowDown':
                this.removeAction('move-down');
                evt.preventDefault();
                break;
            case '+':
                this.removeAction('zoom-in');
                evt.preventDefault();
                break;
            case '-':
                this.removeAction('zoom-out');
                evt.preventDefault();
                break;
            case 'z':
                this.setViewProperty('zoom', 1);
                evt.preventDefault();
                break;
            case 'x':
                this.setViewProperty('x', 0);
                this.setViewProperty('y', 0);
                evt.preventDefault();
                break;
        }
    }
}
export default SchematicDisplay;