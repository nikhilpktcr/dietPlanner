import { registerUser, loginUser, getAllUsers } from "../userController";
import * as userService from "../userService";
import * as responseUtil from "../../../utils/responseUtil";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

jest.mock("../userService");
jest.mock("../../../utils/responseUtil");

describe("User Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("registerUser", () => {
    it("should register a user and send success response", async () => {
      const mockUser = { id: "1", name: "John", email: "john@example.com" };
      req.body = {
        ...mockUser,
        password: "pass123",
        role: "user",
        phone: "1234567890",
      };

      (userService.registerUser as jest.Mock).mockResolvedValue(mockUser);

      await registerUser(req as Request, res as Response);

      expect(userService.registerUser).toHaveBeenCalledWith({
        name: "John",
        email: "john@example.com",
        password: "pass123",
        role: "user",
        phone: "1234567890",
      });

      expect(responseUtil.sendSuccessResponse).toHaveBeenCalledWith(
        StatusCodes.CREATED,
        req,
        res,
        mockUser,
        expect.any(String)
      );
    });

    it("should handle errors and send error response", async () => {
      const error = new Error("Registration failed");
      req.body = { name: "John" };

      (userService.registerUser as jest.Mock).mockRejectedValue(error);

      await registerUser(req as Request, res as Response);

      expect(responseUtil.sendErrorResponse).toHaveBeenCalledWith(
        StatusCodes.BAD_REQUEST,
        req,
        res,
        {},
        "Registration failed"
      );
    });
  });

  describe("loginUser", () => {
    it("should login a user and send success response", async () => {
      const mockResponse = { token: "abc123", role: "user" };
      req.body = { email: "john@example.com", password: "pass123" };

      (userService.loginUser as jest.Mock).mockResolvedValue(mockResponse);

      await loginUser(req as Request, res as Response);

      expect(userService.loginUser).toHaveBeenCalledWith({
        email: "john@example.com",
        password: "pass123",
      });

      expect(responseUtil.sendSuccessResponse).toHaveBeenCalledWith(
        StatusCodes.CREATED,
        req,
        res,
        mockResponse,
        expect.stringContaining("loggedin successfully")
      );
    });

    it("should handle login errors and send error response", async () => {
      const error = new Error("Invalid credentials");
      req.body = { email: "john@example.com", password: "wrongpass" };

      (userService.loginUser as jest.Mock).mockRejectedValue(error);

      await loginUser(req as Request, res as Response);

      expect(responseUtil.sendErrorResponse).toHaveBeenCalledWith(
        StatusCodes.UNAUTHORIZED,
        req,
        res,
        {},
        "Invalid credentials"
      );
    });
  });

  describe("getAllUsers", () => {
    it("should fetch all users and send success response", async () => {
      const mockUsers = [
        { id: "1", name: "John Doe", email: "john@example.com" },
        { id: "2", name: "Jane Doe", email: "jane@example.com" },
      ];

      req.query = {
        search: "john",
        sortBy: "createdAt",
        sortOrder: "asc",
        limit: "10",
        offset: "0",
      };

      (userService.getAllUsers as jest.Mock).mockResolvedValue(mockUsers);

      await getAllUsers(req as Request, res as Response);

      expect(userService.getAllUsers).toHaveBeenCalledWith(req.query);
      expect(responseUtil.sendSuccessResponse).toHaveBeenCalledWith(
        StatusCodes.OK,
        req,
        res,
        mockUsers,
        expect.any(String)
      );
    });

    it("should handle errors and send error response", async () => {
      const error = new Error("Failed to fetch users");
      req.query = {};

      (userService.getAllUsers as jest.Mock).mockRejectedValue(error);

      await getAllUsers(req as Request, res as Response);

      expect(responseUtil.sendErrorResponse).toHaveBeenCalledWith(
        StatusCodes.INTERNAL_SERVER_ERROR,
        req,
        res,
        {},
        "Failed to fetch users"
      );
    });
  });
});
