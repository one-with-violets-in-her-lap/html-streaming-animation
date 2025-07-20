import "@/assets/styles/main.css";
import samplePageHtml from "@/sample-page.html?raw";

import { getHtmlElementBySelectorOrThrow } from "@/utils/get-element-or-throw";
import { wait } from "@/utils/wait";
import { DiffDOM } from "diff-dom";

const STYLES_TO_INJECT_IN_PREVIEW_IFRAME = `
html, body {
    overflow: hidden;
}

body * {
    opacity: 0;
    animation-name: appear;
    animation-duration: 0.4s;
    animation-fill-mode: both;
}

@keyframes appear {
    0% {
	scale: 0%;
	opacity: 0;
    }
    
    100% {
	scale: 100%;
	opacity: 1;
    }
}
`;

window.addEventListener("load", async () => {
    const heading = getHtmlElementBySelectorOrThrow("#heading");
    const codeBlockContainer = getHtmlElementBySelectorOrThrow(
        "#codeBlockContainer",
    );

    const previewIframe = document.querySelector("#previewContainer iframe");

    if (!(previewIframe instanceof HTMLIFrameElement)) {
        throw new Error("#previewContainer element must have an iframe");
    }

    heading.style.opacity = "1";
    heading.style.transition = "0.5s ease all";
    heading.style.translate = "none";

    codeBlockContainer.style.opacity = "1";
    codeBlockContainer.style.filter = "blur(0px)";
    codeBlockContainer.style.transition = "0.8s ease all";

    await startSampleHtmlStreaming(
        getHtmlElementBySelectorOrThrow("#codeBlock"),
        previewIframe,
        codeBlockContainer.clientHeight,
    );
});

async function startSampleHtmlStreaming(
    codeBlock: HTMLElement,
    previewIframe: HTMLIFrameElement,
    codeBlockContainerHeight: number,
) {
    const domParser = new DOMParser();
    const domDiff = new DiffDOM();

    function updatePreview() {
        previewIframe.style.scale = "100%";

        const parsedDocument = domParser.parseFromString(
            codeBlock.textContent || "",
            "text/html",
        );
        parsedDocument.head.insertAdjacentHTML(
            "beforeend",
            `<style>${STYLES_TO_INJECT_IN_PREVIEW_IFRAME}</style>`,
        );

        if (!previewIframe.contentWindow) {
            throw new Error(
                "Preview iframe's contentWindow must be accessible by JS",
            );
        }

        const diffs = domDiff.diff(
            previewIframe.contentWindow.document.documentElement,
            parsedDocument.documentElement,
        );

        console.log(diffs);

        domDiff.apply(
            previewIframe.contentWindow.document.documentElement,
            diffs,
        );
    }

    const previewUpdateInterval = setInterval(updatePreview, 3000);

    for (const character of samplePageHtml) {
        codeBlock.textContent += character;
        codeBlock.style.position = "absolute";
        codeBlock.style.top =
            codeBlockContainerHeight - codeBlock.clientHeight + "px";

        await wait(1);
    }

    clearInterval(previewUpdateInterval);
    updatePreview();
}
