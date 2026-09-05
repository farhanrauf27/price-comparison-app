interface Props {
  params: { id: string };
}

export default function ProductDetailsPage({ params }: Props) {
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2">
        {/* Gallery */}
        <div className="aspect-square rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm">
          [Image Presentation Framework]
        </div>

        {/* Comparison Engine */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Sony WH-1000XM5 Headphones</h1>
          <p className="mt-2 text-sm text-slate-500">ID Reference: {params.id}</p>
          
          <h2 className="mt-8 text-lg font-bold text-slate-900">Available Retailer Realtime Offers</h2>
          <div className="mt-4 overflow-hidden border border-slate-200 rounded-xl bg-white shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 font-semibold text-slate-700 text-left">
                <tr>
                  <th className="px-6 py-3">Store Name</th>
                  <th className="px-6 py-3">Stock Condition</th>
                  <th className="px-6 py-3">Final Price</th>
                  <th className="px-6 py-3 text-right">Redirect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 text-slate-700">
                <tr>
                  <td className="px-6 py-4 font-medium text-slate-900">Amazon</td>
                  <td className="px-6 py-4 text-green-600">In Stock</td>
                  <td className="px-6 py-4 font-bold">$348.00</td>
                  <td className="px-6 py-4 text-right">
                    <button className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold px-3 py-1.5 rounded-lg text-xs">Buy Item</button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-slate-900">Walmart</td>
                  <td className="px-6 py-4 text-green-600">In Stock</td>
                  <td className="px-6 py-4 font-bold">$352.99</td>
                  <td className="px-6 py-4 text-right">
                    <button className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold px-3 py-1.5 rounded-lg text-xs">Buy Item</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}