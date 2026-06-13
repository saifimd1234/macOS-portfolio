import { Suspense, lazy } from "react";
import { Download } from "lucide-react";
import Window from "./Window";

const PdfViewer = lazy(() => import("#components/PdfViewer.jsx"));

const RESUME_URL = "/files/resume.pdf";

const Resume = (props) => {
  const download = (e) => {
    e.stopPropagation();
    const a = document.createElement("a");
    a.href = RESUME_URL;
    a.download = "resume.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <Window
      {...props}
      className="resume"
      title="Resume.pdf"
      headerRight={
        <button
          type="button"
          className="resume-download"
          onClick={download}
          title="Download PDF"
          aria-label="Download résumé"
        >
          <Download className="size-4" />
        </button>
      }
    >
      <Suspense
        fallback={
          <div className="pdf-viewer">
            <p className="pdf-state">Loading résumé…</p>
          </div>
        }
      >
        <PdfViewer url={RESUME_URL} />
      </Suspense>
    </Window>
  );
};

export default Resume;
