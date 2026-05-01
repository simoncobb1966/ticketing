/* eslint-disable @typescript-eslint/no-explicit-any */
// // eslint-disable-next-line no-unused-vars
// import React from "react";
// import { render, screen } from "@testing-library/react";
// import UserModal from "../../ticketing/app/components/userModal/userModal";
// import { describe, it, expect } from "vitest";
// import "@testing-library/jest-dom/vitest";

// const roles = [{ id: "123", role: "user" }];
// const selectedRole = "";
// const setSelectedRole = () => {};

// describe("Greeting", () => {
//   it("renders a default greeting", () => {
//     const selectedUser = null;

//     render(
//       <UserModal
//         open
//         close={() => {}}
//         title={selectedUser ? "Edit User" : "Add User"}
//         upsertUserHandler={() => upsertUserHandler()}
//         selectedUser={selectedUser}
//         roles={roles}
//         selectedRole={selectedRole}
//         setSelectedRole={setSelectedRole}
//       />,
//     );
//     expect(screen.getByText("Add User")).toBeInTheDocument();
//   });

//   it("renders firstname, lastname and role in the relevant fields", () => {
//     const selectedUser = {
//       id: 3,
//       firstName: "Bobby",
//       lastName: "Campbell",
//       role: roles[0].id,
//     };

//     render(
//       <UserModal
//         open
//         close={() => {}}
//         title={selectedUser ? "Edit User" : "Add User"}
//         upsertUserHandler={() => upsertUserHandler()}
//         selectedUser={selectedUser}
//         roles={roles}
//         selectedRole={selectedRole}
//         setSelectedRole={setSelectedRole}
//       />,
//     );
//     expect(screen.getByText("Edit User")).toBeInTheDocument();
//     expect(screen.getByLabelText("First Name")).toBeInTheDocument();
//     expect(screen.getByLabelText("Last Name")).toBeInTheDocument();
//   });
// });

// components/UserModal.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import UserModal from "@/components/userModal/userModal";

const roles = [{ id: "123", role: "user" }];

// ─────────────────────────────────────────────
// vi.hoisted() — shared mocks safe for use in vi.mock() factories
// ─────────────────────────────────────────────
const {
  mockDialogContent,
  mockSelect,
  mockSelectTrigger,
  mockSelectContent,
  mockSelectItem,
} = vi.hoisted(() => ({
  mockDialogContent: vi.fn(({ children, ...props }: any) => (
    <div role="dialog" {...props}>
      {children}
    </div>
  )),
  mockSelect: vi.fn(({ children, onValueChange, value }: any) => (
    <div data-testid="select" data-value={value}>
      {/* Expose a way to trigger onValueChange in tests */}
      <button
        data-testid="select-trigger-btn"
        onClick={() => onValueChange?.("role-2")}
      />
      {children}
    </div>
  )),
  mockSelectTrigger: vi.fn(({ children }: any) => <div>{children}</div>),
  mockSelectContent: vi.fn(({ children }: any) => <div>{children}</div>),
  mockSelectItem: vi.fn(({ children, value }: any) => (
    <div data-testid={`select-item-${value}`}>{children}</div>
  )),
}));

// ─────────────────────────────────────────────
// Module mocks
// ─────────────────────────────────────────────
vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children, open }: any) =>
    open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: mockDialogContent,
  DialogClose: ({ children, onClick }: any) => (
    <div onClick={onClick}>{children}</div>
  ),
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <h2>{children}</h2>,
  DialogFooter: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, type, variant }: any) => (
    <button onClick={onClick} type={type} data-variant={variant}>
      {children}
    </button>
  ),
}));

vi.mock("@/components/ui/field", () => ({
  Field: ({ children }: any) => <div>{children}</div>,
  FieldGroup: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("@/components/ui/input", () => ({
  Input: ({ id, name, placeholder, defaultValue, onChange, disabled }: any) => (
    <input
      id={id}
      name={name}
      placeholder={placeholder}
      defaultValue={defaultValue}
      onChange={onChange}
      disabled={disabled}
    />
  ),
}));

vi.mock("@/components/ui/label", () => ({
  Label: ({ children, htmlFor }: any) => (
    <label htmlFor={htmlFor}>{children}</label>
  ),
}));

vi.mock("@/components/ui/select", () => ({
  Select: mockSelect,
  SelectTrigger: mockSelectTrigger,
  SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>,
  SelectContent: mockSelectContent,
  SelectGroup: ({ children }: any) => <div>{children}</div>,
  SelectLabel: ({ children }: any) => <div>{children}</div>,
  SelectItem: mockSelectItem,
}));

// Mock the page constants
vi.mock("../../page", () => ({
  DOMAIN: "example.com",
  PASSWORD: "secret123",
}));

// ─────────────────────────────────────────────
// Fixtures
// ─────────────────────────────────────────────
const mockRoles = [
  { id: "role-1", role: "Admin" },
  { id: "role-2", role: "User" },
];

const mockUser = {
  id: "user-1",
  firstName: "Alice",
  lastName: "Smith",
  email: "alice.smith@example.com",
  updatedAt: new Date("2024-01-01"),
  role: mockRoles[0].id,
  password: "password",
};

const defaultProps = {
  close: vi.fn(),
  open: true,
  upsertUserHandler: vi.fn().mockResolvedValue(undefined),
  title: "Create User",
  selectedUser: null,
  roles: mockRoles,
  selectedRole: mockRoles[0].id,
  setSelectedRole: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

// ─────────────────────────────────────────────
// Rendering
// ─────────────────────────────────────────────
describe("rendering", () => {
  it("renders the dialog when open is true", () => {
    render(<UserModal {...defaultProps} />);
    expect(screen.getByTestId("dialog")).toBeInTheDocument();
  });

  it("does not render when open is false", () => {
    render(<UserModal {...defaultProps} open={false} />);
    expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
  });

  it("displays the provided title", () => {
    render(<UserModal {...defaultProps} title="Edit User" />);
    expect(screen.getByText("Edit User")).toBeInTheDocument();
  });

  it("renders First Name and Last Name inputs", () => {
    render(<UserModal {...defaultProps} />);
    expect(screen.getByPlaceholderText("First name...")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Last name...")).toBeInTheDocument();
  });

  it("renders all role options", () => {
    render(<UserModal {...defaultProps} />);
    expect(screen.getByTestId("select-item-role-1")).toBeInTheDocument();
    expect(screen.getByTestId("select-item-role-2")).toBeInTheDocument();
  });

  it("shows 'Create' on the submit button when selectedUser is null", () => {
    render(<UserModal {...defaultProps} selectedUser={null} />);
    expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument();
  });

  it("shows 'Update' on the submit button when a user is selected", () => {
    render(<UserModal {...defaultProps} selectedUser={mockUser} />);
    expect(screen.getByRole("button", { name: "Update" })).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────
// Pre-population
// ─────────────────────────────────────────────
describe("pre-population with selectedUser", () => {
  it("pre-fills firstName input with the selected user's first name", () => {
    render(<UserModal {...defaultProps} selectedUser={mockUser} />);
    expect(screen.getByPlaceholderText("First name...")).toHaveValue("Alice");
  });

  it("pre-fills lastName input with the selected user's last name", () => {
    render(<UserModal {...defaultProps} selectedUser={mockUser} />);
    expect(screen.getByPlaceholderText("Last name...")).toHaveValue("Smith");
  });

  it("leaves inputs empty when no user is selected", () => {
    render(<UserModal {...defaultProps} selectedUser={null} />);
    expect(screen.getByPlaceholderText("First name...")).toHaveValue("");
    expect(screen.getByPlaceholderText("Last name...")).toHaveValue("");
  });
});

// ─────────────────────────────────────────────
// Interactions
// ─────────────────────────────────────────────
describe("interactions", () => {
  it("calls close when Cancel button is clicked", async () => {
    const close = vi.fn();
    render(<UserModal {...defaultProps} close={close} />);
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(close).toHaveBeenCalled();
  });

  it("calls setSelectedRole when role selection changes", async () => {
    const setSelectedRole = vi.fn();
    render(<UserModal {...defaultProps} setSelectedRole={setSelectedRole} />);
    // The mock Select fires onValueChange("role-2") when its inner button is clicked
    await userEvent.click(screen.getByTestId("select-trigger-btn"));
    expect(setSelectedRole).toHaveBeenCalledWith("role-2");
  });

  it("calls upsertUserHandler and close when the form is submitted", async () => {
    const upsertUserHandler = vi.fn().mockResolvedValue(undefined);
    const close = vi.fn();
    render(
      <UserModal
        {...defaultProps}
        upsertUserHandler={upsertUserHandler}
        close={close}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Create" }));

    await waitFor(() => {
      expect(upsertUserHandler).toHaveBeenCalledTimes(1);
      expect(close).toHaveBeenCalled();
    });
  });

  it("updates firstName state when typing in the first name input", async () => {
    render(<UserModal {...defaultProps} />);
    const input = screen.getByPlaceholderText("First name...");
    await userEvent.clear(input);
    await userEvent.type(input, "Charlie");
    expect(input).toHaveValue("Charlie");
  });

  it("updates lastName state when typing in the last name input", async () => {
    render(<UserModal {...defaultProps} />);
    const input = screen.getByPlaceholderText("Last name...");
    await userEvent.clear(input);
    await userEvent.type(input, "Brown");
    expect(input).toHaveValue("Brown");
  });
});

// ─────────────────────────────────────────────
// Role select binding
// ─────────────────────────────────────────────
describe("role select", () => {
  it("passes the selectedRole value to the Select component", () => {
    render(<UserModal {...defaultProps} selectedRole="role-2" />);
    expect(screen.getByTestId("select")).toHaveAttribute(
      "data-value",
      "role-2",
    );
  });
});
