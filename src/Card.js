import React from 'react';
import Circle from './Circle';

const Card = ({ facesData: facesData }) => {
  const cardStyles = {
    minWidth: '300px',
    minHeight: '300px',
    borderRadius: '10px',
    backgroundColor: '#222831',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    border: '6px solid #31363F',
  };

  return (
    <div style={cardStyles}>
      {facesData.map((faceData) => (
        <Circle key={faceData.name} faceData={faceData} />
      ))}
    </div>
  );
};

export default Card;

