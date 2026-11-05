-- CATEGORY 1:

INSERT INTO question_skills (question_id, skill_id)

SELECT
    mapping.question_id,
    skills.id

FROM (
    VALUES

    -- 1
    (
        '50000000-0000-0000-0000-000000000001'::UUID,
        'variables-and-data-types'
    ),
    (
        '50000000-0000-0000-0000-000000000002'::UUID,
        'variables-and-data-types'
    ),
    (
        '50000000-0000-0000-0000-000000000003'::UUID,
        'variables-and-data-types'
    ),

    -- 2 
    (
        '50000000-0000-0000-0000-000000000004'::UUID,
        'operators-and-expressions'
    ),
    (
        '50000000-0000-0000-0000-000000000005'::UUID,
        'operators-and-expressions'
    ),
    (
        '50000000-0000-0000-0000-000000000006'::UUID,
        'operators-and-expressions'
    ),

    -- 3
    (
        '50000000-0000-0000-0000-000000000007'::UUID,
        'conditional-statements'
    ),
    (
        '50000000-0000-0000-0000-000000000008'::UUID,
        'conditional-statements'
    ),
    (
        '50000000-0000-0000-0000-000000000009'::UUID,
        'conditional-statements'
    ),

    -- 4
    (
        '50000000-0000-0000-0000-000000000010'::UUID,
        'loops'
    ),
    (
        '50000000-0000-0000-0000-000000000011'::UUID,
        'loops'
    ),
    (
        '50000000-0000-0000-0000-000000000012'::UUID,
        'loops'
    ),

    -- 5
    (
        '50000000-0000-0000-0000-000000000013'::UUID,
        'methods-and-functions'
    ),
    (
        '50000000-0000-0000-0000-000000000014'::UUID,
        'methods-and-functions'
    ),
    (
        '50000000-0000-0000-0000-000000000015'::UUID,
        'methods-and-functions'
    ),

    -- 6
    (
        '50000000-0000-0000-0000-000000000016'::UUID,
        'arrays-and-strings'
    ),
    (
        '50000000-0000-0000-0000-000000000017'::UUID,
        'arrays-and-strings'
    ),
    (
        '50000000-0000-0000-0000-000000000018'::UUID,
        'arrays-and-strings'
    )

) AS mapping(question_id, skill_slug)

JOIN skills
    ON skills.slug = mapping.skill_slug

ON CONFLICT (question_id, skill_id) DO NOTHING;


-- CATEGORY 2:

INSERT INTO question_skills (question_id, skill_id)

SELECT
    mapping.question_id,
    skills.id

FROM (
    VALUES

    -- 7
    (
        '50000000-0000-0000-0000-000000000019'::UUID,
        'classes-and-objects'
    ),
    (
        '50000000-0000-0000-0000-000000000020'::UUID,
        'classes-and-objects'
    ),
    (
        '50000000-0000-0000-0000-000000000021'::UUID,
        'classes-and-objects'
    ),

    -- 8
    (
        '50000000-0000-0000-0000-000000000022'::UUID,
        'encapsulation'
    ),
    (
        '50000000-0000-0000-0000-000000000023'::UUID,
        'encapsulation'
    ),
    (
        '50000000-0000-0000-0000-000000000024'::UUID,
        'encapsulation'
    ),

    -- 9
    (
        '50000000-0000-0000-0000-000000000025'::UUID,
        'inheritance'
    ),
    (
        '50000000-0000-0000-0000-000000000026'::UUID,
        'inheritance'
    ),
    (
        '50000000-0000-0000-0000-000000000027'::UUID,
        'inheritance'
    ),

    -- 10
    (
        '50000000-0000-0000-0000-000000000028'::UUID,
        'polymorphism'
    ),
    (
        '50000000-0000-0000-0000-000000000029'::UUID,
        'polymorphism'
    ),
    (
        '50000000-0000-0000-0000-000000000030'::UUID,
        'polymorphism'
    ),

    -- 11
    (
        '50000000-0000-0000-0000-000000000031'::UUID,
        'abstraction-and-interfaces'
    ),
    (
        '50000000-0000-0000-0000-000000000032'::UUID,
        'abstraction-and-interfaces'
    ),
    (
        '50000000-0000-0000-0000-000000000033'::UUID,
        'abstraction-and-interfaces'
    ),

    -- 12
    (
        '50000000-0000-0000-0000-000000000034'::UUID,
        'exception-handling'
    ),
    (
        '50000000-0000-0000-0000-000000000035'::UUID,
        'exception-handling'
    ),
    (
        '50000000-0000-0000-0000-000000000036'::UUID,
        'exception-handling'
    )

) AS mapping(question_id, skill_slug)

JOIN skills
    ON skills.slug = mapping.skill_slug

ON CONFLICT (question_id, skill_id) DO NOTHING;

-- CATEGORY 3:

INSERT INTO question_skills (question_id, skill_id)

SELECT
    mapping.question_id,
    skills.id

FROM (
    VALUES

    -- 13
    ('50000000-0000-0000-0000-000000000037'::UUID, 'list-set-and-map'),
    ('50000000-0000-0000-0000-000000000038'::UUID, 'list-set-and-map'),
    ('50000000-0000-0000-0000-000000000039'::UUID, 'list-set-and-map'),

    -- 14
    ('50000000-0000-0000-0000-000000000040'::UUID, 'hashmap-internals'),
    ('50000000-0000-0000-0000-000000000041'::UUID, 'hashmap-internals'),
    ('50000000-0000-0000-0000-000000000042'::UUID, 'hashmap-internals'),

    -- 15
    ('50000000-0000-0000-0000-000000000052'::UUID, 'sorting-and-searching'),
    ('50000000-0000-0000-0000-000000000053'::UUID, 'sorting-and-searching'),
    ('50000000-0000-0000-0000-000000000054'::UUID, 'sorting-and-searching')

) AS mapping(question_id, skill_slug)

JOIN skills
    ON skills.slug = mapping.skill_slug

ON CONFLICT (question_id, skill_id) DO NOTHING;

-- CATEGORY 4

INSERT INTO question_skills (question_id, skill_id)

SELECT
    mapping.question_id,
    skills.id

FROM (
    VALUES

    -- 16
    ('50000000-0000-0000-0000-000000000055'::UUID, 'relational-database-concepts'),
    ('50000000-0000-0000-0000-000000000056'::UUID, 'relational-database-concepts'),
    ('50000000-0000-0000-0000-000000000057'::UUID, 'relational-database-concepts'),

    -- 17
    ('50000000-0000-0000-0000-000000000058'::UUID, 'sql-fundamentals'),
    ('50000000-0000-0000-0000-000000000059'::UUID, 'sql-fundamentals'),
    ('50000000-0000-0000-0000-000000000060'::UUID, 'sql-fundamentals'),

    -- 18
    ('50000000-0000-0000-0000-000000000061'::UUID, 'joins-and-subqueries'),
    ('50000000-0000-0000-0000-000000000062'::UUID, 'joins-and-subqueries'),
    ('50000000-0000-0000-0000-000000000063'::UUID, 'joins-and-subqueries'),

    -- 19
    ('50000000-0000-0000-0000-000000000064'::UUID, 'primary-and-foreign-keys'),
    ('50000000-0000-0000-0000-000000000065'::UUID, 'primary-and-foreign-keys'),
    ('50000000-0000-0000-0000-000000000066'::UUID, 'primary-and-foreign-keys'),

    -- 20
    ('50000000-0000-0000-0000-000000000067'::UUID, 'database-normalization'),
    ('50000000-0000-0000-0000-000000000068'::UUID, 'database-normalization'),
    ('50000000-0000-0000-0000-000000000069'::UUID, 'database-normalization'),

    -- 21
    ('50000000-0000-0000-0000-000000000070'::UUID, 'transactions-and-acid-properties'),
    ('50000000-0000-0000-0000-000000000071'::UUID, 'transactions-and-acid-properties'),
    ('50000000-0000-0000-0000-000000000072'::UUID, 'transactions-and-acid-properties')

) AS mapping(question_id, skill_slug)

JOIN skills
    ON skills.slug = mapping.skill_slug

ON CONFLICT (question_id, skill_id) DO NOTHING;


-- CATEGORY 5

-- 22
INSERT INTO question_skills (question_id, skill_id)
SELECT q.id, s.id
FROM questions q
JOIN skills s ON s.slug = 'how-the-internet-works'
WHERE q.id IN (
'50000000-0000-0000-0000-000000000073',
'50000000-0000-0000-0000-000000000074',
'50000000-0000-0000-0000-000000000075'
)
ON CONFLICT (question_id, skill_id) DO NOTHING;

-- 23
INSERT INTO question_skills (question_id, skill_id)
SELECT q.id, s.id
FROM questions q
JOIN skills s ON s.slug = 'client-server-architecture'
WHERE q.id IN (
'50000000-0000-0000-0000-000000000076',
'50000000-0000-0000-0000-000000000077',
'50000000-0000-0000-0000-000000000078'
)
ON CONFLICT (question_id, skill_id) DO NOTHING;

--24
INSERT INTO question_skills (question_id, skill_id)
SELECT q.id, s.id
FROM questions q
JOIN skills s ON s.slug = 'http-and-https'
WHERE q.id IN (
'50000000-0000-0000-0000-000000000079',
'50000000-0000-0000-0000-000000000080',
'50000000-0000-0000-0000-000000000081'
)
ON CONFLICT (question_id, skill_id) DO NOTHING;

-- 25
INSERT INTO question_skills (question_id, skill_id)
SELECT q.id, s.id
FROM questions q
JOIN skills s ON s.slug = 'rest-api-architecture'
WHERE q.id IN (
'50000000-0000-0000-0000-000000000082',
'50000000-0000-0000-0000-000000000083',
'50000000-0000-0000-0000-000000000084'
)
ON CONFLICT (question_id, skill_id) DO NOTHING;

-- 26
INSERT INTO question_skills (question_id, skill_id)
SELECT q.id, s.id
FROM questions q
JOIN skills s ON s.slug = 'http-methods-and-status-codes'
WHERE q.id IN (
'50000000-0000-0000-0000-000000000085',
'50000000-0000-0000-0000-000000000086',
'50000000-0000-0000-0000-000000000087'
)
ON CONFLICT (question_id, skill_id) DO NOTHING;

-- 27
INSERT INTO question_skills (question_id, skill_id)
SELECT q.id, s.id
FROM questions q
JOIN skills s ON s.slug = 'authentication-and-authorization'
WHERE q.id IN (
'50000000-0000-0000-0000-000000000088',
'50000000-0000-0000-0000-000000000089',
'50000000-0000-0000-0000-000000000090'
)
ON CONFLICT (question_id, skill_id) DO NOTHING;


-- CATEGORY 6

-- Skill 28
INSERT INTO question_skills (question_id, skill_id)
SELECT q.id, s.id
FROM questions q
JOIN skills s ON s.slug = 'spring-framework-and-ioc'
WHERE q.id IN (
'50000000-0000-0000-0000-000000000091',
'50000000-0000-0000-0000-000000000092',
'50000000-0000-0000-0000-000000000093'
)
ON CONFLICT (question_id, skill_id) DO NOTHING;

-- Skill 29
INSERT INTO question_skills (question_id, skill_id)
SELECT q.id, s.id
FROM questions q
JOIN skills s ON s.slug = 'dependency-injection-and-spring-beans'
WHERE q.id IN (
'50000000-0000-0000-0000-000000000094',
'50000000-0000-0000-0000-000000000095',
'50000000-0000-0000-0000-000000000096'
)
ON CONFLICT (question_id, skill_id) DO NOTHING;

-- Skill 30
INSERT INTO question_skills (question_id, skill_id)
SELECT q.id, s.id
FROM questions q
JOIN skills s ON s.slug = 'spring-boot-and-auto-configuration'
WHERE q.id IN (
'50000000-0000-0000-0000-000000000097',
'50000000-0000-0000-0000-000000000098',
'50000000-0000-0000-0000-000000000099'
)
ON CONFLICT (question_id, skill_id) DO NOTHING;

-- Skill 31
INSERT INTO question_skills (question_id, skill_id)
SELECT q.id, s.id
FROM questions q
JOIN skills s ON s.slug = 'spring-data-jpa-and-hibernate'
WHERE q.id IN (
'50000000-0000-0000-0000-000000000100',
'50000000-0000-0000-0000-000000000101',
'50000000-0000-0000-0000-000000000102'
)
ON CONFLICT (question_id, skill_id) DO NOTHING;

-- Skill 32
INSERT INTO question_skills (question_id, skill_id)
SELECT q.id, s.id
FROM questions q
JOIN skills s ON s.slug = 'unit-and-integration-testing'
WHERE q.id IN (
'50000000-0000-0000-0000-000000000103',
'50000000-0000-0000-0000-000000000104',
'50000000-0000-0000-0000-000000000105'
)
ON CONFLICT (question_id, skill_id) DO NOTHING;

-- Skill 33
INSERT INTO question_skills (question_id, skill_id)
SELECT q.id, s.id
FROM questions q
JOIN skills s ON s.slug = 'docker-and-ci-cd'
WHERE q.id IN (
'50000000-0000-0000-0000-000000000106',
'50000000-0000-0000-0000-000000000107',
'50000000-0000-0000-0000-000000000108'
)
ON CONFLICT (question_id, skill_id) DO NOTHING;
