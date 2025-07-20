import { useEffect, useRef, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialLight } from "react-syntax-highlighter/dist/cjs/styles/prism";

export function CodePreview({ code }: { code: string }) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const codePreviewRef = useRef<HTMLDivElement | null>(null);

    const [yOffset, setYOffset] = useState(0);

    useEffect(() => {
        if (containerRef.current === null || codePreviewRef.current === null) {
            throw new TypeError("containerRef must not be null");
        }

        setYOffset(
            containerRef.current.clientHeight -
                codePreviewRef.current.clientHeight,
        );
    }, [code]);

    return (
        <div
            ref={containerRef}
            className="relative w-full h-82 max-sm:h-32 overflow-hidden before:absolute before:w-full before:top-0 before:left-0 before:h-14 before:bg-gradient-to-b before:from-white before:to-white/10 before:z-10 after:absolute after:w-full after:bottom-0 after:left-0 after:h-14 after:bg-gradient-to-b after:to-white after:from-white/10 after:z-10 max-sm:after:h-8 max-sm:before:h-8"
        >
            <div
                ref={codePreviewRef}
                className="code-highlight-block absolute top-0 left-0 text-sm min-h-full font-mono w-full max-lg:text-xs transition-all duration-[50ms]"
                style={{ top: `${yOffset}px` }}
            >
                <SyntaxHighlighter language="html" style={materialLight}>
                    {code}
                </SyntaxHighlighter>
            </div>
        </div>
    );
}
