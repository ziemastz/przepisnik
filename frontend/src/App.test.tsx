import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import constants from "./constants";

jest.mock("./router", () => ({
    BrowserRouter: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    Routes: ({ children }: { children: ReactNode }) => <>{children}</>,
    Route: ({ element }: { element: ReactNode }) => <>{element}</>,
}));

import App from "./App";

describe("App Component", () => {
    test("renders header, main content, and footer", () => {
        render(<App />);

        expect(screen.getByRole("banner")).toHaveTextContent(constants.titleApp);
        expect(screen.getByRole("main")).toHaveTextContent("Home Page");
        expect(screen.getByRole("contentinfo")).toHaveTextContent(
            constants.footer.rightsText
        );
    });
});
