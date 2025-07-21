import samplePageHtml from "@/assets/sample-page.html?raw";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { CodePreview } from "@/components/code-preview";
import { PagePreview } from "@/components/page-preview";
import { MessDrawing } from "@/components/mess-drawing";
import { wait } from "@/utils/wait";
import { buildClassName } from "@/utils/class-names";

export function App() {
    const [code, setCode] = useState("");

    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        let currentCode = "";
        let unmounted = false;

        async function startMockedCodeStreaming() {
            console.log("Starting mocked code streaming");

            for (
                let currentCharacterIndex = 0;
                currentCharacterIndex <= samplePageHtml.length;
                currentCharacterIndex += 37
            ) {
                currentCode += samplePageHtml.slice(
                    currentCharacterIndex,
                    currentCharacterIndex + 37,
                );
                setCode(currentCode);

                await wait(100);

                if (unmounted) {
                    console.log(
                        "Component unmounted. Cancelling code streaming",
                    );
                    return;
                }
            }

            setIsCompleted(true);
        }

        startMockedCodeStreaming().catch(console.error);

        return () => {
            unmounted = true;
        };
    }, []);

    return (
        <main>
            <div
                className={buildClassName(
                    "px-6 py-12 grid grid-cols-2 gap-7 min-h-screen max-sm:grid-cols-1 max-sm:py-6 transition-all duration-300",
                    isCompleted && "scale-40 opacity-0",
                )}
            >
                <div className="relative pb-10 max-sm:pb-4">
                    <motion.h1
                        className="text-6xl font-serif font-bold mb-10 flex items-center gap-x-2 max-sm:text-4xl max-sm:mb-4"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.8,
                            type: "spring",
                            delay: 0.7,
                        }}
                    >
                        <MessDrawing /> Creating
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 1, filter: "blur(40px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                    >
                        <CodePreview code={code} />
                    </motion.div>

                    <svg
			className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-full max-w-xl stroke-[0.7px] max-sm:h-10"
                        viewBox="0 0 534 100"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <motion.path
                            d="M1 99C74.6145 25.0469 284.075 -78.4875 533 99"
                            stroke="#BDBDBD"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
			    transition={{ duration: 1, delay: 0.7 }}
                        />
                        <motion.path
                            d="M219 99C249.996 43.9125 338.189 -33.21 443 99"
                            stroke="#BDBDBD"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
			    transition={{ duration: 1, delay: 0.7 }}
                        />
                        <motion.path
                            d="M111 99C142.687 66.5512 232.85 21.1229 340 99"
                            stroke="#BDBDBD"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
			    transition={{ duration: 1, delay: 0.7 }}
                        />
                    </svg>

                    <motion.div
                        className="w-px bg-gradient-to-b from-transparent to-neutral-400 absolute top-2 right-0"
                        initial={{ height: "0px" }}
                        animate={{ height: "100%" }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    ></motion.div>

                    <motion.div
                        className="h-px bg-gradient-to-r from-neutral-100 to-neutral-300 to-20% absolute -bottom-2 right-0"
                        initial={{ width: "0px" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                    ></motion.div>
                </div>

                <PagePreview code={code} />
            </div>

            <AnimatePresence>
                {isCompleted && (
                    <motion.div
                        className="w-full h-full p-10 fixed top-1/2 left-1/2 -translate-1/2 max-md:p-4"
                        initial={{ scaleY: 0, opacity: 0 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        transition={{
                            duration: 0.4,
                            type: "spring",
                            delay: 0.3,
                        }}
                    >
                        <iframe
                            className="bg-violet-100 rounded-xl w-full h-full shadow-xl shadow-black/10"
                            srcDoc={code}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
