// app/__tests__/lockerrequestApi.test.ts
import { handleLockerRequest } from "@/lib/lockerService";

// --- Mocks ---
const sendMailMock = jest.fn().mockResolvedValue({
  messageId: "fake-id",
  message: "test-message",
});

jest.mock("@/lib/mailer", () => ({
  getTransporter: jest.fn(() => ({ sendMail: sendMailMock })),
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    wish: {
      create: jest.fn().mockResolvedValue({ id: 1 }),
    },
  },
}));

// --- Tests ---
describe("LockerRequest Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 if sNumber is missing", async () => {
    const result = await handleLockerRequest({ lockerLocation: "Lounge" });
    expect(result.status).toBe(400);
    expect(result.data.error).toBe("sNumber required");
  });

  it("creates a wish and sends an email if sNumber is present", async () => {
    const result = await handleLockerRequest({ sNumber: "s1234", lockerLocation: "Lounge" });

    // check if response is ok
    expect(result.status).toBe(200);
    expect(result.data.ok).toBe(true);

    // prisma was called correctly
    const { prisma } = await import("@/lib/prisma");
    expect(prisma.wish.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          sNumber: "s1234",
          lockerLocation: "Lounge",
        }),
      })
    );

    // mailer was called correctly
    expect(sendMailMock).toHaveBeenCalled();
    expect(result.data.messageId).toBe("fake-id");
  });
});
