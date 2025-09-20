import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()
    const { tanggal, penyumbang, keterangan, nominal } = body

    const pemasukan = await prisma.pemasukan.update({
      where: { id },
      data: {
        tanggal: new Date(tanggal),
        penyumbang,
        keterangan,
        nominal,
      },
    })

    return NextResponse.json(pemasukan)
  } catch (error) {
    console.error('Error updating pemasukan:', error)
    return NextResponse.json(
      { error: 'Failed to update pemasukan' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    await prisma.pemasukan.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting pemasukan:', error)
    return NextResponse.json(
      { error: 'Failed to delete pemasukan' },
      { status: 500 }
    )
  }
}
