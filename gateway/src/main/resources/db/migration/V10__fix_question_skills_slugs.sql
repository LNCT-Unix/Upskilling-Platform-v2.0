-- Fix question_skills mappings where V7 used mismatched skill slugs compared to V4__skills.sql

INSERT INTO question_skills (question_id, skill_id)
SELECT
    q.id,
    s.id
FROM (
    VALUES
        -- 1. Variables and Data Types
        ('50000000-0000-0000-0000-000000000001'::UUID, 'variables-data-types'),
        ('50000000-0000-0000-0000-000000000002'::UUID, 'variables-data-types'),
        ('50000000-0000-0000-0000-000000000003'::UUID, 'variables-data-types'),

        -- 2. Operators and Expressions
        ('50000000-0000-0000-0000-000000000004'::UUID, 'operators-expressions'),
        ('50000000-0000-0000-0000-000000000005'::UUID, 'operators-expressions'),
        ('50000000-0000-0000-0000-000000000006'::UUID, 'operators-expressions'),

        -- 5. Methods and Functions
        ('50000000-0000-0000-0000-000000000013'::UUID, 'methods-functions'),
        ('50000000-0000-0000-0000-000000000014'::UUID, 'methods-functions'),
        ('50000000-0000-0000-0000-000000000015'::UUID, 'methods-functions'),

        -- 6. Arrays and Strings
        ('50000000-0000-0000-0000-000000000016'::UUID, 'arrays-strings'),
        ('50000000-0000-0000-0000-000000000017'::UUID, 'arrays-strings'),
        ('50000000-0000-0000-0000-000000000018'::UUID, 'arrays-strings'),

        -- 7. Classes and Objects
        ('50000000-0000-0000-0000-000000000019'::UUID, 'classes-objects'),
        ('50000000-0000-0000-0000-000000000020'::UUID, 'classes-objects'),
        ('50000000-0000-0000-0000-000000000021'::UUID, 'classes-objects'),

        -- 11. Abstraction and Interfaces
        ('50000000-0000-0000-0000-000000000031'::UUID, 'abstraction-interfaces'),
        ('50000000-0000-0000-0000-000000000032'::UUID, 'abstraction-interfaces'),
        ('50000000-0000-0000-0000-000000000033'::UUID, 'abstraction-interfaces'),

        -- 13. List, Set, Map
        ('50000000-0000-0000-0000-000000000037'::UUID, 'list-set-map'),
        ('50000000-0000-0000-0000-000000000038'::UUID, 'list-set-map'),
        ('50000000-0000-0000-0000-000000000039'::UUID, 'list-set-map'),

        -- 15. Sorting and Searching
        ('50000000-0000-0000-0000-000000000052'::UUID, 'sorting-searching'),
        ('50000000-0000-0000-0000-000000000053'::UUID, 'sorting-searching'),
        ('50000000-0000-0000-0000-000000000054'::UUID, 'sorting-searching'),

        -- 18. Joins and Subqueries
        ('50000000-0000-0000-0000-000000000061'::UUID, 'joins-subqueries'),
        ('50000000-0000-0000-0000-000000000062'::UUID, 'joins-subqueries'),
        ('50000000-0000-0000-0000-000000000063'::UUID, 'joins-subqueries'),

        -- 19. Primary and Foreign Keys
        ('50000000-0000-0000-0000-000000000064'::UUID, 'primary-foreign-keys'),
        ('50000000-0000-0000-0000-000000000065'::UUID, 'primary-foreign-keys'),
        ('50000000-0000-0000-0000-000000000066'::UUID, 'primary-foreign-keys'),

        -- 21. Transactions and ACID Properties
        ('50000000-0000-0000-0000-000000000070'::UUID, 'transactions-acid-properties'),
        ('50000000-0000-0000-0000-000000000071'::UUID, 'transactions-acid-properties'),
        ('50000000-0000-0000-0000-000000000072'::UUID, 'transactions-acid-properties'),

        -- 22. How the Internet Works
        ('50000000-0000-0000-0000-000000000073'::UUID, 'how-internet-works'),
        ('50000000-0000-0000-0000-000000000074'::UUID, 'how-internet-works'),
        ('50000000-0000-0000-0000-000000000075'::UUID, 'how-internet-works'),

        -- 24. HTTP and HTTPS
        ('50000000-0000-0000-0000-000000000079'::UUID, 'http-https'),
        ('50000000-0000-0000-0000-000000000080'::UUID, 'http-https'),
        ('50000000-0000-0000-0000-000000000081'::UUID, 'http-https'),

        -- 26. HTTP Methods and Status Codes
        ('50000000-0000-0000-0000-000000000085'::UUID, 'http-methods-status-codes'),
        ('50000000-0000-0000-0000-000000000086'::UUID, 'http-methods-status-codes'),
        ('50000000-0000-0000-0000-000000000087'::UUID, 'http-methods-status-codes'),

        -- 27. Authentication and Authorization
        ('50000000-0000-0000-0000-000000000088'::UUID, 'authentication-authorization'),
        ('50000000-0000-0000-0000-000000000089'::UUID, 'authentication-authorization'),
        ('50000000-0000-0000-0000-000000000090'::UUID, 'authentication-authorization'),

        -- 28. Spring Framework and IoC
        ('50000000-0000-0000-0000-000000000091'::UUID, 'spring-framework-ioc'),
        ('50000000-0000-0000-0000-000000000092'::UUID, 'spring-framework-ioc'),
        ('50000000-0000-0000-0000-000000000093'::UUID, 'spring-framework-ioc'),

        -- 29. Dependency Injection and Spring Beans
        ('50000000-0000-0000-0000-000000000094'::UUID, 'dependency-injection-spring-beans'),
        ('50000000-0000-0000-0000-000000000095'::UUID, 'dependency-injection-spring-beans'),
        ('50000000-0000-0000-0000-000000000096'::UUID, 'dependency-injection-spring-beans'),

        -- 30. Spring Boot and Auto-Configuration
        ('50000000-0000-0000-0000-000000000097'::UUID, 'spring-boot-auto-configuration'),
        ('50000000-0000-0000-0000-000000000098'::UUID, 'spring-boot-auto-configuration'),
        ('50000000-0000-0000-0000-000000000099'::UUID, 'spring-boot-auto-configuration'),

        -- 31. Spring Data JPA and Hibernate
        ('50000000-0000-0000-0000-000000000100'::UUID, 'spring-data-jpa-hibernate'),
        ('50000000-0000-0000-0000-000000000101'::UUID, 'spring-data-jpa-hibernate'),
        ('50000000-0000-0000-0000-000000000102'::UUID, 'spring-data-jpa-hibernate'),

        -- 32. Unit and Integration Testing
        ('50000000-0000-0000-0000-000000000103'::UUID, 'unit-integration-testing'),
        ('50000000-0000-0000-0000-000000000104'::UUID, 'unit-integration-testing'),
        ('50000000-0000-0000-0000-000000000105'::UUID, 'unit-integration-testing'),

        -- 33. Docker and CI/CD
        ('50000000-0000-0000-0000-000000000106'::UUID, 'docker-cicd'),
        ('50000000-0000-0000-0000-000000000107'::UUID, 'docker-cicd'),
        ('50000000-0000-0000-0000-000000000108'::UUID, 'docker-cicd')
) AS mapping(question_id, skill_slug)
JOIN questions q
    ON q.id = mapping.question_id
JOIN skills s
    ON s.slug = mapping.skill_slug
ON CONFLICT (question_id, skill_id) DO NOTHING;

