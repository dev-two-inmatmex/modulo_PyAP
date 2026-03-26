'use client'
import Image from 'next/image';
import { empresas } from '@/services/empresas-data';
type Props = {
    id: number;
    wyh: number;
}
export default function EmpresaLogo({
    id, wyh
}: Props) {
    const empresa = empresas.find(e => e.id === id);
    if (!empresa) return null;
    return <Image src={empresa.logo} alt="Logo" width={wyh} height={wyh} />
}
