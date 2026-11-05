--only backend track doing for now
INSERT INTO tracks (
    id,
    name,
    description,
    slug,
    is_active
)
VALUES (
    '10000000-0000-0000-0000-000000000001',
    'Backend Development',
    'A structured learning path covering Java programming, databases, APIs, Spring Boot, testing and deployment.',
    'backend-development',
    TRUE
)
ON CONFLICT (slug) DO NOTHING;