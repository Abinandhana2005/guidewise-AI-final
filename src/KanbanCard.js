import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const KanbanCard = ({ card, index, deleteCard }) => {
  const handleDelete = () => {
    deleteCard(card.id);
  };

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided) => (
        <div
          className="kanban-card"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="card-content">
            {card.content}
          </div>
          <button className="delete-button" onClick={handleDelete}>Delete</button>
        </div>
      )}
    </Draggable>
  );
};

export default KanbanCard;
