import React from 'react';
// import './Tile.css';

const Tile = ({ tile, onClick, isEmpty }) => {
  return (
    <div
      className={`tile ${isEmpty ? 'empty' : ''}`}
      onClick={onClick}
    >
      {tile}
    </div>
  );
};

export default Tile;
