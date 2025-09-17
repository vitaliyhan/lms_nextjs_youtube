"use client"

import { AdminCourseSingularType } from "@/app/data/admin/admin-get-course";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import {
  DndContext,
  DraggableSyntheticListeners,
  KeyboardSensor,
  PointerSensor,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown, ChevronRight, GripVertical } from "lucide-react";
import { ReactNode, useState } from "react";

interface iAppProps {
  data: AdminCourseSingularType;
}

interface SortableItemProps {
  id: string;
  children: (listeners: DraggableSyntheticListeners) => ReactNode;
  className?: string;
  data?: {
    type: "chapter" | "lesson";
    chapterId?: string;
  };
}

export default function CourseStructure({ data }: iAppProps) {
  const initialItems =
    data.chapter.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      order: chapter.position,
      isOpen: true, // default is true
      lessons:
        chapter.lessons.map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          order: lesson.position,
        })) || [],
    })) || [];

  const [items, setItems] = useState(initialItems);

  function SortableItem({ children, id, className, data }: SortableItemProps) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: id, data: data });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes} // keep attributes here
        className={cn(
          "touch-none",
          className,
          isDragging ? "z-10 shadow-lg" : ""
        )}
      >
        {children(listeners)} {/* listeners will only be passed to drag handle */}
      </div>
    );
  }

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div>
      <DndContext
        collisionDetection={rectIntersection}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Chapters</CardTitle>
          </CardHeader>
          <CardContent>
            <SortableContext items={items} strategy={verticalListSortingStrategy}>
              {items.map((item) => (
                <SortableItem key={item.id} id={item.id} data={{ type: "chapter" }}>
                  {(listeners) => (
                    <Card className="mb-2">
                      <Collapsible
                        open={item.isOpen}
                        onOpenChange={(open) =>
                          setItems((prev) =>
                            prev.map((ch) =>
                              ch.id === item.id ? { ...ch, isOpen: open } : ch
                            )
                          )
                        }
                      >
                        <div className="flex items-center justify-between p-3 border-b border-border">
                          <div className="flex items-center gap-2">
                            {/* ✅ Drag handle only */}
                            <button
                              className="cursor-grab opacity-60 hover:opacity-100"
                              {...listeners}
                            >
                              <GripVertical className="size-4" />
                            </button>

                            {/* ✅ Collapsible trigger */}
                            <CollapsibleTrigger asChild>
                              <button className="flex items-center gap-1">
                                {item.isOpen ? (
                                  <ChevronDown className="size-4" />
                                ) : (
                                  <ChevronRight className="size-4" />
                                )}
                                <span>{item.title}</span>
                              </button>
                            </CollapsibleTrigger>
                          </div>
                        </div>

                        {/* ✅ Collapsible content */}
                        <CollapsibleContent>
                          <div className="p-3">
                            {item.lessons.map((lesson) => (
                              <div
                                key={lesson.id}
                                className="pl-6 py-1 text-sm text-muted-foreground"
                              >
                                {lesson.title}
                              </div>
                            ))}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </Card>
                  )}
                </SortableItem>
              ))}
            </SortableContext>
          </CardContent>
        </Card>
      </DndContext>
    </div>
  );
}
