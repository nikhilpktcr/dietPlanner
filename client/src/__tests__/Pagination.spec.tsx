import { render, screen, fireEvent } from "@testing-library/react";
import { Pagination } from "../components/Table/Pagination";

describe("Pagination Component", () => {
  const setup = (props: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    maxVisiblePages?: number;
  }) => {
    return render(<Pagination {...props} />);
  };

  test("does not render when totalPages is 1 or less", () => {
    const { container } = setup({
      currentPage: 1,
      totalPages: 1,
      onPageChange: jest.fn(),
    });
    expect(container.firstChild).toBeNull();
  });

  test("renders Prev and Next buttons", () => {
    setup({
      currentPage: 2,
      totalPages: 5,
      onPageChange: jest.fn(),
    });

    expect(screen.getByText("Prev")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  test("disables Prev button on first page", () => {
    setup({
      currentPage: 1,
      totalPages: 5,
      onPageChange: jest.fn(),
    });

    expect(screen.getByText("Prev")).toBeDisabled();
  });

  test("disables Next button on last page", () => {
    setup({
      currentPage: 5,
      totalPages: 5,
      onPageChange: jest.fn(),
    });

    expect(screen.getByText("Next")).toBeDisabled();
  });

  test("calls onPageChange when page number is clicked", () => {
    const onPageChangeMock = jest.fn();

    setup({
      currentPage: 3,
      totalPages: 5,
      onPageChange: onPageChangeMock,
    });

    fireEvent.click(screen.getByText("2"));
    expect(onPageChangeMock).toHaveBeenCalledWith(2);
  });

  test("calls onPageChange when Prev and Next are clicked", () => {
    const onPageChangeMock = jest.fn();

    setup({
      currentPage: 3,
      totalPages: 5,
      onPageChange: onPageChangeMock,
    });

    fireEvent.click(screen.getByText("Prev"));
    expect(onPageChangeMock).toHaveBeenCalledWith(2);

    fireEvent.click(screen.getByText("Next"));
    expect(onPageChangeMock).toHaveBeenCalledWith(4);
  });

  test("renders ellipsis when needed", () => {
    setup({
      currentPage: 5,
      totalPages: 10,
      onPageChange: jest.fn(),
    });

    expect(screen.getAllByText("...").length).toBeGreaterThan(0);
  });

  test("highlights current page", () => {
    setup({
      currentPage: 3,
      totalPages: 5,
      onPageChange: jest.fn(),
    });

    const currentPageButton = screen.getByText("3");
    expect(currentPageButton).toHaveClass("bg-blue-600");
    expect(currentPageButton).toHaveClass("text-white");
  });
});
