-- =============================================================================
-- Migration: V15__roadmap_resources_collections.sql
-- Resources for Category 3: Java Collections and Problem Solving (Nodes 037–045)
-- =============================================================================

-- List
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "ArrayList In Java + Notes | Java Placement Course", "url": "https://www.youtube.com/watch?v=liFyhzZl9uw", "provider": "Apna College"}, {"type": "YOUTUBE", "title": "Java List Interface Deep Dive | ArrayList, LinkedList, Vector, Stack | Java Full Course #32", "url": "https://www.youtube.com/watch?v=OfNtIOGDqzY", "provider": "Coder Army"}, {"type": "DOCUMENTATION", "title": "The List Interface", "url": "https://docs.oracle.com/javase/tutorial/collections/interfaces/list.html", "provider": "Oracle Docs"}, {"type": "ONLINE_RESOURCE", "title": "Java LinkedList Guide", "url": "https://www.w3schools.com/java/java_linkedlist.asp", "provider": "W3Schools"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000037'::uuid;

-- Set
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Java Set, HashSet and TreeSet (Java Unordered Collections) #10.2", "url": "https://www.youtube.com/watch?v=mI4eNh5iIpE", "provider": "Smartherd"}, {"type": "YOUTUBE", "title": "SET in Java | HashSet | LinkedHashSet | TreeSet (SortedSet Explained) | Beginners", "url": "https://www.youtube.com/watch?v=Qp_woAk8wkM", "provider": "RuchiCodes"}, {"type": "DOCUMENTATION", "title": "The Set Interface", "url": "https://docs.oracle.com/javase/tutorial/collections/interfaces/set.html", "provider": "Oracle Docs"}, {"type": "ONLINE_RESOURCE", "title": "HashSet vs TreeSet in Java", "url": "https://www.geeksforgeeks.org/hashset-vs-treeset-in-java/", "provider": "GeeksforGeeks"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000038'::uuid;

-- Map
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Java HashMap Explained! 🔥 The Only Tutorial You Need (Beginners to Advanced 2025)", "url": "https://www.youtube.com/watch?v=tNRLAEuKn1w", "provider": "Engineering Digest"}, {"type": "YOUTUBE", "title": "Java Collections Framework | Java Placement Course", "url": "https://www.youtube.com/watch?v=VphowcSkBX4", "provider": "Apna College"}, {"type": "DOCUMENTATION", "title": "The Map Interface", "url": "https://docs.oracle.com/javase/tutorial/collections/interfaces/map.html", "provider": "Oracle Docs"}, {"type": "ONLINE_RESOURCE", "title": "Java HashMap Guide", "url": "https://www.w3schools.com/java/java_hashmap.asp", "provider": "W3Schools"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000039'::uuid;

-- Hashing fundamentals
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "equals() vs hashCode() in Java | Internal Working & Real Use Cases", "url": "https://www.youtube.com/watch?v=nBL3AbUU2ZU", "provider": "The Curious Coder"}, {"type": "YOUTUBE", "title": "equals() and hashCode() in Java  Complete Guide with Coding Examples", "url": "https://www.youtube.com/watch?v=KSVJE9tDIJY", "provider": "Code for Tech Solutions"}, {"type": "DOCUMENTATION", "title": "Object hashCode() Specification", "url": "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Object.html", "provider": "Oracle Docs"}, {"type": "ONLINE_RESOURCE", "title": "Java equals() and hashCode() Contracts", "url": "https://www.baeldung.com/java-equals-hashcode-contracts", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000040'::uuid;

-- HashMap internal structure
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "How HashMap Works Internally?", "url": "https://www.youtube.com/watch?v=bAwNXRJwc84", "provider": "Bitwise"}, {"type": "YOUTUBE", "title": "How HashMap Works Internally in Java | Java Interview Question", "url": "https://www.youtube.com/watch?v=gYFdo9HciB8", "provider": "BackendToAI"}, {"type": "DOCUMENTATION", "title": "HashMap API Specification", "url": "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/HashMap.html", "provider": "Oracle Docs"}, {"type": "ONLINE_RESOURCE", "title": "Internal Working of HashMap in Java", "url": "https://www.geeksforgeeks.org/internal-working-of-hashmap-java/", "provider": "GeeksforGeeks"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000041'::uuid;

-- HashMap operations
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Hash Map Operations (put, get, remove in Java) | Data Structures for Interview Preparation", "url": "https://www.youtube.com/watch?v=1nCv087k1ng", "provider": "Live To Code"}, {"type": "YOUTUBE", "title": "Java HashMap Internals Explained | Collision, Buckets, Treeify, Resize (JDK 8+)", "url": "https://www.youtube.com/watch?v=k94ioAo_fkw", "provider": "Techie Book"}, {"type": "DOCUMENTATION", "title": "Map Interface Specification", "url": "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Map.html", "provider": "Oracle Docs"}, {"type": "ONLINE_RESOURCE", "title": "HashMap Load Factor and Capacity in Java", "url": "https://www.baeldung.com/java-hashmap-load-factor", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000042'::uuid;

-- Comparable / Comparator
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "#95 Comparator vs Comparable in Java", "url": "https://www.youtube.com/watch?v=ZA2oNhtNk3w", "provider": "Telusko"}, {"type": "YOUTUBE", "title": "Java Comparator Made EASY! 🔥 Learn Object Sorting Like a Pro", "url": "https://www.youtube.com/watch?v=XgF7XNLNf38", "provider": "Engineering Digest"}, {"type": "DOCUMENTATION", "title": "Object Ordering", "url": "https://docs.oracle.com/javase/tutorial/collections/interfaces/order.html", "provider": "Oracle Docs"}, {"type": "ONLINE_RESOURCE", "title": "Comparable and Comparator in Java", "url": "https://www.baeldung.com/java-comparator-comparable", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000043'::uuid;

-- Binary search
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "Binary Search in Java - Full Simple Coding Tutorial", "url": "https://www.youtube.com/watch?v=NFhOrxtXXcM", "provider": "Coding with John"}, {"type": "YOUTUBE", "title": "Java Binary Search Algorithm, Program with Recursion Tutorial", "url": "https://www.youtube.com/watch?v=8y_rX89Yzf4", "provider": "José Vidal (José M Vidal)"}, {"type": "DOCUMENTATION", "title": "Collections binarySearch Specification", "url": "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Collections.html", "provider": "Oracle Docs"}, {"type": "ONLINE_RESOURCE", "title": "Binary Search in Java", "url": "https://www.baeldung.com/java-binary-search", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000044'::uuid;

-- Complexity
UPDATE roadmap_nodes
   SET resources = '[{"type": "YOUTUBE", "title": "L-3.1: How Quick Sort Works | Performance of Quick Sort with Example | Divide and Conquer", "url": "https://www.youtube.com/watch?v=tWCaFVJMUi8", "provider": "Gate Smashers"}, {"type": "YOUTUBE", "title": "Quick Sort Algorithm - Lecture 51 of Complete DSA Placement Series", "url": "https://www.youtube.com/watch?v=8MNB0Mba_Dc", "provider": "Shradha Khapra"}, {"type": "DOCUMENTATION", "title": "Java Collections Framework Overview", "url": "https://docs.oracle.com/javase/tutorial/collections/intro/index.html", "provider": "Oracle Docs"}, {"type": "ONLINE_RESOURCE", "title": "Time Complexity of Java Collections", "url": "https://www.baeldung.com/java-collections-complexity", "provider": "Baeldung"}]'::jsonb,
       updated_at = NOW()
 WHERE id = '70000000-0000-0000-0000-000000000045'::uuid;
