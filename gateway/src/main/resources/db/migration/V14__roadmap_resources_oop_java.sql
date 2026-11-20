-- =============================================================================
-- Migration: V14__roadmap_resources_oop_java.sql
-- Resources for Category 2: Object-Oriented Programming and Java (Nodes 019–036)
-- =============================================================================

-- Fields and methods
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Java Tutorials 03 :  Objects , Classes , Methods , Instance Variables", "url": "https://www.youtube.com/watch?v=sd-S0yu9qus", "provider": "Tech Academy"}, {"type": "YOUTUBE", "title": "Introduction to Classes and Objects (Part 1)", "url": "https://www.youtube.com/watch?v=W-D71ZeMixQ", "provider": "Neso Academy"}, {"type": "DOCUMENTATION", "title": "Declaring Member Variables", "url": "https://docs.oracle.com/javase/tutorial/java/javaOO/variables.html", "provider": "Oracle Docs"}, {"type": "ONLINE_RESOURCE", "title": "Classes and Objects in Java", "url": "https://www.baeldung.com/java-classes-objects", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000019'::uuid;

-- Constructors
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Constructors in Java | Constructor Chaining, Overloading & this | Java Full Course #13", "url": "https://www.youtube.com/watch?v=RADpqk79IzQ", "provider": "Coder Army"}, {"type": "YOUTUBE", "title": "Java Tutorial: Constructors in Java", "url": "https://www.youtube.com/watch?v=Fxj4n8En8lw", "provider": "CodeWithHarry"}, {"type": "DOCUMENTATION", "title": "Providing Constructors for Your Classes", "url": "https://docs.oracle.com/javase/tutorial/java/javaOO/constructors.html", "provider": "Oracle Docs"}, {"type": "ONLINE_RESOURCE", "title": "Guide to Constructors in Java", "url": "https://www.baeldung.com/java-constructors", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000020'::uuid;

-- this / static
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Static & Final in Java | Static Methods, Blocks & String[] args | Java Full Course #15", "url": "https://www.youtube.com/watch?v=Lyg4ZcrjUBw", "provider": "Coder Army"}, {"type": "YOUTUBE", "title": "Static keyword in Java - Static variables, Static Methods and Static Blocks in Java", "url": "https://www.youtube.com/watch?v=K9Rvor70Aiw", "provider": "Indian Programmer"}, {"type": "DOCUMENTATION", "title": "Using the this Keyword", "url": "https://docs.oracle.com/javase/tutorial/java/javaOO/thiskey.html", "provider": "Oracle Docs"}, {"type": "ONLINE_RESOURCE", "title": "The static Keyword in Java", "url": "https://www.baeldung.com/java-static", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000021'::uuid;

-- Access modifiers
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Access Modifiers: Public, Private, Default & Protected", "url": "https://www.youtube.com/watch?v=ZlUuQIw-a9U", "provider": "Engineering Digest"}, {"type": "YOUTUBE", "title": "Access modifier in java | access control in java | what is access modifiers in java | With examples", "url": "https://www.youtube.com/watch?v=VHJ8RneeO5U", "provider": "Neeraj sharma - Java Training | Metazone"}, {"type": "DOCUMENTATION", "title": "Controlling Access to Members of a Class", "url": "https://docs.oracle.com/javase/tutorial/java/javaOO/accesscontrol.html", "provider": "Oracle Docs"}, {"type": "ONLINE_RESOURCE", "title": "Access Modifiers in Java", "url": "https://www.baeldung.com/java-access-modifiers", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000022'::uuid;

-- Getters / setters
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Java Tutorial: Access modifiers, getters & setters in Java", "url": "https://www.youtube.com/watch?v=25zw-ljLLw0", "provider": "CodeWithHarry"}, {"type": "YOUTUBE", "title": "Learn Java getters and setters in 10 minutes! 🔐", "url": "https://www.youtube.com/watch?v=OjrR_C_UPjc", "provider": "Bro Code"}, {"type": "DOCUMENTATION", "title": "JavaBeans Properties", "url": "https://docs.oracle.com/javase/tutorial/javabeans/writing/properties.html", "provider": "Oracle Docs"}, {"type": "ONLINE_RESOURCE", "title": "Why Use Getters and Setters in Java", "url": "https://www.baeldung.com/java-why-getters-setters", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000023'::uuid;

-- Immutability
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Immutable classes In #java #coding #javaframework #programming", "url": "https://www.youtube.com/watch?v=zeMsNeyNJYc", "provider": "CodeSnippet by Chetan"}, {"type": "YOUTUBE", "title": "FS-030: Immutability, Defensive Copies, and Safe Object Design | Full Stack Java", "url": "https://www.youtube.com/watch?v=ngVVgbdftsk", "provider": "EDUCATA"}, {"type": "DOCUMENTATION", "title": "A Strategy for Defining Immutable Objects", "url": "https://docs.oracle.com/javase/tutorial/essential/concurrency/recipe.html", "provider": "Oracle Docs"}, {"type": "ONLINE_RESOURCE", "title": "How to Create an Immutable Class in Java", "url": "https://www.baeldung.com/java-immutable-object", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000024'::uuid;

-- extends
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Inheritance in Java Explained | Types, extends Keyword & Object Class | OOP Concepts", "url": "https://www.youtube.com/watch?v=OuYLjyonukg", "provider": "ShashCode"}, {"type": "YOUTUBE", "title": "Object Class in Java | Parent Class | Methods of Object Class | Java for Developers | #Java #Lec55", "url": "https://www.youtube.com/watch?v=lPZyYdT1r1g", "provider": "OSOPCoding"}, {"type": "DOCUMENTATION", "title": "Writing Subclasses", "url": "https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html", "provider": "Oracle Docs"}, {"type": "ONLINE_RESOURCE", "title": "Inheritance in Java", "url": "https://www.baeldung.com/java-inheritance", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000025'::uuid;

-- super
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "🚀 Constructor Calling Order in Java | Constructor Calling in Inheritance | Java OOPs", "url": "https://www.youtube.com/watch?v=6b41Z1KpRsI", "provider": "GABS CLASSES"}, {"type": "YOUTUBE", "title": "Constructors in Java | what is constructor? with syntax and example", "url": "https://www.youtube.com/watch?v=Y1lP07CFP0Y", "provider": "Learn Coding"}, {"type": "DOCUMENTATION", "title": "Using the Keyword super", "url": "https://docs.oracle.com/javase/tutorial/java/IandI/super.html", "provider": "Oracle Docs"}, {"type": "ONLINE_RESOURCE", "title": "The super Keyword in Java", "url": "https://www.baeldung.com/java-super", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000026'::uuid;

-- Overriding
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "#52 Method Overriding in Java", "url": "https://www.youtube.com/watch?v=CLzgS08equQ", "provider": "Telusko"}, {"type": "YOUTUBE", "title": "Overriding in Java | Overriding Rules", "url": "https://www.youtube.com/watch?v=WjTSxWVYlZ8", "provider": "Byte Programming"}, {"type": "DOCUMENTATION", "title": "Overriding and Hiding Methods", "url": "https://docs.oracle.com/javase/tutorial/java/IandI/override.html", "provider": "Oracle Docs"}, {"type": "ONLINE_RESOURCE", "title": "Overriding in Java", "url": "https://www.geeksforgeeks.org/overriding-in-java/", "provider": "GeeksforGeeks"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000027'::uuid;

-- Overload vs override
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Java Override vs Overload: Compile Time vs Runtime", "url": "https://www.youtube.com/watch?v=XUj1vfWf6Cs", "provider": "FiloSoft Company"}, {"type": "YOUTUBE", "title": "Java Polymorphism: Compile time vs. Run time. Method Overloading vs. Overriding #17", "url": "https://www.youtube.com/watch?v=W2pTtlNaa6s", "provider": "Smartherd"}, {"type": "DOCUMENTATION", "title": "Polymorphism", "url": "https://docs.oracle.com/javase/tutorial/java/IandI/polymorphism.html", "provider": "Oracle Docs"}, {"type": "ONLINE_RESOURCE", "title": "Overloading vs Overriding in Java", "url": "https://www.geeksforgeeks.org/difference-between-method-overloading-and-method-overriding-in-java/", "provider": "GeeksforGeeks"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000028'::uuid;

-- Upcasting
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "#59 Upcasting and Downcasting in Java", "url": "https://www.youtube.com/watch?v=Q8cTydJSawQ", "provider": "Telusko"}, {"type": "YOUTUBE", "title": "Upcasting and Downcasting in Java - Full Tutorial", "url": "https://www.youtube.com/watch?v=HpuH7n9VOYk", "provider": "Coding with John"}, {"type": "DOCUMENTATION", "title": "Hiding Member Variables and Casts", "url": "https://docs.oracle.com/javase/tutorial/java/IandI/hidevariables.html", "provider": "Oracle Docs"}, {"type": "ONLINE_RESOURCE", "title": "Upcasting vs Downcasting in Java", "url": "https://www.geeksforgeeks.org/upcasting-vs-downcasting-in-java/", "provider": "GeeksforGeeks"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000029'::uuid;

-- Dynamic dispatch
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Dynamic Method Dispatch in Java", "url": "https://www.youtube.com/watch?v=qbXNFOuD9k4", "provider": "CodeWithHarry"}, {"type": "YOUTUBE", "title": "#56 Dynamic Method Dispatch in Java", "url": "https://www.youtube.com/watch?v=8C_YRYXCuwc", "provider": "Telusko"}, {"type": "DOCUMENTATION", "title": "JLS - Dynamic Method Lookup", "url": "https://docs.oracle.com/javase/specs/jls/se21/html/jls-15.html", "provider": "Oracle Docs"}, {"type": "ONLINE_RESOURCE", "title": "Dynamic Method Dispatch in Java", "url": "https://www.geeksforgeeks.org/dynamic-method-dispatch-runtime-polymorphism-java/", "provider": "GeeksforGeeks"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000030'::uuid;

-- Abstract classes
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Java Tutorial: Abstract Class & Abstract Methods", "url": "https://www.youtube.com/watch?v=vqV22AszAdw", "provider": "CodeWithHarry"}, {"type": "YOUTUBE", "title": "Abstraction in Java | Abstract Class | Abstract Method", "url": "https://www.youtube.com/watch?v=W0Qv4UkCo6k", "provider": "Engineering Digest"}, {"type": "DOCUMENTATION", "title": "Abstract Methods and Classes", "url": "https://docs.oracle.com/javase/tutorial/java/IandI/abstract.html", "provider": "Oracle Docs"}, {"type": "ONLINE_RESOURCE", "title": "Abstract Classes in Java", "url": "https://www.baeldung.com/java-abstract-class", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000031'::uuid;

-- Interfaces
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Mastering Java Interfaces: Static & Default Methods, Multiple Inheritance Explained", "url": "https://www.youtube.com/watch?v=PpxzFint1IA", "provider": "Engineering Digest"}, {"type": "YOUTUBE", "title": "Java 8 Default Methods in Interface | Multiple Inheritance & Conflict Resolution", "url": "https://www.youtube.com/watch?v=ORmhR1VaH0c", "provider": "The Curious Coder"}, {"type": "DOCUMENTATION", "title": "Interfaces", "url": "https://docs.oracle.com/javase/tutorial/java/IandI/createinterface.html", "provider": "Oracle Docs"}, {"type": "ONLINE_RESOURCE", "title": "Interfaces in Java", "url": "https://www.baeldung.com/java-interfaces", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000032'::uuid;

-- Default methods
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "#7.6 Java Tutorial | Default method in Interface", "url": "https://www.youtube.com/watch?v=Swzy7cirX2U", "provider": "Telusko"}, {"type": "YOUTUBE", "title": "Default Methods In Interface JAVA 8 In Hindi", "url": "https://www.youtube.com/watch?v=b4paTLGsJjE", "provider": "Engineering Digest"}, {"type": "DOCUMENTATION", "title": "Default Methods", "url": "https://docs.oracle.com/javase/tutorial/java/IandI/defaultmethods.html", "provider": "Oracle Docs"}, {"type": "ONLINE_RESOURCE", "title": "Default Methods in Java Interfaces", "url": "https://www.geeksforgeeks.org/default-methods-java/", "provider": "GeeksforGeeks"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000033'::uuid;

-- try / catch / finally
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "#78 Try with Multiple Catch in Java", "url": "https://www.youtube.com/watch?v=Ky8P70QlKNU", "provider": "Telusko"}, {"type": "YOUTUBE", "title": "Master Exceptions in Java: Try, Catch, Finally, Throw, Throws, try-with-resources & Custom Exception", "url": "https://www.youtube.com/watch?v=IZu5rZTN7PI", "provider": "Engineering Digest"}, {"type": "DOCUMENTATION", "title": "Catching and Handling Exceptions", "url": "https://docs.oracle.com/javase/tutorial/essential/exceptions/handling.html", "provider": "Oracle Docs"}, {"type": "ONLINE_RESOURCE", "title": "Exception Handling in Java", "url": "https://www.baeldung.com/java-exceptions", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000034'::uuid;

-- Checked vs unchecked
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Checked vs. Unchecked Exceptions in Java Tutorial - What''s The Difference?", "url": "https://www.youtube.com/watch?v=bCPClyGsVhc", "provider": "Coding with John"}, {"type": "YOUTUBE", "title": "Java Exception Handling in One Shot | try-catch, finally & throw vs throws", "url": "https://www.youtube.com/watch?v=uSLSswpvlEU", "provider": "The Curious Coder"}, {"type": "DOCUMENTATION", "title": "Unchecked Exceptions - The Controversy", "url": "https://docs.oracle.com/javase/tutorial/essential/exceptions/runtime.html", "provider": "Oracle Docs"}, {"type": "ONLINE_RESOURCE", "title": "Checked vs Unchecked Exceptions in Java", "url": "https://www.baeldung.com/java-checked-unchecked-exceptions", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000035'::uuid;

-- Custom exceptions
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Java Custom Exceptions Tutorial - It''s Way Easier Than You Think", "url": "https://www.youtube.com/watch?v=OIozDnGYqIU", "provider": "Coding with John"}, {"type": "YOUTUBE", "title": "Custom Exception in Java | User Defined Exceptions | Exception vs RuntimeException", "url": "https://www.youtube.com/watch?v=PtS4fTPx1E0", "provider": "ShashCode"}, {"type": "DOCUMENTATION", "title": "Creating Exception Classes", "url": "https://docs.oracle.com/javase/tutorial/essential/exceptions/creating.html", "provider": "Oracle Docs"}, {"type": "ONLINE_RESOURCE", "title": "Creating a Custom Exception in Java", "url": "https://www.baeldung.com/java-new-custom-exception", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000036'::uuid;
