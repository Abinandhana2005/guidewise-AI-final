// src/components/KanbanCard.js
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const KanbanCard = ({ card, index }) => {
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided) => (
        <div
          className="kanban-card"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {card.content}
        </div>
      )}
    </Draggable>
  );
};

export default KanbanCard;
