// app/actions.test.ts
// import {
//   getAllUsers,
//   upsertUser,
//   deleteUser,
//   findAllUsers,
// } from "../../app/actions/user";

// app/actions.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

// ─────────────────────────────────────────────
// vi.hoisted() — runs before vi.mock() factories,
// so these variables are safe to reference inside them.
// ─────────────────────────────────────────────
const {
  mockReturning,
  mockWhere,
  mockSet,
  mockUpdate,
  mockInsert,
  mockDelete,
  mockOrderBy,
  mockWhereSearch,
  mockLeftJoin,
  mockFrom,
  mockSelect,
} = vi.hoisted(() => {
  const mockReturning = vi.fn();
  const mockWhere = vi.fn(() => ({ returning: mockReturning }));
  const mockSet = vi.fn(() => ({ where: mockWhere }));
  const mockUpdate = vi.fn(() => ({ set: mockSet }));
  const mockInsert = vi.fn(() => ({
    values: vi.fn().mockResolvedValue({ rowCount: 1 }),
  }));
  const mockDelete = vi.fn(() => ({ where: mockWhere }));

  const mockOrderBy = vi.fn();
  const mockWhereSearch = vi.fn();
  const mockLeftJoin = vi.fn(() => ({
    where: mockWhereSearch,
    orderBy: mockOrderBy,
  }));
  const mockFrom = vi.fn(() => ({
    leftJoin: mockLeftJoin,
    orderBy: mockOrderBy,
  }));
  const mockSelect = vi.fn(() => ({ from: mockFrom }));

  return {
    mockReturning,
    mockWhere,
    mockSet,
    mockUpdate,
    mockInsert,
    mockDelete,
    mockOrderBy,
    mockWhereSearch,
    mockLeftJoin,
    mockFrom,
    mockSelect,
  };
});

// ─────────────────────────────────────────────
// Module mocks — factories can now safely reference
// the hoisted variables above.
// ─────────────────────────────────────────────
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/db/db", () => ({
  db: {
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdate,
    delete: mockDelete,
  },
}));

vi.mock("@/db/schema", () => ({
  users: {
    id: "id",
    firstName: "firstName",
    lastName: "lastName",
    email: "email",
    updatedAt: "updatedAt",
    role: "role",
  },
  roles: {
    id: "id",
    role: "role",
  },
}));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn((a, b) => ({ eq: [a, b] })),
  ilike: vi.fn((a, b) => ({ ilike: [a, b] })),
  or: vi.fn((...args) => ({ or: args })),
  asc: vi.fn((col) => ({ asc: col })),
}));

// Import after mocks are registered
import {
  getAllUsers,
  upsertUser,
  deleteUser,
  findAllUsers,
} from "../../app/actions/user";

// ─────────────────────────────────────────────
// Shared fixtures
// ─────────────────────────────────────────────
const mockUsers = [
  {
    id: "1",
    firstName: "Alice",
    lastName: "Smith",
    email: "alice@example.com",
    updatedAt: new Date("2024-01-01"),
    role: "admin",
  },
  {
    id: "2",
    firstName: "Bob",
    lastName: "Jones",
    email: "bob@example.com",
    updatedAt: new Date("2024-01-02"),
    role: "user",
  },
];

beforeEach(() => {
  vi.clearAllMocks();

  // Re-wire the default chain after clearAllMocks resets return values
  mockOrderBy.mockResolvedValue(mockUsers);
  mockLeftJoin.mockReturnValue({
    where: mockWhereSearch,
    orderBy: mockOrderBy,
  });
  mockFrom.mockReturnValue({ leftJoin: mockLeftJoin, orderBy: mockOrderBy });
  mockSelect.mockReturnValue({ from: mockFrom });

  mockWhere.mockReturnValue({ returning: mockReturning });
  mockDelete.mockReturnValue({ where: mockWhere });
});

// ─────────────────────────────────────────────
// getAllUsers
// ─────────────────────────────────────────────
describe("getAllUsers", () => {
  it("returns users when sortAlphabetically is true", async () => {
    const result = await getAllUsers(true);
    expect(result).toEqual(mockUsers);
    expect(mockOrderBy).toHaveBeenCalled();
  });

  it("returns users when sortAlphabetically is false", async () => {
    const result = await getAllUsers(false);
    expect(result).toEqual(mockUsers);
    expect(mockOrderBy).toHaveBeenCalled();
  });

  it("returns an empty array when the DB throws", async () => {
    mockOrderBy.mockRejectedValueOnce(new Error("DB error"));
    const result = await getAllUsers(true);
    expect(result).toEqual([]);
  });

  it("calls select with the expected field shape", async () => {
    await getAllUsers(true);
    expect(mockSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.anything(),
        firstName: expect.anything(),
        lastName: expect.anything(),
        email: expect.anything(),
        updatedAt: expect.anything(),
        role: expect.anything(),
      }),
    );
  });
});

// ─────────────────────────────────────────────
// upsertUser
// ─────────────────────────────────────────────
describe("upsertUser", () => {
  const baseUser = {
    firstName: "Carol",
    lastName: "White",
    email: "carol@example.com",
    updatedAt: new Date("2024-03-01"),
    role: "user",
  };

  it("inserts a new user when no id is provided", async () => {
    const mockValues = vi.fn().mockResolvedValue({ rowCount: 1 });
    mockInsert.mockReturnValue({ values: mockValues });

    const result = await upsertUser(baseUser);

    expect(mockInsert).toHaveBeenCalled();
    expect(mockValues).toHaveBeenCalledWith(baseUser);
    expect(result).toBe(1);
  });

  it("updates an existing user when an id is provided", async () => {
    const mockWhereUpdate = vi.fn().mockResolvedValue({ rowCount: 1 });
    const mockSetUpdate = vi.fn(() => ({ where: mockWhereUpdate }));
    mockUpdate.mockReturnValue({ set: mockSetUpdate });

    const result = await upsertUser({ ...baseUser, id: "42" });

    expect(mockUpdate).toHaveBeenCalled();
    expect(mockSetUpdate).toHaveBeenCalledWith({ ...baseUser, id: "42" });
    expect(result).toBe(1);
  });

  it("returns the error when the DB throws on insert", async () => {
    const dbError = new Error("Insert failed");
    mockInsert.mockReturnValue({
      values: vi.fn().mockRejectedValue(dbError),
    });

    const result = await upsertUser(baseUser);
    expect(result).toBe(dbError);
  });

  it("returns the error when the DB throws on update", async () => {
    const dbError = new Error("Update failed");
    const mockWhereUpdate = vi.fn().mockRejectedValue(dbError);
    const mockSetUpdate = vi.fn(() => ({ where: mockWhereUpdate }));
    mockUpdate.mockReturnValue({ set: mockSetUpdate });

    const result = await upsertUser({ ...baseUser, id: "42" });
    expect(result).toBe(dbError);
  });
});

// ─────────────────────────────────────────────
// deleteUser
// ─────────────────────────────────────────────
describe("deleteUser", () => {
  it("deletes a user and returns the deleted row", async () => {
    const deletedRow = [{ id: "1", firstName: "Alice" }];
    mockReturning.mockResolvedValue(deletedRow);

    const result = await deleteUser("1");

    expect(mockDelete).toHaveBeenCalled();
    expect(result).toEqual(deletedRow);
  });

  it("returns the failure string when the DB throws", async () => {
    mockReturning.mockRejectedValueOnce(new Error("Delete failed"));

    const result = await deleteUser("99");
    expect(result).toBe("Failed to delete user");
  });
});

// ─────────────────────────────────────────────
// findAllUsers
// ─────────────────────────────────────────────
describe("findAllUsers", () => {
  beforeEach(() => {
    mockWhereSearch.mockResolvedValue(mockUsers);
  });

  it("returns matching users for a search string", async () => {
    const result = await findAllUsers("alice");
    expect(result).toEqual(mockUsers);
    expect(mockWhereSearch).toHaveBeenCalled();
  });

  it("invokes the or/ilike matchers with a wildcard pattern", async () => {
    const { or, ilike } = await import("drizzle-orm");
    await findAllUsers("bob");
    expect(ilike).toHaveBeenCalledTimes(3); // firstName, lastName, email
    expect(or).toHaveBeenCalledTimes(1);
  });

  it("returns an empty array when the DB throws", async () => {
    mockWhereSearch.mockRejectedValueOnce(new Error("Search failed"));
    const result = await findAllUsers("error");
    expect(result).toEqual([]);
  });

  it("returns an empty array for an empty search string", async () => {
    mockWhereSearch.mockResolvedValueOnce([]);
    const result = await findAllUsers("");
    expect(result).toEqual([]);
  });
});
