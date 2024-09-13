// src/components/KanbanBoard.js
import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import KanbanColumn from './KanbanColumn';

const KanbanBoard = ({ columns, onDragEnd }) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="board" direction="horizontal">
        {(provided) => (
          <div
            className="kanban-board"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {columns.map((column, index) => (
              <KanbanColumn key={column.id} column={column} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default KanbanBoard;
