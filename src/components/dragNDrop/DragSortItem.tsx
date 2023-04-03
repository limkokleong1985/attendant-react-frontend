import React from 'react';

import { Draggable, DraggableProvided, DraggableStateSnapshot } from '@hello-pangea/dnd'


export type DragChildrenFn<Item> = (provided: DraggableProvided, snapshot: DraggableStateSnapshot, item: Item) => React.ReactNode



interface DraggableItemProps<Item> {
  children: DragChildrenFn<Item>;
  item: Item
  index: number,
  id: number
}

export default function DragSortItem<Item>({ children, item, id, index }: DraggableItemProps<Item>) {
  return (
    <Draggable
      draggableId={`dragable-${id}`}
      index={index}
    >
      {
        (provided, snapshot) => children(provided, snapshot, item)

      }
    </Draggable>
  );
}
