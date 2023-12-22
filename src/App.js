/* global Core */
import React, { useRef, useEffect } from 'react';
import WebViewer from '@pdftron/webviewer';
import './App.css';

Core.setWorkerPath("webviewer/lib/core");
Core.enableFullPDF();

const licenseKey = 'your_license_key';  // sign up to get a free trial key at https://dev.apryse.com

const workerTransportPromise = Core.PDFNet.initialize(licenseKey).then(() =>
  Core.initPDFWorkerTransports("pdf", {}, licenseKey)
);

const App = () => {
  const viewer = useRef(null);

  // if using a class, equivalent of componentDidMount 
  useEffect(() => {
    WebViewer(
      {
        workerTransportPromise,
        path: '/webviewer/lib',
        initialDoc: '/files/construction_drawing-final.pdf',
        licenseKey,
      },
      viewer.current,
    ).then((instance) => {
      const { documentViewer, annotationManager, Annotations } = instance.Core;

      documentViewer.addEventListener('documentLoaded', () => {
        console.log("adding layers updated event listener");
        documentViewer.getDocument().addEventListener("layersUpdated", () => {
          console.log("layers updated");
        });

        const rectangleAnnot = new Annotations.RectangleAnnotation({
          PageNumber: 1,
          // values are in page coordinates with (0, 0) in the top left
          X: 100,
          Y: 150,
          Width: 200,
          Height: 50,
          Author: annotationManager.getCurrentUser()
        });

        annotationManager.addAnnotation(rectangleAnnot);
        // need to draw the annotation otherwise it won't show up until the page is refreshed
        annotationManager.redrawAnnotation(rectangleAnnot);
      });
    });
  }, []);

  return (
    <div className="App">
      <div className="header">React sample</div>
      <div className="webviewer" ref={viewer}></div>
    </div>
  );
};

export default App;
