import type React from "react"
import { useEffect, useRef, useState } from "react"
import {
  GlobalWorkerOptions,
  getDocument,
  type PDFDocumentProxy,
  type PDFPageProxy,
} from "pdfjs-dist";
import SearchIcon from "src/assets/svg/SearchIcon/SearchIcon";
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

    useEffect(() => {
        (async () => {
            const loaded = await getDocument(url).promise
            setPdf(loaded)
            setTotalPages(loaded.numPages)
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
                if (err instanceof Error && err.name === "RenderingCancelledException") {
                    // нормальное поведение при отмене
                } else {
                    console.error(err);
                }
            }
        })();

        return () => {
            canceled = true;
            renderTask?.cancel();
        };
    }, [pdf, page])

    return (
        <div className="w-full">
            <div className="flex flex-col items-center gap-12">
                <div className="flex justify-between">
                    <div className="flex items-center">
                        <button
                            className="cursor-pointer"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            <MoreIcon size={120} direction="left" color="var(--color-accent-brown)"/>
                        </button>
                    </div>
                    <canvas ref={canvasRef} className="shadow-[0_0_20px_#000000]"/>
                    <div className="flex items-center">
                        <button
                            className="cursor-pointer"
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                        >
                            <MoreIcon size={120} direction="right" color="var(--color-accent-brown)"/>
                        </button>
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <span className="text-3xl font-base">
                        {page} / {totalPages}
                    </span>
                    <div className="box-border p-3 rounded-4xl bg-bg-search">
                        <SearchIcon size={36} color="var(--color-accent-brown)"/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PdfViewer