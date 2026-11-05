-- =====================================================
-- INSERT 36 BACKEND DEVELOPMENT SKILLS
-- 6 CATEGORIES x 6 SKILLS
-- =====================================================

INSERT INTO skills (
    track_id,
    category_id,
    name,
    slug,
    description,
    difficulty_level,
    estimated_minutes,
    sort_order,
    is_active
)
VALUES

-- =====================================================
-- CATEGORY 1: PROGRAMMING FUNDAMENTALS (JAVA)
-- =====================================================

(
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    'Variables and Data Types',
    'variables-data-types',
    'Understand Java variables, primitive data types, reference types, type conversion and type casting.',
    'BEGINNER',
    30,
    1,
    TRUE
),

(
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    'Operators and Expressions',
    'operators-expressions',
    'Learn arithmetic, relational, logical, assignment, unary and bitwise operators in Java.',
    'BEGINNER',
    35,
    2,
    TRUE
),

(
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    'Conditional Statements',
    'conditional-statements',
    'Understand decision-making using if, if-else, nested if, else-if and switch statements.',
    'BEGINNER',
    35,
    3,
    TRUE
),

(
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    'Loops',
    'loops',
    'Learn iteration using for, while, do-while and nested loops, including break and continue.',
    'BEGINNER',
    40,
    4,
    TRUE
),

(
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    'Methods and Functions',
    'methods-functions',
    'Understand method declaration, parameters, return values, method overloading and recursion.',
    'INTERMEDIATE',
    45,
    5,
    TRUE
),

(
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    'Arrays and Strings',
    'arrays-strings',
    'Learn array creation, traversal, multidimensional arrays and Java String operations.',
    'INTERMEDIATE',
    50,
    6,
    TRUE
),

-- =====================================================
-- CATEGORY 2: OBJECT-ORIENTED PROGRAMMING AND JAVA
-- =====================================================

(
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000002',
    'Classes and Objects',
    'classes-objects',
    'Understand classes, objects, constructors, instance variables and object creation in Java.',
    'BEGINNER',
    40,
    1,
    TRUE
),

(
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000002',
    'Encapsulation',
    'encapsulation',
    'Learn data hiding, access modifiers, getters, setters and encapsulation principles.',
    'INTERMEDIATE',
    35,
    2,
    TRUE
),

(
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000002',
    'Inheritance',
    'inheritance',
    'Understand inheritance, parent-child relationships, super keyword and types of inheritance supported by Java.',
    'INTERMEDIATE',
    40,
    3,
    TRUE
),

(
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000002',
    'Polymorphism',
    'polymorphism',
    'Learn compile-time and runtime polymorphism, method overloading and method overriding.',
    'INTERMEDIATE',
    45,
    4,
    TRUE
),

(
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000002',
    'Abstraction and Interfaces',
    'abstraction-interfaces',
    'Understand abstraction, abstract classes, interfaces and their implementation in Java.',
    'ADVANCED',
    45,
    5,
    TRUE
),

(
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000002',
    'Exception Handling',
    'exception-handling',
    'Learn exception handling using try, catch, finally, throw, throws and custom exceptions.',
    'INTERMEDIATE',
    40,
    6,
    TRUE
),

-- =====================================================
-- CATEGORY 3: DATA STRUCTURES, ALGORITHMS AND COLLECTIONS
-- =====================================================

(
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000003',
    'List, Set and Map',
    'list-set-map',
    'Understand Java Collections Framework interfaces including List, Set and Map.',
    'INTERMEDIATE',
    50,
    1,
    TRUE
),

(
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000003',
    'HashMap Internals',
    'hashmap-internals',
    'Learn hashing, hash codes, collision handling, buckets and internal HashMap operations.',
    'ADVANCED',
    55,
    2,
    TRUE
),

(
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000003',
    'Stacks and Queues',
    'stacks-queues',
    'Understand stack and queue operations, implementations and real-world applications.',
    'INTERMEDIATE',
    40,
    3,
    TRUE
),

(
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000003',
    'Linked Lists',
    'linked-lists',
    'Learn singly linked lists, doubly linked lists, traversal, insertion and deletion.',
    'INTERMEDIATE',
    45,
    4,
    TRUE
),

(
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000003',
    'Trees and Binary Search Trees',
    'trees-binary-search-trees',
    'Understand tree terminology, binary trees, BST operations and tree traversal techniques.',
    'ADVANCED',
    55,
    5,
    TRUE
),

(
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000003',
    'Sorting and Searching',
    'sorting-searching',
    'Learn linear search, binary search and common sorting algorithms with time complexity.',
    'ADVANCED',
    55,
    6,
    TRUE
),

-- =====================================================
-- CATEGORY 4: DATABASE MANAGEMENT
-- =====================================================

(
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000004',
    'Relational Database Concepts',
    'relational-database-concepts',
    'Understand relational databases, tables, rows, columns, relationships and schemas.',
    'BEGINNER',
    35,
    1,
    TRUE
),

(
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000004',
    'SQL Fundamentals',
    'sql-fundamentals',
    'Learn SQL commands including SELECT, INSERT, UPDATE, DELETE and filtering.',
    'BEGINNER',
    45,
    2,
    TRUE
),

(
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000004',
    'Joins and Subqueries',
    'joins-subqueries',
    'Understand SQL joins, nested queries, correlated subqueries and query composition.',
    'INTERMEDIATE',
    50,
    3,
    TRUE
),

(
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000004',
    'Primary and Foreign Keys',
    'primary-foreign-keys',
    'Learn primary keys, foreign keys, unique constraints and referential integrity.',
    'INTERMEDIATE',
    35,
    4,
    TRUE
),

(
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000004',
    'Database Normalization',
    'database-normalization',
    'Understand database normalization, functional dependencies and normal forms.',
    'ADVANCED',
    45,
    5,
    TRUE
),

(
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000004',
    'Transactions and ACID Properties',
    'transactions-acid-properties',
    'Learn database transactions, ACID properties, commit, rollback and isolation.',
    'ADVANCED',
    45,
    6,
    TRUE
),

-- =====================================================
-- CATEGORY 5: NETWORKING AND API DEVELOPMENT
-- =====================================================

(
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000005',
    'How the Internet Works',
    'how-internet-works',
    'Understand IP addresses, DNS, domain names, packets and basic internet communication.',
    'BEGINNER',
    35,
    1,
    TRUE
),

(
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000005',
    'Client-Server Architecture',
    'client-server-architecture',
    'Learn client-server communication, request-response cycles and architectural components.',
    'BEGINNER',
    35,
    2,
    TRUE
),

(
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000005',
    'HTTP and HTTPS',
    'http-https',
    'Understand HTTP communication, HTTPS, TLS and secure data transmission.',
    'INTERMEDIATE',
    40,
    3,
    TRUE
),

(
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000005',
    'REST API Architecture',
    'rest-api-architecture',
    'Learn REST principles, resources, endpoints, statelessness and API design.',
    'INTERMEDIATE',
    45,
    4,
    TRUE
),

(
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000005',
    'HTTP Methods and Status Codes',
    'http-methods-status-codes',
    'Understand GET, POST, PUT, PATCH, DELETE and commonly used HTTP status codes.',
    'INTERMEDIATE',
    40,
    5,
    TRUE
),

(
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000005',
    'Authentication and Authorization',
    'authentication-authorization',
    'Understand authentication, authorization, sessions, tokens and JWT fundamentals.',
    'ADVANCED',
    50,
    6,
    TRUE
),

-- =====================================================
-- CATEGORY 6: SPRING BOOT, TESTING AND DEPLOYMENT
-- =====================================================

(
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000006',
    'Spring Framework and IoC',
    'spring-framework-ioc',
    'Understand the Spring Framework, Inversion of Control and the Spring container.',
    'INTERMEDIATE',
    45,
    1,
    TRUE
),

(
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000006',
    'Dependency Injection and Spring Beans',
    'dependency-injection-spring-beans',
    'Learn dependency injection, bean creation, bean scopes and component management.',
    'INTERMEDIATE',
    45,
    2,
    TRUE
),

(
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000006',
    'Spring Boot and Auto-Configuration',
    'spring-boot-auto-configuration',
    'Understand Spring Boot starters, auto-configuration, application properties and embedded servers.',
    'INTERMEDIATE',
    50,
    3,
    TRUE
),

(
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000006',
    'Spring Data JPA and Hibernate',
    'spring-data-jpa-hibernate',
    'Learn entity mapping, repositories, ORM, relationships and database operations using JPA and Hibernate.',
    'ADVANCED',
    55,
    4,
    TRUE
),

(
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000006',
    'Unit and Integration Testing',
    'unit-integration-testing',
    'Understand unit testing, integration testing, JUnit, Mockito and Spring Boot testing.',
    'ADVANCED',
    50,
    5,
    TRUE
),

(
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000006',
    'Docker and CI/CD',
    'docker-cicd',
    'Learn Docker fundamentals, containerization, CI/CD pipelines and automated deployment.',
    'ADVANCED',
    55,
    6,
    TRUE
)

ON CONFLICT (slug) DO NOTHING;