import React, { useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw, RotateCw } from 'lucide-react';
import { File } from '../../types';
import { Document, Page, pdfjs } from 'react-pdf';
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Set the worker source for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

interface FileViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: File | null;
  fileDataUrl: string | null; // New prop for the data URL
}

export function FileViewerModal({ isOpen, onClose, file, fileDataUrl }: FileViewerModalProps) {
  if (!isOpen || !file) return null;

  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);

  const onDocumentLoadSuccess = useCallback(({ numPages: nextNumPages }: { numPages: number }) => {
    setNumPages(nextNumPages);
    setPageNumber(1); // Reset to first page on new document load
  }, []);

  const goToPrevPage = useCallback(() => {
    setPageNumber((prevPageNumber) => Math.max(1, prevPageNumber - 1));
  }, []);

  const goToNextPage = useCallback(() => {
    setPageNumber((prevPageNumber) => Math.min(numPages || 1, prevPageNumber + 1));
  }, [numPages]);

  const zoomIn = useCallback(() => {
    setScale((prevScale) => prevScale + 0.1);
  }, []);

  const zoomOut = useCallback(() => {
    setScale((prevScale) => Math.max(0.1, prevScale - 0.1));
  }, []);

  const rotateClockwise = useCallback(() => {
    setRotation((prevRotation) => (prevRotation + 90) % 360);
  }, []);

  const rotateCounterClockwise = useCallback(() => {
    setRotation((prevRotation) => (prevRotation - 90 + 360) % 360);
  }, []);

  const renderFileContent = useCallback(() => {
    if (!file || !fileDataUrl) {
      return (
        <div className="p-4 text-center text-gray-700">
          <div class="loader">
            <figure class="iconLoaderProgress">
              <svg class="iconLoaderProgressFirst" width="240" height="240">
                <circle cx="120" cy="120" r="100"></circle>
              </svg>

              <svg class="iconLoaderProgressSecond" width="240" height="240">
                <circle cx="120" cy="120" r="100"></circle>
              </svg>
            </figure>
          </div>
        </div>
      );
    }

    const fileExtension = file.type; // Assuming file.type stores the extension like 'pdf', 'png', etc.

    switch (fileExtension) {
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'webp':
      case 'svg':
        return (
          <img
            src={fileDataUrl}
            alt={file.name}
            className="max-w-full max-h-[80vh] object-contain mx-auto"
          />
        );
      case 'pdf':
        return (
          <div className="pdf-container overflow-auto w-full h-full">
            <div className="pdf-controls flex justify-center items-center gap-2 p-2 bg-gray-100 rounded-md mb-2">
              <button onClick={goToPrevPage} disabled={pageNumber <= 1} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 h-8 w-8 flex items-center justify-center">
                <ChevronLeft size={20} />
              </button>
              <span className="text-sm">Page {pageNumber} of {numPages || '--'}</span>
              <button onClick={goToNextPage} disabled={pageNumber >= (numPages || 1)} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 h-8 w-8 flex items-center justify-center">
                <ChevronRight size={20} />
              </button>
              <button onClick={zoomOut} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 h-8 w-8 flex items-center justify-center">
                <ZoomOut size={20} />
              </button>
              <span className="text-sm">{(scale * 100).toFixed(0)}%</span>
              <button onClick={zoomIn} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 h-8 w-8 flex items-center justify-center">
                <ZoomIn size={20} />
              </button>
              <button onClick={rotateCounterClockwise} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 h-8 w-8 flex items-center justify-center">
                <RotateCcw size={20} />
              </button>
              <button onClick={rotateClockwise} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 h-8 w-8 flex items-center justify-center">
                <RotateCw size={20} />
              </button>
            </div>
            <Document
              file={fileDataUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={(error) => console.error('Error loading PDF document:', error)}
              className="flex flex-col items-center"
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                rotate={rotation}
                renderAnnotationLayer={true}
                renderTextLayer={true}
                className="mb-4 shadow-md"
              />
            </Document>
            {numPages === null && (
              <div className="p-4 text-center text-gray-700">Loading PDF...</div>
            )}
          </div>
        );
      case 'docx':
      case 'doc':
        return (
          <div className="p-4 text-center text-gray-700">
            <p>Document preview for .{fileExtension} files is not supported.</p>
            <p>
              <a
                href={fileDataUrl}
                download={file.name}
                className="text-blue-500 hover:underline"
              >
                Download {file.name}
              </a>{' '}
              to view it.
            </p>
          </div>
        );
      case 'mp3':
        return (
          <audio controls className="w-full mt-4">
            <source src={fileDataUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        );
      case 'mp4':
        return (
          <video controls className="w-full mt-4 max-h-[80vh] bg-black">
            <source src={fileDataUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      default:
        return (
          <div className="p-4 text-center text-gray-700">
            <p>Cannot display file type: .{fileExtension}</p>
            <p>
              <a
                href={fileDataUrl}
                download={file.name}
                className="text-blue-500 hover:underline"
              >
                Download {file.name}
              </a>{' '}
              to view it.
            </p>
          </div>
        );
    }
  }, [file, fileDataUrl, numPages, onDocumentLoadSuccess, pageNumber, scale, rotation, goToPrevPage, goToNextPage, zoomIn, zoomOut, rotateClockwise, rotateCounterClockwise]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-white bg-opacity-70 p-4">
      <div className="relative bg-white rounded-lg shadow-xl max-w-[90vw] max-h-[90vh] w-fit h-fit min-w-[1%] min-h-[1%] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold truncate">{file.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="flex-grow overflow-auto p-4">
          {renderFileContent()}
        </div>
      </div>
    </div>
  );
}