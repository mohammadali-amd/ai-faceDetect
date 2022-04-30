import logo from "./logo.svg";
import "./App.css";
import { useRef } from "react";     //reach elements
import * as tf from "@tensorflow/tfjs";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import Webcam from "react-webcam";
import {drawMesh} from './utilities';

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runFacemesh = async () => {
    const net = await faceLandmarksDetection.load(    //create model
      faceLandmarksDetection.SupportedPackages.mediapipeFacemesh
    );

    setInterval(() => {   //repeat detect(net) evry 300 seconds
      detect(net);
    }, 300);
  };

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const face = await net.estimateFaces({input: video});
      const ctx = canvasRef.current.getContext('2d');   //canvas
      drawMesh(face, ctx);
    }
  };

  runFacemesh();
  return (
    <div className="App">
      <Webcam
        ref={webcamRef}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          width: 640,
          height: 400,
          // visibility: "hidden"
        }}
      />

      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          width: 640,
          height: 400,
        }}
      />
    </div>
  );
}

export default App;
