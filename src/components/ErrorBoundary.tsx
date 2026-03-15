"use client";

import { Component, type ReactNode } from "react";
import { AlertCircle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          <AlertCircle className="size-8 text-terminal-red" />
          <p className="mono text-base text-foreground">Something went wrong</p>
          <p className="mono text-sm text-muted-foreground">
            Try refreshing the page.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mono text-sm text-terminal-green hover:underline"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
