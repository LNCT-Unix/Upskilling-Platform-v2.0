import { StrictMode } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import MilestoneAssessment from "../components/assessment/MilestoneAssessment";
import Roadmap from "../components/roadmap/roadmap";
import * as auth from "../api/auth";

const mockQuestions = Array.from({ length: 8 }, (_, i) => ({
  questionId: `q-${i + 1}`,
  questionOrder: i + 1,
  questionText: `Question ${i + 1} text?`,
  options: { A: "Opt A", B: "Opt B", C: "Opt C", D: "Opt D" },
  selectedAnswer: null,
}));

describe("MilestoneAssessment", () => {
  beforeEach(() => {
    vi.spyOn(auth, "getAuthToken").mockReturnValue("test-token");
  });

  it("starts, loads 8 questions, saves an answer, and submits the attempt", async () => {
    global.fetch = vi.fn((url, opts) => {
      if (url.endsWith("/milestones/start")) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({
            attemptId: "att-1",
            skillName: "Spring Framework and IoC",
            attemptNumber: 1,
            totalQuestions: 8,
            status: "IN_PROGRESS",
          }),
        });
      }
      if (url.endsWith("/milestones/att-1") && (!opts?.method || opts.method === "GET")) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({
            attemptId: "att-1",
            status: "IN_PROGRESS",
            totalQuestions: 8,
            questions: mockQuestions,
          }),
        });
      }
      if (url.includes("/answers/") && opts?.method === "PATCH") {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({ saved: true }),
        });
      }
      if (url.endsWith("/milestones/att-1/submit")) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({
            attemptId: "att-1",
            status: "COMPLETED",
            totalQuestions: 8,
            correctAnswers: 6,
            incorrectAnswers: 2,
            score: 6,
            passed: true,
          }),
        });
      }
      return Promise.reject(new Error(`Unexpected fetch: ${url}`));
    });

    render(
      <StrictMode>
        <MemoryRouter initialEntries={["/milestone-assessment/spring-framework-ioc"]}>
          <Routes>
            <Route path="/milestone-assessment/:skillId" element={<MilestoneAssessment />} />
          </Routes>
        </MemoryRouter>
      </StrictMode>
    );

    await waitFor(() => {
      expect(screen.getByText("Question 1 text?")).toBeInTheDocument();
    });

    const startCalls = global.fetch.mock.calls.filter(([url]) => url.endsWith("/milestones/start"));
    expect(startCalls).toHaveLength(1);

    fireEvent.click(screen.getByText("Opt B"));
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/milestones/att-1/answers/q-1"),
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify({ selectedAnswer: "B" }),
        })
      );
    });

    fireEvent.click(screen.getByRole("button", { name: "8" }));
    expect(screen.getByText("Question 8 text?")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Submit Assessment" }));
    await waitFor(() => {
      expect(screen.getByText("6 / 8")).toBeInTheDocument();
      expect(screen.getByText("Passed — Skill Unlocked")).toBeInTheDocument();
    });
  });

  it("navigates from roadmap card secondary Take Assessment button to milestone assessment", async () => {
    global.fetch = vi.fn((url) => {
      if (url.endsWith("/roadmap")) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({
            categories: [
              {
                id: 1,
                title: "Programming Fundamentals",
                steps: [{ id: 1, title: "Variables and Data Types", topics: [] }],
              },
            ],
          }),
        });
      }
      if (url.endsWith("/roadmap/progress")) {
        return Promise.resolve({ ok: true, status: 200, json: async () => ({ completed: [] }) });
      }
      if (url.endsWith("/milestones/start")) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({
            attemptId: "att-2",
            skillName: "Variables and Data Types",
            attemptNumber: 1,
            totalQuestions: 8,
            status: "IN_PROGRESS",
          }),
        });
      }
      if (url.endsWith("/milestones/att-2")) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({
            attemptId: "att-2",
            status: "IN_PROGRESS",
            totalQuestions: 8,
            questions: mockQuestions,
          }),
        });
      }
      return Promise.reject(new Error(`Unexpected fetch: ${url}`));
    });

    render(
      <MemoryRouter initialEntries={["/roadmap"]}>
        <Routes>
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/milestone-assessment/:skillId" element={<MilestoneAssessment />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("1. Programming Fundamentals")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("1. Programming Fundamentals"));

    // Secondary card Take Assessment button is the first one before the main bottom button
    const buttons = screen.getAllByRole("button", { name: "Take Assessment" });
    fireEvent.click(buttons[0]);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/milestones/start"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ skillId: "variables-data-types" }),
        })
      );
      expect(screen.getByText("Question 1 text?")).toBeInTheDocument();
    });
  });
});
