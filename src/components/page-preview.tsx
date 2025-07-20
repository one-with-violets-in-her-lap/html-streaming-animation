import { motion } from "motion/react";

export function PagePreview({ code }: { code: string }) {
    return (
        <div className="relative h-full max-sm:h-[700px]">
            <motion.iframe
                className="h-full max-h-full w-full rounded-xl"
                srcDoc={code}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 1.2, type: "spring" }}
            ></motion.iframe>
        </div>
    );
}
