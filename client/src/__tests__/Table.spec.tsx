import { render, screen, fireEvent } from "@testing-library/react";
import { Column, Table } from "../components/Table/TableComp";

interface User {
  id: number;
  name: string;
  email: string;
}

const mockData: User[] = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
];

const columns: Column<User>[] = [
  { label: "ID", key: "id" },
  { label: "Name", key: "name" },
  { label: "Email", key: "email" },
];

describe("Table Component", () => {
  test("renders table with data", () => {
    render(
      <Table
        data={mockData}
        columns={columns}
        page={1}
        totalPages={1}
        onPageChange={() => {}}
      />
    );

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("bob@example.com")).toBeInTheDocument();
  });

  test("renders empty message when no data", () => {
    render(
      <Table
        data={[]}
        columns={columns}
        page={1}
        totalPages={1}
        onPageChange={() => {}}
        emptyMessage="No users found."
      />
    );

    expect(screen.getByText("No users found.")).toBeInTheDocument();
  });

  test("calls onSortChange when column header is clicked", () => {
    const onSortChangeMock = jest.fn();

    render(
      <Table
        data={mockData}
        columns={columns}
        page={1}
        totalPages={1}
        onPageChange={() => {}}
        onSortChange={onSortChangeMock}
        sortKey="name"
        sortDirection="asc"
      />
    );

    fireEvent.click(screen.getByText("Name"));
    expect(onSortChangeMock).toHaveBeenCalledWith("name", "desc");
  });

  test("calls onSearchChange when typing in search input", () => {
    const onSearchChangeMock = jest.fn();

    render(
      <Table
        data={mockData}
        columns={columns}
        page={1}
        totalPages={1}
        onPageChange={() => {}}
        onSearchChange={onSearchChangeMock}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Search..."), {
      target: { value: "Alice" },
    });

    expect(onSearchChangeMock).toHaveBeenCalledWith("Alice");
  });

  test("calls onPageChange when pagination button is clicked", () => {
    const onPageChangeMock = jest.fn();

    render(
      <Table
        data={mockData}
        columns={columns}
        page={2}
        totalPages={3}
        onPageChange={onPageChangeMock}
      />
    );

    fireEvent.click(screen.getByText("Prev"));
    expect(onPageChangeMock).toHaveBeenCalledWith(1);
  });
});
