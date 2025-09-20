import { prisma } from '@/lib/prisma'
import PemasukanTable from '@/components/PemasukanTable'

export default async function PemasukanPage() {
  const pemasukanData = await prisma.pemasukan.findMany({
    orderBy: {
      tanggal: 'desc',
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Pemasukan</h1>
        <p className="mt-2 text-gray-600">
          Kelola data pemasukan dan donasi Club Jepang
        </p>
      </div>

      <PemasukanTable initialData={pemasukanData} />
    </div>
  )
}
