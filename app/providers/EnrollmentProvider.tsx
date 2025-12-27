"use client";

import React, { createContext, useContext } from "react";

type EnrollmentContextType = {
  enrolled: boolean;
};

const EnrollmentContext =
  createContext<EnrollmentContextType | undefined>(undefined);

export function EnrollmentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EnrollmentContext.Provider value={{ enrolled: false }}>
      {children}
    </EnrollmentContext.Provider>
  );
}

export function useEnrollment() {
  const ctx = useContext(EnrollmentContext);
  if (!ctx) {
    throw new Error("useEnrollment must be used within EnrollmentProvider");
  }
  return ctx;
}
