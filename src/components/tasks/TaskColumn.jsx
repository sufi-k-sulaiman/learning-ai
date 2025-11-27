import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';

const TaskColumn = ({ status, tasks, onTaskClick }) => {
  const statusConfig = {
    todo: { label: 'To Do', color: 'bg-gray-500' },
    in_progress: { label: 'In Progress', color: 'bg-blue-500' },
    review: { label: 'In Review', color: 'bg-yellow-500' },
    done: { label: 'Done', color: 'bg-green-500' },
  };

  const { label, color } = statusConfig[status] || { label: 'Unknown', color: 'bg-gray-400' };

  return (
    <div className="bg-gray-100 rounded-xl p-4 w-80 flex-shrink-0">
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-3 h-3 rounded-full ${color}`} />
        <h3 className="font-bold text-gray-800">{label}</h3>
        <span className="ml-auto text-sm font-medium text-gray-500 bg-gray-200 rounded-full px-2 py-0.5">
          {tasks.length}
        </span>
      </div>
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`space-y-3 min-h-[400px] transition-colors duration-200 rounded-lg p-2 ${
              snapshot.isDraggingOver ? 'bg-purple-50' : 'bg-transparent'
            }`}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} onClick={() => onTaskClick(task)} />
            ))}
            {provided.placeholder}
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex items-center justify-center h-40 text-sm text-gray-400">
                No tasks in this stage
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TaskColumn;