import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SkillGraph from '../components/skillgraph/SkillGraph';
import * as auth from '../api/auth';

// Polyfill ResizeObserver for JSDOM / React Flow
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

const fullBackendData = {
  "trackId": "10000000-0000-0000-0000-000000000001",
  "nodes": [
    { "id": "24976d4d-ff1c-4dcb-a583-349cd9f085bf", "name": "How the Internet Works", "slug": "how-internet-works", "difficultyLevel": "BEGINNER", "sortOrder": 1, "categoryName": "Networking and API Development", "status": "LOCKED", "masteryScore": 0.0 },
    { "id": "f9563328-38d6-4850-a177-06dc87eab217", "name": "Relational Database Concepts", "slug": "relational-database-concepts", "difficultyLevel": "BEGINNER", "sortOrder": 1, "categoryName": "Database Management", "status": "LOCKED", "masteryScore": 0.0 },
    { "id": "cb70bd06-6c80-42e0-a1e6-eab46d4019db", "name": "Variables and Data Types", "slug": "variables-data-types", "difficultyLevel": "BEGINNER", "sortOrder": 1, "categoryName": "Programming Fundamentals (Java)", "status": "LOCKED", "masteryScore": 0.0 },
    { "id": "a82c87ce-4fb2-4319-90a6-4f898158ebf7", "name": "Classes and Objects", "slug": "classes-objects", "difficultyLevel": "BEGINNER", "sortOrder": 1, "categoryName": "Object-Oriented Programming and Java", "status": "LOCKED", "masteryScore": 0.0 },
    { "id": "b3bd557d-7ac8-40e0-93de-5b3a547dfe00", "name": "Spring Framework and IoC", "slug": "spring-framework-ioc", "difficultyLevel": "INTERMEDIATE", "sortOrder": 1, "categoryName": "Spring Boot, Testing and Deployment", "status": "LOCKED", "masteryScore": 0.0 },
    { "id": "44207b04-c1e7-486d-8a42-efdbd53a83c0", "name": "Client-Server Architecture", "slug": "client-server-architecture", "difficultyLevel": "BEGINNER", "sortOrder": 2, "categoryName": "Networking and API Development", "status": "LOCKED", "masteryScore": 0.0 },
    { "id": "219adbff-8f82-43f5-a6a7-c8c4f5f9fe7b", "name": "Dependency Injection and Spring Beans", "slug": "dependency-injection-spring-beans", "difficultyLevel": "INTERMEDIATE", "sortOrder": 2, "categoryName": "Spring Boot, Testing and Deployment", "status": "LOCKED", "masteryScore": 0.0 },
    { "id": "9c3a90de-72cb-4676-b759-bfc616bca779", "name": "Encapsulation", "slug": "encapsulation", "difficultyLevel": "INTERMEDIATE", "sortOrder": 2, "categoryName": "Object-Oriented Programming and Java", "status": "LOCKED", "masteryScore": 0.0 },
    { "id": "67ce6ff9-d753-4794-b29a-1dbf85cdfd9a", "name": "Operators and Expressions", "slug": "operators-expressions", "difficultyLevel": "BEGINNER", "sortOrder": 2, "categoryName": "Programming Fundamentals (Java)", "status": "LOCKED", "masteryScore": 0.0 },
    { "id": "990946cf-7320-432f-a36f-f6860927ead6", "name": "SQL Fundamentals", "slug": "sql-fundamentals", "difficultyLevel": "BEGINNER", "sortOrder": 2, "categoryName": "Database Management", "status": "LOCKED", "masteryScore": 0.0 },
    { "id": "49dc0b10-cd69-424e-8e02-496fec79dc0d", "name": "Conditional Statements", "slug": "conditional-statements", "difficultyLevel": "BEGINNER", "sortOrder": 3, "categoryName": "Programming Fundamentals (Java)", "status": "LOCKED", "masteryScore": 0.0 },
    { "id": "33091d92-214d-497d-852b-06f6757515e6", "name": "HTTP and HTTPS", "slug": "http-https", "difficultyLevel": "INTERMEDIATE", "sortOrder": 3, "categoryName": "Networking and API Development", "status": "LOCKED", "masteryScore": 0.0 },
    { "id": "cbcc7f95-7f45-40a4-943c-6f205ce05a86", "name": "Inheritance", "slug": "inheritance", "difficultyLevel": "INTERMEDIATE", "sortOrder": 3, "categoryName": "Object-Oriented Programming and Java", "status": "LOCKED", "masteryScore": 0.0 },
    { "id": "a7fd1ce9-aace-41a4-b20c-a7fcf45d7af1", "name": "Joins and Subqueries", "slug": "joins-subqueries", "difficultyLevel": "INTERMEDIATE", "sortOrder": 3, "categoryName": "Database Management", "status": "LOCKED", "masteryScore": 0.0 },
    { "id": "db99ac89-2940-4a0e-a418-d2e346fce4f3", "name": "Spring Boot and Auto-Configuration", "slug": "spring-boot-auto-configuration", "difficultyLevel": "INTERMEDIATE", "sortOrder": 3, "categoryName": "Spring Boot, Testing and Deployment", "status": "LOCKED", "masteryScore": 0.0 },
    { "id": "ef86c754-7553-4873-bddf-2e2e33e211fb", "name": "Loops", "slug": "loops", "difficultyLevel": "BEGINNER", "sortOrder": 4, "categoryName": "Programming Fundamentals (Java)", "status": "LOCKED", "masteryScore": 0.0 },
    { "id": "e2031c2e-e0fa-4c5c-855d-a4974b38371d", "name": "Polymorphism", "slug": "polymorphism", "difficultyLevel": "INTERMEDIATE", "sortOrder": 4, "categoryName": "Object-Oriented Programming and Java", "status": "LOCKED", "masteryScore": 0.0 },
    { "id": "d1cad5ce-238a-4854-ae04-10edeae5e47b", "name": "Primary and Foreign Keys", "slug": "primary-foreign-keys", "difficultyLevel": "INTERMEDIATE", "sortOrder": 4, "categoryName": "Database Management", "status": "LOCKED", "masteryScore": 0.0 },
    { "id": "66504338-567f-4ddd-b0e4-1fae72b81796", "name": "REST API Architecture", "slug": "rest-api-architecture", "difficultyLevel": "INTERMEDIATE", "sortOrder": 4, "categoryName": "Networking and API Development", "status": "LOCKED", "masteryScore": 0.0 },
    { "id": "dd321597-cce1-437c-9870-122b927e3881", "name": "Spring Data JPA and Hibernate", "slug": "spring-data-jpa-hibernate", "difficultyLevel": "ADVANCED", "sortOrder": 4, "categoryName": "Spring Boot, Testing and Deployment", "status": "LOCKED", "masteryScore": 0.0 },
    { "id": "0aa50598-d7d4-4490-9be6-4d90430b5e85", "name": "Abstraction and Interfaces", "slug": "abstraction-interfaces", "difficultyLevel": "ADVANCED", "sortOrder": 5, "categoryName": "Object-Oriented Programming and Java", "status": "LOCKED", "masteryScore": 0.0 },
    { "id": "0a27799c-ccf1-45cf-b7e8-f57cb40da37d", "name": "Database Normalization", "slug": "database-normalization", "difficultyLevel": "ADVANCED", "sortOrder": 5, "categoryName": "Database Management", "status": "LOCKED", "masteryScore": 0.0 },
    { "id": "6a8077cb-011c-4845-ae03-11ee4796a416", "name": "HTTP Methods and Status Codes", "slug": "http-methods-status-codes", "difficultyLevel": "INTERMEDIATE", "sortOrder": 5, "categoryName": "Networking and API Development", "status": "LOCKED", "masteryScore": 0.0 },
    { "id": "c6e8e31a-2fea-48b6-b1e0-1d8b295b36e9", "name": "Methods and Functions", "slug": "methods-functions", "difficultyLevel": "INTERMEDIATE", "sortOrder": 5, "categoryName": "Programming Fundamentals (Java)", "status": "LOCKED", "masteryScore": 0.0 },
    { "id": "4af3ec89-a830-448c-82c0-642a5fdf2010", "name": "Unit and Integration Testing", "slug": "unit-integration-testing", "difficultyLevel": "ADVANCED", "sortOrder": 5, "categoryName": "Spring Boot, Testing and Deployment", "status": "LOCKED", "masteryScore": 0.0 },
    { "id": "d130edd1-2e3a-46c2-a062-f0ea83175985", "name": "Arrays and Strings", "slug": "arrays-strings", "difficultyLevel": "INTERMEDIATE", "sortOrder": 6, "categoryName": "Programming Fundamentals (Java)", "status": "LOCKED", "masteryScore": 0.0 },
    { "id": "55847438-98ab-4ac8-96d7-39c10125d018", "name": "List, Set and Map", "slug": "list-set-map", "difficultyLevel": "INTERMEDIATE", "sortOrder": 1, "categoryName": "Java Collections and Problem Solving", "status": "LOCKED", "masteryScore": 0.0 },
    { "id": "75efba09-8cd4-47ec-9b45-eaed6d758024", "name": "HashMap Internals", "slug": "hashmap-internals", "difficultyLevel": "ADVANCED", "sortOrder": 2, "categoryName": "Java Collections and Problem Solving", "status": "LOCKED", "masteryScore": 0.0 },
    { "id": "b046ffff-3fa3-4929-b5a9-f3a6586de84c", "name": "Authentication and Authorization", "slug": "authentication-authorization", "difficultyLevel": "ADVANCED", "sortOrder": 6, "categoryName": "Networking and API Development", "status": "LOCKED", "masteryScore": 0.0 },
    { "id": "39830b3b-0471-43f2-b154-0feeb9808f4c", "name": "Docker and CI/CD", "slug": "docker-cicd", "difficultyLevel": "ADVANCED", "sortOrder": 6, "categoryName": "Spring Boot, Testing and Deployment", "status": "LOCKED", "masteryScore": 0.0 },
    { "id": "9472aad3-b716-43a8-a958-09144c482657", "name": "Exception Handling", "slug": "exception-handling", "difficultyLevel": "INTERMEDIATE", "sortOrder": 6, "categoryName": "Object-Oriented Programming and Java", "status": "LOCKED", "masteryScore": 0.0 },
    { "id": "97c6901d-d922-4593-822f-2eac0f7f3cc5", "name": "Sorting and Searching", "slug": "sorting-searching", "difficultyLevel": "ADVANCED", "sortOrder": 6, "categoryName": "Java Collections and Problem Solving", "status": "LOCKED", "masteryScore": 0.0 },
    { "id": "6b084e2f-c029-477a-a7c4-7f7b57397105", "name": "Transactions and ACID Properties", "slug": "transactions-acid-properties", "difficultyLevel": "ADVANCED", "sortOrder": 6, "categoryName": "Database Management", "status": "LOCKED", "masteryScore": 0.0 }
  ],
  "edges": [
    { "prerequisiteSkillId": "cb70bd06-6c80-42e0-a1e6-eab46d4019db", "dependentSkillId": "67ce6ff9-d753-4794-b29a-1dbf85cdfd9a" },
    { "prerequisiteSkillId": "67ce6ff9-d753-4794-b29a-1dbf85cdfd9a", "dependentSkillId": "49dc0b10-cd69-424e-8e02-496fec79dc0d" },
    { "prerequisiteSkillId": "49dc0b10-cd69-424e-8e02-496fec79dc0d", "dependentSkillId": "ef86c754-7553-4873-bddf-2e2e33e211fb" },
    { "prerequisiteSkillId": "ef86c754-7553-4873-bddf-2e2e33e211fb", "dependentSkillId": "c6e8e31a-2fea-48b6-b1e0-1d8b295b36e9" },
    { "prerequisiteSkillId": "c6e8e31a-2fea-48b6-b1e0-1d8b295b36e9", "dependentSkillId": "d130edd1-2e3a-46c2-a062-f0ea83175985" },
    { "prerequisiteSkillId": "cb70bd06-6c80-42e0-a1e6-eab46d4019db", "dependentSkillId": "a82c87ce-4fb2-4319-90a6-4f898158ebf7" },
    { "prerequisiteSkillId": "a82c87ce-4fb2-4319-90a6-4f898158ebf7", "dependentSkillId": "9c3a90de-72cb-4676-b759-bfc616bca779" },
    { "prerequisiteSkillId": "a82c87ce-4fb2-4319-90a6-4f898158ebf7", "dependentSkillId": "cbcc7f95-7f45-40a4-943c-6f205ce05a86" },
    { "prerequisiteSkillId": "cbcc7f95-7f45-40a4-943c-6f205ce05a86", "dependentSkillId": "e2031c2e-e0fa-4c5c-855d-a4974b38371d" },
    { "prerequisiteSkillId": "a82c87ce-4fb2-4319-90a6-4f898158ebf7", "dependentSkillId": "0aa50598-d7d4-4490-9be6-4d90430b5e85" },
    { "prerequisiteSkillId": "a82c87ce-4fb2-4319-90a6-4f898158ebf7", "dependentSkillId": "9472aad3-b716-43a8-a958-09144c482657" },
    { "prerequisiteSkillId": "d130edd1-2e3a-46c2-a062-f0ea83175985", "dependentSkillId": "55847438-98ab-4ac8-96d7-39c10125d018" },
    { "prerequisiteSkillId": "55847438-98ab-4ac8-96d7-39c10125d018", "dependentSkillId": "75efba09-8cd4-47ec-9b45-eaed6d758024" },
    { "prerequisiteSkillId": "d130edd1-2e3a-46c2-a062-f0ea83175985", "dependentSkillId": "97c6901d-d922-4593-822f-2eac0f7f3cc5" },
    { "prerequisiteSkillId": "f9563328-38d6-4850-a177-06dc87eab217", "dependentSkillId": "990946cf-7320-432f-a36f-f6860927ead6" },
    { "prerequisiteSkillId": "990946cf-7320-432f-a36f-f6860927ead6", "dependentSkillId": "a7fd1ce9-aace-41a4-b20c-a7fcf45d7af1" },
    { "prerequisiteSkillId": "f9563328-38d6-4850-a177-06dc87eab217", "dependentSkillId": "d1cad5ce-238a-4854-ae04-10edeae5e47b" },
    { "prerequisiteSkillId": "d1cad5ce-238a-4854-ae04-10edeae5e47b", "dependentSkillId": "0a27799c-ccf1-45cf-b7e8-f57cb40da37d" },
    { "prerequisiteSkillId": "990946cf-7320-432f-a36f-f6860927ead6", "dependentSkillId": "6b084e2f-c029-477a-a7c4-7f7b57397105" },
    { "prerequisiteSkillId": "24976d4d-ff1c-4dcb-a583-349cd9f085bf", "dependentSkillId": "44207b04-c1e7-486d-8a42-efdbd53a83c0" },
    { "prerequisiteSkillId": "44207b04-c1e7-486d-8a42-efdbd53a83c0", "dependentSkillId": "33091d92-214d-497d-852b-06f6757515e6" },
    { "prerequisiteSkillId": "33091d92-214d-497d-852b-06f6757515e6", "dependentSkillId": "66504338-567f-4ddd-b0e4-1fae72b81796" },
    { "prerequisiteSkillId": "66504338-567f-4ddd-b0e4-1fae72b81796", "dependentSkillId": "6a8077cb-011c-4845-ae03-11ee4796a416" },
    { "prerequisiteSkillId": "6a8077cb-011c-4845-ae03-11ee4796a416", "dependentSkillId": "b046ffff-3fa3-4929-b5a9-f3a6586de84c" },
    { "prerequisiteSkillId": "a82c87ce-4fb2-4319-90a6-4f898158ebf7", "dependentSkillId": "b3bd557d-7ac8-40e0-93de-5b3a547dfe00" },
    { "prerequisiteSkillId": "b3bd557d-7ac8-40e0-93de-5b3a547dfe00", "dependentSkillId": "219adbff-8f82-43f5-a6a7-c8c4f5f9fe7b" },
    { "prerequisiteSkillId": "219adbff-8f82-43f5-a6a7-c8c4f5f9fe7b", "dependentSkillId": "db99ac89-2940-4a0e-a418-d2e346fce4f3" },
    { "prerequisiteSkillId": "db99ac89-2940-4a0e-a418-d2e346fce4f3", "dependentSkillId": "dd321597-cce1-437c-9870-122b927e3881" },
    { "prerequisiteSkillId": "dd321597-cce1-437c-9870-122b927e3881", "dependentSkillId": "4af3ec89-a830-448c-82c0-642a5fdf2010" },
    { "prerequisiteSkillId": "db99ac89-2940-4a0e-a418-d2e346fce4f3", "dependentSkillId": "39830b3b-0471-43f2-b154-0feeb9808f4c" }
  ]
};

describe('SkillGraph Component with Actual Backend Data', () => {
  beforeEach(() => {
    vi.spyOn(auth, 'getAuthToken').mockReturnValue('mock-jwt-token');
  });

  it('correctly processes and displays all 33 skills and categories from the actual backend', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => fullBackendData,
    });

    render(
      <MemoryRouter>
        <SkillGraph />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('My Skill Graph')).toBeInTheDocument();
    });

    // Check total skills count
    expect(screen.getByText('33')).toBeInTheDocument();

    // Check that all 6 categories are rendered as filter chips
    const categories = [
      'Networking and API Development',
      'Database Management',
      'Programming Fundamentals (Java)',
      'Object-Oriented Programming and Java',
      'Spring Boot, Testing and Deployment',
      'Java Collections and Problem Solving',
    ];

    categories.forEach((cat) => {
      expect(screen.getAllByText(cat).length).toBeGreaterThan(0);
    });

    // Verify detail panel shows the initially selected node
    expect(screen.getByText('Selected Skill Details')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /take assessment/i })).toBeInTheDocument();
  });

  it('filters by category when clicked and handles node selection', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => fullBackendData,
    });

    render(
      <MemoryRouter>
        <SkillGraph />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('My Skill Graph')).toBeInTheDocument();
    });

    const categoryBtn = screen.getByRole('button', { name: /Spring Boot, Testing and Deployment/i });
    fireEvent.click(categoryBtn);

    expect(categoryBtn.className).toContain('bg-violet-600');
  });

  it('handles API error state with retry button', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    render(
      <MemoryRouter>
        <SkillGraph />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Could Not Load Graph')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });
  });
});
