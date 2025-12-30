import React from "react";

type GlobalLayoutProps = {
  title?: string;
  children: React.ReactNode;
};

const GlobalLayout = ({ title, children }: GlobalLayoutProps) => {
  return (
    <main style={{ maxWidth: "900px", margin: "0 auto", padding: "1.5rem" }}>
      {title && <h1>{title}</h1>}
      {children}
    </main>
  );
};

export default GlobalLayout;
