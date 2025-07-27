"use client"
import { useEffect, useState } from 'react'
import { supabase, Room } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchRooms = async () => {
      const { data } = await supabase.from('rooms').select('*')
      setRooms(data || [])
    }
    fetchRooms()
  }, [])

  return (
    <div>
      <h1>All Rooms</h1>
      <ul>
        {rooms.map(room => (
          <li key={room.id}>
            {room.room_code}
            <button onClick={() => router.push(`/room/${room.room_code}`)}>Join</button>
          </li>
        ))}
      </ul>
    </div>
  )
} 