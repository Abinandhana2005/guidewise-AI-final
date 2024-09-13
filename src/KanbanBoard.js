// src/components/KanbanBoard.js
import React, { useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import KanbanColumn from './KanbanColumn';
import './KanbanBoard.css'; // Make sure to import the CSS file

const KanbanBoard = () => {
  const [columns, setColumns] = useState({
    'column-1': {
      id: 'column-1',
      title: 'To Do',
      cardIds: []
    },
    'column-2': {
      id: 'column-2',
      title: 'In Progress',
      cardIds: []
    },
    'column-3': {
      id: 'column-3',
      title: 'Done',
      cardIds: []
    }
  });

  const [cards, setCards] = useState({});

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId) {
      const column = columns[source.droppableId];
      const newCardIds = Array.from(column.cardIds);
      newCardIds.splice(source.index, 1);
      newCardIds.splice(destination.index, 0, draggableId);

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          cardIds: newCardIds
        }
      });
    } else {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceCardIds = Array.from(sourceColumn.cardIds);
      const destCardIds = Array.from(destColumn.cardIds);

      sourceCardIds.splice(source.index, 1);
      destCardIds.splice(destination.index, 0, draggableId);

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          cardIds: sourceCardIds
        },
        [destination.droppableId]: {
          ...destColumn,
          cardIds: destCardIds
        }
      });
    }
  };

  const addCard = (columnId, content) => {
    const newCardId = `card-${Date.now()}`;
    const newCard = { id: newCardId, content };

    setCards({
      ...cards,
      [newCardId]: newCard
    });

    const column = columns[columnId];
    const newCardIds = [...column.cardIds, newCardId];

    setColumns({
      ...columns,
      [columnId]: {
        ...column,
        cardIds: newCardIds
      }
    });
  };

  const deleteCard = (cardId) => {
    const newColumns = Object.keys(columns).reduce((acc, columnId) => {
      const column = columns[columnId];
      const newCardIds = column.cardIds.filter(id => id !== cardId);

      acc[columnId] = {
        ...column,
        cardIds: newCardIds
      };

      return acc;
    }, {});

    const { [cardId]: _, ...remainingCards } = cards;

    setColumns(newColumns);
    setCards(remainingCards);
  };

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="board" direction="horizontal">
          {(provided) => (
            <div
              className="kanban-board"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {Object.values(columns).map((column, index) => (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  cards={cards}
                  index={index}
                  addCard={addCard}
                  deleteCard={deleteCard}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
