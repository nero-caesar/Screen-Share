import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for TypeScript support
export interface Room {
  id: string
  room_code: string
  created_at: string
  updated_at: string
  is_active: boolean
  sharer_id?: string
  viewer_count?: number
}

export interface CreateRoomData {
  room_code: string
  sharer_id?: string
  is_active?: boolean
}

// Room management functions
export async function createRoom(roomData: CreateRoomData) {
  return await supabase
    .from('rooms')
    .insert([roomData])
    .select()
}

export async function getRoomByCode(roomCode: string) {
  return await supabase
    .from('rooms')
    .select('*')
    .eq('room_code', roomCode)
    .single()
}

export async function updateRoomStatus(roomId: string, isActive: boolean) {
  return await supabase
    .from('rooms')
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq('id', roomId)
}

export async function getAllRooms() {
  return await supabase
    .from('rooms')
    .select('*')
    .order('created_at', { ascending: false })
}

export async function deleteRoom(roomId: string) {
  return await supabase
    .from('rooms')
    .delete()
    .eq('id', roomId)
} 