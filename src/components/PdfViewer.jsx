import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

/**
 * Renders every page of a PDF to a <canvas>. This draws the PDF ourselves
 * instead of handing the URL to the browser, so it always previews inline and
 * never triggers a download (even if the browser is set to download PDFs).
 */
const PdfViewer = ({ url, className = "" }) => {
  const containerRef = useRef(null);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;

    const render = async () => {
      try {
        setStatus("loading");
        const pdf = await pdfjsLib.getDocument(url).promise;
        if (cancelled) return;
        container.innerHTML = "";

        for (let n = 1; n <= pdf.numPages; n++) {
          const page = await pdf.getPage(n);
          if (cancelled) return;

          const scale = Math.min(2, (container.clientWidth - 24) / page.getViewport({ scale: 1 }).width);
          const viewport = page.getViewport({ scale: Math.max(1, scale) });

          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.className = "pdf-page";
          container.appendChild(canvas);

          await page.render({
            canvasContext: canvas.getContext("2d"),
            viewport,
          }).promise;
        }
        if (!cancelled) setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    };

    render();
    return () => {
      cancelled = true;
    };
  }, [url]);

  return (
    <div className={`pdf-viewer ${className}`}>
      {status === "loading" && <p className="pdf-state">Loading résumé…</p>}
      {status === "error" && (
        <p className="pdf-state">
          Couldn&apos;t render the PDF.{" "}
          <a href={url} target="_blank" rel="noopener noreferrer">
            Open it in a new tab
          </a>
          .
        </p>
      )}
      <div ref={containerRef} className="pdf-pages" />
    </div>
  );
};

export default PdfViewer;
