import React from "react";

export function Card({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}): JSX.Element {
  return (
    <div className="border p-4 rounded-lg bg-slate-100 shadow-md">
      <h1 className="text-xl border-b pb-2">{title}</h1>
      <div>{children}</div>
    </div>
  );
}
