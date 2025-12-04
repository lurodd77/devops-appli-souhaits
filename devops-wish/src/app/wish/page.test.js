// devops-wish/src/app/wish/page.test.js

import { render, screen, fireEvent } from "@testing-library/react";
import WishPage from "./page";

describe("WishPage Component", () => {
  beforeEach(() => {
    render(<WishPage />);
  });

  test("renders the title correctly", () => {
    const titleElement = screen.getByText(/Mes vœux du mois/i);
    expect(titleElement).toBeInTheDocument();
  });

  test("adds a wish and displays it", () => {
    const wishInput = screen.getByPlaceholderText(
      /Ex : Voyage, nouveau PC.../i
    );
    const dateInput = screen.getByLabelText(/Date/i);
    const submitButton = screen.getByText(/Ajouter le vœu/i);

    fireEvent.change(wishInput, { target: { value: "Voyage" } });
    fireEvent.change(dateInput, { target: { value: "2023-12-25" } });
    fireEvent.click(submitButton);

    const wishItem = screen.getByText(/Voyage/i);
    expect(wishItem).toBeInTheDocument();
  });

  test("navigates to the next month", () => {
    const nextButton = screen.getByText(/▶/i);
    fireEvent.click(nextButton);

    const monthLabel = screen.getByText(/janvier/i); // Assuming the next month is January
    expect(monthLabel).toBeInTheDocument();
  });

  test("navigates to the previous month", () => {
    const prevButton = screen.getByText(/◀/i);
    fireEvent.click(prevButton);

    const monthLabel = screen.getByText(/novembre/i); // Assuming the previous month is November
    expect(monthLabel).toBeInTheDocument();
  });

  test("displays wishes for the current month", () => {
    const wishInput = screen.getByPlaceholderText(
      /Ex : Voyage, nouveau PC.../i
    );
    const submitButton = screen.getByText(/Ajouter le vœu/i);

    fireEvent.change(wishInput, { target: { value: "Noël" } });
    fireEvent.click(submitButton);

    const wishItem = screen.getByText(/Noël/i);
    expect(wishItem).toBeInTheDocument();
  });
});
