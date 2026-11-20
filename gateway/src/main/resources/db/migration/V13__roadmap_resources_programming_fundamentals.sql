-- =============================================================================
-- Migration: V13__roadmap_resources_programming_fundamentals.sql
-- Resources for Category 1: Programming Fundamentals (Java) (Nodes 001–018)
-- =============================================================================

-- Primitives
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Java Data Types Explained for Beginners | Java Tutorial Day 6 | 30 Days Java Challenge", "url": "https://www.youtube.com/watch?v=zcOwnf8y8c0", "provider": "DebuggingwithAmina"}, {"type": "YOUTUBE", "title": "Java Programming: Lesson 26 - Integer, Double, Boolean, and Character", "url": "https://www.youtube.com/watch?v=iK7qDgRC9BA", "provider": "youmils03"}, {"type": "DOCUMENTATION", "title": "Java Primitive Data Types", "url": "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html", "provider": "Oracle Docs"}, {"type": "ONLINE_RESOURCE", "title": "Java Primitives Guide", "url": "https://www.baeldung.com/java-primitives", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000001'::uuid;

-- Reference types
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "#26 Stack And Heap in Java", "url": "https://www.youtube.com/watch?v=_GK3WoFFKUE", "provider": "Telusko"}, {"type": "YOUTUBE", "title": "Stack vs Heap Memory - Simple Explanation", "url": "https://www.youtube.com/watch?v=5OJRqkYbK-4", "provider": "Alex Hyett"}, {"type": "DOCUMENTATION", "title": "What Is an Object?", "url": "https://docs.oracle.com/javase/tutorial/java/concepts/object.html", "provider": "Oracle Docs"}, {"type": "ONLINE_RESOURCE", "title": "Stack Memory and Heap Space in Java", "url": "https://www.baeldung.com/java-stack-heap", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000002'::uuid;

-- Type casting
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "#60 Wrapper Class in Java", "url": "https://www.youtube.com/watch?v=Fyc86kVIePE", "provider": "Telusko"}, {"type": "YOUTUBE", "title": "Mastering Wrapper Classes in Java: Autoboxing, Autounboxing, Methods Explained", "url": "https://www.youtube.com/watch?v=suBZpy8Z2VY", "provider": "Engineering Digest"}, {"type": "DOCUMENTATION", "title": "Autoboxing and Unboxing", "url": "https://docs.oracle.com/javase/tutorial/java/data/autoboxing.html", "provider": "Oracle Docs"}, {"type": "ONLINE_RESOURCE", "title": "Type Casting in Java", "url": "https://www.baeldung.com/java-type-casting", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000003'::uuid;

-- Arithmetic and logic
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Java Tutorial: Relational and Logical Operators in Java", "url": "https://www.youtube.com/watch?v=Y-c8gQV2Tuw", "provider": "CodeWithHarry"}, {"type": "YOUTUBE", "title": "Operators & Binary Number System | Java Lecture 14", "url": "https://www.youtube.com/watch?v=Oud4alVQU4s", "provider": "Apna College"}, {"type": "DOCUMENTATION", "title": "Equality, Relational, and Conditional Operators", "url": "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/op2.html", "provider": "Oracle Docs"}, {"type": "ONLINE_RESOURCE", "title": "Operators in Java", "url": "https://www.geeksforgeeks.org/operators-in-java/", "provider": "GeeksforGeeks"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000004'::uuid;

-- Precedence
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Increment and Decrement Operators in Java | MCA | BTECH | BCA | BSC | ICSE CLASS 9 AND 10", "url": "https://www.youtube.com/watch?v=yPpclaO3ecY", "provider": "E- Gurukul"}, {"type": "YOUTUBE", "title": "Operator Precedence In Java With Example | Java Tutorial for beginners", "url": "https://www.youtube.com/watch?v=QTPYmCqd1vM", "provider": "TAP ACADEMY"}, {"type": "DOCUMENTATION", "title": "Summary of Operators", "url": "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/opsummary.html", "provider": "Oracle Docs"}, {"type": "ONLINE_RESOURCE", "title": "Operator Precedence and Associativity in Java", "url": "https://www.geeksforgeeks.org/operator-precedence-and-associativity-in-java/", "provider": "GeeksforGeeks"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000005'::uuid;

-- Ternary
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "🔥 Java Ternary Operator & Assignment Operators Explained | Nested Ternary & Shorthand Operators", "url": "https://www.youtube.com/watch?v=fT501aQsQew", "provider": "Coding with Sudhir"}, {"type": "YOUTUBE", "title": "#14 Ternary Operator in Java", "url": "https://www.youtube.com/watch?v=kBdZBbWZ2a4", "provider": "Telusko"}, {"type": "DOCUMENTATION", "title": "Assignment, Arithmetic, and Unary Operators", "url": "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/op1.html", "provider": "Oracle Docs"}, {"type": "ONLINE_RESOURCE", "title": "Java Ternary Operator", "url": "https://www.baeldung.com/java-ternary-operator", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000006'::uuid;

-- if / else
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Conditional Statements | If-else, Switch Break | Complete Java Placement Course | Lecture 3", "url": "https://www.youtube.com/watch?v=I5srDu75h_M", "provider": "Apna College"}, {"type": "YOUTUBE", "title": "Java Conditionals: If-else Statement in Java", "url": "https://www.youtube.com/watch?v=YPK6NYMJt_A", "provider": "CodeWithHarry"}, {"type": "DOCUMENTATION", "title": "The if-then and if-then-else Statements", "url": "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/if.html", "provider": "Oracle Docs"}, {"type": "ONLINE_RESOURCE", "title": "Java if-else Statement", "url": "https://www.geeksforgeeks.org/java-if-else-statement-with-examples/", "provider": "GeeksforGeeks"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000007'::uuid;

-- switch
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "What''s new in Java Switch | Switch Statement and Expression", "url": "https://www.youtube.com/watch?v=AZb1wLIQ1R4", "provider": "Telusko"}, {"type": "YOUTUBE", "title": "Java Switch Case Fall Through Explained", "url": "https://www.youtube.com/watch?v=Pbl0jI8clg4", "provider": "SkillUni By Abbas"}, {"type": "DOCUMENTATION", "title": "The switch Statement", "url": "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/switch.html", "provider": "Oracle Docs"}, {"type": "ONLINE_RESOURCE", "title": "Guide to the Java Switch Statement", "url": "https://www.baeldung.com/java-switch", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000008'::uuid;

-- Nested logic
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Guard Clauses Explained: The 3-Level Rule That Fixes Nested If-Else 🛡️ #shorts #youtubeshorts", "url": "https://www.youtube.com/watch?v=XUqaQ5J5RPc", "provider": "VashistX"}, {"type": "YOUTUBE", "title": "Nested if-else Statements in Java", "url": "https://www.youtube.com/watch?v=6sYZDA8JPhk", "provider": "Neso Academy"}, {"type": "DOCUMENTATION", "title": "JLS - The if Statement", "url": "https://docs.oracle.com/javase/specs/jls/se21/html/jls-14.html", "provider": "Oracle Docs"}, {"type": "ONLINE_RESOURCE", "title": "Replace Nested Conditional with Guard Clauses", "url": "https://refactoring.guru/replace-nested-conditional-with-guard-clauses", "provider": "Refactoring Guru"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000009'::uuid;

-- for / while
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Loops in Java | Java Placement Full Course | Lecture 4", "url": "https://www.youtube.com/watch?v=0r1SfRoLuzU", "provider": "Apna College"}, {"type": "YOUTUBE", "title": "Java For Beginners: While, Do While & For Loops (7/10)", "url": "https://www.youtube.com/watch?v=6djggrlkHY8", "provider": "Codecourse"}, {"type": "DOCUMENTATION", "title": "The for Statement", "url": "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/for.html", "provider": "Oracle Docs"}, {"type": "ONLINE_RESOURCE", "title": "Loops in Java", "url": "https://www.geeksforgeeks.org/loops-in-java/", "provider": "GeeksforGeeks"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000010'::uuid;

-- break / continue
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Learn BREAK & CONTINUE in 2 minutes! 🚦", "url": "https://www.youtube.com/watch?v=iGo1Syv4YuM", "provider": "Bro Code"}, {"type": "YOUTUBE", "title": "Java break vs continue: Control Your Loops", "url": "https://www.youtube.com/watch?v=O9ImWnkk1WA", "provider": "BrewByte"}, {"type": "DOCUMENTATION", "title": "Branching Statements", "url": "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/branch.html", "provider": "Oracle Docs"}, {"type": "ONLINE_RESOURCE", "title": "Break Statement in Java", "url": "https://www.geeksforgeeks.org/break-statement-in-java/", "provider": "GeeksforGeeks"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000011'::uuid;

-- Nested loops
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Master Java Nested Loops 😱 | ALL Pattern Problems Explained | Logic Building for Beginners", "url": "https://www.youtube.com/watch?v=pfvm1lUX4Tk", "provider": "Info Techiezz"}, {"type": "YOUTUBE", "title": "Learn Java nested loops in 8 minutes! ➿", "url": "https://www.youtube.com/watch?v=sd4x2QG2K6U", "provider": "Bro Code"}, {"type": "DOCUMENTATION", "title": "The while and do-while Statements", "url": "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/while.html", "provider": "Oracle Docs"}, {"type": "ONLINE_RESOURCE", "title": "Java Nested Loops", "url": "https://www.programiz.com/java-programming/nested-loop", "provider": "Programiz"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000012'::uuid;

-- Parameters
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "#5.3 Java Tutorial | Varargs", "url": "https://www.youtube.com/watch?v=9EzGgz5th_s", "provider": "Telusko"}, {"type": "YOUTUBE", "title": "Learn VARARGS in 6 minutes! 💬", "url": "https://www.youtube.com/watch?v=2knxgAFqwKk", "provider": "Bro Code"}, {"type": "DOCUMENTATION", "title": "Passing Information to a Method or a Constructor", "url": "https://docs.oracle.com/javase/tutorial/java/javaOO/arguments.html", "provider": "Oracle Docs"}, {"type": "ONLINE_RESOURCE", "title": "Varargs in Java", "url": "https://www.baeldung.com/java-varargs", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000013'::uuid;

-- Return values
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "The void Return Type in Java", "url": "https://www.youtube.com/watch?v=14Cfx3fpH-w", "provider": "Neso Academy"}, {"type": "YOUTUBE", "title": "Void vs Return Type in Java: Stop Getting Confused! 🤯 [2026]", "url": "https://www.youtube.com/watch?v=hHhbTMBnmS8", "provider": "Code Less by Deepanshu Bisht"}, {"type": "DOCUMENTATION", "title": "Returning a Value from a Method", "url": "https://docs.oracle.com/javase/tutorial/java/javaOO/returnvalue.html", "provider": "Oracle Docs"}, {"type": "ONLINE_RESOURCE", "title": "Return Keyword in Java", "url": "https://www.geeksforgeeks.org/return-keyword-java/", "provider": "GeeksforGeeks"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000014'::uuid;

-- Overloading
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "#25 Method Overloading in Java", "url": "https://www.youtube.com/watch?v=KpwBVAYbPDA", "provider": "Telusko"}, {"type": "YOUTUBE", "title": "Method Overloading in Java | Learn Coding", "url": "https://www.youtube.com/watch?v=V7SB1JFekgc", "provider": "Learn Coding"}, {"type": "DOCUMENTATION", "title": "Defining Methods", "url": "https://docs.oracle.com/javase/tutorial/java/javaOO/methods.html", "provider": "Oracle Docs"}, {"type": "ONLINE_RESOURCE", "title": "Method Overloading in Java", "url": "https://www.geeksforgeeks.org/overloading-in-java/", "provider": "GeeksforGeeks"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000015'::uuid;

-- Arrays
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "2D Arrays | Java Complete Placement Course | Lecture 11", "url": "https://www.youtube.com/watch?v=18Zt5I4S45o", "provider": "Apna College"}, {"type": "YOUTUBE", "title": "Learn Java arrays in 9 minutes! 🍎", "url": "https://www.youtube.com/watch?v=9dr2mHYYoug", "provider": "Bro Code"}, {"type": "DOCUMENTATION", "title": "Arrays", "url": "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/arrays.html", "provider": "Oracle Docs"}, {"type": "ONLINE_RESOURCE", "title": "Guide to Java Arrays", "url": "https://www.baeldung.com/java-arrays-guide", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000016'::uuid;

-- String methods
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "#35 Mutable vs Immutable String in Java", "url": "https://www.youtube.com/watch?v=JjIewPuyexA", "provider": "Telusko"}, {"type": "YOUTUBE", "title": "Java Tutorial: String Methods in Java", "url": "https://www.youtube.com/watch?v=1SJK4Y4axXs", "provider": "CodeWithHarry"}, {"type": "DOCUMENTATION", "title": "Strings", "url": "https://docs.oracle.com/javase/tutorial/java/data/strings.html", "provider": "Oracle Docs"}, {"type": "ONLINE_RESOURCE", "title": "Guide to the Java String Pool", "url": "https://www.baeldung.com/java-string-pool", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000017'::uuid;

-- StringBuilder
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "String Builder | Java Placement Course Lecture 13", "url": "https://www.youtube.com/watch?v=ZLDwskEhIFg", "provider": "Apna College"}, {"type": "YOUTUBE", "title": "Java StringBuilder: Adding Strings with append(String str) Method | Java Tutorial", "url": "https://www.youtube.com/watch?v=RFeT4FNxU_w", "provider": "Ram N Java"}, {"type": "DOCUMENTATION", "title": "The StringBuilder Class", "url": "https://docs.oracle.com/javase/tutorial/java/data/buffers.html", "provider": "Oracle Docs"}, {"type": "ONLINE_RESOURCE", "title": "StringBuilder vs StringBuffer", "url": "https://www.baeldung.com/java-string-builder-string-buffer", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000018'::uuid;
