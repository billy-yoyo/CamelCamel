import * as React from 'react';

interface AnimationProps {
    target: HTMLElement;
    duration: number;
    animation: HTMLElement;
}

export default ({ target, duration, animation }: AnimationProps) => {
    const top = target.offsetTop + (target.offsetHeight / 2);
    const left = target.offsetLeft + (target.offsetWidth / 2);

    const el = document.createElement('div');
    el.style.position = 'absolute';
    el.style.top = `${top}px`;
    el.style.left = `${left}px`;
    el.style.zIndex = '100';

    el.appendChild(animation);

    const container = document.getElementById('animation-container');
    container.appendChild(el);

    setTimeout(() => {
        el.remove();
    }, duration);
};
