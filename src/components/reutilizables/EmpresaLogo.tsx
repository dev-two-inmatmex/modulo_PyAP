'use client'
import Image from 'next/image';
import { empresas } from '@/services/empresas-data_estilos';
type Props = {
    id: number | null;
    wyh: number;
}
export default function EmpresaLogo({
    id, wyh
}: Props) {
    const empresa = empresas.find(e => e.id === id);
    if (!empresa) return null;
    return <Image src={empresa.logo} alt="Logo" width={wyh} height={wyh} />
}
