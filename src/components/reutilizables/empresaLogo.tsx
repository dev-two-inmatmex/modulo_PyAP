'use client';
import Image from 'next/image';

export interface empresa_style {
    id: number;
    logo: string;
    color: string;
}

export const empresas: empresa_style[] = [
    {
        id: 1,
        logo: "/logos_empresas/PDRlogo.svg",
        color: "bg-pink"
    },
    {
        id: 2,
        logo: "/logos_empresas/HGlogo.svg",
        color: "bg-blue"
    },
    {
        id: 3,
        logo: "/logos_empresas/MTMlogo.svg",
        color: "bg-green"
    }
];
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