import playAnimation from './animation';
import './delivery.less';

const DeliveryAnimation = (): HTMLElement => {
    const el = document.createElement('div');

    el.classList.add('delivery-animation');
    setTimeout(() => {
        el.classList.add('started');
    }, 100);

    return el;
};

export default (target: HTMLElement) => {
    playAnimation({
        target: target,
        animation: DeliveryAnimation(),
        duration: 1100
    });
};
