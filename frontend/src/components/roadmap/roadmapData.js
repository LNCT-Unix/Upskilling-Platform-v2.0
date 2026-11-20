export const categories = [
  {
    id: 1,
    title: "Programming Fundamentals",
    steps: [
      [1, "Variables and Data Types", [
        ["Primitives", ["int", "double", "boolean", "char"]],
        ["Reference types", ["String", "objects", "null", "stack vs heap"]],
        ["Type casting", ["Widening", "narrowing", "wrapper classes", "autoboxing"]],
      ]],
      [2, "Operators and Expressions", [
        ["Arithmetic and logic", ["+ - * / %", "relational", "&&, ||, !"]],
        ["Precedence", ["Order of evaluation", "parentheses", "increment/decrement"]],
        ["Ternary", ["condition ? a : b", "assignment operators", "bitwise basics"]],
      ]],
      [3, "Conditional Statements", [
        ["if / else", ["if, else if, else", "boolean conditions"]],
        ["switch", ["Classic switch", "fall-through", "switch expressions"]],
        ["Nested logic", ["Nested if", "combined conditions", "guard clauses"]],
      ]],
      [4, "Loops", [
        ["for / while", ["for", "while", "do-while", "for-each"]],
        ["break / continue", ["Exit early", "skip iteration", "labels"]],
        ["Nested loops", ["Pattern printing", "matrix traversal", "loop pitfalls"]],
      ]],
      [5, "Methods and Functions", [
        ["Parameters", ["Declaring methods", "pass by value", "varargs"]],
        ["Return values", ["return types", "void", "early return"]],
        ["Overloading", ["Same name, different signatures", "recursion basics"]],
      ]],
      [6, "Arrays and Strings", [
        ["Arrays", ["1D/2D arrays", "traversal", "Arrays utility"]],
        ["String methods", ["Immutability", "substring", "split", "compare"]],
        ["StringBuilder", ["Mutable strings", "append", "performance"]],
      ]],
    ],
  },
  {
    id: 2,
    title: "Object-Oriented Programming and Java",
    steps: [
      [7, "Classes and Objects", [
        ["Fields and methods", ["Instance variables", "methods", "object creation"]],
        ["Constructors", ["Default", "parameterized", "chaining"]],
        ["this / static", ["this keyword", "static members", "static blocks"]],
      ]],
      [8, "Encapsulation", [
        ["Access modifiers", ["private", "default", "protected", "public"]],
        ["Getters / setters", ["Controlled access", "validation"]],
        ["Immutability", ["final", "immutable classes", "defensive copies"]],
      ]],
      [9, "Inheritance", [
        ["extends", ["Parent/child classes", "IS-A", "Object class"]],
        ["super", ["Calling parent constructor/method", "constructor order"]],
        ["Overriding", ["@Override", "rules", "final methods"]],
      ]],
      [10, "Polymorphism", [
        ["Overload vs override", ["Compile-time vs runtime"]],
        ["Upcasting", ["Parent reference", "downcasting", "instanceof"]],
        ["Dynamic dispatch", ["Method resolution at runtime"]],
      ]],
      [11, "Abstraction and Interfaces", [
        ["Abstract classes", ["abstract methods", "partial implementation"]],
        ["Interfaces", ["Contracts", "multiple implementation"]],
        ["Default methods", ["default/static methods", "functional interfaces"]],
      ]],
      [12, "Exception Handling", [
        ["try / catch / finally", ["Flow", "multiple catch", "try-with-resources"]],
        ["Checked vs unchecked", ["Exception hierarchy", "throws"]],
        ["Custom exceptions", ["Extending Exception", "best practices"]],
      ]],
    ],
  },
  {
    id: 3,
    title: "Java Collections and Problem Solving",
    steps: [
      [13, "List, Set and Map", [
        ["List", ["ArrayList", "LinkedList", "iteration"]],
        ["Set", ["HashSet", "LinkedHashSet", "TreeSet"]],
        ["Map", ["HashMap", "TreeMap", "Collections framework overview"]],
      ]],
      [14, "HashMap Internals", [
        ["Hashing fundamentals", ["hashCode", "equals", "hash functions", "collisions"]],
        ["HashMap internal structure", ["Buckets", "Node array", "linked list/tree bins"]],
        ["HashMap operations", ["put", "get", "remove", "resize", "load factor"]],
      ]],
      [15, "Sorting and Searching", [
        ["Comparable / Comparator", ["Natural vs custom ordering", "Collections.sort"]],
        ["Binary search", ["Sorted data", "iterative/recursive"]],
        ["Complexity", ["Big-O", "bubble/merge/quick sort basics"]],
      ]],
    ],
  },
  {
    id: 4,
    title: "Database Management",
    steps: [
      [16, "Relational Database Concepts", [
        ["Tables and rows", ["Schema", "columns", "data types"]],
        ["Keys", ["Candidate", "primary", "unique"]],
        ["Relationships", ["1:1", "1:N", "N:N"]],
      ]],
      [17, "SQL Fundamentals", [
        ["SELECT / WHERE", ["Filtering", "ORDER BY", "LIMIT"]],
        ["INSERT / UPDATE / DELETE", ["DML", "safe updates"]],
        ["GROUP BY", ["Aggregates", "HAVING", "DISTINCT"]],
      ]],
      [18, "Joins and Subqueries", [
        ["INNER / LEFT join", ["Join types", "ON conditions"]],
        ["Subqueries", ["Scalar", "IN/EXISTS", "correlated"]],
        ["Self joins", ["Hierarchies", "aliases"]],
      ]],
      [19, "Primary and Foreign Keys", [
        ["Primary key", ["Uniqueness", "auto-increment", "UUIDs"]],
        ["Foreign key", ["Referential integrity", "ON DELETE/UPDATE"]],
        ["Constraints", ["NOT NULL", "UNIQUE", "CHECK", "indexes"]],
      ]],
      [20, "Database Normalization", [
        ["1NF", ["Atomic values"]],
        ["2NF", ["No partial dependency"]],
        ["3NF", ["No transitive dependency", "when to denormalize"]],
      ]],
      [21, "Transactions and ACID", [
        ["Commit / rollback", ["BEGIN", "COMMIT", "ROLLBACK", "savepoints"]],
        ["ACID", ["Atomicity", "consistency", "isolation", "durability"]],
        ["Isolation levels", ["Dirty/non-repeatable/phantom reads", "locks"]],
      ]],
    ],
  },
  {
    id: 5,
    title: "Networking and API Development",
    steps: [
      [22, "How the Internet Works", [
        ["IP and DNS", ["IP addresses", "DNS resolution", "domains"]],
        ["Ports", ["TCP vs UDP", "common ports"]],
        ["Routing basics", ["Packets", "routers", "request journey"]],
      ]],
      [23, "Client-Server Architecture", [
        ["Request / response", ["Cycle", "clients", "servers"]],
        ["Stateless", ["Statelessness", "cookies", "sessions"]],
        ["Load balancing", ["Scaling", "proxies", "reverse proxy"]],
      ]],
      [24, "HTTP and HTTPS", [
        ["Headers", ["Request/response headers", "content type"]],
        ["TLS", ["Handshake", "encryption"]],
        ["Certificates", ["CA", "HTTPS setup", "HSTS basics"]],
      ]],
      [25, "REST API Architecture", [
        ["Resources and URIs", ["Naming", "nouns", "nesting"]],
        ["Statelessness", ["REST constraints", "JSON"]],
        ["Versioning", ["URL/header versioning", "pagination", "HATEOAS intro"]],
      ]],
      [26, "HTTP Methods and Status Codes", [
        ["GET / POST / PUT / PATCH / DELETE", ["Purpose and safe usage", "CRUD mapping"]],
        ["2xx / 4xx / 5xx", ["200, 201, 204", "400, 401, 403, 404", "500, 503"]],
        ["Idempotency", ["Idempotent vs non-idempotent methods", "retries"]],
      ]],
      [27, "Authentication and Authorization", [
        ["Password hashing", ["Hash vs encrypt", "salt", "BCrypt"]],
        ["Sessions", ["Session cookies", "server-side state"]],
        ["JWT generation / validation", ["Structure", "signing", "verifying", "expiry"]],
        ["Refresh token", ["Access vs refresh", "rotation", "revocation"]],
        ["Role-based access", ["Roles", "authorities", "protecting endpoints"]],
      ]],
    ],
  },
  {
    id: 6,
    title: "Spring Boot and Backend Development",
    steps: [
      [28, "Spring Framework and IoC", [
        ["IoC container", ["Inversion of control", "container role"]],
        ["BeanFactory", ["Lazy loading", "basic container"]],
        ["ApplicationContext", ["Features over BeanFactory", "configuration"]],
        ["Bean lifecycle", ["Instantiate", "initialize", "destroy", "callbacks"]],
      ]],
      [29, "Dependency Injection and Spring Beans", [
        ["Constructor / setter / field injection", ["All three types", "recommended style"]],
        ["@Component / @Bean", ["Stereotypes", "component scan", "Java config"]],
        ["Scopes", ["singleton", "prototype", "request/session"]],
        ["AuthenticationManager / Provider / PasswordEncoder beans", ["Defining and wiring security beans"]],
      ]],
      [30, "Spring Boot and Auto-Configuration", [
        ["Starters", ["Dependency starters", "BOM"]],
        ["Auto-config", ["@SpringBootApplication", "conditions"]],
        ["application.properties", ["Profiles", "externalized config"]],
        ["Security config (SecurityFilterChain)", ["Request rules", "filters", "stateless setup"]],
        ["CORS / CSRF", ["Allowed origins", "when to disable CSRF"]],
      ]],
      [31, "Spring Data JPA and Hibernate", [
        ["@Entity", ["Mapping", "@Id", "@Column", "ddl-auto"]],
        ["Repositories", ["JpaRepository", "derived queries", "paging"]],
        ["Relationships", ["@OneToMany", "@ManyToOne", "@ManyToMany", "cascade"]],
        ["JPQL and queries", ["@Query", "native queries", "projections"]],
        ["Lazy vs eager loading", ["Fetch types", "N+1 problem"]],
      ]],
      [32, "Unit and Integration Testing", [
        ["JUnit", ["Assertions", "lifecycle", "parameterized tests"]],
        ["Mockito", ["Mocks", "stubs", "verify"]],
        ["@SpringBootTest", ["Integration tests", "MockMvc", "test DB"]],
      ]],
      [33, "Docker and CI/CD", [
        ["Dockerfile", ["Images", "layers", "build and run"]],
        ["Compose", ["Multi-container", "networks", "volumes"]],
        ["Pipeline", ["Build, test, deploy", "GitHub Actions basics"]],
      ]],
    ],
  },
];
