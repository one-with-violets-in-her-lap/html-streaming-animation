import { DiffDOM } from "diff-dom";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";

const PAGE_PREVIEW_UPDATE_INTERVAL_MILLISECONDS = 1000;
const STYLES_TO_INJECT_IN_PREVIEW_IFRAME = `
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgb(240, 240, 245);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: oklch(90% 0 0);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: oklch(85% 0 0);
}

::-webkit-scrollbar-corner {
  background: transparent;
}

* {
    opacity: 0;
    animation-name: appear;
    animation-duration: 0.4s;
    animation-fill-mode: both;
    transition: all 0.3s ease;
}

@keyframes appear {
    0% {
	scale: 120%;
	opacity: 0;
    }
    
    100% {
	scale: 100%;
	opacity: 1;
    }
}
`;

export function PagePreview({ code }: { code: string }) {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const previewUpdateAllowed = useRef(true);

    useEffect(() => {
        if (previewUpdateAllowed.current) {
            previewUpdateAllowed.current = false;
            console.log("Updating code");

            console.log(
                `Locking preview update for ${PAGE_PREVIEW_UPDATE_INTERVAL_MILLISECONDS}ms`,
            );

            updatePreview();

            setTimeout(() => {
                previewUpdateAllowed.current = true;
            }, PAGE_PREVIEW_UPDATE_INTERVAL_MILLISECONDS);
        }
    }, [code]);

    function updatePreview() {
        const domParser = new DOMParser();
        const diffDom = new DiffDOM();

        if (!iframeRef.current) {
            throw new TypeError("iframeRef must be an iframe, not null");
        }

        if (!iframeRef.current.contentWindow) {
            throw new Error(
                "Preview iframe's contentWindow must be accessible by JS",
            );
        }

        const parsedDocument = domParser.parseFromString(code, "text/html");

        parsedDocument.head.insertAdjacentHTML(
            "beforeend",
            `<style>${STYLES_TO_INJECT_IN_PREVIEW_IFRAME}</style>`,
        );

        const diffs = diffDom.diff(
            iframeRef.current.contentWindow.document.documentElement,
            parsedDocument.documentElement,
        );

        diffDom.apply(
            iframeRef.current.contentWindow.document.documentElement,
            diffs,
        );

        iframeRef.current.contentWindow.document.body.scrollTo({
            top: iframeRef.current.contentWindow.document.body.scrollHeight,
            behavior: "smooth",
        });
    }

    return (
        <div className="relative h-full max-sm:h-[700px]">
            <motion.iframe
                ref={iframeRef}
                className="h-full max-h-full w-full rounded-xl"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 1.2, type: "spring" }}
            />
        </div>
    );
}
