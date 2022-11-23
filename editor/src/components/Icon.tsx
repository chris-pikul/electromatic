import type { FC } from 'react';

const IconPaths:Record<string, string> = {
    'new-document': 'M22.5 36.3h3v-6.5H32v-3h-6.5v-6.5h-3v6.5H16v3h6.5ZM8 44V4h21l11 11v29Zm19.6-27.7V7H11v34h26V16.3ZM11 7v9.3V7v34Z',
    'folder-open': 'M4 40V8h17l3 3h20v3H22.7l-3-3H7v26l5.1-20H47l-6 23Zm6.2-3h28.6L43 20H14.4Zm0 0 4.2-17-4.2 17ZM7 14v-3 3Z',
    'file-import': 'M8 44V4h20l12 12v13.5h-3V18H26V7H11v34h20.5v3Zm35.9 0-6.4-6.4V44h-3V32.5h11.4v3h-6.3l6.4 6.4ZM11 41V7v34Z',
    'save': 'M6 42V6h28.1l7.9 7.8V42Zm3-3h30V15.2L32.8 9H9Zm15-3.3q2.1 0 3.7-1.5t1.5-3.7q0-2.1-1.5-3.6T24 25.4q-2.1 0-3.7 1.5t-1.5 3.7q0 2.1 1.5 3.6t3.7 1.5ZM11.7 18.9h17.9v-7.2h-18ZM9 39V9v30Z',
    'print': 'M32.9 15.6V9H15.1v6.6h-3V6h23.8v9.6Zm4 7.8q.6 0 1.1-.5.4-.4.4-1t-.4-1.1q-.5-.5-1-.5-.7 0-1.1.5-.5.5-.5 1 0 .7.5 1.1.5.5 1 .5ZM33 39v-9.6H15.1V39Zm3 3H12.1v-8.8H4V15.6h40v17.6h-8.1ZM41 30.2V18.6H7v11.6h5.1v-3.8h23.8v3.8ZM7 18.6h34-28.9Z',
    'triangle-right': 'M20 34V14l10 10Z',
    'undo': 'M14 38v-3h14.4q3.6 0 6-2.3 2.6-2.4 2.6-5.8t-2.5-5.8q-2.6-2.3-6-2.3H13.6l5.7 5.7-2.1 2.1L8 17.3 17.3 8l2.1 2.1-5.7 5.7h14.7q4.8 0 8.2 3.2 3.4 3.2 3.4 7.9t-3.4 7.9Q33 38 28.4 38Z',
    'redo': 'M19.6 38q-4.8 0-8.2-3.2Q8 31.6 8 26.9t3.4-7.9q3.5-3.2 8.2-3.2h14.7l-5.7-5.7L30.7 8l9.3 9.3-9.3 9.3-2.1-2.1 5.7-5.7H19.6q-3.6 0-6 2.3Q11 23.4 11 27t2.5 5.8q2.6 2.3 6 2.3H34v3Z',
    'cut': 'm39.1 42.3-15-15-5.9 5.8q.6.8.7 1.6l.1 1.8q0 3.2-2.1 5.3-2.2 2.2-5.4 2.2t-5.3-2.1Q4 39.6 4 36.5t2.1-5.3Q8.4 29 11.6 29q.9 0 1.8.3.8.2 1.8.7l5.8-5.8-5.9-5.9q-.9.4-1.7.5l-1.8.2q-3.2 0-5.3-2.1Q4 14.7 4 11.5t2.1-5.3Q8.4 4 11.6 4t5.3 2.1Q19 8.4 19 11.6l-.1 1.8q-.1.8-.5 1.6L44 40.6v1.7Zm-9.2-20.6-3.2-3.4L39 6h5v1.6ZM11.6 16q1.9 0 3.2-1.3 1.3-1.3 1.3-3.2 0-1.9-1.3-3.2Q13.4 7 11.5 7 9.6 7 8.3 8.3 7 9.6 7 11.5q0 1.9 1.3 3.2Q9.6 16 11.5 16Zm12.7 9.2q.3 0 .6-.3t.3-.7q0-.4-.3-.7t-.7-.3q-.4 0-.6.3t-.3.7q0 .4.3.7t.6.3ZM11.4 41q1.9 0 3.2-1.3 1.3-1.3 1.3-3.2 0-1.9-1.3-3.2-1.3-1.3-3.2-1.3-1.9 0-3.2 1.3Q7 34.6 7 36.5q0 1.9 1.3 3.2Q9.6 41 11.5 41Z',
    'copy': 'M12 38V4h28v34Zm3-3h22V7H15Zm-9 9V10.8h3v30.1h23.7v3Zm9-9V7v28Z',
    'paste': 'M24 9q.8 0 1.4-.6.6-.6.6-1.4 0-.8-.6-1.4Q25 5 24 5q-.8 0-1.4.6-.6.6-.6 1.4 0 .8.6 1.4.5.6 1.4.6ZM6 42V6h13.1q.3-1.8 1.7-2.9T24 2q1.8 0 3.2 1.1 1.4 1.1 1.7 2.9H42v36Zm3-3h30V9h-3v4.5H12V9H9Z',
    'select-all': 'M6 9V6h3v3Zm0 17V22h3v4.2Zm7.4 16v-3h4.2v3ZM6 17.6v-4.2h3v4.2ZM22 9V6H26v3Zm17 0V6h3v3ZM6 42v-3h3v3Zm0-7.4v-4.2h3v4.2ZM13.4 9V6h4.2v3ZM22 42v-3H26v3Zm17-16V22h3v4.2Zm0 16v-3h3v3Zm0-24.4v-4.2h3v4.2Zm0 17v-4.2h3v4.2ZM30.4 42v-3h4.2v3Zm0-33V6h4.2v3Zm-17 25.6V13.4h21.2v21.2Zm3-3h15.2V16.4H16.4Z',
    'de-select': 'm42.1 46.6-12-12H13.4V17.8L1.9 6.4 4 4.3l40.3 40.3ZM9 42q-1.2 0-2.1-1-.9-.8-.9-2h3Zm-3-7.4v-4.2h3v4.2ZM6 26V22h3v4.2Zm0-8.4v-4.2h3v4.2ZM13.4 42v-3h4.2v3Zm.4-33-.4-.4V6h4.2v3Zm2.6 22.6h10.8L16.4 20.8Zm18.2-1.1-3-3V16.4H20.5l-3-3h17.1ZM21.9 42v-3h4.2v3Zm0-33V6h4.2v3Zm8.6 33v-3h4.1v3Zm0-33V6h4.1v3Zm8.9 25.6-.4-.4v-3.8h3v4.2ZM39 26V22h3v4.2Zm0-8.4v-4.2h3v4.2ZM39 9V6q1.2 0 2.1 1 .9.8.9 2Z',
    'zoom-in': 'M39.8 42 26.7 28.8q-1.6 1.3-3.6 2t-4.2.7q-5.4 0-9.2-3.7t-3.7-9q0-5.4 3.8-9.1 3.7-3.8 9-3.8 5.4 0 9 3.8 3.8 3.8 3.8 9 0 2.2-.7 4.2t-2.1 3.8l13.2 13Zm-21-13.4q4.1 0 7-3 2.8-2.8 2.8-6.9t-2.9-6.9Q23 9 19 9q-4.1 0-7 3T9 18.6q0 4.1 2.9 7t7 2.9Zm-1.5-4.3v-4.1h-4.1v-3h4.1v-4h3v4h4v3h-4v4.1Z',
    'zoom-out': 'M39.8 42 26.7 28.8q-1.6 1.3-3.6 2t-4.2.7q-5.4 0-9.2-3.7t-3.7-9q0-5.4 3.8-9.1 3.7-3.8 9-3.8 5.4 0 9 3.8 3.8 3.8 3.8 9 0 2.2-.7 4.2t-2.1 3.8l13.2 13Zm-21-13.4q4.1 0 7-3 2.8-2.8 2.8-6.9t-2.9-6.9Q23 9 19 9q-4.1 0-7 3T9 18.6q0 4.1 2.9 7t7 2.9Zm-5-8.4v-3h10v3Z',
    'center-focus': 'M24 33.4q-3.9 0-6.6-2.8T14.7 24q0-3.9 2.7-6.6t6.6-2.7q3.9 0 6.6 2.7t2.8 6.6q0 3.9-2.8 6.6T24 33.4Zm0-9.4Zm0 6.3q2.7 0 4.5-1.8 1.9-1.8 1.9-4.5t-1.9-4.5q-1.8-1.9-4.5-1.9t-4.5 1.9q-1.9 1.8-1.9 4.5t1.9 4.5q1.8 1.9 4.5 1.9ZM6 17.7V6h11.6v3H9v8.6ZM17.6 42H6V30.4h3V39h8.6Zm12.8 0v-3H39v-8.6h3V42ZM39 17.6V9h-8.6V6H42v11.6Z',
    'fullscreen': 'M10 38v-9.7h3V35h6.7v3Zm0-18.4V10h9.7v3H13v6.7ZM28.4 38v-3H35v-6.7h3V38ZM35 19.6V13h-6.7v-3H38v9.7Z',
    'info': 'M22.6 34h3V22h-3ZM24 18.3q.7 0 1.2-.5.5-.4.5-1.1t-.5-1.2q-.5-.5-1.2-.5t-1.2.5q-.5.5-.5 1.2t.5 1.1q.5.5 1.2.5ZM24 44q-4.1 0-7.8-1.6-3.6-1.6-6.3-4.3-2.8-2.7-4.3-6.4Q4 28.1 4 24q0-4 1.6-7.7 1.6-3.6 4.3-6.3 2.7-2.8 6.3-4.3Q20 4 24.1 4q4 0 7.7 1.6 3.6 1.6 6.3 4.3 2.7 2.7 4.3 6.3Q44 19.9 44 24t-1.6 7.8q-1.6 3.6-4.3 6.3t-6.3 4.3Q28.1 44 24 44Zm0-3q7.1 0 12-5t5-12q0-7.1-5-12T24 7q-7 0-12 5-5 4.9-5 12 0 7 5 12t12 5Zm0-17Z',
    'heart': 'M24 42 22 40q-5.4-4.8-8.8-8.4-3.5-3.5-5.5-6.3t-2.9-5Q4 18.1 4 15.9q0-4.6 3-7.6t7.5-3q2.9 0 5.3 1.4Q22.2 8 24 10.6q2.1-2.7 4.5-4t5-1.3q4.5 0 7.5 3t3 7.5q0 2.3-.8 4.6t-2.9 5q-2 2.8-5.5 6.3t-8.7 8.4Zm0-4 8.3-8q3.3-3.3 5.2-5.8 2-2.5 2.7-4.5.8-1.9.8-3.8 0-3.4-2.1-5.5t-5.4-2.1q-2.5 0-4.8 1.6t-3.5 4.4h-2.5q-1.2-2.8-3.4-4.4-2.3-1.6-4.8-1.6-3.3 0-5.4 2.1Q7 12.6 7 15.8q0 2 .8 4t2.7 4.5q1.9 2.5 5.2 5.8Q19 33.4 24 38Zm0-14.8Z',
    'link': 'M22.5 34H14q-4.2 0-7-3t-3-7q0-4.2 3-7t7-3h8.5v3H14q-2.9 0-5 2-2 2.1-2 5t2 5q2.1 2 5 2h8.5Zm-6.3-8.5v-3h15.6v3Zm9.3 8.5v-3H34q2.9 0 5-2 2-2.1 2-5t-2-5q-2.1-2-5-2h-8.5v-3H34q4.2 0 7 3t3 7q0 4.2-3 7t-7 3Z',
    'dark': 'M24 42q-7.5 0-12.8-5.3T6 24q0-7.5 5.3-12.8T24 6h.8l1.2.1q-1.8 1.6-2.8 4-1 2.3-1 4.9 0 4.5 3.1 7.7 3.2 3.1 7.7 3.1 2.6 0 5-1t3.9-2.5v1l.1.7q0 7.5-5.3 12.8T24 42Zm0-3q5.5 0 9.5-3.4t5-7.9q-1.2.6-2.6.8-1.4.3-2.9.3-5.8 0-9.8-4t-4-9.8q0-1.2.3-2.6.2-1.3.8-3.1-4.9 1.4-8 5.5Q9 18.9 9 24q0 6.3 4.4 10.6T24 39Zm-.2-14.8Z',
    'palette': 'M24 44q-4.1 0-7.8-1.6-3.6-1.6-6.3-4.3-2.8-2.7-4.3-6.4Q4 28.1 4 24q0-4.3 1.6-7.9 1.6-3.6 4.4-6.3 2.7-2.7 6.5-4.3 3.7-1.5 8-1.5 3.9 0 7.4 1.3T38.3 9q2.6 2.4 4.2 5.6 1.6 3.2 1.6 7 0 5.4-3.1 8.6t-8.4 3.1h-3.8q-.8 0-1.5.7t-.7 1.6q0 1.3.8 2.2.7 1 .7 2.2 0 2-1 3t-3 1Zm0-20Zm-11.7 1.3q1 0 1.8-.8t.8-1.7q0-1-.8-1.8t-1.8-.7q-1 0-1.7.8t-.8 1.7q0 1 .8 1.8t1.8.7Zm6.3-8.5q1 0 1.8-.8t.8-1.7q0-1-.8-1.8t-1.8-.7q-1 0-1.7.8t-.8 1.7q0 1 .8 1.8t1.8.7Zm10.7 0q1 0 1.8-.8t.7-1.7q0-1-.7-1.8t-1.8-.7q-1 0-1.7.8t-.8 1.7q0 1 .8 1.8t1.7.7Zm6.6 8.5q1 0 1.8-.8t.7-1.7q0-1-.8-1.8t-1.7-.7q-1 0-1.8.8t-.7 1.7q0 1 .8 1.8t1.7.7ZM24 41q.6 0 .8-.2.2-.2.2-.7 0-.8-.7-1.4-.8-.6-.8-2.6 0-2.3 1.5-4t3.8-1.8h3.7q3.8 0 6.2-2.2 2.3-2.3 2.3-6.5Q41 15 36 11T24.4 7q-7.2 0-12.3 5T7 24q0 7 5 12t12 5Z',
    'grid': 'M16.6 40v-8.7H8v-3h8.7v-8.6H8v-3h8.7V8h3v8.7h8.6V8h3v8.7H40v3h-8.7v8.6H40v3h-8.7V40h-3v-8.7h-8.6V40Zm3-11.7h8.7v-8.6h-8.7Z',
    'bug': 'M24 42q-3.3 0-6-1.6T13.8 36H8v-3h4.6q-.3-1.3-.3-2.6v-2.7H7.8v-3h4.3v-2.9q0-1.5.5-2.8H8v-3h6q.7-1.4 1.9-2.5 1.1-1 2.5-1.7L14.6 8l2-2 4.6 4.7q1.5-.5 2.9-.5t2.8.5L31.6 6l2 2-3.8 3.8q1.4.7 2.5 1.8 1 1 1.9 2.4H40v3h-4.7q.5 1.4.4 2.8v2.9H40v3h-4.3v2.7q0 1.3-.3 2.6h4.7v3h-5.9q-1.3 3-4 4.5Q27.2 42 24 42Zm0-3q3.6 0 6.2-2.5 2.5-2.5 2.5-6.1V22q0-3.6-2.6-6.1T24 13.3q-3.6 0-6.2 2.6-2.5 2.5-2.5 6.1v8.3q0 3.7 2.5 6.2T24 39Zm-4-7h8v-3h-8Zm0-8.7h8v-3h-8Zm4 2.9Z',
    'light': 'M24 31q2.9 0 5-2 2-2.1 2-5t-2-5q-2.1-2-5-2t-5 2q-2 2.1-2 5t2 5q2.1 2 5 2Zm0 3q-4.2 0-7-3t-3-7q0-4.2 3-7t7-3q4.2 0 7 3t3 7q0 4.2-3 7t-7 3ZM2 25.5v-3h8v3Zm36 0v-3h8v3ZM22.5 10V2h3v8Zm0 36v-8h3v8Zm-9.4-30.9-5-4.9 2.1-2.1 5 5ZM37.8 40l-5-5 2.1-2 5 4.9Zm-2.9-24.8-2-2 4.9-5 2.1 2.1ZM10.2 40l-2.1-2.1 5-5 2 2.1ZM24 24Z',
    'automagic': 'm38.6 16.3-2.1-5-5.2-2.4 5.2-2.2 2.1-4.8 2.1 4.8L46 8.9l-5.1 2.3Zm0 29.7-2.1-4.8-5.2-2.3 5.2-2.2 2.1-5 2.1 5L46 39l-5.1 2.2Zm-22-7.7-4.5-9.8L2 23.8l10-4.4 4.7-9.9 4.6 9.8 10 4.6-10 4.4Zm0-7.4 2.5-4.8 4.8-2.2-4.8-2.1-2.4-4.8-2.4 4.8-5 2.1 5 2.2Zm0-7Z',
    'check': 'M18.9 35.7 7.7 24.5l2.1-2.1 9.1 9 19.2-19.2 2.1 2.2Z',

} as const;

export type EIconType = keyof typeof IconPaths;

export interface IconProps {
    className?: string;
    type?: EIconType;
}

export const Icon:FC<IconProps> = ({
    className,
    type,
}) => {
    const clss = `icon ${className ?? ''}`;

    if(!type)
        return <span className={clss} />
    
    return <svg className={clss} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
        <path d={IconPaths[type]} />
    </svg>
};
export default Icon;
