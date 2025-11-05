import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import AppRoutes from "./AppRoutes";

type CapturedRoute = {
    path: string;
    element: ReactNode;
};

const capturedRoutes: CapturedRoute[] = [];

jest.mock("../router", () => ({
    Routes: ({ children }: { children: ReactNode }) => <>{children}</>,
    Route: ({ path, element }: { path: string; element: ReactNode }) => {
        capturedRoutes.push({ path, element });
        return <>{element}</>;
    },
}));


describe("AppRoutes", () => {
    beforeEach(() => {
        capturedRoutes.length = 0;
    });

    test("defines home and fallback routes", () => {
        render(<AppRoutes />);

        expect(screen.getByText("Home Page")).toBeInTheDocument();
        expect(screen.getByText("404 - Strona nie istnieje")).toBeInTheDocument();
        expect(capturedRoutes.map((route) => route.path)).toEqual(["/", "*"]);
    });
});
