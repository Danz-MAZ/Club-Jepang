'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import { Pemasukan } from '@prisma/client'

interface PemasukanTableProps {
  initialData: Pemasukan[]
}

export default function PemasukanTable({ initialData }: PemasukanTableProps) {
  const [data, setData] = useState<Pemasukan[]>(initialData)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [newItem, setNewItem] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    penyumbang: '',
    keterangan: 'DalamClub',
    nominal: 0,
  })

  const filteredData = data.filter(item =>
    item.penyumbang.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.keterangan.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPemasukan = data.reduce((sum, item) => sum + item.nominal, 0)

  const handleAdd = async () => {
    if (!newItem.penyumbang || newItem.nominal <= 0) {
      alert('Semua field harus diisi dengan benar!')
      return
    }

    try {
      const response = await fetch('/api/pemasukan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newItem,
          tanggal: new Date(newItem.tanggal),
        }),
      })

      if (response.ok) {
        const newPemasukan = await response.json()
        setData([newPemasukan, ...data])
        setNewItem({
          tanggal: new Date().toISOString().split('T')[0],
          penyumbang: '',
          keterangan: 'DalamClub',
          nominal: 0,
        })
        setIsAdding(false)
      }
    } catch (error) {
      console.error('Error adding pemasukan:', error)
    }
  }

  const handleEdit = async (id: number, updatedData: Partial<Pemasukan>) => {
    try {
      const response = await fetch(`/api/pemasukan/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      })

      if (response.ok) {
        const updatedPemasukan = await response.json()
        setData(data.map(item => item.id === id ? updatedPemasukan : item))
        setEditingId(null)
      }
    } catch (error) {
      console.error('Error updating pemasukan:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data pemasukan ini?')) return

    try {
      const response = await fetch(`/api/pemasukan/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setData(data.filter(item => item.id !== id))
      }
    } catch (error) {
      console.error('Error deleting pemasukan:', error)
    }
  }

  return (
    <div className="bg-white shadow rounded-lg">
      {/* Header */}
      <div className="px-4 py-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-medium text-gray-900">Data Pemasukan</h2>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-4">
            <button
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Pemasukan
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
              placeholder="Cari pemasukan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        {/* Add Form */}
        {isAdding && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tambah Pemasukan Baru</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tanggal</label>
                <input
                  type="date"
                  value={newItem.tanggal}
                  onChange={(e) => setNewItem({ ...newItem, tanggal: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nama Penyumbang</label>
                <input
                  type="text"
                  value={newItem.penyumbang}
                  onChange={(e) => setNewItem({ ...newItem, penyumbang: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  placeholder="Nama penyumbang"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Keterangan</label>
                <select
                  value={newItem.keterangan}
                  onChange={(e) => setNewItem({ ...newItem, keterangan: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                >
                  <option value="DalamClub">Dalam Club</option>
                  <option value="OrangLuarClub">Orang Luar Club</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nominal (Rp)</label>
                <input
                  type="number"
                  min="0"
                  value={newItem.nominal}
                  onChange={(e) => setNewItem({ ...newItem, nominal: parseInt(e.target.value) || 0 })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
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
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
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
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Penyumbang
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Keterangan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nominal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(item.tanggal).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.penyumbang}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      item.keterangan === 'DalamClub' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {item.keterangan === 'DalamClub' ? 'Dalam Club' : 'Orang Luar Club'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    Rp {item.nominal.toLocaleString('id-ID')}
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div className="mt-6 flex justify-end">
          <div className="bg-green-50 px-4 py-3 rounded-lg">
            <span className="text-lg font-semibold text-green-900">
              Total Pemasukan: Rp {totalPemasukan.toLocaleString('id-ID')}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
