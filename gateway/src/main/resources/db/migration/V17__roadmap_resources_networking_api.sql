-- =============================================================================
-- Migration: V17__roadmap_resources_networking_api.sql
-- Resources for Category 5: Networking and API Development (Nodes 064–083)
-- =============================================================================

-- IP and DNS
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "DNS Explained! 🌐 How Domain Names Become IP Addresses | CCNA", "url": "https://www.youtube.com/watch?v=h6T79ShNE70", "provider": "Thecrazynetworkengineer"}, {"type": "YOUTUBE", "title": "Java #3-Converting a domain name to IP address", "url": "https://www.youtube.com/watch?v=U7wJ-n-iVYM", "provider": "luffy d"}, {"type": "DOCUMENTATION", "title": "Domain Name System (DNS) Glossary", "url": "https://developer.mozilla.org/en-US/docs/Glossary/DNS", "provider": "MDN Web Docs"}, {"type": "ONLINE_RESOURCE", "title": "How the Internet Works", "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/How_does_the_Internet_work", "provider": "MDN Web Docs"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000064'::uuid;

-- Ports
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "TCP vs UDP Comparison", "url": "https://www.youtube.com/watch?v=uwoD5YsGACg", "provider": "PowerCert Animated Videos"}, {"type": "YOUTUBE", "title": "Ports & Protocols Explained 🔥 TCP vs UDP + How Ports Work (With Examples) | Networking Basics", "url": "https://www.youtube.com/watch?v=3KOtMFH2KBY", "provider": "CodexSecura"}, {"type": "DOCUMENTATION", "title": "Service Name and Port Number Registry", "url": "https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml", "provider": "IANA"}, {"type": "ONLINE_RESOURCE", "title": "Port - MDN Web Docs Glossary", "url": "https://developer.mozilla.org/en-US/docs/Glossary/Port", "provider": "MDN Web Docs"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000065'::uuid;

-- Routing basics
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Understanding Routing! | ICT#8", "url": "https://www.youtube.com/watch?v=gQtgtKtvRdo", "provider": "Sabin Civil Engineering"}, {"type": "YOUTUBE", "title": "Routing Tables | CCNA - Explained", "url": "https://www.youtube.com/watch?v=CGmTvukObOw", "provider": "PowerCert Animated Videos"}, {"type": "DOCUMENTATION", "title": "RFC 1812 - Requirements for IP Version 4 Routers", "url": "https://datatracker.ietf.org/doc/html/rfc1812", "provider": "IETF RFC"}, {"type": "ONLINE_RESOURCE", "title": "How Does the Internet Work? A Simple Guide", "url": "https://www.freecodecamp.org/news/how-does-the-internet-work/", "provider": "freeCodeCamp"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000066'::uuid;

-- Request / response
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Client vs Server Communication Explained | Complete Request-Response Cycle for Beginners", "url": "https://www.youtube.com/watch?v=9o0JtEVxjQM", "provider": "#NaghmasTechWorld"}, {"type": "YOUTUBE", "title": "Web Application Architecture: Full Request-Response Lifecycle", "url": "https://www.youtube.com/watch?v=xv0Be4QfkH0", "provider": "ByteMonk"}, {"type": "DOCUMENTATION", "title": "An Overview of HTTP", "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview", "provider": "MDN Web Docs"}, {"type": "ONLINE_RESOURCE", "title": "Client-Server Model in Computer Networks", "url": "https://www.geeksforgeeks.org/client-server-model/", "provider": "GeeksforGeeks"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000067'::uuid;

-- Stateless
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Stateful vs Stateless Architectures Explained", "url": "https://www.youtube.com/watch?v=20tpk8A_xa0", "provider": "Hayk Simonyan"}, {"type": "YOUTUBE", "title": "Cookies are stateless? Yes, same as JWT", "url": "https://www.youtube.com/watch?v=2xvA-WjblOU", "provider": "andreyka26_se"}, {"type": "DOCUMENTATION", "title": "HTTP Sessions and Cookies", "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Session", "provider": "MDN Web Docs"}, {"type": "ONLINE_RESOURCE", "title": "Stateless and Stateful Systems in System Design", "url": "https://www.geeksforgeeks.org/stateless-and-stateful-systems-in-system-design/", "provider": "GeeksforGeeks"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000068'::uuid;

-- Load balancing
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Load Balancer vs Reverse Proxy vs API Gateway", "url": "https://www.youtube.com/watch?v=0x4dkWjzO2s", "provider": "Ashish Pratap Singh"}, {"type": "YOUTUBE", "title": "Reverse Proxy vs Load Balancer — What''s the Difference?", "url": "https://www.youtube.com/watch?v=AP4CV6rsFt0", "provider": "Backend With Sushil"}, {"type": "DOCUMENTATION", "title": "HTTP Load Balancing", "url": "https://docs.nginx.com/nginx/admin-guide/load-balancer/http-load-balancer/", "provider": "NGINX Docs"}, {"type": "ONLINE_RESOURCE", "title": "What Is Load Balancing?", "url": "https://www.digitalocean.com/community/tutorials/what-is-load-balancing", "provider": "DigitalOcean"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000069'::uuid;

-- Headers
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "How to use headers in REST APIs? Different types of headers, how and where to use?", "url": "https://www.youtube.com/watch?v=76CcJ90Lz4U", "provider": "sudoCODE"}, {"type": "YOUTUBE", "title": "Http Headers (Accept & Content-Type)", "url": "https://www.youtube.com/watch?v=xTtqQo7w6cQ", "provider": "Adityahrudayam"}, {"type": "DOCUMENTATION", "title": "HTTP Headers Reference", "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers", "provider": "MDN Web Docs"}, {"type": "ONLINE_RESOURCE", "title": "HTTP Headers Overview", "url": "https://www.geeksforgeeks.org/http-headers/", "provider": "GeeksforGeeks"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000070'::uuid;

-- TLS
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "SSL / TLS Handshake Explained For DevOps Engineers in Hindi", "url": "https://www.youtube.com/watch?v=EBh6emvhUNw", "provider": "TrainWithShubham"}, {"type": "YOUTUBE", "title": "The TLS Handshake Explained in Java (TLS 1.3, Certificates, Tampering)", "url": "https://www.youtube.com/watch?v=WBjiXuvTbnc", "provider": "Jayasekhar K"}, {"type": "DOCUMENTATION", "title": "Transport Layer Security (TLS)", "url": "https://developer.mozilla.org/en-US/docs/Web/Security/Transport_Layer_Security", "provider": "MDN Web Docs"}, {"type": "ONLINE_RESOURCE", "title": "Transport Layer Security (TLS) in Computer Network", "url": "https://www.geeksforgeeks.org/transport-layer-security-tls/", "provider": "GeeksforGeeks"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000071'::uuid;

-- Certificates
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Spring Boot SSL/TLS Setup with CA-Signed Certificate | Test HTTPS on 8443", "url": "https://www.youtube.com/watch?v=-Dgf1RKLLoA", "provider": "learn_with_vm"}, {"type": "YOUTUBE", "title": "How SSL Certificate Works?  - HTTPS Explained", "url": "https://www.youtube.com/watch?v=0yw-z6f7Mb4", "provider": "Piyush Garg"}, {"type": "DOCUMENTATION", "title": "Let''s Encrypt Documentation", "url": "https://letsencrypt.org/docs/", "provider": "Let''s Encrypt"}, {"type": "ONLINE_RESOURCE", "title": "OpenSSL Essentials: Working with SSL Certificates", "url": "https://www.digitalocean.com/community/tutorials/openssl-essentials-working-with-ssl-certificates-private-keys-and-csrs", "provider": "DigitalOcean"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000072'::uuid;

-- Resources and URIs
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Naming Conventions in Java | Best Practices Explained", "url": "https://www.youtube.com/watch?v=Es5-ugC9Dq0", "provider": "Ahiraa Learning Private Limited"}, {"type": "YOUTUBE", "title": "Java Nested Classes | Static Nested, Inner, Local & Anonymous Classes | Java Full Course #19", "url": "https://www.youtube.com/watch?v=0LaBK28_470", "provider": "Coder Army"}, {"type": "DOCUMENTATION", "title": "What Is a URL?", "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_URL", "provider": "MDN Web Docs"}, {"type": "ONLINE_RESOURCE", "title": "REST API Resource Naming Guide", "url": "https://restfulapi.net/resource-naming/", "provider": "RESTful API"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000073'::uuid;

-- Statelessness
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "What is REST API? | Web Service", "url": "https://www.youtube.com/watch?v=qVTAB8Z2VmA", "provider": "Telusko"}, {"type": "YOUTUBE", "title": "JSON Complete Course In Java & Spring Boot | Master JSON from Beginner to Advanced | REST API |", "url": "https://www.youtube.com/watch?v=aXOroRCFQEw", "provider": "CodeNeeTi"}, {"type": "DOCUMENTATION", "title": "REST Architectural Style", "url": "https://developer.mozilla.org/en-US/docs/Glossary/REST", "provider": "MDN Web Docs"}, {"type": "ONLINE_RESOURCE", "title": "What is REST - REST API Tutorial", "url": "https://restfulapi.net/", "provider": "RESTful API"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000074'::uuid;

-- Versioning
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "🚀 Spring Boot 4 API Versioning – Stop Breaking Client APIs", "url": "https://www.youtube.com/watch?v=SUfYMpWXJ7g", "provider": "Java Techie"}, {"type": "YOUTUBE", "title": "FS-219: API DESIGN AT SCALE: PAGINATION, VERSIONING, AND IDEMPOTENCY | Full Stack Java", "url": "https://www.youtube.com/watch?v=Cm5Y_wbuv4o", "provider": "EDUCATA"}, {"type": "DOCUMENTATION", "title": "API Design Guide: Versioning", "url": "https://cloud.google.com/apis/design/versioning", "provider": "Google Cloud Docs"}, {"type": "ONLINE_RESOURCE", "title": "REST API Versioning", "url": "https://www.baeldung.com/rest-versioning", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000075'::uuid;

-- GET / POST / PUT / PATCH / DELETE
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "(Hindi) GET /POST / PUT / PATCH / DELETE Request Explained  | HTTP Methods |  Day 4", "url": "https://www.youtube.com/watch?v=hrp_RebjZE4", "provider": "TheTestingAcademy Hindi"}, {"type": "YOUTUBE", "title": "Postman Beginner Tutorial 2026 | HTTP Methods Explained (GET, POST, PUT, PATCH, DELETE) + QUIZ", "url": "https://www.youtube.com/watch?v=geGsavlMVDQ", "provider": "Automation Step by Step"}, {"type": "DOCUMENTATION", "title": "HTTP Request Methods", "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods", "provider": "MDN Web Docs"}, {"type": "ONLINE_RESOURCE", "title": "PUT vs. PATCH in REST APIs", "url": "https://www.baeldung.com/http-put-patch-difference-spring", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000076'::uuid;

-- 2xx / 4xx / 5xx
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "HTTP Status Codes Explained in Hindi | 200, 201, 400, 401, 403, 404, 500 Explained | REST API", "url": "https://www.youtube.com/watch?v=jess_6chyu0", "provider": "LearnWithRehan"}, {"type": "YOUTUBE", "title": "HTTP Status Codes Explained for REST APIs (200, 400, 404, 500)", "url": "https://www.youtube.com/watch?v=x2d59rJ7vgo", "provider": "Topictrick"}, {"type": "DOCUMENTATION", "title": "HTTP Response Status Codes", "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status", "provider": "MDN Web Docs"}, {"type": "ONLINE_RESOURCE", "title": "HTTP Status Messages Reference", "url": "https://www.w3schools.com/tags/ref_httpmessages.asp", "provider": "W3Schools"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000077'::uuid;

-- Idempotency
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "#day79 - Which http method is idempotent in Rest API ? #coding #restapi #dotnet", "url": "https://www.youtube.com/watch?v=jRZfyWQ2RdM", "provider": "The Engineer''s Desk"}, {"type": "YOUTUBE", "title": "What is Idempotent in Java? #shorts #shortsfeed #short #shortvideo #developer #restapi", "url": "https://www.youtube.com/watch?v=USfFhRhWEY8", "provider": "Code With Roy"}, {"type": "DOCUMENTATION", "title": "Idempotent HTTP Methods", "url": "https://developer.mozilla.org/en-US/docs/Glossary/Idempotent", "provider": "MDN Web Docs"}, {"type": "ONLINE_RESOURCE", "title": "Idempotent Operations in REST APIs", "url": "https://www.baeldung.com/cs/idempotent-operations", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000078'::uuid;

-- Password hashing
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "BCrypt password hashing #hungrycoders #javaprogramming #javadeveloper", "url": "https://www.youtube.com/watch?v=n4d5m-_vb0U", "provider": "Coding with Aman"}, {"type": "YOUTUBE", "title": "#34 Spring Security | Bcrypt Password Encoder", "url": "https://www.youtube.com/watch?v=RI3UpqUZq50", "provider": "Telusko"}, {"type": "DOCUMENTATION", "title": "OWASP Password Storage Cheat Sheet", "url": "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html", "provider": "OWASP"}, {"type": "ONLINE_RESOURCE", "title": "Password Hashing in Java with BCrypt", "url": "https://www.baeldung.com/java-password-hashing", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000079'::uuid;

-- Sessions
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Cookies vs Sessions for Authentication – Which is Better? | Web Security Explained", "url": "https://www.youtube.com/watch?v=kbdYuwkIQv8", "provider": "LearnIT"}, {"type": "YOUTUBE", "title": "In table they were accidentally swapped.Cookies are stored in client, sessions are stored on server.", "url": "https://www.youtube.com/watch?v=paVbVm3lKUY", "provider": "Tech Vazid"}, {"type": "DOCUMENTATION", "title": "Using HTTP Cookies", "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies", "provider": "MDN Web Docs"}, {"type": "ONLINE_RESOURCE", "title": "Servlet Session Tracking", "url": "https://www.tutorialspoint.com/servlets/servlets-session-tracking.htm", "provider": "TutorialsPoint"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000080'::uuid;

-- JWT generation / validation
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "#38 Spring Security | Validating JWT Token", "url": "https://www.youtube.com/watch?v=ZhtF4i-iB1A", "provider": "Telusko"}, {"type": "YOUTUBE", "title": "JWT Token Creation & Validation in Spring Security | Complete Coding | ATS", "url": "https://www.youtube.com/watch?v=LjmxkWT6x5s", "provider": "A.T.S - Anshul Teaches Spring"}, {"type": "DOCUMENTATION", "title": "RFC 7519 - JSON Web Token (JWT)", "url": "https://datatracker.ietf.org/doc/html/rfc7519", "provider": "IETF RFC"}, {"type": "ONLINE_RESOURCE", "title": "Java JSON Web Tokens Tutorial with JJWT", "url": "https://www.baeldung.com/java-json-web-tokens-jjwt", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000081'::uuid;

-- Refresh token
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Access token and refresh token in Backend", "url": "https://www.youtube.com/watch?v=L2_gIrDxCes", "provider": "Chai aur Code"}, {"type": "YOUTUBE", "title": "Spring Boot Security - JWT Refresh Token Explained In Details | JavaTechie", "url": "https://www.youtube.com/watch?v=Wp4h_wYXqmU", "provider": "Java Techie"}, {"type": "DOCUMENTATION", "title": "RFC 6749 - OAuth 2.0 Refresh Token", "url": "https://datatracker.ietf.org/doc/html/rfc6749", "provider": "IETF RFC"}, {"type": "ONLINE_RESOURCE", "title": "What Are Refresh Tokens and How Do They Work?", "url": "https://auth0.com/learn/refresh-tokens", "provider": "Auth0"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000082'::uuid;

-- Role-based access
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Role Based Authorization in Spring Boot Project", "url": "https://www.youtube.com/watch?v=LndqWC4yIU4", "provider": "Engineering Digest"}, {"type": "YOUTUBE", "title": "Spring Boot Video #48 | Role-Based Authorization in Spring Boot | USER and ADMIN Roles", "url": "https://www.youtube.com/watch?v=UCRcfpNlQLM", "provider": "RuchiCodes"}, {"type": "DOCUMENTATION", "title": "NIST Role Based Access Control", "url": "https://csrc.nist.gov/projects/role-based-access-control", "provider": "NIST"}, {"type": "ONLINE_RESOURCE", "title": "Roles and Privileges in Spring Security", "url": "https://www.baeldung.com/role-and-privilege-for-spring-security-registration", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000083'::uuid;
