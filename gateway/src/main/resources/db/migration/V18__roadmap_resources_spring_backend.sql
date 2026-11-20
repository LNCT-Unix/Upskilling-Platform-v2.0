-- =============================================================================
-- Migration: V18__roadmap_resources_spring_backend.sql
-- Resources for Category 6: Spring Boot and Backend Development (Nodes 084–107)
-- =============================================================================

-- IoC container
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "🚀 Mastering Inversion of Control (IoC) - Java Spring Boot Tutorial In Hindi 🌱", "url": "https://www.youtube.com/watch?v=VkeguyxgSg4", "provider": "Indian Programmer"}, {"type": "YOUTUBE", "title": "Spring IOC Container | What is Spring IOC Container | Spring Tutorial", "url": "https://www.youtube.com/watch?v=1jGGsuQoLjY", "provider": "Learn Code With Durgesh"}, {"type": "DOCUMENTATION", "title": "Introduction to the Spring IoC Container and Beans", "url": "https://docs.spring.io/spring-framework/reference/core/beans/introduction.html", "provider": "Spring Docs"}, {"type": "ONLINE_RESOURCE", "title": "Intro to Inversion of Control and Dependency Injection in Spring", "url": "https://www.baeldung.com/inversion-control-and-dependency-injection-in-spring", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000084'::uuid;

-- BeanFactory
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "#14 . Fetch Technique Theory | Lazy Loading | Eager Loading | Hibernate Tutorial in hindi", "url": "https://www.youtube.com/watch?v=OpYjBJjuwUI", "provider": "Learn Code With Durgesh"}, {"type": "YOUTUBE", "title": "BeanFactory and Application Context in Spring Framework with Live Examples #springframework", "url": "https://www.youtube.com/watch?v=tH6rd_OkClM", "provider": "Lazy Programmer"}, {"type": "DOCUMENTATION", "title": "The BeanFactory API", "url": "https://docs.spring.io/spring-framework/reference/core/beans/beanfactory.html", "provider": "Spring Docs"}, {"type": "ONLINE_RESOURCE", "title": "Spring Bean Definition", "url": "https://www.tutorialspoint.com/spring/spring_bean_definition.htm", "provider": "TutorialsPoint"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000085'::uuid;

-- ApplicationContext
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Understanding Beans and ApplicationContext in Spring Framework", "url": "https://www.youtube.com/watch?v=DQbkePm2ims", "provider": "CodeSnippet by Chetan"}, {"type": "YOUTUBE", "title": "Difference Between BeanFactory and ApplicationContext in Spring", "url": "https://www.youtube.com/watch?v=YEloNWh4U-M", "provider": "Java Guides"}, {"type": "DOCUMENTATION", "title": "ApplicationContext Features", "url": "https://docs.spring.io/spring-framework/reference/core/beans/context-introduction.html", "provider": "Spring Docs"}, {"type": "ONLINE_RESOURCE", "title": "Spring ApplicationContext Guide", "url": "https://www.baeldung.com/spring-application-context", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000086'::uuid;

-- Bean lifecycle
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Spring bean life cycle | Bean Initialization & Destroy Callbacks | Spring boot interview prep #1", "url": "https://www.youtube.com/watch?v=g3bl7HJtBIw", "provider": "Selenium Express"}, {"type": "YOUTUBE", "title": "Customizing Bean Nature in Spring | Bean Lifecycle, @PostConstruct & @PreDestroy Explained", "url": "https://www.youtube.com/watch?v=KxWh70Xr35c", "provider": "CodeSnippet by Chetan"}, {"type": "DOCUMENTATION", "title": "Customizing the Nature of a Bean", "url": "https://docs.spring.io/spring-framework/reference/core/beans/factory-nature.html", "provider": "Spring Docs"}, {"type": "ONLINE_RESOURCE", "title": "Bean Life Cycle in Java Spring", "url": "https://www.geeksforgeeks.org/bean-life-cycle-in-java-spring/", "provider": "GeeksforGeeks"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000087'::uuid;

-- Constructor / setter / field injection
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Field Vs Constructor Injection ✅ Why Constructor Injection Is Recommended 🤔 #java #programming", "url": "https://www.youtube.com/watch?v=cS9bZgmG_04", "provider": "CodeSnippet by Chetan"}, {"type": "YOUTUBE", "title": "Mastering Dependency Injection in Spring Boot | Constructor, Setter, Field", "url": "https://www.youtube.com/watch?v=MWd6hLGTAew", "provider": "The Curious Coder"}, {"type": "DOCUMENTATION", "title": "Dependency Injection Methods", "url": "https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html", "provider": "Spring Docs"}, {"type": "ONLINE_RESOURCE", "title": "Spring Dependency Injection Tutorial", "url": "https://www.digitalocean.com/community/tutorials/spring-dependency-injection", "provider": "DigitalOcean"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000088'::uuid;

-- @Component / @Bean
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "[SPRING CORE] Spring Configuration, Beans & Annotations  — Consolidated Overview", "url": "https://www.youtube.com/watch?v=wd9ajnQEwiE", "provider": "Amruta Awati Patil"}, {"type": "YOUTUBE", "title": "#3 Spring Annotations | @Component, @Value & @ComponentScan | Annotation Based Configurations", "url": "https://www.youtube.com/watch?v=sCQphHUZmiE", "provider": "Smart Programming"}, {"type": "DOCUMENTATION", "title": "Classpath Scanning and Managed Components", "url": "https://docs.spring.io/spring-framework/reference/core/beans/classpath-scanning.html", "provider": "Spring Docs"}, {"type": "ONLINE_RESOURCE", "title": "Spring @Component vs @Bean", "url": "https://www.baeldung.com/spring-component-annotation", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000089'::uuid;

-- Scopes
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Singleton, Prototype, Request, Session : Spring Boot Scopes Explained! #shorts", "url": "https://www.youtube.com/watch?v=GfJV2WOpX7s", "provider": "The Curious Coder"}, {"type": "YOUTUBE", "title": "Spring Bean Scope | Singleton | Prototype | how to configure scope spring tutorial in hindi", "url": "https://www.youtube.com/watch?v=Zx9iYwQqaPg", "provider": "Learn Code With Durgesh"}, {"type": "DOCUMENTATION", "title": "Bean Scopes", "url": "https://docs.spring.io/spring-framework/reference/core/beans/factory-scopes.html", "provider": "Spring Docs"}, {"type": "ONLINE_RESOURCE", "title": "Spring Bean Scopes", "url": "https://www.baeldung.com/spring-bean-scopes", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000090'::uuid;

-- AuthenticationManager / Provider / PasswordEncoder beans
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Spring Security 6 with Spring Boot and JWT Tutorial", "url": "https://www.youtube.com/watch?v=oeni_9g7too", "provider": "Telusko"}, {"type": "YOUTUBE", "title": "Spring Boot JWT Authentication Full Course | Build Instagram''s Auth Backend", "url": "https://www.youtube.com/watch?v=bhD9vrReIPY", "provider": "Prashant Sharma"}, {"type": "DOCUMENTATION", "title": "Spring Security Authentication Architecture", "url": "https://docs.spring.io/spring-security/reference/servlet/authentication/architecture.html", "provider": "Spring Docs"}, {"type": "ONLINE_RESOURCE", "title": "Custom AuthenticationProvider in Spring Security", "url": "https://www.baeldung.com/spring-security-authentication-provider", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000091'::uuid;

-- Starters
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "🔥 Create Own Starter Dependency from scratch in Hindi", "url": "https://www.youtube.com/watch?v=uS81XylbZp8", "provider": "Learn Code With Durgesh"}, {"type": "YOUTUBE", "title": "Spring Boot Starters: Mostly Used Spring Boot Starter Dependencies | Beginners Must Know 🔥", "url": "https://www.youtube.com/watch?v=Zxy8DmsJMTs", "provider": "Coding Wallah Sir"}, {"type": "DOCUMENTATION", "title": "Spring Boot Starters", "url": "https://docs.spring.io/spring-boot/reference/using/build-systems.html", "provider": "Spring Docs"}, {"type": "ONLINE_RESOURCE", "title": "Introduction to Spring Boot Starters", "url": "https://www.baeldung.com/spring-boot-starters", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000092'::uuid;

-- Auto-config
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "How Spring Boot Auto Configuration Magic works | Spring boot Tutorial [HIndi]", "url": "https://www.youtube.com/watch?v=rVOmSrCSdGE", "provider": "Learn Code With Durgesh"}, {"type": "YOUTUBE", "title": "Spring Boot Auto-Configuration Explained | How It Works + How to Override It", "url": "https://www.youtube.com/watch?v=aW_utRYb7Eg", "provider": "GK TechVerse"}, {"type": "DOCUMENTATION", "title": "Spring Boot Auto-configuration", "url": "https://docs.spring.io/spring-boot/reference/using/auto-configuration.html", "provider": "Spring Docs"}, {"type": "ONLINE_RESOURCE", "title": "Spring Boot Auto-Configuration", "url": "https://www.geeksforgeeks.org/spring-boot-auto-configuration/", "provider": "GeeksforGeeks"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000093'::uuid;

-- application.properties
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Spring Profiles, application.properties, application.yaml, @Value, and @ConfigurationProperties", "url": "https://www.youtube.com/watch?v=9nV70HXMg3A", "provider": "The Curious Coder"}, {"type": "YOUTUBE", "title": "Master Spring Boot Profiles: A Comprehensive Guide for Developers - 2026 Update", "url": "https://www.youtube.com/watch?v=WRUVixDFI6s", "provider": "Engineering Digest"}, {"type": "DOCUMENTATION", "title": "Externalized Configuration in Spring Boot", "url": "https://docs.spring.io/spring-boot/reference/features/external-config.html", "provider": "Spring Docs"}, {"type": "ONLINE_RESOURCE", "title": "Properties with Spring and Spring Boot", "url": "https://www.baeldung.com/properties-with-spring", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000094'::uuid;

-- Security config (SecurityFilterChain)
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "#32 Spring Security | Custom Configuration", "url": "https://www.youtube.com/watch?v=d33a1pK4OYs", "provider": "Telusko"}, {"type": "YOUTUBE", "title": "Spring Security JWT Filter Chain Explained | Stateless Auth + Rate Limiting (Part 7)", "url": "https://www.youtube.com/watch?v=HEO4aq9Q8sw", "provider": "Prashant Sharma"}, {"type": "DOCUMENTATION", "title": "Spring Security Java Configuration", "url": "https://docs.spring.io/spring-security/reference/servlet/configuration/java.html", "provider": "Spring Docs"}, {"type": "ONLINE_RESOURCE", "title": "Securing a Web Application", "url": "https://spring.io/guides/gs/securing-web/", "provider": "Spring Guides"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000095'::uuid;

-- CORS / CSRF
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "#31 Spring Security | CSRF Token", "url": "https://www.youtube.com/watch?v=8QDORHQvdu8", "provider": "Telusko"}, {"type": "YOUTUBE", "title": "Disable CSRF in Spring Security #springsecurity #csrf #javaprogramming", "url": "https://www.youtube.com/watch?v=hjYyeVCPVlI", "provider": "Coding with Nam"}, {"type": "DOCUMENTATION", "title": "Cross Site Request Forgery (CSRF) in Spring Security", "url": "https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html", "provider": "Spring Docs"}, {"type": "ONLINE_RESOURCE", "title": "CORS with Spring", "url": "https://www.baeldung.com/spring-cors", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000096'::uuid;

-- @Entity
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "JPA Entity Mapping in Spring Boot 4 | @Entity, @Id, @Column & @GeneratedValue | Part 0", "url": "https://www.youtube.com/watch?v=TYmpAO-rpgk", "provider": "The Coding Cubical"}, {"type": "YOUTUBE", "title": "Entity Mapping | @OneToOne, @OneToMany, @JoinColumn| Spring Data JPA | Spring Boot | Dev2Prod Coding", "url": "https://www.youtube.com/watch?v=2fvUrpYG95w", "provider": "Dev2Prod Coding"}, {"type": "DOCUMENTATION", "title": "Hibernate User Guide: Entity Types", "url": "https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html", "provider": "Hibernate Docs"}, {"type": "ONLINE_RESOURCE", "title": "JPA Entities and Annotations", "url": "https://www.baeldung.com/jpa-entities", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000097'::uuid;

-- Repositories
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Spring JPA Repository Full Guide | Derived Queries, Pagination, Sorting, Search & Filters Explained", "url": "https://www.youtube.com/watch?v=dRCkQFNGmHs", "provider": "hindi code class"}, {"type": "YOUTUBE", "title": "Spring Data JPA Implementation: Full Guide with CrudRepository, Paging, Sorting & Query Methods", "url": "https://www.youtube.com/watch?v=IG7f9bAPJYs", "provider": "CodeSnippet by Chetan"}, {"type": "DOCUMENTATION", "title": "Spring Data Repositories Core Extensions", "url": "https://docs.spring.io/spring-data/commons/reference/repositories/core-extensions.html", "provider": "Spring Docs"}, {"type": "ONLINE_RESOURCE", "title": "The Spring Data Repositories", "url": "https://www.baeldung.com/spring-data-repositories", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000098'::uuid;

-- Relationships
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "[DAY 22]  HINDI JPA Relationships Complete Guide | OneToOne, OneToMany, ManyToMany Hibernate Course", "url": "https://www.youtube.com/watch?v=iuOHwPu5Qf8", "provider": "Faisal Memon"}, {"type": "YOUTUBE", "title": "Spring Data JPA Mapping In One Shot | Cascading and Fetch types | N+1 Query Optimisation (Hindi)", "url": "https://www.youtube.com/watch?v=nty9L3YXZds", "provider": "Anuj Kumar Sharma"}, {"type": "DOCUMENTATION", "title": "Spring Data JPA Entity Relationships", "url": "https://docs.spring.io/spring-data/jpa/reference/jpa/entity-persistence.html", "provider": "Spring Docs"}, {"type": "ONLINE_RESOURCE", "title": "JPA Many-to-Many and Relationships Guide", "url": "https://www.baeldung.com/jpa-many-to-many", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000099'::uuid;

-- JPQL and queries
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Master JPQL & Query Methods in Spring Data JPA | Native Queries | Pagination in One Shot (Hindi)", "url": "https://www.youtube.com/watch?v=wxrU-7UFITU", "provider": "Anuj Kumar Sharma"}, {"type": "YOUTUBE", "title": "Executing JPQL and Native  Queries with Spring Data JPA | @Query @Param Annotations | Spring boot", "url": "https://www.youtube.com/watch?v=6bxxsoCqll4", "provider": "Learn Code With Durgesh"}, {"type": "DOCUMENTATION", "title": "Declaring JPA Query Methods", "url": "https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html", "provider": "Spring Docs"}, {"type": "ONLINE_RESOURCE", "title": "Spring Data JPA @Query Annotation", "url": "https://www.baeldung.com/spring-data-jpa-query", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000100'::uuid;

-- Lazy vs eager loading
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "#14 Hibernate Tutorial | Fetch EAGER LAZY", "url": "https://www.youtube.com/watch?v=ucuVbL-tsUY", "provider": "Telusko"}, {"type": "YOUTUBE", "title": "Interview Q&A |  Lazy vs Eager Loading Explained | Clear & Confident Answers ! @Javatechie", "url": "https://www.youtube.com/watch?v=QuqubmbGOUU", "provider": "Java Techie"}, {"type": "DOCUMENTATION", "title": "Spring Data JPA Reference Documentation", "url": "https://docs.spring.io/spring-data/jpa/reference/index.html", "provider": "Spring Docs"}, {"type": "ONLINE_RESOURCE", "title": "Eager and Lazy Loading in Hibernate", "url": "https://www.baeldung.com/hibernate-lazy-eager-loading", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000101'::uuid;

-- JUnit
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "JUnit Tutorial - #1 - Introduction to JUnit | What is the JUnit? | JUnit Tutorial New Series ☑️", "url": "https://www.youtube.com/watch?v=YXV51LVmfok", "provider": "Java Guides"}, {"type": "YOUTUBE", "title": "Java Unit Testing with JUnit - Tutorial - How to Create And Use Unit Tests", "url": "https://www.youtube.com/watch?v=vZm0lHciFsQ", "provider": "Coding with John"}, {"type": "DOCUMENTATION", "title": "JUnit 5 User Guide", "url": "https://junit.org/junit5/docs/current/user-guide/", "provider": "JUnit Docs"}, {"type": "ONLINE_RESOURCE", "title": "A Guide to JUnit 5", "url": "https://www.baeldung.com/junit-5", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000102'::uuid;

-- Mockito
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "14 Mockito Stubbing Statement  when   thenReturn & doReturn   when", "url": "https://www.youtube.com/watch?v=OPV1bjLcQgo", "provider": "心藍說Java"}, {"type": "YOUTUBE", "title": "FS-072: Mockito Fundamentals: Mocks, Stubbing, and Verification | Full Stack Java", "url": "https://www.youtube.com/watch?v=Qld0q5cjt7M", "provider": "EDUCATA"}, {"type": "DOCUMENTATION", "title": "Mockito Documentation and Javadoc", "url": "https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html", "provider": "Mockito Docs"}, {"type": "ONLINE_RESOURCE", "title": "Mockito Tutorial Series", "url": "https://www.baeldung.com/mockito-series", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000103'::uuid;

-- @SpringBootTest
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Spring Boot | Controller Unit Testing | Mockito | MockMVC", "url": "https://www.youtube.com/watch?v=9-mX5MACs5U", "provider": "TheCodeStorm"}, {"type": "YOUTUBE", "title": "Spring Boot Integration testing with MockMvc", "url": "https://www.youtube.com/watch?v=Q_pfkcsRI2Q", "provider": "Java Code House"}, {"type": "DOCUMENTATION", "title": "Testing in Spring Boot", "url": "https://docs.spring.io/spring-boot/reference/testing/spring-boot-applications.html", "provider": "Spring Docs"}, {"type": "ONLINE_RESOURCE", "title": "Testing in Spring Boot", "url": "https://www.baeldung.com/spring-boot-testing", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000104'::uuid;

-- Dockerfile
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Dockerize Java Program - Hello World", "url": "https://www.youtube.com/watch?v=kVlhUHqkpSs", "provider": "Engineer Talks With Bhushan"}, {"type": "YOUTUBE", "title": "How to Create Docker Image for Java Application | How to Dockerize an application | Docker Container", "url": "https://www.youtube.com/watch?v=t9L__Y0E5OY", "provider": "ProgrammingKnowledge"}, {"type": "DOCUMENTATION", "title": "Dockerfile Reference", "url": "https://docs.docker.com/reference/dockerfile/", "provider": "Docker Docs"}, {"type": "ONLINE_RESOURCE", "title": "Dockerizing a Spring Boot Application", "url": "https://www.baeldung.com/dockerizing-spring-boot-application", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000105'::uuid;

-- Compose
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Demo of Docker Compose | Multi-Container App with Network & Volumes", "url": "https://www.youtube.com/watch?v=9RhooTLbfGk", "provider": "Upendra | SHA Career Hub"}, {"type": "YOUTUBE", "title": "Docker Compose Explained | Run Multi-Container Apps with One Command | Cloud & Devops", "url": "https://www.youtube.com/watch?v=jkrhbj7__04", "provider": "DheerajTechInsight"}, {"type": "DOCUMENTATION", "title": "Docker Compose Overview", "url": "https://docs.docker.com/compose/", "provider": "Docker Docs"}, {"type": "ONLINE_RESOURCE", "title": "Docker Compose - GeeksforGeeks", "url": "https://www.geeksforgeeks.org/docker-compose/", "provider": "GeeksforGeeks"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000106'::uuid;

-- Pipeline
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "SpringBoot - Build CI/CD Pipeline Using GitHub Actions | Build & Push Docker Image | JavaTechie", "url": "https://www.youtube.com/watch?v=NppkHKvnrqc", "provider": "Java Techie"}, {"type": "YOUTUBE", "title": "Build CI/CD Pipeline for Java Maven Using GitHub Actions #devops #technology #tech", "url": "https://www.youtube.com/watch?v=BqCe-nSXSGI", "provider": "Thetips4you"}, {"type": "DOCUMENTATION", "title": "GitHub Actions Documentation", "url": "https://docs.github.com/en/actions/writing-workflows", "provider": "GitHub Docs"}, {"type": "ONLINE_RESOURCE", "title": "Understanding GitHub Actions", "url": "https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions", "provider": "GitHub Docs"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000107'::uuid;
