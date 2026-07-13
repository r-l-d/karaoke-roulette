import React from "react";
import App from "./app";
import axios from "./axios";
import { render, waitForElement } from "@testing-library/react";

jest.mock("./axios");

test("App renders karaoke shell after loading user", async () => {
    axios.get.mockResolvedValue({
        data: {
            id: 10,
            first: "Funky",
            last: "Chicken",
            image_url: "/funkychicken.png"
        }
    });
    const { container, getByText } = render(<App />);

    expect(container.innerHTML).toBe("");

    await waitForElement(() => getByText("Karaoke Roulette"));

    expect(getByText("Karaoke Roulette")).toBeTruthy();
});
