import {trigger, transition, style, animate, keyframes} from '@angular/animations';

/**
 *
 * This file contains various Angular animations used for enhancing UI transitions
 * in the application. Each animation is defined using the Angular animations API.
 */

/**
 * 1. Scale Up Animation
 * This animation scales an element up from nothing.
 */
export const scaleUpAnimation = trigger('scaleUp', [
  transition(':enter', [
    style({transform: 'scale(0)', opacity: 0}),
    animate('300ms ease-out', style({transform: 'scale(1)', opacity: 1}))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({transform: 'scale(0)', opacity: 0}))
  ])
]);

/**
 * 2. Scale Down Animation
 * This animation scales down an element.
 */
export const scaleDownAnimation = trigger('scaleDown', [
  transition(':enter', [
    style({transform: 'scale(1.2)', opacity: 0}),
    animate('300ms ease-out', style({transform: 'scale(1)', opacity: 1}))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({transform: 'scale(1.2)', opacity: 0}))
  ])
]);

/**
 * 3. Fade In Animation
 * This animation fades an element in when it enters the view.
 */
export const fadeInAnimation = trigger('fadeIn', [
  transition(':enter', [
    style({opacity: 0}),
    animate('500ms ease-out', style({opacity: 1}))
  ]),
  transition(':leave', [
    animate('500ms ease-in', style({opacity: 0}))
  ])
]);

/**
 * 4. Fade Out Animation
 * This animation fades an element out when it leaves the view.
 */
export const fadeOutAnimation = trigger('fadeOut', [
  transition(':enter', [
    style({opacity: 0}),
    animate('500ms ease-out', style({opacity: 1}))
  ]),
  transition(':leave', [
    animate('500ms ease-in', style({opacity: 0}))
  ])
]);

/**
 * 5. Rotate Animation
 * This animation makes an element rotate.
 */
export const rotateAnimation = trigger('rotate', [
  transition(':enter', [
    style({transform: 'rotate(0deg)'}),
    animate('300ms ease-out', style({transform: 'rotate(360deg)'}))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({transform: 'rotate(0deg)'}))
  ])
]);

/**
 * 6. Rotate In Animation
 * This animation rotates an element into view.
 */
export const rotateInAnimation = trigger('rotateIn', [
  transition(':enter', [
    style({transform: 'rotate(-90deg)', opacity: 0}),
    animate('500ms ease-out', style({transform: 'rotate(0)', opacity: 1}))
  ]),
  transition(':leave', [
    animate('500ms ease-in', style({transform: 'rotate(90deg)', opacity: 0}))
  ])
]);

/**
 * 7. Rotate Out Animation
 * This animation rotates an element out of view.
 */
export const rotateOutAnimation = trigger('rotateOut', [
  transition(':enter', [
    style({transform: 'rotate(90deg)', opacity: 0}),
    animate('500ms ease-out', style({transform: 'rotate(0)', opacity: 1}))
  ]),
  transition(':leave', [
    animate('500ms ease-in', style({transform: 'rotate(-90deg)', opacity: 0}))
  ])
]);

/**
 * 8. Slide Right Animation
 * This animation slides an element in from the right.
 */
export const slideRightAnimation = trigger('slideRight', [
  transition(':enter', [
    style({transform: 'translateX(100%)', opacity: 0}),
    animate('300ms ease-out', style({transform: 'translateX(0)', opacity: 1}))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({transform: 'translateX(100%)', opacity: 0}))
  ])
]);

/**
 * 9. Slide Left Animation
 * This animation slides an element in from the left.
 */
export const slideLeftAnimation = trigger('slideLeft', [
  transition(':enter', [
    style({transform: 'translateX(-100%)', opacity: 0}),
    animate('300ms ease-out', style({transform: 'translateX(0)', opacity: 1}))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({transform: 'translateX(-100%)', opacity: 0}))
  ])
]);

/**
 * 10. Slide In Animation
 * This animation slides an element in from the left when it enters the view.
 */
export const slideInAnimation = trigger('slideIn', [
  transition(':enter', [
    style({transform: 'translateX(-100%)', opacity: 0}),
    animate('500ms ease-out', style({transform: 'translateX(0)', opacity: 1}))
  ]),
  transition(':leave', [
    animate('500ms ease-in', style({transform: 'translateX(-100%)', opacity: 0}))
  ])
]);

/**
 * 11. Slide Out Animation
 * This animation slides an element out to the left when it leaves the view.
 */
export const slideOutAnimation = trigger('slideOut', [
  transition(':enter', [
    style({transform: 'translateX(100%)', opacity: 0}),
    animate('500ms ease-out', style({transform: 'translateX(0)', opacity: 1}))
  ]),
  transition(':leave', [
    animate('500ms ease-in', style({transform: 'translateX(100%)', opacity: 0}))
  ])
]);

/**
 * 12. Slide Fade Animation
 * This animation combines sliding and fading effects.
 */
export const slideFadeAnimation = trigger('slideFade', [
  transition(':enter', [
    style({transform: 'translateY(-30px)', opacity: 0}),
    animate('300ms ease-out', style({transform: 'translateY(0)', opacity: 1}))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({transform: 'translateY(-30px)', opacity: 0}))
  ])
]);

/**Bounce Animations */
/**
 * 13. Bounce Animation
 * This animation makes an element bounce in and out of the view.
 */
export const bounceAnimation = trigger('bounce', [
  transition(':enter', [
    style({transform: 'scale(0)', opacity: 0}),
    animate('500ms ease-out', style({transform: 'scale(1)', opacity: 1}))
  ]),
  transition(':leave', [
    animate('500ms ease-in', style({transform: 'scale(0)', opacity: 0}))
  ])
]);

/**
 * 14. Bounce In Animation
 * This animation makes an element bounce when it enters the view.
 */
export const bounceInAnimation = trigger('bounceIn', [
  transition(':enter', [
    style({transform: 'scale(0)', opacity: 0}),
    animate('500ms ease-out', style({transform: 'scale(1)', opacity: 1}))
  ]),
  transition(':leave', [
    animate('500ms ease-in', style({transform: 'scale(0)', opacity: 0}))
  ])
]);

/**
 * 15. Bounce Out Animation
 * This animation makes an element bounce when it leaves the view.
 */
export const bounceOutAnimation = trigger('bounceOut', [
  transition(':enter', [
    style({transform: 'scale(1)', opacity: 1}),
    animate('500ms ease-out', style({transform: 'scale(0)', opacity: 0}))
  ]),
  transition(':leave', [
    animate('500ms ease-in', style({transform: 'scale(1)', opacity: 0}))
  ])
]);

/**
 * 16. Zoom In Animation
 * This animation zooms an element in when it enters the view.
 */
export const zoomInAnimation = trigger('zoomIn', [
  transition(':enter', [
    style({transform: 'scale(0)', opacity: 0}),
    animate('500ms ease-out', style({transform: 'scale(1)', opacity: 1}))
  ]),
  transition(':leave', [
    animate('500ms ease-in', style({transform: 'scale(0)', opacity: 0}))
  ])
]);

/**
 * 17. Zoom Out Animation
 * This animation zooms an element out when it leaves the view.
 */
export const zoomOutAnimation = trigger('zoomOut', [
  transition(':enter', [
    style({transform: 'scale(1)', opacity: 0}),
    animate('500ms ease-out', style({transform: 'scale(0)', opacity: 1}))
  ]),
  transition(':leave', [
    animate('500ms ease-in', style({transform: 'scale(1)', opacity: 0}))
  ])
]);

/**
 * 18. Flip In Animation
 * This animation flips an element into view.
 */
export const flipInAnimation = trigger('flipIn', [
  transition(':enter', [
    style({transform: 'perspective(400px) rotateY(-90deg)', opacity: 0}),
    animate('500ms ease-out', style({transform: 'perspective(400px) rotateY(0)', opacity: 1}))
  ]),
  transition(':leave', [
    animate('500ms ease-in', style({transform: 'perspective(400px) rotateY(90deg)', opacity: 0}))
  ])
]);

/**
 * 19. Flip Out Animation
 * This animation flips an element out of view.
 */
export const flipOutAnimation = trigger('flipOut', [
  transition(':enter', [
    style({transform: 'perspective(400px) rotateY(90deg)', opacity: 0}),
    animate('500ms ease-out', style({transform: 'perspective(400px) rotateY(0)', opacity: 1}))
  ]),
  transition(':leave', [
    animate('500ms ease-in', style({transform: 'perspective(400px) rotateY(-90deg)', opacity: 0}))
  ])
]);

/**
 * 20. Roll In Animation
 * This animation rolls an element into view.
 */
export const rollInAnimation = trigger('rollIn', [
  transition(':enter', [
    style({transform: 'translateX(-100%) rotate(-120deg)', opacity: 0}),
    animate('500ms ease-out', style({transform: 'translateX(0) rotate(0)', opacity: 1}))
  ]),
  transition(':leave', [
    animate('500ms ease-in', style({transform: 'translateX(-100%) rotate(-120deg)', opacity: 0}))
  ])
]);

/**
 * 21. Roll Out Animation
 * This animation rolls an element out of view.
 */
export const rollOutAnimation = trigger('rollOut', [
  transition(':enter', [
    style({transform: 'translateX(100%) rotate(120deg)', opacity: 0}),
    animate('500ms ease-out', style({transform: 'translateX(0) rotate(0)', opacity: 1}))
  ]),
  transition(':leave', [
    animate('500ms ease-in', style({transform: 'translateX(100%) rotate(120deg)', opacity: 0}))
  ])
]);

/**
 * 22. Light Speed In Animation
 * This animation makes an element slide in with a light speed effect.
 */
export const lightSpeedInAnimation = trigger('lightSpeedIn', [
  transition(':enter', [
    style({transform: 'translateX(100%)', opacity: 0}),
    animate('500ms ease-out', style({transform: 'translateX(0)', opacity: 1}))
  ]),
  transition(':leave', [
    animate('500ms ease-in', style({transform: 'translateX(100%)', opacity: 0}))
  ])
]);

/**
 * 23. Light Speed Out Animation
 * This animation makes an element slide out with a light speed effect.
 */
export const lightSpeedOutAnimation = trigger('lightSpeedOut', [
  transition(':enter', [
    style({transform: 'translateX(-100%)', opacity: 0}),
    animate('500ms ease-out', style({transform: 'translateX(0)', opacity: 1}))
  ]),
  transition(':leave', [
    animate('500ms ease-in', style({transform: 'translateX(-100%)', opacity: 0}))
  ])
]);

/**
 * 24. Back In Animation
 * This animation slides an element down from the top into view.
 */
export const backInAnimation = trigger('backIn', [
  transition(':enter', [
    style({transform: 'translateY(100%)', opacity: 0}),
    animate('500ms ease-out', style({transform: 'translateY(0)', opacity: 1}))
  ]),
  transition(':leave', [
    animate('500ms ease-in', style({transform: 'translateY(100%)', opacity: 0}))
  ])
]);

/**
 * 25. Back Out Animation
 * This animation slides an element up from the bottom out of view.
 */
export const backOutAnimation = trigger('backOut', [
  transition(':enter', [
    style({transform: 'translateY(-100%)', opacity: 0}),
    animate('500ms ease-out', style({transform: 'translateY(0)', opacity: 1}))
  ]),
  transition(':leave', [
    animate('500ms ease-in', style({transform: 'translateY(-100%)', opacity: 0}))
  ])
]);

/**
 * 26. Wave Animation
 * This animation makes an element wave when it enters the view.
 */
export const waveAnimation = trigger('wave', [
  transition(':enter', [
    style({transform: 'rotateY(0deg)', opacity: 0}),
    animate('500ms ease-out', style({transform: 'rotateY(10deg)', opacity: 1})),
    animate('500ms ease-out', style({transform: 'rotateY(0deg)', opacity: 1}))
  ]),
  transition(':leave', [
    animate('500ms ease-in', style({transform: 'rotateY(-10deg)', opacity: 0}))
  ])
]);

/**
 * 27. Shake Animation
 * This animation makes an element shake when it enters the view.
 */
export const shakeAnimation = trigger('shake', [
  transition(':enter', [
    style({transform: 'translateX(0)'}),
    animate('500ms ease-out', style({transform: 'translateX(-10px)'})),
    animate('500ms ease-out', style({transform: 'translateX(10px)'})),
    animate('500ms ease-out', style({transform: 'translateX(0)'}))
  ]),
  transition(':leave', [
    animate('500ms ease-in', style({transform: 'translateX(0)'}))
  ])
]);

/**
 * 28. Tada Animation
 * This animation makes an element shake and bounce.
 */
export const tadaAnimation = trigger('tada', [
  transition(':enter', [
    style({transform: 'scale(1)'}),
    animate('500ms ease-out', style({transform: 'scale(1.1)'})),
    animate('500ms ease-out', style({transform: 'scale(1)'})),
    animate('500ms ease-out', style({transform: 'scale(1.1)'})),
    animate('500ms ease-out', style({transform: 'scale(1)'}))
  ]),
  transition(':leave', [
    animate('500ms ease-in', style({transform: 'scale(0)'}))
  ])
]);

/**
 * 29. Jello Animation
 * This animation makes an element bounce like jelly.
 */
export const jelloAnimation = trigger('jello', [
  transition(':enter', [
    style({transform: 'scale(1)'}),
    animate('500ms ease-out', style({transform: 'scale(1.1)'})),
    animate('500ms ease-out', style({transform: 'scale(1)'})),
    animate('500ms ease-out', style({transform: 'scale(1.1)'})),
    animate('500ms ease-out', style({transform: 'scale(1)'}))
  ]),
  transition(':leave', [
    animate('500ms ease-in', style({transform: 'scale(0)'}))
  ])
]);

/**
 * 30. Pulse Animation
 * This animation makes an element pulse in size.
 */
export const pulseAnimation = trigger('pulse', [
  transition(':enter', [
    style({transform: 'scale(1)'}),
    animate('500ms ease-in-out', style({transform: 'scale(1.1)'})),
    animate('500ms ease-in-out', style({transform: 'scale(1)'}))
  ]),
  transition(':leave', [
    animate('500ms ease-in', style({transform: 'scale(0)'}))
  ])
]);

/**
 * 31. Swing Animation
 * This animation makes an element swing like a pendulum.
 */
export const swingAnimation = trigger('swing', [
  transition(':enter', [
    style({transform: 'rotate(0deg)'}),
    animate('500ms ease-in-out', style({transform: 'rotate(15deg)'})),
    animate('500ms ease-in-out', style({transform: 'rotate(-10deg)'})),
    animate('500ms ease-in-out', style({transform: 'rotate(5deg)'})),
    animate('500ms ease-in-out', style({transform: 'rotate(0deg)'}))
  ]),
  transition(':leave', [
    animate('500ms ease-in', style({transform: 'rotate(-15deg)'}))
  ])
]);


/**
 * 32. Spin Animation
 * This animation makes an element spin continuously.
 */
export const spinAnimation = trigger('spin', [
  transition(':enter', [
    style({transform: 'rotate(0deg)'}),
    animate('500ms linear', style({transform: 'rotate(360deg)'}))
  ]),
  transition(':leave', [
    animate('500ms linear', style({transform: 'rotate(0deg)'}))
  ])
]);

/**
 * 33. Curtain Animation
 * This animation simulates a curtain effect.
 */
export const curtainAnimation = trigger('curtain', [
  transition(':enter', [
    style({width: '0', opacity: 0}),
    animate('500ms ease-out', style({width: '*', opacity: 1}))
  ]),
  transition(':leave', [
    animate('500ms ease-in', style({width: '0', opacity: 0}))
  ])
]);

/**
 * 34. Pulse Scale Animation
 * This animation creates a pulsing effect on an element.
 */
export const pulseScaleAnimation = trigger('pulseScale', [
  transition(':enter', [
    style({transform: 'scale(1)', opacity: 0}),
    animate('300ms ease-out', style({transform: 'scale(1.05)', opacity: 1})),
    animate('300ms ease-in', style({transform: 'scale(1)'}))
  ])
]);

/**
 * 35. Flip Horizontal Animation
 * This animation flips an element horizontally.
 */
export const flipHorizontalAnimation = trigger('flipHorizontal', [
  transition(':enter', [
    style({transform: 'perspective(600px) rotateY(90deg)', opacity: 0}),
    animate('300ms ease-out', style({transform: 'perspective(600px) rotateY(0)', opacity: 1}))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({transform: 'perspective(600px) rotateY(90deg)', opacity: 0}))
  ])
]);

/**
 * 36. Heart Beat Animation
 * This animation makes an element simulate a heartbeat.
 */
export const heartBeatAnimation = trigger('heartBeat', [
  transition(':enter', [
    style({transform: 'scale(1)'}),
    animate('500ms ease-in-out', style({transform: 'scale(1.1)'})),
    animate('500ms ease-in-out', style({transform: 'scale(1)'})),
    animate('500ms ease-in-out', style({transform: 'scale(1.1)'})),
    animate('500ms ease-in-out', style({transform: 'scale(1)'}))
  ]),
  transition(':leave', [
    animate('500ms ease-in', style({transform: 'scale(0)'}))
  ])
]);

/**
 * 37. Rubber Band Animation
 * This animation makes an element stretch like a rubber band.
 */
export const rubberBandAnimation = trigger('rubberBand', [
  transition(':enter', [
    style({transform: 'scale(1)'}),
    animate('500ms ease-in-out', style({transform: 'scale(1.25)'})),
    animate('500ms ease-in-out', style({transform: 'scale(1)'}))
  ]),
  transition(':leave', [
    animate('500ms ease-in', style({transform: 'scale(0)'}))
  ])
]);

/**
 * 38. Flash Animation
 * This animation makes an element flash by toggling its visibility.
 */
export const flashAnimation = trigger('flash', [
  transition(':enter', [
    style({opacity: 0}),
    animate('500ms ease-in-out', style({opacity: 1})),
    animate('500ms ease-in-out', style({opacity: 0})),
    animate('500ms ease-in-out', style({opacity: 1}))
  ]),
  transition(':leave', [
    animate('500ms ease-in', style({opacity: 0}))
  ])
]);

/**
 * 39. Fading Scale Animation
 * This animation scales and fades in an element.
 */
export const fadingScaleAnimation = trigger('fadingScale', [
  transition(':enter', [
    style({transform: 'scale(0)', opacity: 0}),
    animate('500ms ease-out', style({transform: 'scale(1)', opacity: 1}))
  ]),
  transition(':leave', [
    animate('500ms ease-in', style({transform: 'scale(0)', opacity: 0}))
  ])
]);

/**
 * 40. tracking-in-contract-bck
 */
export const trackingInContractBckAnimation = trigger('trackingInContractBck', [
  // Animation for when the element enters the DOM
  transition(':enter', [
    style({
      letterSpacing: '1em', // Initial letter spacing
      transform: 'translateZ(400px)', // Initial position (far away)
      opacity: 0 // Initial opacity
    }),
    animate(
      '1s cubic-bezier(0.215, 0.610, 0.355, 1.000)', // Animation duration and timing function
      keyframes([
        style({ opacity: 0, transform: 'translateZ(400px)', letterSpacing: '1em', offset: 0 }), // Start state
        style({ opacity: 0.6, transform: 'translateZ(200px)', letterSpacing: '0.5em', offset: 0.4 }), // 40% transition
        style({ opacity: 1, transform: 'translateZ(0)', letterSpacing: '0', offset: 1 }) // Final state
      ])
    )
  ]),

  // Animation for when the element leaves the DOM
  transition(':leave', [
    animate(
      '500ms ease-in',
      style({
        transform: 'scale(0)', // Shrinks the element
        opacity: 0 // Fades out the element
      })
    )
  ])
]);
