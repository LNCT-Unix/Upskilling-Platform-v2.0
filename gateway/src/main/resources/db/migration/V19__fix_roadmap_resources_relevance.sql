-- V19__fix_roadmap_resources_relevance.sql
-- Replaces irrelevant, out-of-domain, short, and imprecise resources across audited roadmap nodes with highly relevant, domain-specific learning resources.

-- Node 003 (variables-data-types | Type casting): Replaced wrapper class videos and autoboxing docs with Java type casting (widening, narrowing) tutorials and JLS conversions doc
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Type Casting in Java Explained!  | Widening & Narrowing | Java for Beginners", "url": "https://www.youtube.com/watch?v=iR_WGTwlufA", "provider": "EduNexa"}, {"type": "YOUTUBE", "title": "Java Type Casting for Beginners | Widening & Narrowing Explained", "url": "https://www.youtube.com/watch?v=b9lhO4xxwE0", "provider": "Let’s Make Logic"}, {"type": "DOCUMENTATION", "title": "JLS - Type Conversions and Contexts", "url": "https://docs.oracle.com/javase/specs/jls/se21/html/jls-5.html", "provider": "Oracle Docs"}, {"type": "ONLINE_RESOURCE", "title": "Type Casting in Java", "url": "https://www.baeldung.com/java-type-casting", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000003'::uuid;

-- Node 005 (operators-expressions | Precedence): Replaced increment/decrement operator video with Java operator precedence and associativity tutorial
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Precedence and Associativity of Operators", "url": "https://www.youtube.com/watch?v=8H9G621pQq0", "provider": "Neso Academy"}, {"type": "YOUTUBE", "title": "Operator Precedence In Java With Example | Java Tutorial for beginners", "url": "https://www.youtube.com/watch?v=QTPYmCqd1vM", "provider": "TAP ACADEMY"}, {"type": "DOCUMENTATION", "title": "Summary of Operators", "url": "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/opsummary.html", "provider": "Oracle Docs"}, {"type": "ONLINE_RESOURCE", "title": "Operator Precedence and Associativity in Java", "url": "https://www.geeksforgeeks.org/operator-precedence-and-associativity-in-java/", "provider": "GeeksforGeeks"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000005'::uuid;

-- Node 009 (conditional-statements | Nested logic): Replaced YouTube shorts with full-length tutorials on guard clauses and flattening nested conditionals
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Why You Shouldn''t Nest Your Code", "url": "https://www.youtube.com/watch?v=CFRhGnuXG-4", "provider": "CodeAesthetic"}, {"type": "YOUTUBE", "title": "Stop Writing Arrow Code: Use Guard Clauses (Clean Code Rule #2)", "url": "https://www.youtube.com/watch?v=seXuZQF6MH8", "provider": "ByteSize Dev"}, {"type": "DOCUMENTATION", "title": "JLS - The if Statement", "url": "https://docs.oracle.com/javase/specs/jls/se21/html/jls-14.html", "provider": "Oracle Docs"}, {"type": "ONLINE_RESOURCE", "title": "Replace Nested Conditional with Guard Clauses", "url": "https://refactoring.guru/replace-nested-conditional-with-guard-clauses", "provider": "Refactoring Guru"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000009'::uuid;

-- Node 013 (methods-functions | Parameters): Replaced duplicate varargs video with Java pass-by-value and method parameters tutorial
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Java is ALWAYS Pass By Value. Here''s Why", "url": "https://www.youtube.com/watch?v=-5NC5_sI-vQ", "provider": "Coding with John"}, {"type": "YOUTUBE", "title": "Learn VARARGS in 6 minutes! 💬", "url": "https://www.youtube.com/watch?v=2knxgAFqwKk", "provider": "Bro Code"}, {"type": "DOCUMENTATION", "title": "Passing Information to a Method or a Constructor", "url": "https://docs.oracle.com/javase/tutorial/java/javaOO/arguments.html", "provider": "Oracle Docs"}, {"type": "ONLINE_RESOURCE", "title": "Varargs in Java", "url": "https://www.baeldung.com/java-varargs", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000013'::uuid;

-- Node 024 (encapsulation | Immutability): Replaced short snippet with in-depth tutorial on Java immutable classes and defensive copying
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "How to create an Immutable Class in Java from Scratch?", "url": "https://www.youtube.com/watch?v=lO5r8EBdvYo", "provider": "Riddhi Dutta"}, {"type": "YOUTUBE", "title": "FS-030: Immutability, Defensive Copies, and Safe Object Design | Full Stack Java", "url": "https://www.youtube.com/watch?v=ngVVgbdftsk", "provider": "EDUCATA"}, {"type": "DOCUMENTATION", "title": "A Strategy for Defining Immutable Objects", "url": "https://docs.oracle.com/javase/tutorial/essential/concurrency/recipe.html", "provider": "Oracle Docs"}, {"type": "ONLINE_RESOURCE", "title": "How to Create an Immutable Class in Java", "url": "https://www.baeldung.com/java-immutable-object", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000024'::uuid;

-- Node 045 (sorting-searching | Complexity): Replaced redundant quick sort video with tutorial covering Big-O sorting algorithm time complexity
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Learn Big O notation in 6 minutes 📈", "url": "https://www.youtube.com/watch?v=XMUe3zFhM5c", "provider": "Bro Code"}, {"type": "YOUTUBE", "title": "L-3.1: How Quick Sort Works | Performance of Quick Sort with Example | Divide and Conquer", "url": "https://www.youtube.com/watch?v=tWCaFVJMUi8", "provider": "Gate Smashers"}, {"type": "DOCUMENTATION", "title": "Java Collections Framework Overview", "url": "https://docs.oracle.com/javase/tutorial/collections/intro/index.html", "provider": "Oracle Docs"}, {"type": "ONLINE_RESOURCE", "title": "Time Complexity of Java Collections", "url": "https://www.baeldung.com/java-collections-complexity", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000045'::uuid;

-- Node 046 (relational-database-concepts | Tables and rows): Replaced Java videos with database tutorials covering relational database tables, columns, rows, and data types
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "3. Relational Concepts: Tables, Rows, Columns", "url": "https://www.youtube.com/watch?v=3JnMfj-hWNM", "provider": "EDUCATA"}, {"type": "YOUTUBE", "title": "SQL Basics for Beginners | Relational Model, Tables, Rows & Columns Explained (SQL Server 2022)", "url": "https://www.youtube.com/watch?v=P__4X_IldU0", "provider": "Software to Silicon"}, {"type": "DOCUMENTATION", "title": "PostgreSQL DDL Basics", "url": "https://www.postgresql.org/docs/current/ddl-basics.html", "provider": "PostgreSQL Docs"}, {"type": "ONLINE_RESOURCE", "title": "SQL Introduction and Tables", "url": "https://www.w3schools.com/sql/sql_intro.asp", "provider": "W3Schools"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000046'::uuid;

-- Node 048 (relational-database-concepts | Relationships): Replaced JPA entity mapping and Java OOP association videos with language-neutral database cardinality tutorials
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "DBMS Relationship & Types (One to One, One to Many, Many to Many) | Learn Coding", "url": "https://www.youtube.com/watch?v=zaq6aR1S_c8", "provider": "Learn Coding"}, {"type": "YOUTUBE", "title": "What Is a One-to-Many Relationship? | SQL and Database Basics for Beginners", "url": "https://www.youtube.com/watch?v=YwEX4f-ixg4", "provider": "SQL & Database Tutorials"}, {"type": "DOCUMENTATION", "title": "PostgreSQL Foreign Keys Tutorial", "url": "https://www.postgresql.org/docs/current/tutorial-fk.html", "provider": "PostgreSQL Docs"}, {"type": "ONLINE_RESOURCE", "title": "SQL FOREIGN KEY Constraint", "url": "https://www.w3schools.com/sql/sql_foreignkey.asp", "provider": "W3Schools"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000048'::uuid;

-- Node 050 (sql-fundamentals | INSERT / UPDATE / DELETE): Replaced Hibernate CRUD video with pure SQL INSERT, UPDATE, and DELETE DML tutorial
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "INSERT UPDATE, DELETE & ALTER Table in SQL With Example | SQL Tutorial in Hindi 4", "url": "https://www.youtube.com/watch?v=4YAAgrm8_ZI", "provider": "Rishabh Mishra"}, {"type": "YOUTUBE", "title": "Intermediate SQL Tutorial | Updating/Deleting Data", "url": "https://www.youtube.com/watch?v=bhnrIforc7s", "provider": "Alex The Analyst"}, {"type": "DOCUMENTATION", "title": "PostgreSQL Data Manipulation Language", "url": "https://www.postgresql.org/docs/current/dml.html", "provider": "PostgreSQL Docs"}, {"type": "ONLINE_RESOURCE", "title": "SQL INSERT INTO Statement", "url": "https://www.w3schools.com/sql/sql_insert.asp", "provider": "W3Schools"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000050'::uuid;

-- Node 051 (sql-fundamentals | GROUP BY): Replaced Java Streams groupingBy video with SQL GROUP BY, HAVING, and Aggregates tutorial
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Group By + Order By in MySQL | Beginner MySQL Series", "url": "https://www.youtube.com/watch?v=zgYqUP_PhQo", "provider": "Alex The Analyst"}, {"type": "YOUTUBE", "title": "GROUP BY and HAVING Clause in SQL", "url": "https://www.youtube.com/watch?v=VQf0V6Wwbf4", "provider": "Neso Academy"}, {"type": "DOCUMENTATION", "title": "PostgreSQL Aggregate Functions", "url": "https://www.postgresql.org/docs/current/tutorial-agg.html", "provider": "PostgreSQL Docs"}, {"type": "ONLINE_RESOURCE", "title": "SQL GROUP BY Statement", "url": "https://www.w3schools.com/sql/sql_groupby.asp", "provider": "W3Schools"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000051'::uuid;

-- Node 054 (joins-subqueries | Self joins): Replaced interview trick clips with structured conceptual tutorials on SQL Self Joins and hierarchical queries
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Self join in sql server - Part 14", "url": "https://www.youtube.com/watch?v=qnYSN_7qwgg", "provider": "kudvenkat"}, {"type": "YOUTUBE", "title": "Joins in MySQL | Intermediate MySQL", "url": "https://www.youtube.com/watch?v=lXQzD09BOH0", "provider": "Alex The Analyst"}, {"type": "DOCUMENTATION", "title": "PostgreSQL Self-Joins and Table Aliases", "url": "https://www.postgresql.org/docs/current/queries-table-expressions.html#QUERIES-TABLE-ALIASES", "provider": "PostgreSQL Docs"}, {"type": "ONLINE_RESOURCE", "title": "SQL Self Join", "url": "https://www.w3schools.com/sql/sql_join_self.asp", "provider": "W3Schools"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000054'::uuid;

-- Node 055 (primary-foreign-keys | Primary key): Replaced Spring Boot UUID video with DBMS primary key tutorial and updated documentation to PostgreSQL primary key constraints
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Lec-10: What is Primary Key in DBMS | Primary Key with Examples in Hindi", "url": "https://www.youtube.com/watch?v=Tp37HXfekNo", "provider": "Gate Smashers"}, {"type": "YOUTUBE", "title": "UUID vs INT: What’s Better For Your Primary Key?", "url": "https://www.youtube.com/watch?v=DHtf_46OxY8", "provider": "Database Star"}, {"type": "DOCUMENTATION", "title": "PostgreSQL Primary Key Constraints", "url": "https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-PRIMARY-KEYS", "provider": "PostgreSQL Docs"}, {"type": "ONLINE_RESOURCE", "title": "Primary Key in DBMS", "url": "https://www.geeksforgeeks.org/primary-key-in-dbms/", "provider": "GeeksforGeeks"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000055'::uuid;

-- Node 057 (primary-foreign-keys | Constraints): Replaced Full Stack Java video with SQL constraints tutorial and updated documentation from indexes to PostgreSQL constraints page
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Master SQL Constraints in Simple Steps! (NOT NULL, UNIQUE, CHECK, DEFAULT)", "url": "https://www.youtube.com/watch?v=79x4GxQ5pUI", "provider": "Skill IT Academy"}, {"type": "YOUTUBE", "title": "SQL Constraints Made Easy | NOT NULL to FOREIGN KEY Explained Fast!", "url": "https://www.youtube.com/watch?v=Fz7LFcMMxh0", "provider": "Gate Smashers"}, {"type": "DOCUMENTATION", "title": "PostgreSQL Check and Column Constraints", "url": "https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-CHECK-CONSTRAINTS", "provider": "PostgreSQL Docs"}, {"type": "ONLINE_RESOURCE", "title": "SQL Constraints Overview", "url": "https://www.w3schools.com/sql/sql_constraints.asp", "provider": "W3Schools"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000057'::uuid;

-- Node 060 (database-normalization | 3NF): Replaced generic PostgreSQL DDL chapter documentation with specific MariaDB Third Normal Form (3NF) guide
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Transitive Dependency Explained with Solved Example ll Introduction to Third Normal Form in Hindi", "url": "https://www.youtube.com/watch?v=XjUa8glRzSM", "provider": "5 Minutes Engineering"}, {"type": "YOUTUBE", "title": "2.4: Normalisation: 1NF, 2NF, 3NF | DBMS 2.4 | Anomalies, Partial & Transitive Dependencies", "url": "https://www.youtube.com/watch?v=XjxGiS8u04s", "provider": "Abhijeet Karve"}, {"type": "DOCUMENTATION", "title": "MariaDB Third Normal Form (3NF) Guide", "url": "https://mariadb.com/kb/en/third-normal-form-3nf/", "provider": "MariaDB Docs"}, {"type": "ONLINE_RESOURCE", "title": "Third Normal Form (3NF)", "url": "https://www.geeksforgeeks.org/third-normal-form-3nf/", "provider": "GeeksforGeeks"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000060'::uuid;

-- Node 061 (transactions-acid-properties | Commit / rollback): Replaced JDBC in Java video with database transactions COMMIT, ROLLBACK, and Savepoints tutorial
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "SQL Transactions in one shot | ACID Properties Auto Commit Rollback SavePoint in One Video", "url": "https://www.youtube.com/watch?v=GksDj-1_JmI", "provider": "Traidev Official"}, {"type": "YOUTUBE", "title": "42-Transactional Command in SQL | COMMIT | ROLLBACK | SAVEPOINT | SQL Interview Preparation", "url": "https://www.youtube.com/watch?v=do5ZjXmXR94", "provider": "CodeEra"}, {"type": "DOCUMENTATION", "title": "PostgreSQL Transactions Tutorial", "url": "https://www.postgresql.org/docs/current/tutorial-transactions.html", "provider": "PostgreSQL Docs"}, {"type": "ONLINE_RESOURCE", "title": "SQL Transactions - COMMIT and ROLLBACK", "url": "https://www.tutorialspoint.com/sql/sql-transactions.htm", "provider": "TutorialsPoint"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000061'::uuid;

-- Node 063 (transactions-acid-properties | Isolation levels): Replaced Spring Boot transaction isolation video with pure database transaction isolation levels tutorial
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Isolation + Dirty Read, Non-Repeatable Read And Phantom Read | Concurrency series - Video 3", "url": "https://www.youtube.com/watch?v=TbrCdiE53So", "provider": "Kartikeya Sharma"}, {"type": "YOUTUBE", "title": "Serializable vs Repeatable Read Isolation Level - When to use one over the other in Database Systems", "url": "https://www.youtube.com/watch?v=KoULlXKK1H8", "provider": "Hussein Nasser"}, {"type": "DOCUMENTATION", "title": "PostgreSQL Transaction Isolation Levels", "url": "https://www.postgresql.org/docs/current/transaction-iso.html", "provider": "PostgreSQL Docs"}, {"type": "ONLINE_RESOURCE", "title": "Transaction Isolation Levels in DBMS", "url": "https://www.geeksforgeeks.org/transaction-isolation-levels-dbms/", "provider": "GeeksforGeeks"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000063'::uuid;

-- Node 064 (how-internet-works | IP and DNS): Replaced Java domain lookup program with networking tutorial on DNS resolution
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "DNS Explained! 🌐 How Domain Names Become IP Addresses | CCNA", "url": "https://www.youtube.com/watch?v=h6T79ShNE70", "provider": "Thecrazynetworkengineer"}, {"type": "YOUTUBE", "title": "Everything You Need to Know About DNS: Crash Course System Design #4", "url": "https://www.youtube.com/watch?v=27r4Bzuj5NQ", "provider": "ByteByteGo"}, {"type": "DOCUMENTATION", "title": "Domain Name System (DNS) Glossary", "url": "https://developer.mozilla.org/en-US/docs/Glossary/DNS", "provider": "MDN Web Docs"}, {"type": "ONLINE_RESOURCE", "title": "How the Internet Works", "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/How_does_the_Internet_work", "provider": "MDN Web Docs"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000064'::uuid;

-- Node 068 (client-server-architecture | Stateless): Replaced YouTube short with full tutorial on stateful vs stateless client-server architectures
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Stateful vs Stateless Architectures Explained", "url": "https://www.youtube.com/watch?v=20tpk8A_xa0", "provider": "Hayk Simonyan"}, {"type": "YOUTUBE", "title": "Stateful vs Stateless Applications (Explained by Example)", "url": "https://www.youtube.com/watch?v=nFPzI_Qg3FU", "provider": "Hussein Nasser"}, {"type": "DOCUMENTATION", "title": "HTTP Sessions and Cookies", "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Session", "provider": "MDN Web Docs"}, {"type": "ONLINE_RESOURCE", "title": "Stateless and Stateful Systems in System Design", "url": "https://www.geeksforgeeks.org/stateless-and-stateful-systems-in-system-design/", "provider": "GeeksforGeeks"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000068'::uuid;

-- Node 073 (rest-api-architecture | Resources and URIs): Replaced Java naming conventions and Java nested classes with REST API resource naming and URI hierarchy design tutorials
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "REST API URI Naming Conventions Every Developer Should Know (With Versioning Tips)", "url": "https://www.youtube.com/watch?v=rcKpECli_vA", "provider": "Beyond Code with Prime"}, {"type": "YOUTUBE", "title": "Http verbs and REST URL naming conventions", "url": "https://www.youtube.com/watch?v=2vjHp18Xmlo", "provider": "@NurtureLearning"}, {"type": "DOCUMENTATION", "title": "What Is a URL?", "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_URL", "provider": "MDN Web Docs"}, {"type": "ONLINE_RESOURCE", "title": "REST API Resource Naming Guide", "url": "https://restfulapi.net/resource-naming/", "provider": "RESTful API"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000073'::uuid;

-- Node 078 (http-methods-status-codes | Idempotency): Replaced YouTube shorts with full-length educational tutorials on HTTP idempotency in REST APIs
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Idempotency in APIs: you should be aware of this!", "url": "https://www.youtube.com/watch?v=t99NvIazD68", "provider": "Software Developer Diaries"}, {"type": "YOUTUBE", "title": "Build a robust Payments service using Idempotency Keys", "url": "https://www.youtube.com/watch?v=m6DtqSb1BDM", "provider": "Arpit Bhayani"}, {"type": "DOCUMENTATION", "title": "Idempotent HTTP Methods", "url": "https://developer.mozilla.org/en-US/docs/Glossary/Idempotent", "provider": "MDN Web Docs"}, {"type": "ONLINE_RESOURCE", "title": "Idempotent Operations in REST APIs", "url": "https://www.baeldung.com/cs/idempotent-operations", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000078'::uuid;

-- Node 079 (authentication-authorization | Password hashing): Replaced short snippet with in-depth tutorial on password hashing, salt, and BCrypt
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "How NOT to Store Passwords! - Computerphile", "url": "https://www.youtube.com/watch?v=8ZtInClXe1Q", "provider": "Computerphile"}, {"type": "YOUTUBE", "title": "#34 Spring Security | Bcrypt Password Encoder", "url": "https://www.youtube.com/watch?v=RI3UpqUZq50", "provider": "Telusko"}, {"type": "DOCUMENTATION", "title": "OWASP Password Storage Cheat Sheet", "url": "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html", "provider": "OWASP"}, {"type": "ONLINE_RESOURCE", "title": "Password Hashing in Java with BCrypt", "url": "https://www.baeldung.com/java-password-hashing", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000079'::uuid;

-- Node 080 (authentication-authorization | Sessions): Replaced YouTube short with full tutorial on HTTP sessions, cookies, and server-side state
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Difference between cookies, session and tokens", "url": "https://www.youtube.com/watch?v=GhrvZ5nUWNg", "provider": "Valentin Despa"}, {"type": "YOUTUBE", "title": "Cookies vs Sessions for Authentication – Which is Better? | Web Security Explained", "url": "https://www.youtube.com/watch?v=kbdYuwkIQv8", "provider": "LearnIT"}, {"type": "DOCUMENTATION", "title": "Using HTTP Cookies", "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies", "provider": "MDN Web Docs"}, {"type": "ONLINE_RESOURCE", "title": "Servlet Session Tracking", "url": "https://www.tutorialspoint.com/servlets/servlets-session-tracking.htm", "provider": "TutorialsPoint"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000080'::uuid;

-- Node 085 (spring-framework-ioc | BeanFactory): Replaced Hibernate lazy fetching video with Spring BeanFactory container and lazy loading tutorial
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Spring Container Explained | BeanFactory vs ApplicationContext | Spring Core Tutorial", "url": "https://www.youtube.com/watch?v=Aq2yyrFvauk", "provider": "RuchiCodes"}, {"type": "YOUTUBE", "title": "BeanFactory and Application Context in Spring Framework with Live Examples #springframework", "url": "https://www.youtube.com/watch?v=tH6rd_OkClM", "provider": "Lazy Programmer"}, {"type": "DOCUMENTATION", "title": "The BeanFactory API", "url": "https://docs.spring.io/spring-framework/reference/core/beans/beanfactory.html", "provider": "Spring Docs"}, {"type": "ONLINE_RESOURCE", "title": "Spring Bean Definition", "url": "https://www.tutorialspoint.com/spring/spring_bean_definition.htm", "provider": "TutorialsPoint"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000085'::uuid;

-- Node 090 (dependency-injection-spring-beans | Scopes): Replaced YouTube short with full tutorials on Spring Bean scopes (singleton, prototype, web scopes)
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Bean Scopes in Spring Boot : Complete Guide : Singleton | Prototype | Request | Session", "url": "https://www.youtube.com/watch?v=aOwJWMkuE54", "provider": "The Curious Coder"}, {"type": "YOUTUBE", "title": "Spring Bean Scope | Singleton | Prototype | how to configure scope spring tutorial in hindi", "url": "https://www.youtube.com/watch?v=Zx9iYwQqaPg", "provider": "Learn Code With Durgesh"}, {"type": "DOCUMENTATION", "title": "Bean Scopes", "url": "https://docs.spring.io/spring-framework/reference/core/beans/factory-scopes.html", "provider": "Spring Docs"}, {"type": "ONLINE_RESOURCE", "title": "Spring Bean Scopes", "url": "https://www.baeldung.com/spring-bean-scopes", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000090'::uuid;

-- Node 096 (spring-boot-auto-configuration | CORS / CSRF): Replaced YouTube short with full tutorial on Spring Security CORS and CSRF configuration
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "#31 Spring Security | CSRF Token", "url": "https://www.youtube.com/watch?v=8QDORHQvdu8", "provider": "Telusko"}, {"type": "YOUTUBE", "title": "Spring Security CORS: How to configure CORS in Spring Boot & Spring Security", "url": "https://www.youtube.com/watch?v=HRwlT_etr60", "provider": "Dan Vega"}, {"type": "DOCUMENTATION", "title": "Cross Site Request Forgery (CSRF) in Spring Security", "url": "https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html", "provider": "Spring Docs"}, {"type": "ONLINE_RESOURCE", "title": "CORS with Spring", "url": "https://www.baeldung.com/spring-cors", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000096'::uuid;

-- Node 103 (unit-integration-testing | Mockito): Replaced non-English video with English Mockito tutorial from established educator
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Mockito Spring Boot Tutorial | @Mock @InjectMocks", "url": "https://www.youtube.com/watch?v=YcAC59cvcV0", "provider": "Engineering Digest"}, {"type": "YOUTUBE", "title": "FS-072: Mockito Fundamentals: Mocks, Stubbing, and Verification | Full Stack Java", "url": "https://www.youtube.com/watch?v=Qld0q5cjt7M", "provider": "EDUCATA"}, {"type": "DOCUMENTATION", "title": "Mockito Documentation and Javadoc", "url": "https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html", "provider": "Mockito Docs"}, {"type": "ONLINE_RESOURCE", "title": "Mockito Tutorial Series", "url": "https://www.baeldung.com/mockito-series", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000103'::uuid;
