import { NextResponse } from "next/server"
import { deleteApplication } from "@/lib/storage"

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await deleteApplication(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting application:', error)
    return NextResponse.json(
      { error: 'Failed to delete application' },
      { status: 500 }
    )
  }
} 