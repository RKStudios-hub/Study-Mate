import React, { useState, useCallback } from 'react';
import { X } from 'lucide-react';
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

  const onDocumentLoadSuccess = useCallback(({ numPages: nextNumPages }: { numPages: number }) => {
    setNumPages(nextNumPages);
  }, []);

  const renderFileContent = useCallback(() => {
    if (!file || !fileDataUrl) {
      return (
        <div className="p-4 text-center text-gray-700">
          <p>Loading file content...</p>
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
            <Document
              file={fileDataUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={(error) => console.error('Error loading PDF document:', error)}
              className="flex flex-col items-center"
            >
              {Array.from(new Array(numPages || 0), (el, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  renderAnnotationLayer={true}
                  renderTextLayer={true}
                  className="mb-4 shadow-md"
                />
              ))}
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
  }, [file, fileDataUrl, numPages, onDocumentLoadSuccess]); // Add dependencies for useCallback

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-70 p-4">
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full h-[90vh] flex flex-col">
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