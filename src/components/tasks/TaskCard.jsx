import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Badge } from '@/components/ui/badge';
import { Paperclip, MessageSquare } from 'lucide-react';

const PRIORITY_CONFIG = {
  low: { label: 'Low', color: 'bg-gray-100 text-gray-600' },
  medium: { label: 'Medium', color: 'bg-blue-100 text-blue-700' },
  high: { label: 'High', color: 'bg-orange-100 text-orange-700' },
  urgent: { label: 'Urgent', color: 'bg-red-100 text-red-700' },
};

const TaskCard = ({ task, index, onClick }) => {
  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  const attachmentCount = task.attachments?.length || 0;

  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className={`bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-all cursor-pointer ${
            snapshot.isDragging ? 'shadow-lg ring-2 ring-purple-500' : 'border-gray-200'
          }`}
        >
          <h4 className="font-semibold text-gray-800 mb-2">{task.title}</h4>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Badge variant="outline">{task.category}</Badge>
            <Badge className={`${priority.color} font-medium`}>{priority.label}</Badge>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-3 text-gray-500">
              {attachmentCount > 0 && (
                <div className="flex items-center gap-1 text-xs">
                  <Paperclip className="w-3 h-3" />
                  <span>{attachmentCount}</span>
                </div>
              )}
            </div>
            {task.due_date && (
                <span className="text-xs text-gray-500">
                    Due: {new Date(task.due_date).toLocaleDateString()}
                </span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;