import type React from "react"
import { useEffect, useRef, useState } from "react"
import {
  GlobalWorkerOptions,
  getDocument,
  type PDFDocumentProxy,
  type PDFPageProxy,
} from "pdfjs-dist";

import MoreIcon from "src/assets/svg/MoreIcon/MoreIcon";

GlobalWorkerOptions.workerSrc = "/lib/pdf/pdf.worker.js";

type PdfViewerProps = {
    url: string
}

const PdfViewer: React.FC<PdfViewerProps> = ({ url }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const [pdf, setPdf] = useState<PDFDocumentProxy| null>(null)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [viewportSize, setViewportSize] = useState<{ width: number, height: number } | null>(null);

    useEffect(() => {
        (async () => {
            const loaded = await getDocument(url).promise
            setPdf(loaded)
            setTotalPages(loaded.numPages)

             const firstPage = await loaded.getPage(1);
            const vp = firstPage.getViewport({ scale: 1.5 });

            setViewportSize({ width: vp.width, height: vp.height });


            setIsLoading(false);   
        })()
    }, [url])

    useEffect(() => {
        if (!pdf) return;
        let canceled = false;
        let renderTask: ReturnType<PDFPageProxy['render']> | null = null;


        (async () => {
            const pdfPage = await pdf.getPage(page);
            const viewport = pdfPage.getViewport({ scale: 1.5 });

            const canvas = canvasRef.current!;
            const ctx = canvas.getContext('2d')!;

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            renderTask = pdfPage.render({
                canvas,
                canvasContext: ctx,
                viewport,
            });

            try {
                await renderTask.promise;
                if (canceled) renderTask.cancel();
            } catch (err) {
                if (!(err instanceof Error && err.name === "RenderingCancelledException")) {
                    console.error(err)
                }
            }
        })();

        return () => {
            canceled = true;
            renderTask?.cancel();
        };
    }, [pdf, page])

    return (
        <div className="w-full flex justify-center">
            <div className="flex items-center">
                <button
                    className="cursor-pointer"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1 || isLoading}
                >
                    <MoreIcon size={120} direction="left" color="var(--color-accent-brown)"/>
                </button>
            </div>

            <div className="relative shadow-[0_0_20px_#000000] w-[892px] h-[1262px]">
                <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0"
                />

                {isLoading &&
                    <div className="absolute z-1 top-0 left-0 w-full h-full flex justify-center items-center bg-white">
                        <span className="font-base text-5xl font-bold">Документ загружается...</span>
                    </div>
                }
            </div>

            <div className="flex items-center">
                <button
                    className="cursor-pointer"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages || isLoading}
                >
                    <MoreIcon size={120} direction="right" color="var(--color-accent-brown)"/>
                </button>
            </div> 
        </div>    
    )
}

export default PdfViewer