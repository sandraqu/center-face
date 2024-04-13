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
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    margin: "10px",
  };

  const faceStyles = {
    textAlign: "center",
    position: "relative",
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
    const imageCenterOffset = faceData.imageDimensions.width * imageReduceBy / 2;
    const faceDataCenterOffset = faceData.x * imageReduceBy + faceData.width * imageReduceBy / 2;
    return faceDataCenterOffset - imageCenterOffset;
  }

  function getFaceDataVerticalOffset(faceData) {
    const imageReduceBy = getImageReduceBy(faceData);
    return faceData.y * imageReduceBy;
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
      <span style={faceStyles}>
        <img
          src={`${directoryPath}/${faceData.name}`}
          title={faceData.name}
          alt="Image"
        />
      </span>
    </div>
  );
};

export default Circle;
