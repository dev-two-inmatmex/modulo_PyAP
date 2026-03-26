export interface empresa_style {
    id: number;
    logo: string;
    color: string;
}

export const empresas: empresa_style[] = [
    {
        id: 1,
        logo: "/logos_empresas/PDRlogo.svg",
        //color: "oklch(0.7713 0.0608 358.45)"
        color: "oklch(0.8747 0.0742 356.6)"
    },
    {
        id: 2,
        logo: "/logos_empresas/HGlogo.svg",
        //color: "oklch(0.7357 0.1997 137.93)"
        color: "oklch(0.70 0.16 137.93)"
    },
    {
        id: 3,
        logo: "/logos_empresas/MTMlogo.svg",
        //color: "oklch(0.3883 0.1262 142.32)"
        color: "oklch(0.45 0.12 142.32)"
    }
];

export function EmpresaColor(id: number) {
    const empresa = empresas.find(e => e.id === id);
    if (!empresa) return null;
    return empresa.color;
}