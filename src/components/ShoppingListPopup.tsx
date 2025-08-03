import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { X, ShoppingCart, Printer } from "lucide-react";

type ShoppingListItem = {
  name: string;
  totalAmount: string;
};

export default function ShoppingListPopup({
  open,
  setOpen,
  shoppingList,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  shoppingList: ShoppingListItem[];
}) {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
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
            </style>
          </head>
          <body>
            <h1>🛒 Shopping List</h1>
            ${shoppingList.map(item => `
              <div class="item">
                <span class="name">${item.name}</span>
                <span class="amount">${item.totalAmount}</span>
              </div>
            `).join('')}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

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
              {shoppingList.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No ingredients to buy</h3>
                  <p className="text-gray-600">Add some recipes to your meal plan to generate a shopping list.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      {shoppingList.length} item{shoppingList.length !== 1 ? 's' : ''} to buy
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    {shoppingList.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                        <span className="text-gray-700 font-medium">{item.name}</span>
                        <span className="text-gray-500 text-sm bg-white px-3 py-1 rounded-full border border-gray-200">
                          {item.totalAmount}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                    <p className="text-sm text-blue-700">
                      💡 <strong>Tip:</strong> You can print this list or take a screenshot to bring to the store.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
} 