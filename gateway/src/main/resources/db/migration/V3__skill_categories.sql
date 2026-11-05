INSERT INTO skill_categories (
    id,
    name,
    description,
    slug,
    sort_order,
    is_active
)
VALUES

(
    '20000000-0000-0000-0000-000000000001',
    'Programming Fundamentals (Java)',
    'Learn the core concepts of Java programming, including variables, operators, conditions, loops, methods, arrays and strings.',
    'programming-fundamentals-java',
    1,
    TRUE
),

(
    '20000000-0000-0000-0000-000000000002',
    'Object-Oriented Programming and Java',
    'Understand object-oriented programming principles and their implementation in Java.',
    'object-oriented-programming-java',
    2,
    TRUE
),

(
    '20000000-0000-0000-0000-000000000003',
    'Java Collections and Problem Solving',
    'Learn data structures, algorithms and Java Collections Framework concepts.',
    'java-collections-problem-solving',
    3,
    TRUE
),

(
    '20000000-0000-0000-0000-000000000004',
    'Database Management',
    'Understand relational databases, SQL, joins, keys, normalization and transaction management.',
    'database-management',
    4,
    TRUE
),

(
    '20000000-0000-0000-0000-000000000005',
    'Networking and API Development',
    'Learn networking fundamentals, HTTP, REST APIs and authentication mechanisms.',
    'networking-api-development',
    5,
    TRUE
),

(
    '20000000-0000-0000-0000-000000000006',
    'Spring Boot, Testing and Deployment',
    'Learn Spring Framework, Spring Boot, JPA, testing, Docker and CI/CD.',
    'spring-boot-testing-deployment',
    6,
    TRUE
)

ON CONFLICT (slug) DO NOTHING;