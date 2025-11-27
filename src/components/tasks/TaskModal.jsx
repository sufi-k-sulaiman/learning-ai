import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Paperclip, Upload, Trash2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const PRIORITIES = ['low', 'medium', 'high', 'urgent'];
const STATUSES = ['todo', 'in_progress', 'review', 'done'];

const PRIORITY_CONFIG = {
  low: { label: 'Low' },
  medium: { label: 'Medium' },
  high: { label: 'High' },
  urgent: { label: 'Urgent' },
};

const STATUS_CONFIG = {
  todo: { label: 'To Do' },
  in_progress: { label: 'In Progress' },
  review: { label: 'In Review' },
  done: { label: 'Done' },
};

export default function TaskModal({ task, isOpen, onClose, onSave, onDelete, categories }) {
  const [editedTask, setEditedTask] = useState(task);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setEditedTask(task);
  }, [task]);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (!editedTask) return;
    setIsUploading(true);
    try {
      const uploadPromises = acceptedFiles.map(file => base44.integrations.Core.UploadFile({ file }));
      const uploadedFiles = await Promise.all(uploadPromises);
      const newAttachments = uploadedFiles.map(f => f.file_url);
      
      setEditedTask(prev => ({
        ...prev,
        attachments: [...(prev.attachments || []), ...newAttachments]
      }));
      toast.success(`${acceptedFiles.length} file(s) uploaded successfully.`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error('File upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [editedTask]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, noClick: true });

  const handlePaste = async (event) => {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    for (const item of items) {
      if (item.type.indexOf('image') === 0) {
        const file = item.getAsFile();
        onDrop([file]);
      }
    }
  };

  const removeAttachment = (urlToRemove) => {
    setEditedTask(prev => ({
      ...prev,
      attachments: prev.attachments.filter(url => url !== urlToRemove)
    }));
  };

  const handleSave = () => {
    onSave(editedTask);
    onClose();
  };

  const handleDelete = () => {
    onDelete(editedTask.id);
    onClose();
  }

  if (!isOpen || !editedTask) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl" {...getRootProps()} onPaste={handlePaste}>
        <input {...getInputProps()} />
        <DialogHeader>
          <DialogTitle>
            <Input 
              value={editedTask.title}
              onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
              className="text-xl font-bold border-0 shadow-none focus-visible:ring-0 px-0"
              placeholder="Task Title"
            />
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-6 py-4">
          <div className="col-span-2 space-y-4">
            <Textarea
              placeholder="Add a description..."
              value={editedTask.description}
              onChange={(e) => setEditedTask({...editedTask, description: e.target.value})}
              className="min-h-[120px]"
            />
            
            <div>
              <h4 className="font-semibold text-sm mb-2">Attachments</h4>
              <div 
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  isDragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300'
                }`}
              >
                {isUploading ? (
                   <p className="text-sm text-gray-500">Uploading...</p>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Drag & drop files or paste screenshots here.</p>
                  </div>
                )}
              </div>
              <div className="mt-4 space-y-2">
                {editedTask.attachments?.map((url, i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-600 truncate hover:underline">
                      <Paperclip className="w-4 h-4 inline-block mr-2" />
                      {url.split('/').pop()}
                    </a>
                    <Button variant="ghost" size="icon" onClick={() => removeAttachment(url)}>
                      <Trash2 className="w-4 h-4 text-gray-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="col-span-1 space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Status</label>
              <Select value={editedTask.status} onValueChange={(v) => setEditedTask({...editedTask, status: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUSES.map(s => <SelectItem key={s} value={s}>{STATUS_CONFIG[s].label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Category</label>
              <Select value={editedTask.category} onValueChange={(v) => setEditedTask({...editedTask, category: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Priority</label>
              <Select value={editedTask.priority} onValueChange={(v) => setEditedTask({...editedTask, priority: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map(p => <SelectItem key={p} value={p}>{PRIORITY_CONFIG[p].label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Due Date</label>
              <Input 
                type="date"
                value={editedTask.due_date || ''}
                onChange={(e) => setEditedTask({...editedTask, due_date: e.target.value})}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between items-center">
           <Button variant="destructive" onClick={handleDelete}><Trash2 className="w-4 h-4 mr-2" />Delete</Button>
           <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">Save Task</Button>
           </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}