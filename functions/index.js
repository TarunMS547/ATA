const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { getFirestore } = require("firebase-admin/firestore");
const admin = require("firebase-admin");

admin.initializeApp();

exports.generateTestCases = onCall(async (request) => {
  // Ensure the user is authenticated
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  const { requirementId, title, description } = request.data;

  if (!requirementId || !title) {
    throw new HttpsError(
      "invalid-argument",
      "The function must be called with requirementId and title."
    );
  }

  try {
    // In a real application, you would make an API call to an LLM (e.g., OpenAI, Gemini) here
    // using secrets stored in Firebase environment config.
    // const apiKey = process.env.AI_API_KEY;

    // Simulate AI generation delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock response generated test cases
    const mockTestCases = [
      {
        title: `Verify ${title} functionality`,
        description: `Ensure that the core flow for ${title} works as expected.`,
        preconditions: "User is logged in.",
        steps: "1. Navigate to feature.\n2. Interact with component.\n3. Observe result.",
        expectedResult: "The system should process the action successfully.",
        priority: "High",
        testType: "Functional",
      },
      {
        title: `Verify ${title} error handling`,
        description: `Ensure that errors are gracefully handled in ${title}.`,
        preconditions: "System is in an error state or user provides invalid input.",
        steps: "1. Perform invalid action.\n2. Observe error message.",
        expectedResult: "An appropriate error message is displayed.",
        priority: "Medium",
        testType: "Negative",
      }
    ];

    return {
      success: true,
      testCases: mockTestCases,
      message: "Test cases successfully generated via AI mock."
    };
  } catch (error) {
    console.error("Error generating test cases:", error);
    throw new HttpsError("internal", "An error occurred while generating test cases.");
  }
});
