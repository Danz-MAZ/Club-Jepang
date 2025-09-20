import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()
    const { produk, ukuran, quantity, nominal, fixPrize } = body

    const barang = await prisma.barang.update({
      where: { id },
      data: {
        produk,
        ukuran,
        quantity,
        nominal,
        fixPrize,
      },
      include: {
        subItems: true,
      },
    })

    return NextResponse.json(barang)
  } catch (error) {
    console.error('Error updating barang:', error)
    return NextResponse.json(
      { error: 'Failed to update barang' },
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

    await prisma.barang.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting barang:', error)
    return NextResponse.json(
      { error: 'Failed to delete barang' },
      { status: 500 }
    )
  }
}
