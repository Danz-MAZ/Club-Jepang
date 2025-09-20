import { prisma } from '@/lib/prisma'
import { Package, DollarSign, TrendingUp } from 'lucide-react'

export default async function Dashboard() {
  // Fetch data for dashboard
  const [barangData, pemasukanData] = await Promise.all([
    prisma.barang.findMany(),
    prisma.pemasukan.findMany(),
  ])

  const totalBarang = barangData.length
  const totalHargaBarang = barangData.reduce((sum, barang) => sum + barang.fixPrize, 0)
  const totalPemasukan = pemasukanData.reduce((sum, pemasukan) => sum + pemasukan.nominal, 0)

  const stats = [
    {
      name: 'Total Barang',
      value: totalBarang,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      name: 'Total Harga Barang',
      value: `Rp ${totalHargaBarang.toLocaleString('id-ID')}`,
      icon: Package,
      color: 'bg-green-500',
    },
    {
      name: 'Total Pemasukan',
      value: `Rp ${totalPemasukan.toLocaleString('id-ID')}`,
      icon: DollarSign,
      color: 'bg-yellow-500',
    },
    {
      name: 'Sisa Saldo',
      value: `Rp ${(totalPemasukan - totalHargaBarang).toLocaleString('id-ID')}`,
      icon: TrendingUp,
      color: totalPemasukan - totalHargaBarang >= 0 ? 'bg-green-500' : 'bg-red-500',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Ringkasan manajemen keuangan dan inventaris Club Jepang
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.name}
              className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6"
            >
              <dt>
                <div className={`absolute rounded-md p-3 ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">
                  {stat.name}
                </p>
              </dt>
              <dd className="ml-16 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">
                  {stat.value}
                </p>
              </dd>
            </div>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Barang */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Barang Terbaru
            </h3>
            <div className="space-y-3">
              {barangData.slice(0, 5).map((barang) => (
                <div
                  key={barang.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {barang.produk}
                    </p>
                    <p className="text-sm text-gray-500">
                      {barang.quantity} {barang.ukuran}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    Rp {barang.fixPrize.toLocaleString('id-ID')}
                  </p>
                </div>
              ))}
              {barangData.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  Belum ada data barang
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Pemasukan */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Pemasukan Terbaru
            </h3>
            <div className="space-y-3">
              {pemasukanData.slice(0, 5).map((pemasukan) => (
                <div
                  key={pemasukan.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {pemasukan.penyumbang}
                    </p>
                    <p className="text-sm text-gray-500">
                      {pemasukan.tanggal.toLocaleDateString('id-ID')} - {pemasukan.keterangan}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-green-600">
                    Rp {pemasukan.nominal.toLocaleString('id-ID')}
                  </p>
                </div>
              ))}
              {pemasukanData.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  Belum ada data pemasukan
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
