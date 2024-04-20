import React, { useState, useEffect } from "react";

const Circle = ({ faceData }) => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);

  const circleStyles = {
    width: "200px",
    height: "200px",
    borderRadius: "50%",
    backgroundColor: "#ccc",
    border: "4px solid #EEEEEE",
    display: "flex",
    overflow: "hidden",
    margin: "10px",
    position: "relative",
  };

  const faceStyles = {
    textAlign: "center",
    position: "absolute",
    transformOrigin: "top left",
    transform: `scale(${getImageReduceBy(faceData)})`,
    left: getFaceDataHorizontalOffset(faceData) + "px",
    top: getFaceDataVerticalOffset(faceData) + "px",
  };

  function getSquareInCircle(radius) {
    if (radius <= 0) {
      throw new Error("Radius must be a positive number");
    }

    const diagonal = radius * 2;
    const sideLength = (diagonal * Math.sqrt(2)) / 2;
    return sideLength;
  }

  function getImageReduceBy(faceData) {
    const imageSideLength = getSquareInCircle(100);
    const longestFaceDataSide =
      faceData.width > faceData.height ? faceData.width : faceData.height;
    return imageSideLength / longestFaceDataSide;
  }

  function getFaceDataHorizontalOffset(faceData) {
    const imageReduceBy = getImageReduceBy(faceData);
    const faceDataCenterOffset = (faceData.x - (faceData.width/2)) * imageReduceBy;
    return faceDataCenterOffset * -1;
  }

  function getFaceDataVerticalOffset(faceData) {
    const imageReduceBy = getImageReduceBy(faceData);
    // fix this
    // 29 is (200-141)/2
    // circle is 200, 141 is side length of square that fits in circle
    // half of that is a padding adjustment
    return ((faceData.y * imageReduceBy) - 29) * -1;
  }

  // Combine user-defined styles with defaults
  const directoryPath = process.env.NODE_ENV === "production"
    ? "./assets/images"
    : "./static/images";

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(directoryPath);
        const data = await response.json();
        setImages(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchImages();
  }, []);

  return (
    <div style={circleStyles}>
      <div style={faceStyles}>
        <img
          src={`${directoryPath}/${faceData.name}`}
          /*
           * debugging with face detection
           src={`${directoryPath}/${faceData.name}-detected.jpg`}
           */
          title={faceData.name}
          alt="Image"
        />
      </div>
    </div>
  );
};

export default Circle;
