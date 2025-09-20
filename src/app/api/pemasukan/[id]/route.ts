import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    const pemasukan = await prisma.pemasukan.findUnique({
      where: { id },
    })

    if (!pemasukan) {
      return NextResponse.json(
        { error: 'Pemasukan not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(pemasukan)
  } catch (error) {
    console.error('Error fetching pemasukan:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pemasukan' },
      { status: 500 }
    )
  }
}

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
