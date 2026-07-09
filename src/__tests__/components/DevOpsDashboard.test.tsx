import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import DevOpsDashboard from "@/components/DevOpsDashboard";

describe("DevOpsDashboard", () => {
  it("renders the dashboard heading", () => {
    render(<DevOpsDashboard />);
    expect(screen.getByRole("heading", { name: /devops dashboard/i })).toBeInTheDocument();
  });

  it("displays current version section", () => {
    render(<DevOpsDashboard />);
    expect(screen.getByText(/current version/i)).toBeInTheDocument();
  });

  it("shows deployment history table", () => {
    render(<DevOpsDashboard />);
    expect(screen.getByText(/deployment history/i)).toBeInTheDocument();
  });

  it("shows build history table", () => {
    render(<DevOpsDashboard />);
    expect(screen.getByRole("heading", { name: /build history/i })).toBeInTheDocument();
  });

  it("shows latest release notes", () => {
    render(<DevOpsDashboard />);
    expect(screen.getByText(/latest release notes/i)).toBeInTheDocument();
  });

  it("indicates demo data mode", () => {
    render(<DevOpsDashboard />);
    expect(screen.getByText(/demo data/i)).toBeInTheDocument();
  });

  it("renders environment health cards", () => {
    render(<DevOpsDashboard />);
    expect(screen.getByText("Production")).toBeInTheDocument();
    expect(screen.getByText("Staging")).toBeInTheDocument();
    expect(screen.getByText("Development")).toBeInTheDocument();
  });
});
