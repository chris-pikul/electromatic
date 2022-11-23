/**
 * Electromatic - Web Editor
 * 
 * Copyright 2022 Chris Pikul. Licensed under GNU General Public License 3.0.
 * -----------------------------------------------------------------------------
 * 
 * Toggles fullscreen and reports on which state the app will be in.
 */

import { dispatchRaw } from './state/context';

export function isFullScreen():boolean {
    return !!(
        document.fullscreenElement ??
        (document as any).webkitFullscreenElement ??
        (document as any).mozFullscreenElement ??
        (document as any).msFullScreenElement
    );
}

export function toggleFullScreen():Promise<boolean> {
    const was = isFullScreen();
    if(was) {
        return new Promise(resolve => {
            document.exitFullscreen()
                .then(() => resolve(false))
                .catch(err => {
                    console.error(`Error during document.exitFullscreen(): `, err);
                    resolve(false);
                });
        });
    }

    return new Promise(resolve => {
        document.documentElement.requestFullscreen({ navigationUI: 'hide' })
            .then(() => resolve(true))
            .catch(err => resolve(false));
    });
}

export function handleFullscreenChange(_evt:Event):void {
    dispatchRaw({
        type: 'fullscreen-change',
        fullscreen: isFullScreen(),
    });
}