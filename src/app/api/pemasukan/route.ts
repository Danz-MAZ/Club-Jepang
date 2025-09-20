import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tanggal, penyumbang, keterangan, nominal } = body

    const pemasukan = await prisma.pemasukan.create({
      data: {
        tanggal: new Date(tanggal),
        penyumbang,
        keterangan,
        nominal,
      },
    })

    return NextResponse.json(pemasukan)
  } catch (error) {
    console.error('Error creating pemasukan:', error)
    return NextResponse.json(
      { error: 'Failed to create pemasukan' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const pemasukan = await prisma.pemasukan.findMany({
      orderBy: {
        tanggal: 'desc',
      },
    })

    return NextResponse.json(pemasukan)
  } catch (error) {
    console.error('Error fetching pemasukan:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pemasukan' },
      { status: 500 }
    )
  }
}
