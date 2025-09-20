import { prisma } from '@/lib/prisma'
import BarangTable from '@/components/BarangTable'

export default async function BarangPage() {
  const barangData = await prisma.barang.findMany({
    include: {
      subItems: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Daftar Barang</h1>
        <p className="mt-2 text-gray-600">
          Kelola daftar harga barang dan bahan makanan
        </p>
      </div>

      <BarangTable initialData={barangData} />
    </div>
  )
}
