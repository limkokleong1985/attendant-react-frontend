import React from 'react';
import {
  DragDropContext,
  Droppable,
  OnDragEndResponder,
  DraggableProvided,
  DraggableStateSnapshot,
  DroppableProvided,
  DroppableStateSnapshot
} from '@hello-pangea/dnd'
import DragSortItem, { DragChildrenFn } from './DragSortItem';

export type { DragChildrenFn, DraggableProvided, DraggableStateSnapshot }

export type DropColumnFn = (provided: DroppableProvided, snapshot: DroppableStateSnapshot, dragChildren: React.ReactNode) => React.ReactNode

export type DragItemColumnType<T extends string, Item> = {
  [key in T]: string
} & {
  id: number,
  childrenItem: Item,
  children: DragChildrenFn<Item>,
}

export interface ColumnType {
  id: string,
  type: string,
  children: DropColumnFn
}

interface DragSortableListProps<T extends string, Item, ItemExtend extends DragItemColumnType<T, Item>> {
  items: ItemExtend[];
  onChange: (items: ItemExtend[]) => void;
  columns: ColumnType[];
  columnIdName: T;
}

export default function DragSort<T extends string, Item, ItemExtend extends DragItemColumnType<T, Item>>({ items, columnIdName, onChange, columns }: DragSortableListProps<T, Item, ItemExtend>) {

  type ItemsByColumn = { [key: string]: ItemExtend[] };

  const itemsByColumn: ItemsByColumn = columns.reduce((acc: ItemsByColumn, column) => {
    acc[column.id] = items.filter((item) => item[columnIdName] === column.id);
    return acc;
  }, {});

  const handleOnchange: OnDragEndResponder = (drag) => {
    const { destination, source, draggableId } = drag;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    const sourceItems = [...itemsByColumn[source.droppableId]];
    const destinationItems =
      source.droppableId === destination.droppableId
        ? sourceItems
        : [...itemsByColumn[destination.droppableId]];

    const currentDragItem = sourceItems.splice(source.index, 1)[0];
    (currentDragItem as DragItemColumnType<T, Item>)[columnIdName] =
      destination.droppableId as DragItemColumnType<T, Item>[T];

    destinationItems.splice(destination.index, 0, currentDragItem);

    const updatedItems = columns.reduce<ItemExtend[]>((result, column) => {
      return result.concat(
        column.id === source.droppableId
          ? sourceItems
          : column.id === destination.droppableId
            ? destinationItems
            : itemsByColumn[column.id]
      );
    }, []);

    onChange(updatedItems);
  };



  return (
    <DragDropContext onDragEnd={handleOnchange}>
      {
        columns && columns.map((colum, index) => (
          <Droppable key={index} droppableId={colum.id} type={colum.type}>
            {
              (provided, snapshot) => colum.children(provided, snapshot, <>
                {itemsByColumn[colum.id].map((item, index) => (
                  <div key={item.id}>
                    <DragSortItem
                      index={index}
                      item={item.childrenItem}
                      id={item.id}
                    >
                      {item.children}
                    </DragSortItem>
                  </div>
                ))}
              </>)
            }
          </Droppable>
        ))
      }


    </DragDropContext>

  );
}
