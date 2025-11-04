import * as React from "react";

// Minimal shim for chart components to avoid brittle external typings during TS builds.
export type ChartConfig = Record<string, any>;

export const ChartContainer: React.FC<{ config?: ChartConfig; children?: React.ReactNode }> = ({ children }) => {
  return <div>{children}</div>;
};

export const ChartStyle: React.FC<{ id?: string; config?: ChartConfig }> = () => null;

export const ChartTooltip = (_props: any) => null;

export const ChartTooltipContent = React.forwardRef<HTMLDivElement, any>((_props, _ref) => null);

export const ChartLegend = (_props: any) => null;

export const ChartLegendContent = React.forwardRef<HTMLDivElement, any>(() => null);

// Individual exports already declared above — no additional re-export needed.

