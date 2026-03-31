"use client"
import { useRealtimeEmpleados } from '@/hooks/useRealtimeEmpleados';


export default function RealtimeManager() {
    useRealtimeEmpleados();

    return null;
}