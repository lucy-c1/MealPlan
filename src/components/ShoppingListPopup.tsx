import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { X, ShoppingCart, Printer, GripVertical, Check, X as XIcon } from "lucide-react";
import type { ShoppingListItem } from "@/types/type";
import { useState, useEffect, useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

type DragItem = {
  id: string;
  index: number;
};

function DraggableShoppingItem({
  item,
  index,
  moveItem,
  toggleChecked,
  toggleExcluded,
}: {
  item: ShoppingListItem;
  index: number;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  toggleChecked: (id: string) => void;
  toggleExcluded: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  
  const [{ isDragging }, drag] = useDrag({
    type: "SHOPPING_ITEM",
    item: { id: item.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "SHOPPING_ITEM",
    hover: (draggedItem: DragItem, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = draggedItem.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveItem(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      draggedItem.index = hoverIndex;
    },
  });

  drag(drop(ref));

  if (item.excluded) {
    return (
      <div
        ref={ref}
        className={`flex items-center gap-3 py-3 px-4 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 transition-all duration-200 ${
          isDragging ? "opacity-50" : "opacity-100"
        }`}
      >
        <div className="flex items-center justify-center w-5 h-5 text-gray-400 cursor-move">
          <GripVertical className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <span className="text-gray-400 line-through font-medium">{item.name}</span>
          <span className="text-gray-400 text-sm ml-2 line-through">{item.totalAmount}</span>
        </div>
        <button
          onClick={() => toggleExcluded(item.id)}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          title="Include item"
        >
          <Check className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`flex items-center gap-3 py-3 px-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-all duration-200 ${
        isDragging ? "opacity-50" : "opacity-100"
      } ${item.checked ? "bg-green-50 border-green-200" : ""}`}
    >
      <div className="flex items-center justify-center w-5 h-5 text-gray-400 cursor-move">
        <GripVertical className="w-4 h-4" />
      </div>
      
      <button
        onClick={() => toggleChecked(item.id)}
        className={`flex items-center justify-center w-5 h-5 rounded border-2 transition-colors ${
          item.checked
            ? "bg-green-500 border-green-500 text-white"
            : "border-gray-300 hover:border-green-400"
        }`}
        title={item.checked ? "Uncheck item" : "Check item"}
      >
        {item.checked && <Check className="w-3 h-3" />}
      </button>
      
      <div className="flex-1">
        <span className={`font-medium ${item.checked ? "text-green-700 line-through" : "text-gray-700"}`}>
          {item.name}
        </span>
        <span className={`text-sm ml-2 ${item.checked ? "text-green-600 line-through" : "text-gray-500"}`}>
          {item.totalAmount}
        </span>
      </div>
      
      <button
        onClick={() => toggleExcluded(item.id)}
        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
        title="Exclude item"
      >
        <XIcon className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function ShoppingListPopup({
  open,
  setOpen,
  shoppingList,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  shoppingList: ShoppingListItem[];
}) {
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [showExcluded, setShowExcluded] = useState(false);

  // Initialize items when shopping list changes
  useEffect(() => {
    setItems([...shoppingList]);
  }, [shoppingList]);

  const moveItem = (dragIndex: number, hoverIndex: number) => {
    setItems((prevItems) => {
      const newItems = [...prevItems];
      const draggedItem = newItems[dragIndex];
      
      // Remove the dragged item
      newItems.splice(dragIndex, 1);
      
      // Insert it at the new position
      newItems.splice(hoverIndex, 0, draggedItem);
      
      // Update order property
      newItems.forEach((item, index) => {
        item.order = index;
      });
      
      return newItems;
    });
  };

  const toggleChecked = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const toggleExcluded = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, excluded: !item.excluded } : item
    ));
  };

  const getFilteredItems = () => {
    if (showExcluded) {
      return items.filter(item => item.excluded);
    }
    return items.filter(item => !item.excluded);
  };

  const getActiveItems = () => items.filter(item => !item.excluded);
  const getCheckedItems = () => items.filter(item => item.checked && !item.excluded);
  const getExcludedItems = () => items.filter(item => item.excluded);

  const handlePrint = () => {
    const activeItems = getActiveItems();
    const itemsToPrint = activeItems.filter(item => !item.checked);
    
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Shopping List</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #333; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
              .item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
              .item:last-child { border-bottom: none; }
              .name { font-weight: 500; }
              .amount { color: #666; }
              .checked { text-decoration: line-through; color: #999; }
              .summary { margin-top: 20px; padding: 10px; background: #f8f9fa; border-radius: 5px; }
            </style>
          </head>
          <body>
            <h1>🛒 Shopping List</h1>
            ${itemsToPrint
              .map(
                (item) => `
              <div class="item">
                <span class="name">${item.name}</span>
                <span class="amount">${item.totalAmount}</span>
              </div>
            `
              )
              .join("")}
            <div class="summary">
              <strong>Summary:</strong> ${itemsToPrint.length} items to buy, ${getCheckedItems().length} items completed
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const activeItems = getActiveItems();
  const checkedCount = getCheckedItems().length;
  const excludedCount = getExcludedItems().length;

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="max-h-[90vh] overflow-auto scrollbar-hide relative transform rounded-2xl bg-white px-0 pb-0 text-left shadow-2xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-2xl data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            {/* Header */}
            <div className="sticky top-0 z-20 flex justify-between items-center p-6 bg-white border-b border-gray-100 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <DialogTitle as="h3" className="text-2xl font-bold text-gray-900">
                  Shopping List
                </DialogTitle>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="cursor-pointer rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 hover:text-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-hidden transition-all duration-200 p-2"
                  title="Print shopping list"
                >
                  <span className="sr-only">Print</span>
                  <Printer aria-hidden="true" className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="cursor-pointer rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-hidden transition-all duration-200 p-2"
                >
                  <span className="sr-only">Close</span>
                  <X aria-hidden="true" className="size-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No ingredients to buy
                  </h3>
                  <p className="text-gray-600">
                    Add some recipes to your meal plan to generate a shopping list.
                  </p>
                </div>
              ) : (
                <DndProvider backend={HTML5Backend}>
                  <div className="space-y-4">
                    {/* Summary Stats */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{activeItems.length} active items</span>
                        {checkedCount > 0 && (
                          <span className="text-green-600">{checkedCount} completed</span>
                        )}
                        {excludedCount > 0 && (
                          <span className="text-gray-400">{excludedCount} excluded</span>
                        )}
                      </div>
                      
                      {excludedCount > 0 && (
                        <button
                          onClick={() => setShowExcluded(!showExcluded)}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          {showExcluded ? "Show Active Items" : "Show Excluded Items"}
                        </button>
                      )}
                    </div>

                    {/* Items List */}
                    <div className="space-y-2">
                      {getFilteredItems().map((item, index) => (
                        <DraggableShoppingItem
                          key={item.id}
                          item={item}
                          index={items.findIndex(i => i.id === item.id)}
                          moveItem={moveItem}
                          toggleChecked={toggleChecked}
                          toggleExcluded={toggleExcluded}
                        />
                      ))}
                    </div>

                    {/* Tips */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                      <p className="text-sm text-blue-700">
                        💡 <strong>Tips:</strong> Drag items to reorder, check off completed items, or exclude items you don't need. 
                        Only unchecked items will be included in the printed list.
                      </p>
                    </div>
                  </div>
                </DndProvider>
              )}
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
