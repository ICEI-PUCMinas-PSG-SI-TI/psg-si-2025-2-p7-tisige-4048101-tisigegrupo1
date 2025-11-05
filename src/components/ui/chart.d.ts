import * as React from "react";
export type ChartConfig = Record<string, any>;
export declare const ChartContainer: React.FC<{
    config?: ChartConfig;
    children?: React.ReactNode;
}>;
export declare const ChartStyle: React.FC<{
    id?: string;
    config?: ChartConfig;
}>;
export declare const ChartTooltip: (_props: any) => null;
export declare const ChartTooltipContent: React.ForwardRefExoticComponent<Omit<any, "ref"> & React.RefAttributes<HTMLDivElement>>;
export declare const ChartLegend: (_props: any) => null;
export declare const ChartLegendContent: React.ForwardRefExoticComponent<Omit<any, "ref"> & React.RefAttributes<HTMLDivElement>>;
