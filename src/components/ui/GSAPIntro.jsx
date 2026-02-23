import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const GSAPIntro = ({ onComplete }) => {
    const overlayRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline({
            onComplete: () => {
                if (onComplete) onComplete();
            }
        });

        tl.to(textRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        })
            .to(textRef.current, {
                opacity: 0,
                y: -20,
                duration: 0.5,
                delay: 0.5,
                ease: 'power3.in'
            })
            .to(overlayRef.current, {
                yPercent: -100,
                duration: 0.8,
                ease: 'expo.inOut'
            });
    }, [onComplete]);

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
        >
            <h1
                ref={textRef}
                className="text-4xl md:text-6xl font-bold text-primary opacity-0 translate-y-10"
            >
                Expense <span className='text-green-600'>Flow</span>
            </h1>
        </div>
    );
};

export default GSAPIntro;
