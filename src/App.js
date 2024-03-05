import React, { useRef, useEffect } from 'react';
import WebViewer from '@pdftron/webviewer';
import './App.css';

const App = () => {
  const viewer = useRef(null);

  const licenseKey = '';

  // if using a class, equivalent of componentDidMount
  useEffect(() => {
    WebViewer(
      {
        path: '/webviewer/lib',
        // load non-linearized file to see the expected annotation locations
        // initialDoc: '/files/mixed-pages.pdf',
        initialDoc: '/files/mixed-pages-linearized.pdf',
        licenseKey,
      },
      viewer.current,
    ).then((instance) => {
      const { documentViewer, annotationManager } = instance.Core;

      documentViewer.addEventListener("documentLoaded", async () => {
        const stickyAnnotations = [
          '<?xml version="1.0" encoding="UTF-8" ?><xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve"><fields /><add><text xmlns="http://ns.adobe.com/xfdf/" page="1" rect="1427.922,3525.276,1458.922,3556.276" color="#FFFF00" flags="print,nozoom,norotate" name="d41a26eb-72d2-1b98-9452-6900ed3c6c7f" title="test user" subject="Create a comment" date="D:20240306040655+05\'00\'" creationdate="D:20240306040655+05\'00\'" icon="Comment" statemodel="Review"/></add><modify /><delete /></xfdf>',
          '<?xml version="1.0" encoding="UTF-8" ?><xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve"><fields /><add><text xmlns="http://ns.adobe.com/xfdf/" page="5" rect="354.917,1809.8,385.917,1840.8" color="#FFFF00" flags="print,nozoom,norotate" name="3b46c1e1-5afc-8cd2-9195-aa8b2c21fd32" title="test user" subject="Create a comment" date="D:20240306040617+05\'00\'" creationdate="D:20240306040617+05\'00\'" icon="Comment" statemodel="Review"/></add><modify /><delete /></xfdf>',
        ];

        // wait for the document to be fully loaded
        // this will also fix annotation locations
        // uncomment the following line to see the expected annotation locations
        // await documentViewer.getDocument().getDocumentCompletePromise();

        const importTasks = stickyAnnotations.map((annotation) =>
          annotationManager.importAnnotationCommand(annotation)
        );

        const importedAnnotations = (await Promise.all(importTasks)).flat();
        annotationManager.drawAnnotationsFromList(importedAnnotations);

        annotationManager.jumpToAnnotation(
          annotationManager.getAnnotationById(
            importedAnnotations[importedAnnotations.length - 1].Id
          )
        );
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
