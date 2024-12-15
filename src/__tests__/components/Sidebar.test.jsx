import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import useStore from "../../store/store";

jest.mock("../../store/store", () => jest.fn());

describe("Sidebar Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders menu items when authenticated", () => {
    useStore.mockImplementation((callback) =>
      callback({
        role: "user",
        isAuthenticated: true,
      })
    );

    render(
      <Sidebar
        isOpen={true}
        setIsOpen={jest.fn()}
      />, 
      { wrapper: MemoryRouter }
    );

    // Verifica que los elementos del menú están presentes
    const menuItems = screen.getAllByRole("listitem");
    expect(menuItems.length).toBeGreaterThan(0);
  });

  test("does not render menu items when not authenticated", () => {
    useStore.mockImplementation((callback) =>
      callback({
        role: "user",
        isAuthenticated: false,
      })
    );

    render(
      <Sidebar
        isOpen={true}
        setIsOpen={jest.fn()}
      />, 
      { wrapper: MemoryRouter }
    );

    // Verifica que no hay elementos del menú renderizados
    const menuItems = screen.queryAllByRole("listitem");
    expect(menuItems.length).toBe(0);
  });
});
