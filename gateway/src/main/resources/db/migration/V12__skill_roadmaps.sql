-- =============================================================================
-- Migration V12: Skill-Based Learning Roadmap Schema & Initial Data Seeding
-- Exactly 3 new tables: skill_roadmaps, roadmap_nodes, user_roadmap_progress
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. TABLE: skill_roadmaps
-- Stores learning roadmaps associated with existing skills (1:N relationship)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS skill_roadmaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_id UUID NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    version INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_skill_roadmaps_skill
        FOREIGN KEY (skill_id)
        REFERENCES skills(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_skill_roadmaps_skill
    ON skill_roadmaps(skill_id);

CREATE INDEX IF NOT EXISTS idx_skill_roadmaps_active
    ON skill_roadmaps(skill_id, is_active);

-- -----------------------------------------------------------------------------
-- 2. TABLE: roadmap_nodes
-- Stores topics and subtopics with ordering, JSONB prerequisites & resources
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS roadmap_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    roadmap_id UUID NOT NULL,
    parent_node_id UUID,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    slug VARCHAR(200),
    sequence_order INTEGER NOT NULL DEFAULT 1,
    prerequisites JSONB NOT NULL DEFAULT '[]'::jsonb,
    resources JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_roadmap_nodes_roadmap
        FOREIGN KEY (roadmap_id)
        REFERENCES skill_roadmaps(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_roadmap_nodes_parent
        FOREIGN KEY (parent_node_id)
        REFERENCES roadmap_nodes(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_no_self_parent
        CHECK (parent_node_id IS NULL OR parent_node_id <> id)
);

CREATE INDEX IF NOT EXISTS idx_roadmap_nodes_roadmap
    ON roadmap_nodes(roadmap_id);

CREATE INDEX IF NOT EXISTS idx_roadmap_nodes_parent
    ON roadmap_nodes(parent_node_id);

CREATE INDEX IF NOT EXISTS idx_roadmap_nodes_order
    ON roadmap_nodes(roadmap_id, sequence_order);

-- -----------------------------------------------------------------------------
-- 3. TABLE: user_roadmap_progress
-- Tracks individual learner progress against roadmap nodes
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_roadmap_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    node_id UUID NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'NOT_STARTED',
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_progress_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_progress_node
        FOREIGN KEY (node_id)
        REFERENCES roadmap_nodes(id)
        ON DELETE CASCADE,

    CONSTRAINT uk_user_roadmap_node
        UNIQUE (user_id, node_id),

    CONSTRAINT chk_progress_status
        CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'))
);

CREATE INDEX IF NOT EXISTS idx_progress_user
    ON user_roadmap_progress(user_id);

CREATE INDEX IF NOT EXISTS idx_progress_node
    ON user_roadmap_progress(node_id);


-- =============================================================================
-- SEED DATA: 1 Initial Active Roadmap per Skill for all 33 Skills
-- =============================================================================

INSERT INTO skill_roadmaps (id, skill_id, title, description, version, is_active)
SELECT
    mapping.roadmap_id,
    s.id,
    mapping.title,
    mapping.description,
    1,
    TRUE
FROM (
    VALUES
        -- Category 1
        ('60000000-0000-0000-0000-000000000001'::UUID, 'variables-data-types', 'Variables and Data Types Roadmap', 'Roadmap for mastering Java variables, primitives, references, and type casting.'),
        ('60000000-0000-0000-0000-000000000002'::UUID, 'operators-expressions', 'Operators and Expressions Roadmap', 'Roadmap for arithmetic, logical, precedence, and ternary operators.'),
        ('60000000-0000-0000-0000-000000000003'::UUID, 'conditional-statements', 'Conditional Statements Roadmap', 'Roadmap for if-else branching, switch expressions, and nested logic.'),
        ('60000000-0000-0000-0000-000000000004'::UUID, 'loops', 'Loops Roadmap', 'Roadmap for for, while, do-while iteration, jump statements, and nested loops.'),
        ('60000000-0000-0000-0000-000000000005'::UUID, 'methods-functions', 'Methods and Functions Roadmap', 'Roadmap for method declaration, parameters, return values, and overloading.'),
        ('60000000-0000-0000-0000-000000000006'::UUID, 'arrays-strings', 'Arrays and Strings Roadmap', 'Roadmap for arrays traversal, string immutability, and StringBuilder.'),

        -- Category 2
        ('60000000-0000-0000-0000-000000000007'::UUID, 'classes-objects', 'Classes and Objects Roadmap', 'Roadmap for OOP blueprint, instance variables, constructors, and static members.'),
        ('60000000-0000-0000-0000-000000000008'::UUID, 'encapsulation', 'Encapsulation Roadmap', 'Roadmap for data hiding, access modifiers, getters/setters, and immutability.'),
        ('60000000-0000-0000-0000-000000000009'::UUID, 'inheritance', 'Inheritance Roadmap', 'Roadmap for class hierarchy, super keyword, and method overriding.'),
        ('60000000-0000-0000-0000-000000000010'::UUID, 'polymorphism', 'Polymorphism Roadmap', 'Roadmap for compile-time/runtime polymorphism, upcasting, and dynamic dispatch.'),
        ('60000000-0000-0000-0000-000000000011'::UUID, 'abstraction-interfaces', 'Abstraction and Interfaces Roadmap', 'Roadmap for abstract classes, interface contracts, and default methods.'),
        ('60000000-0000-0000-0000-000000000012'::UUID, 'exception-handling', 'Exception Handling Roadmap', 'Roadmap for try-catch-finally, checked vs unchecked exceptions, and custom exceptions.'),

        -- Category 3
        ('60000000-0000-0000-0000-000000000013'::UUID, 'list-set-map', 'List, Set and Map Roadmap', 'Roadmap for core collection interfaces, implementations, and iteration.'),
        ('60000000-0000-0000-0000-000000000014'::UUID, 'hashmap-internals', 'HashMap Internals Roadmap', 'Roadmap for hashing, buckets, collision resolution, and internal operations.'),
        ('60000000-0000-0000-0000-000000000015'::UUID, 'sorting-searching', 'Sorting and Searching Roadmap', 'Roadmap for Comparable, Comparator, binary search, and complexity.'),

        -- Category 4
        ('60000000-0000-0000-0000-000000000016'::UUID, 'relational-database-concepts', 'Relational Database Concepts Roadmap', 'Roadmap for tables, candidate/primary keys, and entity relationships.'),
        ('60000000-0000-0000-0000-000000000017'::UUID, 'sql-fundamentals', 'SQL Fundamentals Roadmap', 'Roadmap for basic DML, filtering, safe updates, and aggregations.'),
        ('60000000-0000-0000-0000-000000000018'::UUID, 'joins-subqueries', 'Joins and Subqueries Roadmap', 'Roadmap for inner/left joins, correlated subqueries, and self joins.'),
        ('60000000-0000-0000-0000-000000000019'::UUID, 'primary-foreign-keys', 'Primary and Foreign Keys Roadmap', 'Roadmap for primary keys, referential integrity, and constraints.'),
        ('60000000-0000-0000-0000-000000000020'::UUID, 'database-normalization', 'Database Normalization Roadmap', 'Roadmap for 1NF, 2NF, 3NF, and intentional denormalization.'),
        ('60000000-0000-0000-0000-000000000021'::UUID, 'transactions-acid-properties', 'Transactions and ACID Roadmap', 'Roadmap for transaction boundaries, ACID guarantees, and isolation levels.'),

        -- Category 5
        ('60000000-0000-0000-0000-000000000022'::UUID, 'how-internet-works', 'How the Internet Works Roadmap', 'Roadmap for IP/DNS, TCP/UDP ports, and packet routing.'),
        ('60000000-0000-0000-0000-000000000023'::UUID, 'client-server-architecture', 'Client-Server Architecture Roadmap', 'Roadmap for request-response lifecycle, statelessness, and load balancers.'),
        ('60000000-0000-0000-0000-000000000024'::UUID, 'http-https', 'HTTP and HTTPS Roadmap', 'Roadmap for headers, TLS handshakes, and SSL/TLS certificates.'),
        ('60000000-0000-0000-0000-000000000025'::UUID, 'rest-api-architecture', 'REST API Architecture Roadmap', 'Roadmap for resource URIs, REST constraints, and API versioning.'),
        ('60000000-0000-0000-0000-000000000026'::UUID, 'http-methods-status-codes', 'HTTP Methods and Status Codes Roadmap', 'Roadmap for HTTP verbs, status classes (2xx/4xx/5xx), and idempotency.'),
        ('60000000-0000-0000-0000-000000000027'::UUID, 'authentication-authorization', 'Authentication and Authorization Roadmap', 'Roadmap for hashing, sessions, JWT tokens, refresh tokens, and RBAC.'),

        -- Category 6
        ('60000000-0000-0000-0000-000000000028'::UUID, 'spring-framework-ioc', 'Spring Framework and IoC Roadmap', 'Roadmap for IoC container, BeanFactory, ApplicationContext, and bean lifecycle.'),
        ('60000000-0000-0000-0000-000000000029'::UUID, 'dependency-injection-spring-beans', 'Dependency Injection and Spring Beans Roadmap', 'Roadmap for injection styles, stereotypes, bean scopes, and security beans.'),
        ('60000000-0000-0000-0000-000000000030'::UUID, 'spring-boot-auto-configuration', 'Spring Boot and Auto-Configuration Roadmap', 'Roadmap for starters, auto-config, profiles, SecurityFilterChain, and CORS/CSRF.'),
        ('60000000-0000-0000-0000-000000000031'::UUID, 'spring-data-jpa-hibernate', 'Spring Data JPA and Hibernate Roadmap', 'Roadmap for entities, repositories, relationships, JPQL, and lazy loading.'),
        ('60000000-0000-0000-0000-000000000032'::UUID, 'unit-integration-testing', 'Unit and Integration Testing Roadmap', 'Roadmap for JUnit assertions, Mockito stubs/mocks, and @SpringBootTest.'),
        ('60000000-0000-0000-0000-000000000033'::UUID, 'docker-cicd', 'Docker and CI/CD Roadmap', 'Roadmap for Dockerfiles, multi-container Compose, and CI/CD pipelines.')
) AS mapping(roadmap_id, skill_slug, title, description)
JOIN skills s ON s.slug = mapping.skill_slug
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- SEED DATA: Roadmap Nodes (Topics with sequence, prerequisites, descriptions)
-- =============================================================================

INSERT INTO roadmap_nodes (id, roadmap_id, parent_node_id, title, description, sequence_order, prerequisites, resources)
VALUES
    -- -------------------------------------------------------------------------
    -- Category 1: Programming Fundamentals (Java)
    -- -------------------------------------------------------------------------
    -- 1. Variables and Data Types
    ('70000000-0000-0000-0000-000000000001'::UUID, '60000000-0000-0000-0000-000000000001'::UUID, NULL, 'Primitives', 'int, double, boolean, char', 1, '[]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000002'::UUID, '60000000-0000-0000-0000-000000000001'::UUID, NULL, 'Reference types', 'String, objects, null, stack vs heap', 2, '["70000000-0000-0000-0000-000000000001"]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000003'::UUID, '60000000-0000-0000-0000-000000000001'::UUID, NULL, 'Type casting', 'Widening, narrowing, wrapper classes, autoboxing', 3, '["70000000-0000-0000-0000-000000000002"]'::jsonb, '[]'::jsonb),

    -- 2. Operators and Expressions
    ('70000000-0000-0000-0000-000000000004'::UUID, '60000000-0000-0000-0000-000000000002'::UUID, NULL, 'Arithmetic and logic', '+ - * / %, relational, && || !', 1, '[]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000005'::UUID, '60000000-0000-0000-0000-000000000002'::UUID, NULL, 'Precedence', 'Order of evaluation, parentheses, increment/decrement', 2, '["70000000-0000-0000-0000-000000000004"]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000006'::UUID, '60000000-0000-0000-0000-000000000002'::UUID, NULL, 'Ternary', 'condition ? a : b, assignment operators, bitwise basics', 3, '["70000000-0000-0000-0000-000000000005"]'::jsonb, '[]'::jsonb),

    -- 3. Conditional Statements
    ('70000000-0000-0000-0000-000000000007'::UUID, '60000000-0000-0000-0000-000000000003'::UUID, NULL, 'if / else', 'if, else if, else, boolean conditions', 1, '[]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000008'::UUID, '60000000-0000-0000-0000-000000000003'::UUID, NULL, 'switch', 'Classic switch, fall-through, switch expressions', 2, '["70000000-0000-0000-0000-000000000007"]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000009'::UUID, '60000000-0000-0000-0000-000000000003'::UUID, NULL, 'Nested logic', 'Nested if, combined conditions, guard clauses', 3, '["70000000-0000-0000-0000-000000000008"]'::jsonb, '[]'::jsonb),

    -- 4. Loops
    ('70000000-0000-0000-0000-000000000010'::UUID, '60000000-0000-0000-0000-000000000004'::UUID, NULL, 'for / while', 'for, while, do-while, for-each', 1, '[]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000011'::UUID, '60000000-0000-0000-0000-000000000004'::UUID, NULL, 'break / continue', 'Exit early, skip iteration, labels', 2, '["70000000-0000-0000-0000-000000000010"]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000012'::UUID, '60000000-0000-0000-0000-000000000004'::UUID, NULL, 'Nested loops', 'Pattern printing, matrix traversal, loop pitfalls', 3, '["70000000-0000-0000-0000-000000000011"]'::jsonb, '[]'::jsonb),

    -- 5. Methods and Functions
    ('70000000-0000-0000-0000-000000000013'::UUID, '60000000-0000-0000-0000-000000000005'::UUID, NULL, 'Parameters', 'Declaring methods, pass by value, varargs', 1, '[]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000014'::UUID, '60000000-0000-0000-0000-000000000005'::UUID, NULL, 'Return values', 'return types, void, early return', 2, '["70000000-0000-0000-0000-000000000013"]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000015'::UUID, '60000000-0000-0000-0000-000000000005'::UUID, NULL, 'Overloading', 'Same name, different signatures, recursion basics', 3, '["70000000-0000-0000-0000-000000000014"]'::jsonb, '[]'::jsonb),

    -- 6. Arrays and Strings
    ('70000000-0000-0000-0000-000000000016'::UUID, '60000000-0000-0000-0000-000000000006'::UUID, NULL, 'Arrays', '1D/2D arrays, traversal, Arrays utility', 1, '[]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000017'::UUID, '60000000-0000-0000-0000-000000000006'::UUID, NULL, 'String methods', 'Immutability, substring, split, compare', 2, '["70000000-0000-0000-0000-000000000016"]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000018'::UUID, '60000000-0000-0000-0000-000000000006'::UUID, NULL, 'StringBuilder', 'Mutable strings, append, performance', 3, '["70000000-0000-0000-0000-000000000017"]'::jsonb, '[]'::jsonb),

    -- -------------------------------------------------------------------------
    -- Category 2: Object-Oriented Programming and Java
    -- -------------------------------------------------------------------------
    -- 7. Classes and Objects
    ('70000000-0000-0000-0000-000000000019'::UUID, '60000000-0000-0000-0000-000000000007'::UUID, NULL, 'Fields and methods', 'Instance variables, methods, object creation', 1, '[]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000020'::UUID, '60000000-0000-0000-0000-000000000007'::UUID, NULL, 'Constructors', 'Default, parameterized, chaining', 2, '["70000000-0000-0000-0000-000000000019"]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000021'::UUID, '60000000-0000-0000-0000-000000000007'::UUID, NULL, 'this / static', 'this keyword, static members, static blocks', 3, '["70000000-0000-0000-0000-000000000020"]'::jsonb, '[]'::jsonb),

    -- 8. Encapsulation
    ('70000000-0000-0000-0000-000000000022'::UUID, '60000000-0000-0000-0000-000000000008'::UUID, NULL, 'Access modifiers', 'private, default, protected, public', 1, '[]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000023'::UUID, '60000000-0000-0000-0000-000000000008'::UUID, NULL, 'Getters / setters', 'Controlled access, validation', 2, '["70000000-0000-0000-0000-000000000022"]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000024'::UUID, '60000000-0000-0000-0000-000000000008'::UUID, NULL, 'Immutability', 'final, immutable classes, defensive copies', 3, '["70000000-0000-0000-0000-000000000023"]'::jsonb, '[]'::jsonb),

    -- 9. Inheritance
    ('70000000-0000-0000-0000-000000000025'::UUID, '60000000-0000-0000-0000-000000000009'::UUID, NULL, 'extends', 'Parent/child classes, IS-A, Object class', 1, '[]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000026'::UUID, '60000000-0000-0000-0000-000000000009'::UUID, NULL, 'super', 'Calling parent constructor/method, constructor order', 2, '["70000000-0000-0000-0000-000000000025"]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000027'::UUID, '60000000-0000-0000-0000-000000000009'::UUID, NULL, 'Overriding', '@Override, rules, final methods', 3, '["70000000-0000-0000-0000-000000000026"]'::jsonb, '[]'::jsonb),

    -- 10. Polymorphism
    ('70000000-0000-0000-0000-000000000028'::UUID, '60000000-0000-0000-0000-000000000010'::UUID, NULL, 'Overload vs override', 'Compile-time vs runtime', 1, '[]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000029'::UUID, '60000000-0000-0000-0000-000000000010'::UUID, NULL, 'Upcasting', 'Parent reference, downcasting, instanceof', 2, '["70000000-0000-0000-0000-000000000028"]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000030'::UUID, '60000000-0000-0000-0000-000000000010'::UUID, NULL, 'Dynamic dispatch', 'Method resolution at runtime', 3, '["70000000-0000-0000-0000-000000000029"]'::jsonb, '[]'::jsonb),

    -- 11. Abstraction and Interfaces
    ('70000000-0000-0000-0000-000000000031'::UUID, '60000000-0000-0000-0000-000000000011'::UUID, NULL, 'Abstract classes', 'abstract methods, partial implementation', 1, '[]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000032'::UUID, '60000000-0000-0000-0000-000000000011'::UUID, NULL, 'Interfaces', 'Contracts, multiple implementation', 2, '["70000000-0000-0000-0000-000000000031"]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000033'::UUID, '60000000-0000-0000-0000-000000000011'::UUID, NULL, 'Default methods', 'default/static methods, functional interfaces', 3, '["70000000-0000-0000-0000-000000000032"]'::jsonb, '[]'::jsonb),

    -- 12. Exception Handling
    ('70000000-0000-0000-0000-000000000034'::UUID, '60000000-0000-0000-0000-000000000012'::UUID, NULL, 'try / catch / finally', 'Flow, multiple catch, try-with-resources', 1, '[]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000035'::UUID, '60000000-0000-0000-0000-000000000012'::UUID, NULL, 'Checked vs unchecked', 'Exception hierarchy, throws', 2, '["70000000-0000-0000-0000-000000000034"]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000036'::UUID, '60000000-0000-0000-0000-000000000012'::UUID, NULL, 'Custom exceptions', 'Extending Exception, best practices', 3, '["70000000-0000-0000-0000-000000000035"]'::jsonb, '[]'::jsonb),

    -- -------------------------------------------------------------------------
    -- Category 3: Java Collections and Problem Solving
    -- -------------------------------------------------------------------------
    -- 13. List, Set and Map
    ('70000000-0000-0000-0000-000000000037'::UUID, '60000000-0000-0000-0000-000000000013'::UUID, NULL, 'List', 'ArrayList, LinkedList, iteration', 1, '[]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000038'::UUID, '60000000-0000-0000-0000-000000000013'::UUID, NULL, 'Set', 'HashSet, LinkedHashSet, TreeSet', 2, '["70000000-0000-0000-0000-000000000037"]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000039'::UUID, '60000000-0000-0000-0000-000000000013'::UUID, NULL, 'Map', 'HashMap, TreeMap, Collections framework overview', 3, '["70000000-0000-0000-0000-000000000038"]'::jsonb, '[]'::jsonb),

    -- 14. HashMap Internals
    ('70000000-0000-0000-0000-000000000040'::UUID, '60000000-0000-0000-0000-000000000014'::UUID, NULL, 'Hashing fundamentals', 'hashCode, equals, hash functions, collisions', 1, '[]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000041'::UUID, '60000000-0000-0000-0000-000000000014'::UUID, NULL, 'HashMap internal structure', 'Buckets, Node array, linked list/tree bins', 2, '["70000000-0000-0000-0000-000000000040"]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000042'::UUID, '60000000-0000-0000-0000-000000000014'::UUID, NULL, 'HashMap operations', 'put, get, remove, resize, load factor', 3, '["70000000-0000-0000-0000-000000000041"]'::jsonb, '[]'::jsonb),

    -- 15. Sorting and Searching
    ('70000000-0000-0000-0000-000000000043'::UUID, '60000000-0000-0000-0000-000000000015'::UUID, NULL, 'Comparable / Comparator', 'Natural vs custom ordering, Collections.sort', 1, '[]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000044'::UUID, '60000000-0000-0000-0000-000000000015'::UUID, NULL, 'Binary search', 'Sorted data, iterative/recursive', 2, '["70000000-0000-0000-0000-000000000043"]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000045'::UUID, '60000000-0000-0000-0000-000000000015'::UUID, NULL, 'Complexity', 'Big-O, bubble/merge/quick sort basics', 3, '["70000000-0000-0000-0000-000000000044"]'::jsonb, '[]'::jsonb),

    -- -------------------------------------------------------------------------
    -- Category 4: Database Management
    -- -------------------------------------------------------------------------
    -- 16. Relational Database Concepts
    ('70000000-0000-0000-0000-000000000046'::UUID, '60000000-0000-0000-0000-000000000016'::UUID, NULL, 'Tables and rows', 'Schema, columns, data types', 1, '[]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000047'::UUID, '60000000-0000-0000-0000-000000000016'::UUID, NULL, 'Keys', 'Candidate, primary, unique', 2, '["70000000-0000-0000-0000-000000000046"]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000048'::UUID, '60000000-0000-0000-0000-000000000016'::UUID, NULL, 'Relationships', '1:1, 1:N, N:N', 3, '["70000000-0000-0000-0000-000000000047"]'::jsonb, '[]'::jsonb),

    -- 17. SQL Fundamentals
    ('70000000-0000-0000-0000-000000000049'::UUID, '60000000-0000-0000-0000-000000000017'::UUID, NULL, 'SELECT / WHERE', 'Filtering, ORDER BY, LIMIT', 1, '[]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000050'::UUID, '60000000-0000-0000-0000-000000000017'::UUID, NULL, 'INSERT / UPDATE / DELETE', 'DML, safe updates', 2, '["70000000-0000-0000-0000-000000000049"]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000051'::UUID, '60000000-0000-0000-0000-000000000017'::UUID, NULL, 'GROUP BY', 'Aggregates, HAVING, DISTINCT', 3, '["70000000-0000-0000-0000-000000000050"]'::jsonb, '[]'::jsonb),

    -- 18. Joins and Subqueries
    ('70000000-0000-0000-0000-000000000052'::UUID, '60000000-0000-0000-0000-000000000018'::UUID, NULL, 'INNER / LEFT join', 'Join types, ON conditions', 1, '[]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000053'::UUID, '60000000-0000-0000-0000-000000000018'::UUID, NULL, 'Subqueries', 'Scalar, IN/EXISTS, correlated', 2, '["70000000-0000-0000-0000-000000000052"]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000054'::UUID, '60000000-0000-0000-0000-000000000018'::UUID, NULL, 'Self joins', 'Hierarchies, aliases', 3, '["70000000-0000-0000-0000-000000000053"]'::jsonb, '[]'::jsonb),

    -- 19. Primary and Foreign Keys
    ('70000000-0000-0000-0000-000000000055'::UUID, '60000000-0000-0000-0000-000000000019'::UUID, NULL, 'Primary key', 'Uniqueness, auto-increment, UUIDs', 1, '[]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000056'::UUID, '60000000-0000-0000-0000-000000000019'::UUID, NULL, 'Foreign key', 'Referential integrity, ON DELETE/UPDATE', 2, '["70000000-0000-0000-0000-000000000055"]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000057'::UUID, '60000000-0000-0000-0000-000000000019'::UUID, NULL, 'Constraints', 'NOT NULL, UNIQUE, CHECK, indexes', 3, '["70000000-0000-0000-0000-000000000056"]'::jsonb, '[]'::jsonb),

    -- 20. Database Normalization
    ('70000000-0000-0000-0000-000000000058'::UUID, '60000000-0000-0000-0000-000000000020'::UUID, NULL, '1NF', 'Atomic values', 1, '[]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000059'::UUID, '60000000-0000-0000-0000-000000000020'::UUID, NULL, '2NF', 'No partial dependency', 2, '["70000000-0000-0000-0000-000000000058"]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000060'::UUID, '60000000-0000-0000-0000-000000000020'::UUID, NULL, '3NF', 'No transitive dependency, when to denormalize', 3, '["70000000-0000-0000-0000-000000000059"]'::jsonb, '[]'::jsonb),

    -- 21. Transactions and ACID
    ('70000000-0000-0000-0000-000000000061'::UUID, '60000000-0000-0000-0000-000000000021'::UUID, NULL, 'Commit / rollback', 'BEGIN, COMMIT, ROLLBACK, savepoints', 1, '[]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000062'::UUID, '60000000-0000-0000-0000-000000000021'::UUID, NULL, 'ACID', 'Atomicity, consistency, isolation, durability', 2, '["70000000-0000-0000-0000-000000000061"]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000063'::UUID, '60000000-0000-0000-0000-000000000021'::UUID, NULL, 'Isolation levels', 'Dirty/non-repeatable/phantom reads, locks', 3, '["70000000-0000-0000-0000-000000000062"]'::jsonb, '[]'::jsonb),

    -- -------------------------------------------------------------------------
    -- Category 5: Networking and API Development
    -- -------------------------------------------------------------------------
    -- 22. How the Internet Works
    ('70000000-0000-0000-0000-000000000064'::UUID, '60000000-0000-0000-0000-000000000022'::UUID, NULL, 'IP and DNS', 'IP addresses, DNS resolution, domains', 1, '[]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000065'::UUID, '60000000-0000-0000-0000-000000000022'::UUID, NULL, 'Ports', 'TCP vs UDP, common ports', 2, '["70000000-0000-0000-0000-000000000064"]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000066'::UUID, '60000000-0000-0000-0000-000000000022'::UUID, NULL, 'Routing basics', 'Packets, routers, request journey', 3, '["70000000-0000-0000-0000-000000000065"]'::jsonb, '[]'::jsonb),

    -- 23. Client-Server Architecture
    ('70000000-0000-0000-0000-000000000067'::UUID, '60000000-0000-0000-0000-000000000023'::UUID, NULL, 'Request / response', 'Cycle, clients, servers', 1, '[]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000068'::UUID, '60000000-0000-0000-0000-000000000023'::UUID, NULL, 'Stateless', 'Statelessness, cookies, sessions', 2, '["70000000-0000-0000-0000-000000000067"]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000069'::UUID, '60000000-0000-0000-0000-000000000023'::UUID, NULL, 'Load balancing', 'Scaling, proxies, reverse proxy', 3, '["70000000-0000-0000-0000-000000000068"]'::jsonb, '[]'::jsonb),

    -- 24. HTTP and HTTPS
    ('70000000-0000-0000-0000-000000000070'::UUID, '60000000-0000-0000-0000-000000000024'::UUID, NULL, 'Headers', 'Request/response headers, content type', 1, '[]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000071'::UUID, '60000000-0000-0000-0000-000000000024'::UUID, NULL, 'TLS', 'Handshake, encryption', 2, '["70000000-0000-0000-0000-000000000070"]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000072'::UUID, '60000000-0000-0000-0000-000000000024'::UUID, NULL, 'Certificates', 'CA, HTTPS setup, HSTS basics', 3, '["70000000-0000-0000-0000-000000000071"]'::jsonb, '[]'::jsonb),

    -- 25. REST API Architecture
    ('70000000-0000-0000-0000-000000000073'::UUID, '60000000-0000-0000-0000-000000000025'::UUID, NULL, 'Resources and URIs', 'Naming, nouns, nesting', 1, '[]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000074'::UUID, '60000000-0000-0000-0000-000000000025'::UUID, NULL, 'Statelessness', 'REST constraints, JSON', 2, '["70000000-0000-0000-0000-000000000073"]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000075'::UUID, '60000000-0000-0000-0000-000000000025'::UUID, NULL, 'Versioning', 'URL/header versioning, pagination, HATEOAS intro', 3, '["70000000-0000-0000-0000-000000000074"]'::jsonb, '[]'::jsonb),

    -- 26. HTTP Methods and Status Codes
    ('70000000-0000-0000-0000-000000000076'::UUID, '60000000-0000-0000-0000-000000000026'::UUID, NULL, 'GET / POST / PUT / PATCH / DELETE', 'Purpose and safe usage, CRUD mapping', 1, '[]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000077'::UUID, '60000000-0000-0000-0000-000000000026'::UUID, NULL, '2xx / 4xx / 5xx', '200, 201, 204; 400, 401, 403, 404; 500, 503', 2, '["70000000-0000-0000-0000-000000000076"]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000078'::UUID, '60000000-0000-0000-0000-000000000026'::UUID, NULL, 'Idempotency', 'Idempotent vs non-idempotent methods, retries', 3, '["70000000-0000-0000-0000-000000000077"]'::jsonb, '[]'::jsonb),

    -- 27. Authentication and Authorization
    ('70000000-0000-0000-0000-000000000079'::UUID, '60000000-0000-0000-0000-000000000027'::UUID, NULL, 'Password hashing', 'Hash vs encrypt, salt, BCrypt', 1, '[]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000080'::UUID, '60000000-0000-0000-0000-000000000027'::UUID, NULL, 'Sessions', 'Session cookies, server-side state', 2, '["70000000-0000-0000-0000-000000000079"]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000081'::UUID, '60000000-0000-0000-0000-000000000027'::UUID, NULL, 'JWT generation / validation', 'Structure, signing, verifying, expiry', 3, '["70000000-0000-0000-0000-000000000080"]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000082'::UUID, '60000000-0000-0000-0000-000000000027'::UUID, NULL, 'Refresh token', 'Access vs refresh, rotation, revocation', 4, '["70000000-0000-0000-0000-000000000081"]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000083'::UUID, '60000000-0000-0000-0000-000000000027'::UUID, NULL, 'Role-based access', 'Roles, authorities, protecting endpoints', 5, '["70000000-0000-0000-0000-000000000082"]'::jsonb, '[]'::jsonb),

    -- -------------------------------------------------------------------------
    -- Category 6: Spring Boot and Backend Development
    -- -------------------------------------------------------------------------
    -- 28. Spring Framework and IoC
    ('70000000-0000-0000-0000-000000000084'::UUID, '60000000-0000-0000-0000-000000000028'::UUID, NULL, 'IoC container', 'Inversion of control, container role', 1, '[]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000085'::UUID, '60000000-0000-0000-0000-000000000028'::UUID, NULL, 'BeanFactory', 'Lazy loading, basic container', 2, '["70000000-0000-0000-0000-000000000084"]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000086'::UUID, '60000000-0000-0000-0000-000000000028'::UUID, NULL, 'ApplicationContext', 'Features over BeanFactory, configuration', 3, '["70000000-0000-0000-0000-000000000085"]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000087'::UUID, '60000000-0000-0000-0000-000000000028'::UUID, NULL, 'Bean lifecycle', 'Instantiate, initialize, destroy, callbacks', 4, '["70000000-0000-0000-0000-000000000086"]'::jsonb, '[]'::jsonb),

    -- 29. Dependency Injection and Spring Beans
    ('70000000-0000-0000-0000-000000000088'::UUID, '60000000-0000-0000-0000-000000000029'::UUID, NULL, 'Constructor / setter / field injection', 'All three types, recommended style', 1, '[]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000089'::UUID, '60000000-0000-0000-0000-000000000029'::UUID, NULL, '@Component / @Bean', 'Stereotypes, component scan, Java config', 2, '["70000000-0000-0000-0000-000000000088"]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000090'::UUID, '60000000-0000-0000-0000-000000000029'::UUID, NULL, 'Scopes', 'singleton, prototype, request/session', 3, '["70000000-0000-0000-0000-000000000089"]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000091'::UUID, '60000000-0000-0000-0000-000000000029'::UUID, NULL, 'AuthenticationManager / Provider / PasswordEncoder beans', 'Defining and wiring security beans', 4, '["70000000-0000-0000-0000-000000000090"]'::jsonb, '[]'::jsonb),

    -- 30. Spring Boot and Auto-Configuration
    ('70000000-0000-0000-0000-000000000092'::UUID, '60000000-0000-0000-0000-000000000030'::UUID, NULL, 'Starters', 'Dependency starters, BOM', 1, '[]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000093'::UUID, '60000000-0000-0000-0000-000000000030'::UUID, NULL, 'Auto-config', '@SpringBootApplication, conditions', 2, '["70000000-0000-0000-0000-000000000092"]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000094'::UUID, '60000000-0000-0000-0000-000000000030'::UUID, NULL, 'application.properties', 'Profiles, externalized config', 3, '["70000000-0000-0000-0000-000000000093"]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000095'::UUID, '60000000-0000-0000-0000-000000000030'::UUID, NULL, 'Security config (SecurityFilterChain)', 'Request rules, filters, stateless setup', 4, '["70000000-0000-0000-0000-000000000094"]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000096'::UUID, '60000000-0000-0000-0000-000000000030'::UUID, NULL, 'CORS / CSRF', 'Allowed origins, when to disable CSRF', 5, '["70000000-0000-0000-0000-000000000095"]'::jsonb, '[]'::jsonb),

    -- 31. Spring Data JPA and Hibernate
    ('70000000-0000-0000-0000-000000000097'::UUID, '60000000-0000-0000-0000-000000000031'::UUID, NULL, '@Entity', 'Mapping, @Id, @Column, ddl-auto', 1, '[]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000098'::UUID, '60000000-0000-0000-0000-000000000031'::UUID, NULL, 'Repositories', 'JpaRepository, derived queries, paging', 2, '["70000000-0000-0000-0000-000000000097"]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000099'::UUID, '60000000-0000-0000-0000-000000000031'::UUID, NULL, 'Relationships', '@OneToMany, @ManyToOne, @ManyToMany, cascade', 3, '["70000000-0000-0000-0000-000000000098"]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000100'::UUID, '60000000-0000-0000-0000-000000000031'::UUID, NULL, 'JPQL and queries', '@Query, native queries, projections', 4, '["70000000-0000-0000-0000-000000000099"]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000101'::UUID, '60000000-0000-0000-0000-000000000031'::UUID, NULL, 'Lazy vs eager loading', 'Fetch types, N+1 problem', 5, '["70000000-0000-0000-0000-000000000100"]'::jsonb, '[]'::jsonb),

    -- 32. Unit and Integration Testing
    ('70000000-0000-0000-0000-000000000102'::UUID, '60000000-0000-0000-0000-000000000032'::UUID, NULL, 'JUnit', 'Assertions, lifecycle, parameterized tests', 1, '[]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000103'::UUID, '60000000-0000-0000-0000-000000000032'::UUID, NULL, 'Mockito', 'Mocks, stubs, verify', 2, '["70000000-0000-0000-0000-000000000102"]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000104'::UUID, '60000000-0000-0000-0000-000000000032'::UUID, NULL, '@SpringBootTest', 'Integration tests, MockMvc, test DB', 3, '["70000000-0000-0000-0000-000000000103"]'::jsonb, '[]'::jsonb),

    -- 33. Docker and CI/CD
    ('70000000-0000-0000-0000-000000000105'::UUID, '60000000-0000-0000-0000-000000000033'::UUID, NULL, 'Dockerfile', 'Images, layers, build and run', 1, '[]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000106'::UUID, '60000000-0000-0000-0000-000000000033'::UUID, NULL, 'Compose', 'Multi-container, networks, volumes', 2, '["70000000-0000-0000-0000-000000000105"]'::jsonb, '[]'::jsonb),
    ('70000000-0000-0000-0000-000000000107'::UUID, '60000000-0000-0000-0000-000000000033'::UUID, NULL, 'Pipeline', 'Build, test, deploy, GitHub Actions basics', 3, '["70000000-0000-0000-0000-000000000106"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO NOTHING;

