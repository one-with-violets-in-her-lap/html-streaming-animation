import samplePageHtml from "@/assets/sample-page.html?raw";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { CodePreview } from "@/components/code-preview";
import { PagePreview } from "@/components/page-preview";
import { wait } from "@/utils/wait";

export function App() {
    const [code, setCode] = useState("");

    useEffect(() => {
        let currentCode = "";
        let unmounted = false;

        async function startMockedCodeStreaming() {
            console.log("Starting mocked code streaming");

            for (
                let currentCharacterIndex = 0;
                currentCharacterIndex <= samplePageHtml.length;
                currentCharacterIndex += 40
            ) {
                currentCode += samplePageHtml.slice(
                    currentCharacterIndex,
                    currentCharacterIndex + 40,
                );
                setCode(currentCode);

                await wait(100);

                if (unmounted) {
                    console.log(
                        "Component unmounted. Cancelling code streaming",
                    );
                    break;
                }
            }
        }

        startMockedCodeStreaming().catch(console.error);

        return () => {
            unmounted = true;
        };
    }, []);

    return (
        <main className="px-6 py-12 grid grid-cols-2 gap-7 min-h-screen max-sm:grid-cols-1 max-sm:py-6">
            <div className="relative">
                <motion.h1
                    className="text-6xl font-serif font-bold mb-10 max-sm:text-4xl max-sm:mb-4"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, type: "spring", delay: 0.7 }}
                >
                    Creating
                </motion.h1>

                <motion.div
                    initial={{ opacity: 1, filter: "blur(40px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                >
                    <CodePreview code={code} />
                </motion.div>

                <motion.div
                    className="w-px bg-gradient-to-b from-transparent to-violet-400 absolute top-2 right-0"
                    initial={{ height: "0px" }}
                    animate={{ height: "100%" }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                ></motion.div>

                <motion.div
                    className="h-px bg-gradient-to-r from-transparent to-violet-400 absolute -bottom-2 right-0"
                    initial={{ width: "0px" }}
                    animate={{ width: "86%" }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                ></motion.div>
            </div>

            <PagePreview code={code} />
        </main>
    );
}
