


WITH dependency_pairs (prerequisite_slug, dependent_slug) AS (
    VALUES

    -- 1

    ('variables-data-types', 'operators-expressions'),
    ('operators-expressions', 'conditional-statements'),
    ('conditional-statements', 'loops'),
    ('loops', 'methods-functions'),
    ('methods-functions', 'arrays-strings'),

    -- 2

    ('variables-data-types', 'classes-objects'),
    ('classes-objects', 'encapsulation'),
    ('classes-objects', 'inheritance'),
    ('inheritance', 'polymorphism'),
    ('classes-objects', 'abstraction-interfaces'),
    ('classes-objects', 'exception-handling'),

   -- 3

    ('arrays-strings', 'list-set-map'),
    ('list-set-map', 'hashmap-internals'),
    ('arrays-strings', 'sorting-searching'),

  -- 4

    ('relational-database-concepts', 'sql-fundamentals'),
    ('sql-fundamentals', 'joins-subqueries'),
    ('relational-database-concepts', 'primary-foreign-keys'),
    ('primary-foreign-keys', 'database-normalization'),
    ('sql-fundamentals', 'transactions-acid-properties'),

    -- 5

    ('how-internet-works', 'client-server-architecture'),
    ('client-server-architecture', 'http-https'),
    ('http-https', 'rest-api-architecture'),
    ('rest-api-architecture', 'http-methods-status-codes'),
    ('http-methods-status-codes', 'authentication-authorization'),

    -- 6

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