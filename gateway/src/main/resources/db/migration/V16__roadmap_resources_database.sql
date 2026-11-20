-- =============================================================================
-- Migration: V16__roadmap_resources_database.sql
-- Resources for Category 4: Database Management (Nodes 046–063)
-- =============================================================================

-- Tables and rows
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Basic Data Analysis with Java : Tables and Databases | packtpub.com", "url": "https://www.youtube.com/watch?v=kqnIp4wQ0is", "provider": "Packt"}, {"type": "YOUTUBE", "title": "Java Data Types Comparison Table: Explained Simply  | What are Java Data Types? | Java Tutorial", "url": "https://www.youtube.com/watch?v=rGoYqj25PFU", "provider": "Ram N Java"}, {"type": "DOCUMENTATION", "title": "PostgreSQL DDL Basics", "url": "https://www.postgresql.org/docs/current/ddl-basics.html", "provider": "PostgreSQL Docs"}, {"type": "ONLINE_RESOURCE", "title": "SQL Introduction and Tables", "url": "https://www.w3schools.com/sql/sql_intro.asp", "provider": "W3Schools"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000046'::uuid;

-- Keys
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Lec-9: What is CANDIDATE KEY  and PRIMARY key | Full Concept |  Most suitable examples | DBMS", "url": "https://www.youtube.com/watch?v=mMxjKFiIKxs", "provider": "Gate Smashers"}, {"type": "YOUTUBE", "title": "What is key? full Explanation | DBMS |Primary, Foreign, Unique, Composite, Alternate & Condidate Key", "url": "https://www.youtube.com/watch?v=PPDERS5MLAs", "provider": "Learn Coding"}, {"type": "DOCUMENTATION", "title": "PostgreSQL Primary Keys and Constraints", "url": "https://www.postgresql.org/docs/current/ddl-constraints.html", "provider": "PostgreSQL Docs"}, {"type": "ONLINE_RESOURCE", "title": "SQL PRIMARY KEY Constraint", "url": "https://www.w3schools.com/sql/sql_primarykey.asp", "provider": "W3Schools"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000047'::uuid;

-- Relationships
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "JPA Entity Relationships — Database Design & Cardinality | 1:1 & N:1 Explained | Part 1", "url": "https://www.youtube.com/watch?v=VJSHvnKM12E", "provider": "The Coding Cubical"}, {"type": "YOUTUBE", "title": "Association and Aggregation in Java | OOPs Relationships Explained for Beginners", "url": "https://www.youtube.com/watch?v=lHVXG57sWYA", "provider": "RuchiCodes"}, {"type": "DOCUMENTATION", "title": "PostgreSQL Foreign Keys Tutorial", "url": "https://www.postgresql.org/docs/current/tutorial-fk.html", "provider": "PostgreSQL Docs"}, {"type": "ONLINE_RESOURCE", "title": "SQL FOREIGN KEY Constraint", "url": "https://www.w3schools.com/sql/sql_foreignkey.asp", "provider": "W3Schools"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000048'::uuid;

-- SELECT / WHERE
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Master SQL Sorting & Filtering | ORDER BY, LIMIT, DISTINCT Tutorial", "url": "https://www.youtube.com/watch?v=1eejs85vHOM", "provider": "The Data Girl"}, {"type": "YOUTUBE", "title": "SQL WHERE, ORDER BY, LIMIT and OFFSET in PostgreSQL: filter, sort and paginate results", "url": "https://www.youtube.com/watch?v=izU7Yu4wglQ", "provider": "Prepare-sh"}, {"type": "DOCUMENTATION", "title": "PostgreSQL The WHERE Clause", "url": "https://www.postgresql.org/docs/current/queries-table-expressions.html", "provider": "PostgreSQL Docs"}, {"type": "ONLINE_RESOURCE", "title": "SQL WHERE Clause", "url": "https://www.w3schools.com/sql/sql_where.asp", "provider": "W3Schools"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000049'::uuid;

-- INSERT / UPDATE / DELETE
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "INSERT UPDATE, DELETE & ALTER Table in SQL With Example | SQL Tutorial in Hindi 4", "url": "https://www.youtube.com/watch?v=4YAAgrm8_ZI", "provider": "Rishabh Mishra"}, {"type": "YOUTUBE", "title": "Hibernate CRUD Operations in Java | Insert, Update, Delete, Fetch Data (Step-by-Step Tutorial)", "url": "https://www.youtube.com/watch?v=AFCLpxPz5lc", "provider": "RuchiCodes"}, {"type": "DOCUMENTATION", "title": "PostgreSQL Data Manipulation Language", "url": "https://www.postgresql.org/docs/current/dml.html", "provider": "PostgreSQL Docs"}, {"type": "ONLINE_RESOURCE", "title": "SQL INSERT INTO Statement", "url": "https://www.w3schools.com/sql/sql_insert.asp", "provider": "W3Schools"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000050'::uuid;

-- GROUP BY
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "GroupingBy and PartitioningBy | Mastering Java Stream API", "url": "https://www.youtube.com/watch?v=u3F7jRJPZaM", "provider": "CodeSnippet by Chetan"}, {"type": "YOUTUBE", "title": "GROUP BY and HAVING Clause in SQL", "url": "https://www.youtube.com/watch?v=VQf0V6Wwbf4", "provider": "Neso Academy"}, {"type": "DOCUMENTATION", "title": "PostgreSQL Aggregate Functions", "url": "https://www.postgresql.org/docs/current/tutorial-agg.html", "provider": "PostgreSQL Docs"}, {"type": "ONLINE_RESOURCE", "title": "SQL GROUP BY Statement", "url": "https://www.w3schools.com/sql/sql_groupby.asp", "provider": "W3Schools"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000051'::uuid;

-- INNER / LEFT join
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Complete SQL JOINS For Beginners | SQL JOIN Queries with Examples | SQL Tutorial in Hindi 11", "url": "https://www.youtube.com/watch?v=H6988OpZKTU", "provider": "Rishabh Mishra"}, {"type": "YOUTUBE", "title": "difference between inner join and left join in sql || Joins in SQL", "url": "https://www.youtube.com/watch?v=vkA1Bn07FR8", "provider": "Lotus IT Hub training institute"}, {"type": "DOCUMENTATION", "title": "PostgreSQL Querying Multiple Tables", "url": "https://www.postgresql.org/docs/current/tutorial-join.html", "provider": "PostgreSQL Docs"}, {"type": "ONLINE_RESOURCE", "title": "SQL Joins Guide", "url": "https://www.w3schools.com/sql/sql_join.asp", "provider": "W3Schools"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000052'::uuid;

-- Subqueries
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "SQL Subqueries Made EASY 🔥 | Scalar, IN, EXISTS & Correlated Subqueries", "url": "https://www.youtube.com/watch?v=pK8y7rXO7Jg", "provider": "OurTechieJourney"}, {"type": "YOUTUBE", "title": "275 Correlated Subqueries", "url": "https://www.youtube.com/watch?v=hhiPOgLqXQ4", "provider": "Marc Goodman"}, {"type": "DOCUMENTATION", "title": "PostgreSQL Subquery Expressions", "url": "https://www.postgresql.org/docs/current/functions-subquery.html", "provider": "PostgreSQL Docs"}, {"type": "ONLINE_RESOURCE", "title": "SQL EXISTS Operator and Subqueries", "url": "https://www.w3schools.com/sql/sql_exists.asp", "provider": "W3Schools"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000053'::uuid;

-- Self joins
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Employee and Manager Names | SQL Interview Question (Self Join, Aliases) | GrowAsEngineers", "url": "https://www.youtube.com/watch?v=rNMHaR0lwi0", "provider": "Prateek Goel | GrowAsEngineers"}, {"type": "YOUTUBE", "title": "🔥 Find Employees Earning More Than Their Manager in SQL | Self Join Interview Trick!", "url": "https://www.youtube.com/watch?v=2IUiKlKKIjg", "provider": "Find My Tuition"}, {"type": "DOCUMENTATION", "title": "PostgreSQL Self-Joins and Table Aliases", "url": "https://www.postgresql.org/docs/current/queries-table-expressions.html#QUERIES-TABLE-ALIASES", "provider": "PostgreSQL Docs"}, {"type": "ONLINE_RESOURCE", "title": "SQL Self Join", "url": "https://www.w3schools.com/sql/sql_join_self.asp", "provider": "W3Schools"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000054'::uuid;

-- Primary key
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Using UUID as a primary key for Spring Boot and Postgres database #tutorial", "url": "https://www.youtube.com/watch?v=b4XKCGYiVz0", "provider": "CoderVlogger"}, {"type": "YOUTUBE", "title": "UUID vs INT: What’s Better For Your Primary Key?", "url": "https://www.youtube.com/watch?v=DHtf_46OxY8", "provider": "Database Star"}, {"type": "DOCUMENTATION", "title": "PostgreSQL UUID Data Type", "url": "https://www.postgresql.org/docs/current/datatype-uuid.html", "provider": "PostgreSQL Docs"}, {"type": "ONLINE_RESOURCE", "title": "Primary Key in DBMS", "url": "https://www.geeksforgeeks.org/primary-key-in-dbms/", "provider": "GeeksforGeeks"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000055'::uuid;

-- Foreign key
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Lec-12: Insert, Update & Delete from Foreign Key table | Referential Integrity", "url": "https://www.youtube.com/watch?v=DM2lAomoDrg", "provider": "Gate Smashers"}, {"type": "YOUTUBE", "title": "19 SQL Server Foreign Key Default Behavior | DELETE & UPDATE Explained", "url": "https://www.youtube.com/watch?v=zliG4nTTkbI", "provider": "Parvesh"}, {"type": "DOCUMENTATION", "title": "PostgreSQL Foreign Key Referential Integrity", "url": "https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-FK", "provider": "PostgreSQL Docs"}, {"type": "ONLINE_RESOURCE", "title": "Foreign Key in DBMS", "url": "https://www.geeksforgeeks.org/foreign-key-in-dbms/", "provider": "GeeksforGeeks"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000056'::uuid;

-- Constraints
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Master SQL Constraints in Simple Steps! (NOT NULL, UNIQUE, CHECK, DEFAULT)", "url": "https://www.youtube.com/watch?v=79x4GxQ5pUI", "provider": "Skill IT Academy"}, {"type": "YOUTUBE", "title": "FS-145: DATABASE CONSTRAINTS, INDEXES, AND CONCURRENCY FOR REAL APIs | Full Stack Java", "url": "https://www.youtube.com/watch?v=OvU2rkDAmJo", "provider": "EDUCATA"}, {"type": "DOCUMENTATION", "title": "PostgreSQL Indexes Overview", "url": "https://www.postgresql.org/docs/current/indexes.html", "provider": "PostgreSQL Docs"}, {"type": "ONLINE_RESOURCE", "title": "SQL Constraints Overview", "url": "https://www.w3schools.com/sql/sql_constraints.asp", "provider": "W3Schools"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000057'::uuid;

-- 1NF
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "( 1NF ) First Normal Form - Rule 2: Atomic Values", "url": "https://www.youtube.com/watch?v=CJ2tjFCin18", "provider": "Skills"}, {"type": "YOUTUBE", "title": "SQL Tutorial for Beginners #40 | What is 1NF? | First Normal Form & Atomic Values", "url": "https://www.youtube.com/watch?v=p6N45wQ8NPk", "provider": "Shashank"}, {"type": "DOCUMENTATION", "title": "Database Normalization Description", "url": "https://learn.microsoft.com/en-us/office/troubleshoot/access/database-normalization-description", "provider": "Microsoft Learn"}, {"type": "ONLINE_RESOURCE", "title": "First Normal Form (1NF)", "url": "https://www.geeksforgeeks.org/first-normal-form-1nf/", "provider": "GeeksforGeeks"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000058'::uuid;

-- 2NF
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Partial Dependency Explained with Examples ll Introduction to 2NF Explained in Hindi ll DBMS", "url": "https://www.youtube.com/watch?v=fQbtOgf8nMY", "provider": "5 Minutes Engineering"}, {"type": "YOUTUBE", "title": "2 NF Normalization Explained | Partial Dependency | DBMS | GATE DA Preparation #gatedatascience", "url": "https://www.youtube.com/watch?v=Mr1HPAH7vo0", "provider": "Piyush Wairale IITM"}, {"type": "DOCUMENTATION", "title": "MariaDB Database Normalization Guide", "url": "https://mariadb.com/kb/en/database-normalization/", "provider": "MariaDB Docs"}, {"type": "ONLINE_RESOURCE", "title": "Second Normal Form (2NF) with Examples", "url": "https://www.geeksforgeeks.org/second-normal-form-2nf/", "provider": "GeeksforGeeks"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000059'::uuid;

-- 3NF
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Transitive Dependency Explained with Solved Example ll Introduction to Third Normal Form in Hindi", "url": "https://www.youtube.com/watch?v=XjUa8glRzSM", "provider": "5 Minutes Engineering"}, {"type": "YOUTUBE", "title": "2.4: Normalisation: 1NF, 2NF, 3NF | DBMS 2.4 | Anomalies, Partial & Transitive Dependencies", "url": "https://www.youtube.com/watch?v=XjxGiS8u04s", "provider": "Abhijeet Karve"}, {"type": "DOCUMENTATION", "title": "PostgreSQL Data Definition Chapter", "url": "https://www.postgresql.org/docs/current/ddl.html", "provider": "PostgreSQL Docs"}, {"type": "ONLINE_RESOURCE", "title": "Third Normal Form (3NF)", "url": "https://www.geeksforgeeks.org/third-normal-form-3nf/", "provider": "GeeksforGeeks"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000060'::uuid;

-- Commit / rollback
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "SQL Transactions in one shot | ACID Properties Auto Commit Rollback SavePoint in One Video", "url": "https://www.youtube.com/watch?v=GksDj-1_JmI", "provider": "Traidev Official"}, {"type": "YOUTUBE", "title": "JDBC Transactions in Java 💳 | Commit, Rollback & Auto-Commit Explained", "url": "https://www.youtube.com/watch?v=waWcHof2S-g", "provider": "Medha XL"}, {"type": "DOCUMENTATION", "title": "PostgreSQL Transactions Tutorial", "url": "https://www.postgresql.org/docs/current/tutorial-transactions.html", "provider": "PostgreSQL Docs"}, {"type": "ONLINE_RESOURCE", "title": "SQL Transactions - COMMIT and ROLLBACK", "url": "https://www.tutorialspoint.com/sql/sql-transactions.htm", "provider": "TutorialsPoint"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000061'::uuid;

-- ACID
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "ACID Properties ll DBMS ll Atomicity,Consistency,Isolation,Durability Explained in Hindi", "url": "https://www.youtube.com/watch?v=s57648-bbOs", "provider": "5 Minutes Engineering"}, {"type": "YOUTUBE", "title": "Mastering ACID Properties in DBMS : Atomicity, Consistency, Isolation, Durability Explained", "url": "https://www.youtube.com/watch?v=dPNaPeuyaug", "provider": "Engineer''s CodingHub"}, {"type": "DOCUMENTATION", "title": "PostgreSQL Concurrency Control Introduction", "url": "https://www.postgresql.org/docs/current/mvcc-intro.html", "provider": "PostgreSQL Docs"}, {"type": "ONLINE_RESOURCE", "title": "ACID Properties in DBMS", "url": "https://www.geeksforgeeks.org/acid-properties-in-dbms/", "provider": "GeeksforGeeks"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000062'::uuid;

-- Isolation levels
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Isolation + Dirty Read, Non-Repeatable Read And Phantom Read | Concurrency series - Video 3", "url": "https://www.youtube.com/watch?v=TbrCdiE53So", "provider": "Kartikeya Sharma"}, {"type": "YOUTUBE", "title": "Spring Boot Transaction Isolation Levels Explained Simply | Dirty Read, Non-Repeatable, Phantom Read", "url": "https://www.youtube.com/watch?v=95r0lfy8C_U", "provider": "Learn code with Satish"}, {"type": "DOCUMENTATION", "title": "PostgreSQL Transaction Isolation Levels", "url": "https://www.postgresql.org/docs/current/transaction-iso.html", "provider": "PostgreSQL Docs"}, {"type": "ONLINE_RESOURCE", "title": "Transaction Isolation Levels in DBMS", "url": "https://www.geeksforgeeks.org/transaction-isolation-levels-dbms/", "provider": "GeeksforGeeks"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000063'::uuid;
