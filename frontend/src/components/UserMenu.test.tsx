import { render, screen } from "@testing-library/react";
import UserMenu from "./UserMenu";

describe("UserMenu", () => {
    test("renders menu placeholder", () => {
        render(<UserMenu />);

        expect(screen.getByText("User Menu")).toBeInTheDocument();
    });
});
