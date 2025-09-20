import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { produk, ukuran, quantity, nominal, fixPrize } = body

    const barang = await prisma.barang.create({
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
    console.error('Error creating barang:', error)
    return NextResponse.json(
      { error: 'Failed to create barang' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const barang = await prisma.barang.findMany({
      include: {
        subItems: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(barang)
  } catch (error) {
    console.error('Error fetching barang:', error)
    return NextResponse.json(
      { error: 'Failed to fetch barang' },
      { status: 500 }
    )
  }
}