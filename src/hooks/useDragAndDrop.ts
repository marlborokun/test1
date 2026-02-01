import { useState, useCallback } from 'react';
import type { DragEvent } from 'react';

export const useDragAndDrop = (onReorder: (dragId: string, dropId: string) => void) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const handleDragStart = useCallback((e: DragEvent<HTMLElement>, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);

    // Add a slight delay to allow the drag image to be set
    setTimeout(() => {
      (e.target as HTMLElement).style.opacity = '0.5';
    }, 0);
  }, []);

  const handleDragEnd = useCallback((e: DragEvent<HTMLElement>) => {
    setDraggedId(null);
    setDragOverId(null);
    (e.target as HTMLElement).style.opacity = '1';
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLElement>, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (id !== draggedId) {
      setDragOverId(id);
    }
  }, [draggedId]);

  const handleDragLeave = useCallback(() => {
    setDragOverId(null);
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLElement>, dropId: string) => {
    e.preventDefault();
    const dragId = e.dataTransfer.getData('text/plain');
    if (dragId && dragId !== dropId) {
      onReorder(dragId, dropId);
    }
    setDraggedId(null);
    setDragOverId(null);
  }, [onReorder]);

  return {
    draggedId,
    dragOverId,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
};
