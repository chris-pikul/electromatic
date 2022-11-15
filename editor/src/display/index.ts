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

import { throttle, ViewProp } from './utils';
import type { Size, View } from './utils';

import Grid from './Grid';

const ActionTypes:Readonly<Array<string>> = [
    'move-left',
    'move-right',
    'move-up',
    'move-down',
    'zoom-in',
    'zoom-out',
] as const;
type EActionType = typeof ActionTypes[number];

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

    constructor(parent:HTMLElement, themeID?:EThemeID) {
        this.destroy = this.destroy.bind(this);
        this.update = this.update.bind(this);
        this.draw = this.draw.bind(this);

        this.pushAction = this.pushAction.bind(this);
        this.removeAction = this.removeAction.bind(this);
        this.handleResize = throttle(this.handleResize, 250).bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
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
                        this.#view.zoom = Math.min(this.#view.zoom + (deltaTime * 0.002), 5);
                        break;
                    case 'zoom-out':
                        this.#view.zoom = Math.max(this.#view.zoom - (deltaTime * 0.002), 0.2);
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

    private onMouseEnter() {
        console.info('mouse entered schematic canvas');

        document.addEventListener('keydown', this.onKeyDown);
        document.addEventListener('keyup', this.onKeyUp);
    }

    private onMouseLeave() {
        console.info('mouse left schematic canvas');

        document.removeEventListener('keydown', this.onKeyDown);
        document.removeEventListener('keyup', this.onKeyUp);
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
        console.log('key down', key);
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
        }
    }
}
export default SchematicDisplay;