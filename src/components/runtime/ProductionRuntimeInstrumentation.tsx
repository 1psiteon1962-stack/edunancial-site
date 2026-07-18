"use client";

import { Component, type ErrorInfo, type ReactNode, useEffect, useState } from "react";

type RuntimeExceptionDetails = {
  exception: string;
  stack: string;
  component: string;
  file: string;
  line: string;
};

type PartialRuntimeExceptionDetails = Partial<RuntimeExceptionDetails>;

function hasValue(value: string | null | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function toDisplayValue(value: string | undefined): string {
  return hasValue(value) ? value : "Unknown";
}

function parseLocationFromStack(stack: string | undefined): { file?: string; line?: string } {
  if (!hasValue(stack)) {
    return {};
  }

  const locationMatch = stack.match(/\(?((?:https?:\/\/|\/)[^():\s]+):(\d+):\d+\)?/);
  if (!locationMatch) {
    return {};
  }

  return {
    file: locationMatch[1],
    line: locationMatch[2],
  };
}

function buildExceptionDetails(input: PartialRuntimeExceptionDetails): RuntimeExceptionDetails {
  const parsedLocation = parseLocationFromStack(input.stack);
  return {
    exception: toDisplayValue(input.exception),
    stack: toDisplayValue(input.stack),
    component: toDisplayValue(input.component),
    file: toDisplayValue(input.file ?? parsedLocation.file),
    line: toDisplayValue(input.line ?? parsedLocation.line),
  };
}

function mergeExceptionDetails(
  current: RuntimeExceptionDetails,
  incoming: PartialRuntimeExceptionDetails
): RuntimeExceptionDetails {
  const next = buildExceptionDetails(incoming);
  return {
    exception: current.exception,
    stack: current.stack,
    component: current.component === "Unknown" ? next.component : current.component,
    file: current.file === "Unknown" ? next.file : current.file,
    line: current.line === "Unknown" ? next.line : current.line,
  };
}

function extractComponent(componentStack: string | null | undefined): string | undefined {
  if (!hasValue(componentStack)) {
    return undefined;
  }

  const topFrame = componentStack
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.startsWith("at "));

  return topFrame?.replace(/^at\s+/, "");
}

function getUnhandledRejectionMessage(reason: unknown): string {
  if (reason instanceof Error) {
    return reason.message;
  }

  if (typeof reason === "string") {
    return reason;
  }

  try {
    return JSON.stringify(reason);
  } catch {
    return String(reason);
  }
}

function getUnhandledRejectionStack(reason: unknown): string | undefined {
  if (reason instanceof Error && hasValue(reason.stack)) {
    return reason.stack;
  }

  return undefined;
}

class GlobalErrorBoundary extends Component<
  {
    onErrorCaptured: (details: PartialRuntimeExceptionDetails) => void;
    children: ReactNode;
  },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onErrorCaptured({
      exception: error.message,
      stack: error.stack ?? info.componentStack ?? undefined,
      component: extractComponent(info.componentStack),
    });
  }

  render() {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}

function ProductionRuntimeErrorPage({ details }: { details: RuntimeExceptionDetails }) {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16 text-white">
      <h1 className="text-3xl font-black">Production Runtime Error</h1>
      <section className="mt-8">
        <h2 className="text-lg font-bold">Exception:</h2>
        <pre className="mt-2 whitespace-pre-wrap break-words text-sm text-slate-200">
          {details.exception}
        </pre>
      </section>
      <section className="mt-8">
        <h2 className="text-lg font-bold">Stack:</h2>
        <pre className="mt-2 max-h-80 overflow-auto whitespace-pre-wrap break-words text-sm text-slate-200">
          {details.stack}
        </pre>
      </section>
      <section className="mt-8">
        <h2 className="text-lg font-bold">Component:</h2>
        <pre className="mt-2 whitespace-pre-wrap break-words text-sm text-slate-200">
          {details.component}
        </pre>
      </section>
      <section className="mt-8">
        <h2 className="text-lg font-bold">File:</h2>
        <pre className="mt-2 whitespace-pre-wrap break-words text-sm text-slate-200">
          {details.file}
        </pre>
      </section>
      <section className="mt-8">
        <h2 className="text-lg font-bold">Line:</h2>
        <pre className="mt-2 whitespace-pre-wrap break-words text-sm text-slate-200">
          {details.line}
        </pre>
      </section>
    </main>
  );
}

export default function ProductionRuntimeInstrumentation({ children }: { children: ReactNode }) {
  const [firstException, setFirstException] = useState<RuntimeExceptionDetails | null>(null);

  const captureException = (details: PartialRuntimeExceptionDetails) => {
    setFirstException((current) => {
      if (!current) {
        return buildExceptionDetails(details);
      }

      return mergeExceptionDetails(current, details);
    });
  };

  useEffect(() => {
    const previousOnError = window.onerror;
    const previousOnUnhandledRejection = window.onunhandledrejection;

    window.onerror = (message, source, lineno, _colno, error) => {
      captureException({
        exception: typeof message === "string" ? message : error?.message,
        stack: error?.stack,
        file: source || undefined,
        line: typeof lineno === "number" && lineno > 0 ? String(lineno) : undefined,
      });

      if (typeof previousOnError === "function") {
        return previousOnError(message, source, lineno, _colno, error);
      }

      return false;
    };

    window.onunhandledrejection = (event) => {
      captureException({
        exception: getUnhandledRejectionMessage(event.reason),
        stack: getUnhandledRejectionStack(event.reason),
      });

      if (typeof previousOnUnhandledRejection === "function") {
        return previousOnUnhandledRejection.call(window, event);
      }
    };

    return () => {
      window.onerror = previousOnError;
      window.onunhandledrejection = previousOnUnhandledRejection;
    };
  }, []);

  if (firstException) {
    return <ProductionRuntimeErrorPage details={firstException} />;
  }

  return (
    <GlobalErrorBoundary onErrorCaptured={captureException}>{children}</GlobalErrorBoundary>
  );
}
