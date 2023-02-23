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
import type { ISchematicDisplay } from '../types';

import { SchematicEventTypes, receiveSchematicEvent } from '../events';
import type { ESchematicEventType } from '../events';

import { Themes, DefaultThemeID } from './theme';
import type { Theme, EThemeID } from './theme';

import { throttle, clamp } from './utils';
import { Point, Size, Rect } from './vectors';

import Grid from './Grid';

const ActionTypes:Readonly<Array<string>> = [
    'move-left',
    'move-right',
    'move-up',
    'move-down',
    'zoom-in',
    'zoom-out',
    'mouse-move',
    'box-select',
] as const;
type EActionType = typeof ActionTypes[number];

const ZOOM_MIN = 0.1;
const ZOOM_MAX = 5;
const ZOOM_SPEED = 0.1;
const ZOOM_KBD_SPEED = 0.01;

export class SchematicDisplay implements ISchematicDisplay {
    public readonly parent:HTMLElement;
    public readonly canvas:HTMLCanvasElement;
    public readonly ctx:CanvasRenderingContext2D;

    #theme:Theme;

    #view:Rect;
    #zoom:number;

    #dirty:boolean;
    #lastUpdate:number;
    #animHandle?:ReturnType<typeof requestAnimationFrame>;
    #actions:Set<EActionType>;

    #grid:Grid;
    #showGrid:boolean;

    #mouseOver:boolean;
    #mousePosition:Point;
    #mouseMoveStart?:Point;
    #mouseMoveOriginalView?:Point;
    #boxSelectStart?:Point;

    constructor(parent:HTMLElement, themeID?:EThemeID) {
        this.destroy = this.destroy.bind(this);
        this.update = this.update.bind(this);
        this.draw = this.draw.bind(this);
        this.postEvent = this.postEvent.bind(this);

        this.toWorldSpace = this.toWorldSpace.bind(this);
        this.toScreenSpace = this.toScreenSpace.bind(this);
        this.pushAction = this.pushAction.bind(this);
        this.removeAction = this.removeAction.bind(this);
        this.handleResize = throttle(this.handleResize, 250).bind(this);
        this.applyZoom = this.applyZoom.bind(this);

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
        this.#view = new Rect(0, 0, parentRect.width, parentRect.height);

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
        this.#zoom = 1;
        this.#dirty = true;
        this.#lastUpdate = 0;
        this.#actions = new Set<EActionType>();

        this.#mouseOver = false;
        this.#mousePosition = new Point();

        this.#grid = new Grid();
        this.#showGrid = true;

        window.addEventListener('resize', this.handleResize);
        this.canvas.addEventListener('mouseenter', this.onMouseEnter);
        this.canvas.addEventListener('mouseleave', this.onMouseLeave);

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

    get view():Rect {
        return this.#view;
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
                        this.#view = this.#view.translate(-(deltaTime * 0.2), 0);
                        break;
                    case 'move-right':
                        this.#view = this.#view.translate((deltaTime * 0.2), 0);
                        break;
                    case 'move-up':
                        this.#view = this.#view.translate(0, -(deltaTime * 0.2));
                        break;
                    case 'move-down':
                        this.#view = this.#view.translate(0, (deltaTime * 0.2));
                        break;
                    case 'zoom-in':
                        this.applyZoom(deltaTime * ZOOM_KBD_SPEED);
                        break;
                    case 'zoom-out':
                        this.applyZoom(-(deltaTime * ZOOM_KBD_SPEED));
                        break;
                    case 'mouse-move':
                        if(!this.#mouseMoveStart || !this.#mouseMoveOriginalView)
                            break;

                        this.#view = this.#view.withPosition(
                            this.#mouseMoveOriginalView.subtract(this.#mousePosition.subtract(this.#mouseMoveStart))
                        );
                        
                        break;
                }
            });

            this.draw();
            this.#dirty = false;
        }

        this.#animHandle = window.requestAnimationFrame(this.update);
    }

    draw() {
        if(this.#showGrid) {
            this.#grid.draw(
                this.ctx,
                this.#view,
                this.#zoom,
                this.theme,
            );
        } else {
            // Clear screen
            this.ctx.fillStyle = this.#theme.backgroundColor;
            this.ctx.fillRect(0, 0, this.#view.width, this.#view.height);
        }

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
        if(this.#showGrid && this.#theme.showDocumentAxis) {
            if(this.#view.x <= 0 && this.#view.x >= -this.#view.width) {
                this.ctx.beginPath();
                this.ctx.moveTo(-this.#view.x, 0);
                this.ctx.lineTo(-this.#view.x, this.#view.height);
                this.ctx.lineWidth = this.#theme.documentAxisWidth;
                this.ctx.strokeStyle = this.#theme.documentAxisColor;
                this.ctx.stroke();
            }
            if(this.#view.y <= 0 && this.#view.y >= -this.#view.height) {
                this.ctx.beginPath();
                this.ctx.moveTo(0, -this.#view.y);
                this.ctx.lineTo(this.#view.width, -this.#view.y);
                this.ctx.lineWidth = this.#theme.documentAxisWidth;
                this.ctx.strokeStyle = this.#theme.documentAxisColor;
                this.ctx.stroke();
            }
        }

        // Drag box
        if(this.#boxSelectStart) {
            const endPointWS:Point = this.toWorldSpace(this.#mousePosition);
            const boxWS:Rect = Rect.fromPoints(this.#boxSelectStart, endPointWS);
            const boxSS:Rect = this.toScreenSpace(boxWS);

            this.ctx.fillStyle = this.#theme.boxSelectFillColor;
            this.ctx.fillRect(boxSS.x, boxSS.y, boxSS.width, boxSS.height);
            this.ctx.lineWidth = this.#theme.boxSelectBorderWidth;
            this.ctx.strokeStyle = this.#theme.boxSelectBorderColor;
            this.ctx.strokeRect(boxSS.x, boxSS.y, boxSS.width, boxSS.height);
        }
    }

    postEvent(type: ESchematicEventType, data?: any): void {
        console.log('received event in schematic display engine', type, data);

        // Handles any external events
        switch(type) {
            case SchematicEventTypes.TOGGLE_GRID:
                this.#showGrid = !this.#showGrid;
                console.info('toggling grid', this.#showGrid);
                break;
        }

        this.#dirty = true;
    }

    toWorldSpace<T = (Point|Size|Rect)>(screenSpace:T):T {
        const ss:any = screenSpace as any;
        const result:any = {};

        if(typeof ss.x === 'number')
            result.x = this.#view.x + (ss.x * this.#zoom);
        if(typeof ss.y === 'number')
            result.y = this.#view.y + (ss.y * this.#zoom);
        if(typeof ss.width === 'number')
            result.width = ss.width * this.#zoom;
        if(typeof ss.height === 'number')
            result.height = ss.height * this.#zoom;

        return result as T;
    }

    toScreenSpace<T = (Point|Size|Rect)>(worldSpace:T):T {
        const ws:any = worldSpace as any;
        const result:any = {};

        if(typeof ws.x === 'number')
            result.x = (ws.x - this.#view.x) * (1 / this.#zoom);
        if(typeof ws.y === 'number')
            result.y = (ws.y - this.#view.y) * (1 / this.#zoom);
        if(typeof ws.width === 'number')
            result.width = ws.width * (1 / this.#zoom);
        if(typeof ws.height === 'number')
            result.height = ws.height * (1 / this.#zoom);

        return result as T;
    }

    private pushAction(action:EActionType) {
        this.#actions.add(action);
    }

    private removeAction(action:EActionType) {
        this.#actions.delete(action);
    }

    private handleResize() {
        const { width, height } = this.parent.getBoundingClientRect();

        this.#dirty = this.#dirty || (this.#view.width !== width || this.#view.height !== height);

        this.#view = this.#view.withSize(width, height).trunc();

        this.canvas.width = this.#view.width;
        this.canvas.height = this.#view.height;
    }

    private applyZoom(amount:number) {
        const oldZoom = this.#zoom;
        const actAmount = clamp(amount, -1, 1) * ZOOM_SPEED;
        const newZoom = clamp(oldZoom + actAmount, ZOOM_MIN, ZOOM_MAX);

        this.#zoom = newZoom;
        this.#dirty = true;

        // Calculate offset from mouse so it zooms centered on cursor
        const dx = (this.#view.x + this.#mousePosition.x) * actAmount;
        const dy = (this.#view.y + this.#mousePosition.y) * actAmount;

        this.#view = this.#view.translate(dx, dy).trunc();

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
        this.#mousePosition = new Point(evt.offsetX, evt.offsetY);

        this.#dirty = true;
    }

    private onMouseDown(evt:MouseEvent) {
        if(evt.button === 0) {
            this.#boxSelectStart = this.toWorldSpace(this.#mousePosition);

            this.pushAction('box-select');
            evt.preventDefault();
        } else if(evt.button === 1) {
            if(!this.#actions.has('mouse-move')) {
                this.#mouseMoveStart = this.#mousePosition;
                this.#mouseMoveOriginalView = this.#view.position;
                console.info('set starting mouse for move', this.#mouseMoveStart, this.#mouseMoveOriginalView);
            }
            this.pushAction('mouse-move');
            evt.preventDefault();
        }
    }

    private onMouseUp(evt:MouseEvent) {
        if(evt.button === 0) {
            this.#boxSelectStart = undefined;
            this.removeAction('box-select');
            evt.preventDefault();
        } else if(evt.button === 1) {
            this.removeAction('mouse-move');
            evt.preventDefault();
        }
    }

    private onMouseWheel(evt:WheelEvent) {
        this.applyZoom(-(evt.deltaY / 100));
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
                this.#zoom = 1;
                this.#dirty = true;
                evt.preventDefault();
                break;
            case 'x':
                this.#view = this.#view.withPosition(0, 0);
                this.#dirty = true;
                evt.preventDefault();
                break;
        }
    }
}
export default SchematicDisplay;