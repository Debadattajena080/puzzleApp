import React from "react";

const Tile = ({ tile, isEmpty, onDragStart, onDrop, onDragOver }) => {
  return (
    <div
      className={`tile ${isEmpty ? "empty" : ""}`}
      draggable={!isEmpty}
      onDragStart={onDragStart}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      {tile}
    </div>
  );
};

export default Tile;
