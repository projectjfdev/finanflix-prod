// // pages/pdf-viewer.js
// "use client";
// import { useEffect } from "react";

// const PdfViewer = ({ pdfUrl }: { pdfUrl: string }) => {
//   useEffect(() => {
//     // Desactivar clic derecho
//     document.addEventListener("contextmenu", (e) => e.preventDefault());
//     return () => {
//       document.removeEventListener("contextmenu", (e) => e.preventDefault());
//     };
//   }, []);

//   return (
//     <div
//       className="w-full max-w-4xl  aspect-video "
//       style={{ width: "100%", height: "100vh" }}
//     >
//       <iframe
//         src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
//         width="100%"
//         height="100%"
//         className="w-full h-full relative"
//         frameBorder="0"
//         allow="autoplay; fullscreen"
//         allowFullScreen
//         style={{ border: "none", backgroundColor: "transparent" }}
//       ></iframe>
//     </div>
//   );
// };

// // Obtener la URL del PDF de alguna forma, tal vez desde props
// export async function getServerSideProps() {
//   const pdfUrl = "URL_DE_TU_PDF_AQUI";
//   return { props: { pdfUrl } };
// }

// export default PdfViewer;
"use client";
import { useEffect } from "react";

const PdfViewer = ({ pdfUrl }: { pdfUrl: string }) => {
  useEffect(() => {
    const disableRightClick = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", disableRightClick);
    return () => {
      document.removeEventListener("contextmenu", disableRightClick);
    };
  }, []);

  const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(
    pdfUrl
  )}&embedded=true`;

  return (
    <div
      className="w-full max-w-4xl aspect-video"
      style={{ width: "100%", height: "100vh" }}
    >
      <iframe
        src={googleViewerUrl}
        width="100%"
        height="100%"
        className="w-full h-full relative"
        frameBorder="0"
        style={{ border: "none", backgroundColor: "transparent" }}
      ></iframe>
    </div>
  );
};

export default PdfViewer;
