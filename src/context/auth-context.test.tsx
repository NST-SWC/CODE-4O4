import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "./auth-context";

// Provide a simple localStorage polyfill for test environments where it's not
// available or implemented with non-standard APIs (defensive).
if (typeof window !== "undefined" && (!window.localStorage || typeof window.localStorage.setItem !== "function")) {
  const store: Record<string, string> = {};
  const polyfill: Storage = {
    get length() {
      return Object.keys(store).length;
    },
    clear: () => {
      for (const k in store) delete store[k];
    },
    getItem: (k: string) => (k in store ? store[k] : null),
    key: (index: number) => Object.keys(store)[index] ?? null,
    removeItem: (k: string) => {
      if (k in store) {
        delete store[k];
      }
    },
    setItem: (k: string, v: string) => {
      store[k] = String(v);
    },
  };
  Object.defineProperty(window, "localStorage", {
    value: polyfill,
    configurable: true,
  });
}

function AuthTester({ username, password }: { username: string; password: string }) {
  const { user, login } = useAuth();
  const handle = async () => {
    const res = await login({ username, password });
    // render result into DOM
    const el = document.getElementById("result")!;
    el.textContent = `${res.ok ? "ok" : "err"}:${res.message}${res.user ? ":" + res.user.id : ""}`;
  };
  return (
    <div>
      <div data-testid="user">{user ? user.name : "no-user"}</div>
      <button onClick={handle}>do-login</button>
      <div id="result" data-testid="result"></div>
    </div>
  );
}

describe("AuthContext login", () => {
  beforeEach(() => {
    // Clear localStorage between tests (be defensive in case clear() isn't available)
    try {
      if (window.localStorage && typeof window.localStorage.clear === "function") {
        window.localStorage.clear();
      } else {
        window.localStorage.removeItem("nstswc-devclub-user");
      }
    } catch {
      // ignore
    }
  });

  it("logs in a valid member", async () => {
    render(
      <AuthProvider>
        <AuthTester username="member" password="member123" />
      </AuthProvider>,
    );

    fireEvent.click(screen.getByText("do-login"));

    await waitFor(() => {
      expect(screen.getByTestId("result").textContent).toContain("ok");
      expect(screen.getByTestId("user").textContent).not.toContain("no-user");
    });

    // localStorage should have been written
    const stored = window.localStorage.getItem("nstswc-devclub-user");
    expect(stored).toBeTruthy();
  });

  it("fails for unknown user", async () => {
    render(
      <AuthProvider>
        <AuthTester username="unknown" password="x" />
      </AuthProvider>,
    );

    fireEvent.click(screen.getByText("do-login"));

    await waitFor(() => {
      expect(screen.getByTestId("result").textContent).toContain("err");
      expect(screen.getByTestId("user").textContent).toContain("no-user");
    });
  });
});
