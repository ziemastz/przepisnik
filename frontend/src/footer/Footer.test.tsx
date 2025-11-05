import { render, screen } from "@testing-library/react";
import Footer from "./Footer";
import constants from "../constants";

describe("Footer", () => {
    test("renders donation prompt and rights notice", () => {
        render(<Footer />);

        expect(screen.getByText("Buy Me Coffe")).toBeInTheDocument();
        expect(screen.getByText(constants.footer.rightsText)).toBeInTheDocument();
    });
});
