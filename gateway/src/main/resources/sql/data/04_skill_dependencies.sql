---- =====================================================
-- SKILL DEPENDENCIES
-- Defines prerequisite -> dependent skill relationships
-- =====================================================

WITH dependency_pairs (prerequisite_slug, dependent_slug) AS (
    VALUES

    -- CATEGORY 1: PROGRAMMING FUNDAMENTALS

    ('variables-data-types', 'operators-expressions'),
    ('operators-expressions', 'conditional-statements'),
    ('conditional-statements', 'loops'),
    ('loops', 'methods-functions'),
    ('methods-functions', 'arrays-strings'),

    -- CATEGORY 2: OOP AND JAVA

    ('variables-data-types', 'classes-objects'),
    ('classes-objects', 'encapsulation'),
    ('classes-objects', 'inheritance'),
    ('inheritance', 'polymorphism'),
    ('classes-objects', 'abstraction-interfaces'),
    ('classes-objects', 'exception-handling'),

    -- CATEGORY 3: DATA STRUCTURES AND ALGORITHMS

    ('arrays-strings', 'list-set-map'),
    ('list-set-map', 'hashmap-internals'),
    ('list-set-map', 'stacks-queues'),
    ('arrays-strings', 'linked-lists'),
    ('linked-lists', 'trees-binary-search-trees'),
    ('arrays-strings', 'sorting-searching'),

    -- CATEGORY 4: DATABASE MANAGEMENT

    ('relational-database-concepts', 'sql-fundamentals'),
    ('sql-fundamentals', 'joins-subqueries'),
    ('relational-database-concepts', 'primary-foreign-keys'),
    ('primary-foreign-keys', 'database-normalization'),
    ('sql-fundamentals', 'transactions-acid-properties'),

    -- CATEGORY 5: NETWORKING AND API DEVELOPMENT

    ('how-internet-works', 'client-server-architecture'),
    ('client-server-architecture', 'http-https'),
    ('http-https', 'rest-api-architecture'),
    ('rest-api-architecture', 'http-methods-status-codes'),
    ('http-methods-status-codes', 'authentication-authorization'),

    -- CATEGORY 6: SPRING BOOT, TESTING AND DEPLOYMENT

    ('classes-objects', 'spring-framework-ioc'),
    ('spring-framework-ioc', 'dependency-injection-spring-beans'),
    ('dependency-injection-spring-beans', 'spring-boot-auto-configuration'),
    ('spring-boot-auto-configuration', 'spring-data-jpa-hibernate'),
    ('spring-data-jpa-hibernate', 'unit-integration-testing'),
    ('spring-boot-auto-configuration', 'docker-cicd')
)

INSERT INTO skill_dependencies (
    prerequisite_skill_id,
    dependent_skill_id
)
SELECT
    prerequisite.id,
    dependent.id
FROM dependency_pairs dp
JOIN skills prerequisite
    ON prerequisite.slug = dp.prerequisite_slug
JOIN skills dependent
    ON dependent.slug = dp.dependent_slug
WHERE NOT EXISTS (
    SELECT 1
    FROM skill_dependencies sd
    WHERE sd.prerequisite_skill_id = prerequisite.id
      AND sd.dependent_skill_id = dependent.id
);