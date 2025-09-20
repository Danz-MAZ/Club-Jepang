'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, ChevronDown, ChevronRight, Search } from 'lucide-react'
import { Barang, SubItem } from '@prisma/client'

interface BarangWithSubItems extends Barang {
  subItems: SubItem[]
}

interface BarangTableProps {
  initialData: BarangWithSubItems[]
}

export default function BarangTable({ initialData }: BarangTableProps) {
  const [data, setData] = useState<BarangWithSubItems[]>(initialData)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())
  const [newItem, setNewItem] = useState({
    produk: '',
    ukuran: '',
    quantity: 0,
    nominal: 0,
  })

  const filteredData = data.filter(item =>
    item.produk.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.ukuran.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalHarga = data.reduce((sum, item) => sum + item.fixPrize, 0)

  const handleAdd = async () => {
    if (!newItem.produk || !newItem.ukuran || newItem.quantity <= 0 || newItem.nominal <= 0) {
      alert('Semua field harus diisi dengan benar!')
      return
    }

    const fixPrize = newItem.quantity * newItem.nominal

    try {
      const response = await fetch('/api/barang', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newItem,
          fixPrize,
        }),
      })

      if (response.ok) {
        const newBarang = await response.json()
        setData([newBarang, ...data])
        setNewItem({ produk: '', ukuran: '', quantity: 0, nominal: 0 })
        setIsAdding(false)
      }
    } catch (error) {
      console.error('Error adding barang:', error)
    }
  }

  const handleEdit = async (id: number, updatedData: Partial<Barang>) => {
    try {
      const response = await fetch(`/api/barang/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      })

      if (response.ok) {
        const updatedBarang = await response.json()
        setData(data.map(item => item.id === id ? updatedBarang : item))
        setEditingId(null)
      }
    } catch (error) {
      console.error('Error updating barang:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus barang ini?')) return

    try {
      const response = await fetch(`/api/barang/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setData(data.filter(item => item.id !== id))
      }
    } catch (error) {
      console.error('Error deleting barang:', error)
    }
  }

  const toggleRowExpansion = (id: number) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  return (
    <div className="bg-white shadow rounded-lg">
      {/* Header */}
      <div className="px-4 py-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-medium text-gray-900">Daftar Barang</h2>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-4">
            <button
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Barang
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cari barang..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Add Form */}
        {isAdding && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tambah Barang Baru</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Produk</label>
                <input
                  type="text"
                  value={newItem.produk}
                  onChange={(e) => setNewItem({ ...newItem, produk: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nama produk"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Ukuran</label>
                <input
                  type="text"
                  value={newItem.ukuran}
                  onChange={(e) => setNewItem({ ...newItem, ukuran: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ml, g, kg, dll"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <input
                  type="number"
                  min="0"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nominal (Rp)</label>
                <input
                  type="number"
                  min="0"
                  value={newItem.nominal}
                  onChange={(e) => setNewItem({ ...newItem, nominal: parseInt(e.target.value) || 0 })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleAdd}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Simpan
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produk
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ukuran
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nominal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fix Prize
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item) => (
                <>
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <button
                          onClick={() => toggleRowExpansion(item.id)}
                          className="mr-2 text-gray-400 hover:text-gray-600"
                        >
                          {expandedRows.has(item.id) ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                        <div className="text-sm font-medium text-gray-900">
                          {item.produk}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.ukuran}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Rp {item.nominal.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Rp {item.fixPrize.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingId(item.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedRows.has(item.id) && (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 bg-gray-50">
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-900">Sub Items:</h4>
                          {item.subItems.length > 0 ? (
                            <ul className="space-y-1">
                              {item.subItems.map((subItem) => (
                                <li key={subItem.id} className="text-sm text-gray-600">
                                  • {subItem.namaSubItem}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-500">Tidak ada sub items</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div className="mt-6 flex justify-end">
          <div className="bg-gray-50 px-4 py-3 rounded-lg">
            <span className="text-lg font-semibold text-gray-900">
              Total Harga: Rp {totalHarga.toLocaleString('id-ID')}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
