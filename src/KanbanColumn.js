import React, { useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import KanbanCard from './KanbanCard';
import './KanbanColumn.css'; // Make sure to import the CSS file

const KanbanColumn = ({ column, cards, index, addCard, deleteCard }) => {
  const [inputValue, setInputValue] = useState('');

  if (!column) {
    return null; // Return null if column is undefined
  }

  const handleAddCard = () => {
    if (inputValue.trim()) {
      addCard(column.id, inputValue);
      setInputValue('');
    }
  };

  return (
    <Droppable droppableId={column.id} direction="vertical">
      {(provided) => (
        <div
          className="kanban-column"
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          <h3>{column.title}</h3>
          {column.cardIds.map((cardId, index) => (
            cards[cardId] ? (
              <KanbanCard
                key={cardId}
                card={cards[cardId]}
                index={index}
                deleteCard={deleteCard} // Pass deleteCard function here
              />
            ) : null
          ))}
          {provided.placeholder}
          <div className="add-task-container">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter Task"
            />
            <button onClick={handleAddCard}>Add Task</button>
          </div>
        </div>
      )}
    </Droppable>
  );
};

export default KanbanColumn;
