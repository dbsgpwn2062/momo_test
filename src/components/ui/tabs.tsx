"use client";

import React from "react";

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
}

export function Tabs({ value, onValueChange, children }: TabsProps) {
  return (
    <div>
      {React.Children.map(children, (child) => {
        // child의 타입을 React.ReactElement로 명시
        return React.cloneElement(
          child as React.ReactElement<TabsTriggerProps>,
          { value, onValueChange }
        );
      })}
    </div>
  );
}

export function TabsList({ children, className }: TabsListProps) {
  return <div className={`flex ${className}`}>{children}</div>;
}

export function TabsTrigger({
  value,
  onValueChange,
  children,
}: TabsTriggerProps) {
  return (
    <button onClick={() => onValueChange(value)} className="p-2">
      {children}
    </button>
  );
}

export function TabsContent({ value, children }: TabsContentProps) {
  return <div>{children}</div>;
}
