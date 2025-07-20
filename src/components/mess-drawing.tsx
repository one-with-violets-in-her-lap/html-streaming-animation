import messDrawingSvgPathKeyframes from "@/assets/mess-drawing-svg-path-keyframes.json";

import { motion, useAnimate } from "motion/react";
import { useEffect } from "react";

export function MessDrawing() {
    const [scope, animate] = useAnimate();

    useEffect(() => {
        let unmounted = false;

        async function playInfiniteMorphAnimation() {
            let currentKeyframeIndex = 1;

            while (!unmounted) {
                await animate(
                    scope.current,
                    { d: messDrawingSvgPathKeyframes[currentKeyframeIndex] },
                    { duration: 0.025, delay: 0.05 },
                );

                currentKeyframeIndex++;

                if (
                    currentKeyframeIndex >= messDrawingSvgPathKeyframes.length
                ) {
                    currentKeyframeIndex = 0;
                }
            }
        }

        playInfiniteMorphAnimation();

        return () => {
            unmounted = true;
        };
    }, []);

    return (
        <svg
            width="146"
            height="144"
            viewBox="0 0 146 144"
            fill="none"
            className="size-11 max-sm:size-9"
            xmlns="http://www.w3.org/2000/svg"
        >
            <motion.path
                ref={scope}
                d={messDrawingSvgPathKeyframes[0]}
                stroke="black"
                strokeWidth="0.4"
                strokeLinecap="round"
            />
        </svg>
    );
}
