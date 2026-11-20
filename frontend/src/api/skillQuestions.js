import { API_BASE_URL } from "./config";
import { getAuthToken } from "./auth";

// Cache to prevent duplicate API requests when re-clicking the same skill
const questionsCache = new Map();

/**
 * Curated question bank for all 33 curriculum skills.
 * Each skill has exactly 5 realistic multiple-choice questions.
 */
const SKILL_QUESTION_BANK = {
  // 1. Programming Fundamentals (Java)
  "variables-data-types": [
    {
      id: "q-vdt-1",
      text: "Which Java primitive data type is 64-bit and used for storing whole numbers?",
      options: { A: "int", B: "long", C: "short", D: "byte" },
      difficulty: "BEGINNER",
    },
    {
      id: "q-vdt-2",
      text: "What happens when a double value is assigned directly to an int variable without explicit casting?",
      options: {
        A: "It compiles and truncates the decimal part",
        B: "It results in a compile-time error (possible loss of precision)",
        C: "It rounds the double to the nearest integer",
        D: "It throws a runtime ClassCastException",
      },
      difficulty: "BEGINNER",
    },
    {
      id: "q-vdt-3",
      text: "What is the default value of an uninitialized boolean instance variable in a Java class?",
      options: { A: "true", B: "false", C: "null", D: "0" },
      difficulty: "BEGINNER",
    },
    {
      id: "q-vdt-4",
      text: "Which of the following is stored on the stack rather than the heap in Java?",
      options: {
        A: "A newly created String object",
        B: "An array of integers",
        C: "A primitive local variable inside a method",
        D: "An instance of an ArrayList",
      },
      difficulty: "INTERMEDIATE",
    },
    {
      id: "q-vdt-5",
      text: "What is the output of the following cast: `byte b = (byte) 130;` in Java?",
      options: { A: "130", B: "-126", C: "-128", D: "Compile error" },
      difficulty: "INTERMEDIATE",
    },
  ],

  "operators-expressions": [
    {
      id: "q-oe-1",
      text: "Which operator is used in Java to compute the remainder of integer division?",
      options: { A: "/", B: "%", C: "mod", D: "//" },
      difficulty: "BEGINNER",
    },
    {
      id: "q-oe-2",
      text: "What is the output of `int x = 5; System.out.println(x++ + ++x);`?",
      options: { A: "10", B: "11", C: "12", D: "13" },
      difficulty: "INTERMEDIATE",
    },
    {
      id: "q-oe-3",
      text: "What is the difference between `&` and `&&` logical operators in Java?",
      options: {
        A: "No difference",
        B: "`&&` is short-circuit, evaluating the right operand only if necessary",
        C: "`&` is only for floating point numbers",
        D: "`&&` is a bitwise operator",
      },
      difficulty: "BEGINNER",
    },
    {
      id: "q-oe-4",
      text: "What will `int a = 10, b = 5; boolean r = a > 5 && b++ > 5; System.out.println(r + \" \" + b);` print?",
      options: { A: "true 5", B: "false 6", C: "false 5", D: "true 6" },
      difficulty: "INTERMEDIATE",
    },
    {
      id: "q-oe-5",
      text: "What is the result of evaluating `10 + 20 * 3` according to Java operator precedence?",
      options: { A: "90", B: "70", C: "60", D: "30" },
      difficulty: "BEGINNER",
    },
  ],

  "conditional-statements": [
    {
      id: "q-cs-1",
      text: "Which Java statement is used to execute one block of code among many alternative conditions?",
      options: { A: "switch or if-else if", B: "for loop", C: "while loop", D: "try-catch" },
      difficulty: "BEGINNER",
    },
    {
      id: "q-cs-2",
      text: "What happens if a switch case block does not end with a `break` statement in classic Java switch?",
      options: {
        A: "Compilation fails",
        B: "Execution falls through to the next case block",
        C: "A runtime exception is thrown",
        D: "The switch exits immediately",
      },
      difficulty: "BEGINNER",
    },
    {
      id: "q-cs-3",
      text: "Which of the following data types CANNOT be used as an expression in a Java switch statement?",
      options: { A: "int", B: "String", C: "double", D: "enum" },
      difficulty: "INTERMEDIATE",
    },
    {
      id: "q-cs-4",
      text: "What is a major advantage of modern Java switch expressions (`case ->`) introduced in Java 14?",
      options: {
        A: "They eliminate fall-through and can return a value",
        B: "They only work with numbers",
        C: "They run asynchronously",
        D: "They replace all loops",
      },
      difficulty: "INTERMEDIATE",
    },
    {
      id: "q-cs-5",
      text: "What will `int x = 4; String res = (x % 2 == 0) ? \"Even\" : \"Odd\";` assign to `res`?",
      options: { A: "\"Even\"", B: "\"Odd\"", C: "null", D: "0" },
      difficulty: "BEGINNER",
    },
  ],

  "loops": [
    {
      id: "q-lp-1",
      text: "Which loop guarantees that its body is executed at least once before checking the condition?",
      options: { A: "for loop", B: "while loop", C: "do-while loop", D: "enhanced for loop" },
      difficulty: "BEGINNER",
    },
    {
      id: "q-lp-2",
      text: "How many times does the loop `for (int i = 1; i <= 5; i += 2)` execute its body?",
      options: { A: "2", B: "3", C: "4", D: "5" },
      difficulty: "BEGINNER",
    },
    {
      id: "q-lp-3",
      text: "What does the `continue` statement do inside a loop body?",
      options: {
        A: "Terminates the loop immediately",
        B: "Skips the remainder of the current iteration and begins the next",
        C: "Restarts the loop from the beginning counter",
        D: "Throws an exception",
      },
      difficulty: "BEGINNER",
    },
    {
      id: "q-lp-4",
      text: "What happens when using the enhanced for-each loop to modify the collection's structure during iteration?",
      options: {
        A: "It executes smoothly",
        B: "It throws a ConcurrentModificationException",
        C: "It automatically creates a deep copy",
        D: "It causes an infinite loop",
      },
      difficulty: "INTERMEDIATE",
    },
    {
      id: "q-lp-5",
      text: "What is printed by: `for (int i = 1; i <= 2; i++) { for (int j = 1; j <= i; j++) { System.out.print(i); } }`?",
      options: { A: "122", B: "112", C: "12", D: "1122" },
      difficulty: "INTERMEDIATE",
    },
  ],

  "methods-functions": [
    {
      id: "q-mf-1",
      text: "How are arguments passed into methods in Java?",
      options: {
        A: "Strictly pass-by-value (copies of primitive values and object references)",
        B: "Pass-by-reference for all objects",
        C: "Pass-by-name",
        D: "Pass-by-reference for arrays only",
      },
      difficulty: "INTERMEDIATE",
    },
    {
      id: "q-mf-2",
      text: "Which condition is required for valid method overloading in Java?",
      options: {
        A: "Different return type only",
        B: "Different parameter count, types, or order",
        C: "Different access modifiers only",
        D: "Different exception throws only",
      },
      difficulty: "BEGINNER",
    },
    {
      id: "q-mf-3",
      text: "Which keyword specifies that a method does not return any value?",
      options: { A: "empty", B: "null", C: "void", D: "static" },
      difficulty: "BEGINNER",
    },
    {
      id: "q-mf-4",
      text: "What error occurs if a recursive method has no base case or fails to reach it?",
      options: {
        A: "OutOfMemoryError",
        B: "StackOverflowError",
        C: "NullPointerException",
        D: "ArithmeticException",
      },
      difficulty: "INTERMEDIATE",
    },
    {
      id: "q-mf-5",
      text: "What is the purpose of the varargs syntax (`Type... name`) in a Java method signature?",
      options: {
        A: "To accept a variable number of arguments of that type as an array",
        B: "To define generic type parameters",
        C: "To allow multiple return types",
        D: "To execute the method in parallel",
      },
      difficulty: "INTERMEDIATE",
    },
  ],

  "arrays-strings": [
    {
      id: "q-as-1",
      text: "What is the index of the first element in a Java array?",
      options: { A: "0", B: "1", C: "-1", D: "Depends on initialization" },
      difficulty: "BEGINNER",
    },
    {
      id: "q-as-2",
      text: "Why are String objects considered immutable in Java?",
      options: {
        A: "Their contents cannot be changed once created in memory",
        B: "They cannot be concatenated",
        C: "They are stored only on the stack",
        D: "They can only hold 256 characters",
      },
      difficulty: "BEGINNER",
    },
    {
      id: "q-as-3",
      text: "What does the code `String s = \"Java\"; s.concat(\" SE\"); System.out.println(s);` print?",
      options: { A: "\"Java SE\"", B: "\"Java\"", C: "\"SE\"", D: "Compilation error" },
      difficulty: "INTERMEDIATE",
    },
    {
      id: "q-as-4",
      text: "When performing frequent string modifications in a loop, which class is recommended for best performance?",
      options: { A: "String", B: "StringBuilder", C: "CharacterArray", D: "StringTokenizer" },
      difficulty: "BEGINNER",
    },
    {
      id: "q-as-5",
      text: "How do you check if two Strings have the same content rather than memory address in Java?",
      options: { A: "`str1 == str2`", B: "`str1.equals(str2)`", C: "`str1.compare(str2)`", D: "`str1 === str2`" },
      difficulty: "BEGINNER",
    },
  ],

  // 2. Object-Oriented Programming and Java
  "classes-objects": [
    {
      id: "q-co-1",
      text: "What is an object in Java OOP terminology?",
      options: {
        A: "A blueprint or template",
        B: "An instance of a class occupying memory",
        C: "A function pointer",
        D: "A database table",
      },
      difficulty: "BEGINNER",
    },
    {
      id: "q-co-2",
      text: "Which keyword is used to allocate memory and instantiate an object in Java?",
      options: { A: "class", B: "create", C: "new", D: "instance" },
      difficulty: "BEGINNER",
    },
    {
      id: "q-co-3",
      text: "What is the purpose of the `this` keyword in Java?",
      options: {
        A: "Refers to the current class instance",
        B: "Refers to the parent superclass",
        C: "Destroys the current object",
        D: "Allocates global static memory",
      },
      difficulty: "BEGINNER",
    },
    {
      id: "q-co-4",
      text: "If no constructor is defined in a class, what does Java provide automatically?",
      options: {
        A: "No constructor, causing an error",
        B: "A default no-argument constructor",
        C: "A parameterized constructor with null values",
        D: "A static factory method",
      },
      difficulty: "BEGINNER",
    },
    {
      id: "q-co-5",
      text: "What is shared among all instances of a class rather than duplicated per object?",
      options: { A: "Instance fields", B: "Static members", C: "Local variables", D: "Constructors" },
      difficulty: "INTERMEDIATE",
    },
  ],

  "encapsulation": [
    {
      id: "q-enc-1",
      text: "What is the primary principle of encapsulation in object-oriented programming?",
      options: {
        A: "Hiding internal state and requiring interaction through public methods",
        B: "Reusing code through class inheritance",
        C: "Executing multiple methods concurrently",
        D: "Creating subclasses for every data type",
      },
      difficulty: "BEGINNER",
    },
    {
      id: "q-enc-2",
      text: "Which access modifier ensures a field is accessible only within its declaring class?",
      options: { A: "public", B: "protected", C: "private", D: "default (package-private)" },
      difficulty: "BEGINNER",
    },
    {
      id: "q-enc-3",
      text: "Why are getter and setter methods preferred over public fields?",
      options: {
        A: "They allow validation, read-only control, and internal logic encapsulation",
        B: "They make the code run faster",
        C: "They eliminate the need for constructors",
        D: "They are required by the Java compiler",
      },
      difficulty: "BEGINNER",
    },
    {
      id: "q-enc-4",
      text: "How can you create a completely immutable class in Java?",
      options: {
        A: "Declare the class final, make all fields private and final, and provide no mutators",
        B: "Make all methods static",
        C: "Inherit from java.lang.Object",
        D: "Use the transient keyword on fields",
      },
      difficulty: "INTERMEDIATE",
    },
    {
      id: "q-enc-5",
      text: "What is a 'defensive copy' in encapsulation?",
      options: {
        A: "Copying mutable objects in getters/constructors to prevent external modification",
        B: "Creating a backup of source code before compilation",
        C: "Catching exceptions inside setters",
        D: "Cloning the Java Virtual Machine",
      },
      difficulty: "ADVANCED",
    },
  ],

  "inheritance": [
    {
      id: "q-inh-1",
      text: "Which keyword is used by a class to inherit from a superclass in Java?",
      options: { A: "implements", B: "extends", B: "inherits", D: "super" },
      difficulty: "BEGINNER",
    },
    {
      id: "q-inh-2",
      text: "Does Java support multiple inheritance of classes (e.g. `class C extends A, B`)?",
      options: {
        A: "Yes, fully supported",
        B: "No, Java classes can only extend a single superclass",
        C: "Yes, using the `multi` keyword",
        D: "Only for abstract classes",
      },
      difficulty: "BEGINNER",
    },
    {
      id: "q-inh-3",
      text: "What is the purpose of the `super` keyword in a Java subclass?",
      options: {
        A: "To call the superclass constructor or superclass methods",
        B: "To prevent inheritance of that method",
        C: "To declare global access",
        D: "To create an abstract method",
      },
      difficulty: "BEGINNER",
    },
    {
      id: "q-inh-4",
      text: "What is the universal root superclass for every class in Java?",
      options: { A: "java.lang.System", B: "java.lang.Object", C: "java.lang.Class", D: "java.lang.Root" },
      difficulty: "BEGINNER",
    },
    {
      id: "q-inh-5",
      text: "Can a subclass override a method that is declared as `final` in its superclass?",
      options: {
        A: "Yes, with the `@Override` annotation",
        B: "No, `final` methods cannot be overridden",
        C: "Only if the subclass is public",
        D: "Yes, if the return type is changed",
      },
      difficulty: "INTERMEDIATE",
    },
  ],

  "polymorphism": [
    {
      id: "q-poly-1",
      text: "What is runtime polymorphism (dynamic method dispatch) in Java?",
      options: {
        A: "Resolution of an overridden method call at runtime based on the actual object type",
        B: "Overloading methods with different parameter counts",
        C: "Executing code on multiple threads",
        D: "Casting primitives to wrappers",
      },
      difficulty: "INTERMEDIATE",
    },
    {
      id: "q-poly-2",
      text: "Which of the following demonstrates compile-time polymorphism in Java?",
      options: {
        A: "Method overloading",
        B: "Method overriding",
        C: "Interface implementation",
        D: "Dynamic class loading",
      },
      difficulty: "BEGINNER",
    },
    {
      id: "q-poly-3",
      text: "Given `Parent p = new Child();`, what does `p.display()` execute if `Child` overrides `display()`?",
      options: {
        A: "`Child`'s display method",
        B: "`Parent`'s display method",
        C: "Both methods sequentially",
        D: "Throws a NoSuchMethodError",
      },
      difficulty: "INTERMEDIATE",
    },
    {
      id: "q-poly-4",
      text: "Which operator is used to test whether an object reference is an instance of a specific class or interface?",
      options: { A: "typeof", B: "instanceof", C: "is", D: "as" },
      difficulty: "BEGINNER",
    },
    {
      id: "q-poly-5",
      text: "What is downcasting in Java and what exception can it produce if invalid?",
      options: {
        A: "Casting a parent reference to a child type; throws ClassCastException if incompatible",
        B: "Casting float to double; throws ArithmeticException",
        C: "Casting an object to string; throws NullPointerException",
        D: "Casting a class to an interface; throws IllegalStateException",
      },
      difficulty: "INTERMEDIATE",
    },
  ],

  "abstraction-interfaces": [
    {
      id: "q-abs-1",
      text: "Which keyword is used to declare a contract of methods that classes must implement?",
      options: { A: "interface", B: "abstract", C: "contract", D: "blueprint" },
      difficulty: "BEGINNER",
    },
    {
      id: "q-abs-2",
      text: "Can an abstract class in Java be directly instantiated using `new MyAbstractClass()`?",
      options: {
        A: "Yes, always",
        B: "No, abstract classes cannot be directly instantiated",
        C: "Only if it has no abstract methods",
        D: "Yes, if marked public",
      },
      difficulty: "BEGINNER",
    },
    {
      id: "q-abs-3",
      text: "Since Java 8, which keyword allows providing concrete method bodies inside an interface?",
      options: { A: "concrete", B: "default", C: "virtual", D: "inline" },
      difficulty: "INTERMEDIATE",
    },
    {
      id: "q-abs-4",
      text: "How many interfaces can a single Java class implement?",
      options: { A: "Only 1", B: "Up to 5", C: "Any number of interfaces", D: "Zero" },
      difficulty: "BEGINNER",
    },
    {
      id: "q-abs-5",
      text: "What is a Functional Interface in Java?",
      options: {
        A: "An interface with exactly one abstract method (e.g. Runnable, Predicate)",
        B: "An interface containing only static methods",
        C: "An interface that inherits from another interface",
        D: "An interface that cannot have default methods",
      },
      difficulty: "INTERMEDIATE",
    },
  ],

  "exception-handling": [
    {
      id: "q-eh-1",
      text: "Which block in a try-catch-finally statement always executes regardless of whether an exception occurred?",
      options: { A: "try", B: "catch", C: "finally", D: "throw" },
      difficulty: "BEGINNER",
    },
    {
      id: "q-eh-2",
      text: "What is the key difference between checked and unchecked exceptions in Java?",
      options: {
        A: "Checked exceptions are verified at compile-time and must be caught or declared with throws",
        B: "Unchecked exceptions crash the OS directly",
        C: "Checked exceptions inherit directly from Error",
        D: "Unchecked exceptions cannot be caught in a catch block",
      },
      difficulty: "INTERMEDIATE",
    },
    {
      id: "q-eh-3",
      text: "Which class is the superclass of all exceptions in the Java language?",
      options: { A: "java.lang.Throwable", B: "java.lang.Error", C: "java.lang.RuntimeException", D: "java.lang.Problem" },
      difficulty: "INTERMEDIATE",
    },
    {
      id: "q-eh-4",
      text: "What is the main benefit of the try-with-resources statement introduced in Java 7?",
      options: {
        A: "Automatically closes resources that implement AutoCloseable",
        B: "Increases CPU allocation for file I/O",
        C: "Disables all checked exceptions",
        D: "Runs catch blocks in parallel",
      },
      difficulty: "INTERMEDIATE",
    },
    {
      id: "q-eh-5",
      text: "What is the difference between `throw` and `throws` keywords in Java?",
      options: {
        A: "`throw` is used to explicitly raise an exception; `throws` declares exceptions in method signatures",
        B: "`throws` raises an exception; `throw` handles it",
        C: "They are interchangeable synonyms",
        D: "`throw` is for checked exceptions only",
      },
      difficulty: "BEGINNER",
    },
  ],

  // 3. Java Collections and Problem Solving
  "list-set-map": [
    {
      id: "q-lsm-1",
      text: "Which Java Collection interface allows duplicate elements and maintains their insertion order?",
      options: { A: "Set", B: "List", C: "Map", D: "Queue" },
      difficulty: "BEGINNER",
    },
    {
      id: "q-lsm-2",
      text: "Which collection implementation guarantees unique elements with O(1) average lookup time?",
      options: { A: "ArrayList", B: "HashSet", C: "LinkedList", D: "TreeSet" },
      difficulty: "BEGINNER",
    },
    {
      id: "q-lsm-3",
      text: "What key advantage does LinkedList have over ArrayList in Java?",
      options: {
        A: "Faster constant-time O(1) insertions/deletions at the head/tail once located",
        B: "Faster random access by index",
        C: "Less memory consumption per element",
        D: "Thread safety by default",
      },
      difficulty: "INTERMEDIATE",
    },
    {
      id: "q-lsm-4",
      text: "How does a Map store elements in Java?",
      options: {
        A: "As single unique values",
        B: "As key-value pairs where keys must be unique",
        C: "As a sorted linked list",
        D: "As binary search trees only",
      },
      difficulty: "BEGINNER",
    },
    {
      id: "q-lsm-5",
      text: "Which Map implementation keeps its keys sorted according to natural ordering or a Comparator?",
      options: { A: "HashMap", B: "LinkedHashMap", C: "TreeMap", D: "Hashtable" },
      difficulty: "INTERMEDIATE",
    },
  ],

  "hashmap-internals": [
    {
      id: "q-hmi-1",
      text: "Which two methods must be consistently overridden when using custom objects as HashMap keys?",
      options: {
        A: "`equals()` and `hashCode()`",
        B: "`toString()` and `compareTo()`",
        C: "`clone()` and `finalize()`",
        D: "`getKey()` and `getValue()`",
      },
      difficulty: "INTERMEDIATE",
    },
    {
      id: "q-hmi-2",
      text: "What internal structure does a Java 8+ HashMap bucket transition to when collisions exceed the threshold of 8?",
      options: {
        A: "Red-Black Balanced Binary Search Tree (TreeNode)",
        B: "Doubly Linked List",
        C: "Circular Queue",
        D: "B-Tree",
      },
      difficulty: "ADVANCED",
    },
    {
      id: "q-hmi-3",
      text: "What is the default initial capacity and load factor of a standard Java HashMap?",
      options: {
        A: "Capacity 16, Load Factor 0.75",
        B: "Capacity 10, Load Factor 0.50",
        C: "Capacity 32, Load Factor 0.80",
        D: "Capacity 8, Load Factor 1.0",
      },
      difficulty: "ADVANCED",
    },
    {
      id: "q-hmi-4",
      text: "What is the average time complexity of `put()` and `get()` operations in a well-distributed HashMap?",
      options: { A: "O(1)", B: "O(log n)", C: "O(n)", D: "O(n log n)" },
      difficulty: "BEGINNER",
    },
    {
      id: "q-hmi-5",
      text: "What happens if two unequal keys produce the exact same `hashCode()` value in Java?",
      options: {
        A: "A hash collision occurs, and both nodes are stored in the same bucket resolved by equals()",
        B: "The first key is overwritten and lost",
        C: "A HashCollisionException is thrown",
        D: "The capacity doubles immediately",
      },
      difficulty: "INTERMEDIATE",
    },
  ],

  "sorting-searching": [
    {
      id: "q-ss-1",
      text: "What prerequisite must be satisfied before performing a Binary Search on an array?",
      options: {
        A: "The array must be sorted",
        B: "The array must contain unique values",
        C: "The array length must be a power of two",
        D: "The elements must all be positive",
      },
      difficulty: "BEGINNER",
    },
    {
      id: "q-ss-2",
      text: "What is the worst-case time complexity of Binary Search on an array of size n?",
      options: { A: "O(1)", B: "O(log n)", C: "O(n)", D: "O(n²)" },
      difficulty: "BEGINNER",
    },
    {
      id: "q-ss-3",
      text: "What is the worst-case time complexity of Merge Sort?",
      options: { A: "O(n log n)", B: "O(n²)", C: "O(n)", D: "O(log n)" },
      difficulty: "INTERMEDIATE",
    },
    {
      id: "q-ss-4",
      text: "What is the main difference between `Comparable` and `Comparator` interfaces in Java?",
      options: {
        A: "`Comparable` defines natural ordering within the class; `Comparator` provides external custom sorting logic",
        B: "`Comparable` is only for integers",
        C: "`Comparator` can only sort in descending order",
        D: "`Comparable` cannot be used with Collections.sort()",
      },
      difficulty: "INTERMEDIATE",
    },
    {
      id: "q-ss-5",
      text: "What is a stable sorting algorithm?",
      options: {
        A: "An algorithm that preserves the relative order of elements with equal keys",
        B: "An algorithm that never throws an exception",
        C: "An algorithm with O(1) space complexity",
        D: "An algorithm that operates in-place without recursion",
      },
      difficulty: "ADVANCED",
    },
  ],

  // 4. Database Management
  "relational-database-concepts": [
    {
      id: "q-rdc-1",
      text: "What does a row (tuple) represent in a relational database table?",
      options: {
        A: "A single complete record or entity instance",
        B: "An attribute or column property",
        C: "The schema definition",
        D: "A database index",
      },
      difficulty: "BEGINNER",
    },
    {
      id: "q-rdc-2",
      text: "What is a database schema?",
      options: {
        A: "The formal structural blueprint and definition of tables, views, and constraints",
        B: "A live backup file",
        C: "A specific user query result",
        D: "The physical hard disk sector format",
      },
      difficulty: "BEGINNER",
    },
    {
      id: "q-rdc-3",
      text: "In relational algebra, what is the cardinality of a relation?",
      options: {
        A: "The number of tuples (rows) in the relation",
        B: "The number of attributes (columns)",
        C: "The storage size in megabytes",
        D: "The number of indexes",
      },
      difficulty: "INTERMEDIATE",
    },
    {
      id: "q-rdc-4",
      text: "What type of relationship exists between Students and Courses where students enroll in many courses and courses have many students?",
      options: { A: "One-to-One", B: "One-to-Many", C: "Many-to-Many", D: "Zero-to-One" },
      difficulty: "BEGINNER",
    },
    {
      id: "q-rdc-5",
      text: "How is a Many-to-Many relationship implemented in a relational database?",
      options: {
        A: "Using a junction (join/bridge) table containing foreign keys to both parent tables",
        B: "Storing comma-separated values in a single column",
        C: "Duplicating the entire database",
        D: "Using an array column without indexes",
      },
      difficulty: "INTERMEDIATE",
    },
  ],

  "sql-fundamentals": [
    {
      id: "q-sql-1",
      text: "Which SQL command is used to retrieve data from one or more database tables?",
      options: { A: "FETCH", B: "SELECT", C: "GET", D: "QUERY" },
      difficulty: "BEGINNER",
    },
    {
      id: "q-sql-2",
      text: "Which SQL clause is used to filter rows before any grouping occurs?",
      options: { A: "HAVING", B: "WHERE", C: "ORDER BY", D: "GROUP BY" },
      difficulty: "BEGINNER",
    },
    {
      id: "q-sql-3",
      text: "What is the difference between `WHERE` and `HAVING` clauses in SQL?",
      options: {
        A: "`WHERE` filters individual rows before grouping; `HAVING` filters aggregated groups after GROUP BY",
        B: "`HAVING` only works with numbers",
        C: "`WHERE` cannot be used with SELECT",
        D: "There is no difference",
      },
      difficulty: "INTERMEDIATE",
    },
    {
      id: "q-sql-4",
      text: "Which SQL command deletes all rows in a table rapidly without logging individual row deletions?",
      options: { A: "DELETE FROM", B: "TRUNCATE TABLE", C: "DROP TABLE", D: "REMOVE ROWS" },
      difficulty: "INTERMEDIATE",
    },
    {
      id: "q-sql-5",
      text: "What does the `DISTINCT` keyword do in a SQL query?",
      options: {
        A: "Eliminates duplicate rows from the query output",
        B: "Sorts rows in descending order",
        C: "Limits the result to 10 rows",
        D: "Creates a unique index",
      },
      difficulty: "BEGINNER",
    },
  ],

  "joins-subqueries": [
    {
      id: "q-js-1",
      text: "Which SQL JOIN returns only the rows that have matching keys in both participating tables?",
      options: { A: "LEFT JOIN", B: "INNER JOIN", C: "RIGHT JOIN", D: "CROSS JOIN" },
      difficulty: "BEGINNER",
    },
    {
      id: "q-js-2",
      text: "What is returned for right-table columns in a LEFT JOIN when a row has no match on the right?",
      options: { A: "NULL values", B: "Empty strings", C: "Zeroes", D: "Row is excluded entirely" },
      difficulty: "BEGINNER",
    },
    {
      id: "q-js-3",
      text: "What is a correlated subquery in SQL?",
      options: {
        A: "A subquery that depends on and references columns from the outer query, executing once per outer row",
        B: "A subquery containing a JOIN",
        C: "A query that runs in a background thread",
        D: "A query executed in a stored procedure",
      },
      difficulty: "ADVANCED",
    },
    {
      id: "q-js-4",
      text: "Which operator is most appropriate when testing if a subquery returns any rows at all?",
      options: { A: "EXISTS", B: "LIKE", C: "BETWEEN", D: "CONTAINS" },
      difficulty: "INTERMEDIATE",
    },
    {
      id: "q-js-5",
      text: "What is the result of a CROSS JOIN between a table with 5 rows and a table with 4 rows?",
      options: { A: "9 rows", B: "20 rows (Cartesian product)", C: "5 rows", D: "1 row" },
      difficulty: "INTERMEDIATE",
    },
  ],

  "primary-foreign-keys": [
    {
      id: "q-pfk-1",
      text: "What two constraints are automatically enforced on a PRIMARY KEY column?",
      options: {
        A: "UNIQUE and NOT NULL",
        B: "INDEX and DEFAULT",
        C: "CHECK and AUTO_INCREMENT",
        D: "FOREIGN and CASCADE",
      },
      difficulty: "BEGINNER",
    },
    {
      id: "q-pfk-2",
      text: "What is the primary role of a FOREIGN KEY constraint?",
      options: {
        A: "Enforce referential integrity by linking to a primary or unique key in another table",
        B: "Encrypt sensitive password fields",
        C: "Speed up table scans",
        D: "Prevent tables from exceeding memory limits",
      },
      difficulty: "BEGINNER",
    },
    {
      id: "q-pfk-3",
      text: "What does the `ON DELETE CASCADE` action do on a foreign key?",
      options: {
        A: "Automatically deletes child rows when their referenced parent row is deleted",
        B: "Prevents parent row deletion if children exist",
        C: "Sets foreign key values to NULL",
        D: "Sends an email alert on deletion",
      },
      difficulty: "INTERMEDIATE",
    },
    {
      id: "q-pfk-4",
      text: "What is a composite primary key?",
      options: {
        A: "A primary key composed of two or more columns combined to ensure uniqueness",
        B: "A key that links to two foreign databases",
        C: "A primary key that changes dynamically",
        D: "A key containing both integers and text",
      },
      difficulty: "INTERMEDIATE",
    },
    {
      id: "q-pfk-5",
      text: "Can a table have multiple foreign keys pointing to different tables?",
      options: {
        A: "Yes, a table can have multiple foreign keys",
        B: "No, SQL allows at most one foreign key per table",
        C: "Only if declared as primary keys",
        D: "Only in NoSQL databases",
      },
      difficulty: "BEGINNER",
    },
  ],

  "database-normalization": [
    {
      id: "q-norm-1",
      text: "What is the primary objective of relational database normalization?",
      options: {
        A: "Minimize data redundancy and avoid update anomalies",
        B: "Make queries run without indexes",
        C: "Reduce the number of tables in the database",
        D: "Convert relational data into JSON",
      },
      difficulty: "BEGINNER",
    },
    {
      id: "q-norm-2",
      text: "What requirement must a table satisfy to be in First Normal Form (1NF)?",
      options: {
        A: "Each column must contain only atomic (indivisible) values and no repeating groups",
        B: "It must have no foreign keys",
        C: "All columns must be integers",
        D: "Every row must be sorted alphabetically",
      },
      difficulty: "INTERMEDIATE",
    },
    {
      id: "q-norm-3",
      text: "What condition is required to reach Second Normal Form (2NF)?",
      options: {
        A: "Must be in 1NF and have no partial dependency on a composite primary key",
        B: "Must have at least two tables",
        C: "Must eliminate all foreign keys",
        D: "Must contain transitive dependencies",
      },
      difficulty: "INTERMEDIATE",
    },
    {
      id: "q-norm-4",
      text: "A table in 2NF contains a non-key column determined by another non-key column (A -> B -> C). To achieve 3NF, what must be eliminated?",
      options: {
        A: "Transitive dependency",
        B: "Partial dependency",
        C: "Atomic values",
        D: "Candidate keys",
      },
      difficulty: "ADVANCED",
    },
    {
      id: "q-norm-5",
      text: "When might an engineer intentionally denormalize a database schema?",
      options: {
        A: "To optimize heavy read query performance and reduce complex JOIN operations",
        B: "To save disk storage space",
        C: "To prevent SQL injection attacks",
        D: "To eliminate database locks",
      },
      difficulty: "ADVANCED",
    },
  ],

  "transactions-acid-properties": [
    {
      id: "q-acid-1",
      text: "What does the 'A' in ACID stand for?",
      options: { A: "Atomicity (all-or-nothing execution)", B: "Asynchrony", C: "Availability", D: "Authorization" },
      difficulty: "BEGINNER",
    },
    {
      id: "q-acid-2",
      text: "Which ACID property guarantees that committed changes survive system crashes or power outages?",
      options: { A: "Durability", B: "Isolation", C: "Consistency", D: "Atomicity" },
      difficulty: "BEGINNER",
    },
    {
      id: "q-acid-3",
      text: "What SQL command permanently saves changes made during a transaction?",
      options: { A: "SAVE", B: "COMMIT", C: "ROLLBACK", D: "STORE" },
      difficulty: "BEGINNER",
    },
    {
      id: "q-acid-4",
      text: "What concurrency issue occurs when transaction T1 reads uncommitted modifications made by T2?",
      options: { A: "Dirty Read", B: "Non-repeatable Read", C: "Phantom Read", D: "Deadlock" },
      difficulty: "INTERMEDIATE",
    },
    {
      id: "q-acid-5",
      text: "Which transaction isolation level provides the highest protection against all concurrency anomalies?",
      options: { A: "SERIALIZABLE", B: "REPEATABLE READ", C: "READ COMMITTED", D: "READ UNCOMMITTED" },
      difficulty: "ADVANCED",
    },
  ],

  // 5. Networking and API Development
  "how-internet-works": [
    {
      id: "q-hiw-1",
      text: "What is the primary role of DNS (Domain Name System) on the internet?",
      options: {
        A: "Translate human-friendly domain names (e.g. google.com) into numerical IP addresses",
        B: "Encrypt web page content",
        C: "Route packets through submarine cables",
        D: "Host web server source code",
      },
      difficulty: "BEGINNER",
    },
    {
      id: "q-hiw-2",
      text: "What is the main difference between TCP and UDP transport protocols?",
      options: {
        A: "TCP is connection-oriented with guaranteed delivery; UDP is connectionless and faster without guarantees",
        B: "TCP is only for audio/video streaming",
        C: "UDP uses encryption by default",
        D: "TCP does not use IP addresses",
      },
      difficulty: "BEGINNER",
    },
    {
      id: "q-hiw-3",
      text: "Which standard port is used for unencrypted HTTP traffic by default?",
      options: { A: "80", B: "443", C: "8080", D: "22" },
      difficulty: "BEGINNER",
    },
    {
      id: "q-hiw-4",
      text: "How does packet routing work at the network layer across the internet?",
      options: {
        A: "Routers inspect destination IP headers and forward packets hop-by-hop using routing tables",
        B: "A central global server directs all individual packets",
        C: "Packets broadcast to every computer in the world",
        D: "Routers store complete copies of the internet",
      },
      difficulty: "INTERMEDIATE",
    },
    {
      id: "q-hiw-5",
      text: "What is the loopback IPv4 address used to refer to the local machine?",
      options: { A: "127.0.0.1", B: "192.168.1.1", C: "10.0.0.1", D: "255.255.255.0" },
      difficulty: "BEGINNER",
    },
  ],

  "client-server-architecture": [
    {
      id: "q-csa-1",
      text: "In standard client-server architecture, what is the role of the client?",
      options: {
        A: "Initiate requests and render or consume responses",
        B: "Host the central persistent database",
        C: "Manage user authentication tokens globally",
        D: "Direct network packet switching",
      },
      difficulty: "BEGINNER",
    },
    {
      id: "q-csa-2",
      text: "What does it mean that HTTP is fundamentally a 'stateless' protocol?",
      options: {
        A: "Each request from a client is handled independently without the server retaining state across requests",
        B: "Servers cannot use databases",
        C: "Clients are not allowed to store cookies",
        D: "IP addresses change on every request",
      },
      difficulty: "BEGINNER",
    },
    {
      id: "q-csa-3",
      text: "What is the role of a Reverse Proxy (such as Nginx) in modern server architecture?",
      options: {
        A: "Sit in front of web servers to handle SSL termination, load balancing, and request routing",
        B: "Browse the internet on behalf of users",
        C: "Replace application databases",
        D: "Compile backend code into native binaries",
      },
      difficulty: "INTERMEDIATE",
    },
    {
      id: "q-csa-4",
      text: "What is the difference between vertical scaling and horizontal scaling?",
      options: {
        A: "Vertical adds more resources (CPU/RAM) to one machine; horizontal adds more machine instances",
        B: "Vertical adds more machines; horizontal increases CPU",
        C: "Vertical is for frontend; horizontal is for backend",
        D: "There is no difference",
      },
      difficulty: "INTERMEDIATE",
    },
    {
      id: "q-csa-5",
      text: "Which load-balancing algorithm distributes requests sequentially among available backend servers?",
      options: { A: "Round Robin", B: "Least Connections", C: "IP Hash", D: "Random Choice" },
      difficulty: "BEGINNER",
    },
  ],

  "http-https": [
    {
      id: "q-hh-1",
      text: "What is the primary security advantage of HTTPS over HTTP?",
      options: {
        A: "All communication between browser and server is encrypted using TLS/SSL",
        B: "It loads pages twice as fast",
        C: "It eliminates server crashes",
        D: "It blocks all advertisements",
      },
      difficulty: "BEGINNER",
    },
    {
      id: "q-hh-2",
      text: "Which default network port is used for HTTPS connections?",
      options: { A: "443", B: "80", C: "8443", D: "21" },
      difficulty: "BEGINNER",
    },
    {
      id: "q-hh-3",
      text: "What is the purpose of an SSL/TLS Certificate during the HTTPS handshake?",
      options: {
        A: "Authenticate the server's identity and exchange symmetric session keys securely",
        B: "Store user account passwords on the server",
        C: "Compress HTML and CSS files",
        D: "Format JSON payloads",
      },
      difficulty: "INTERMEDIATE",
    },
    {
      id: "q-hh-4",
      text: "Which HTTP request header specifies the MIME type of data sent in the request body?",
      options: { A: "Content-Type", B: "Accept", C: "User-Agent", D: "Host" },
      difficulty: "BEGINNER",
    },
    {
      id: "q-hh-5",
      text: "What does the HSTS (HTTP Strict Transport Security) header enforce?",
      options: {
        A: "Tells browsers to only interact with the domain over secure HTTPS connections",
        B: "Restricts API access to specific countries",
        C: "Forces cookies to be deleted on browser close",
        D: "Disables JavaScript execution",
      },
      difficulty: "ADVANCED",
    },
  ],

  "rest-api-architecture": [
    {
      id: "q-rest-1",
      text: "What does REST stand for in web architecture?",
      options: {
        A: "Representational State Transfer",
        B: "Remote Execution Standard Template",
        C: "Realtime Endpoint Server Transmission",
        D: "Relational Entity Synchronous Transfer",
      },
      difficulty: "BEGINNER",
    },
    {
      id: "q-rest-2",
      text: "Which naming convention best follows RESTful resource design for retrieving user orders?",
      options: {
        A: "`GET /users/{userId}/orders`",
        B: "`POST /getUserOrders`",
        C: "`GET /orders_fetch_by_user`",
        D: "`GET /api/v1/runQuery?table=orders`",
      },
      difficulty: "BEGINNER",
    },
    {
      id: "q-rest-3",
      text: "What is an idempotent HTTP method?",
      options: {
        A: "Making multiple identical requests produces the exact same result as making a single request",
        B: "A method that cannot accept a request body",
        C: "A method that runs in constant time",
        D: "A method that creates a new resource on every invocation",
      },
      difficulty: "INTERMEDIATE",
    },
    {
      id: "q-rest-4",
      text: "Which of the following HTTP methods is NOT considered idempotent?",
      options: { A: "GET", B: "PUT", C: "DELETE", D: "POST" },
      difficulty: "INTERMEDIATE",
    },
    {
      id: "q-rest-5",
      text: "What does HATEOAS stand for in advanced REST maturity levels?",
      options: {
        A: "Hypermedia As The Engine Of Application State",
        B: "Hypertext And Text Encryption Over All Standards",
        C: "Host Authorization Tracking Endpoint And Output Server",
        D: "High Availability Transmission Engine Operational Automated Standard",
      },
      difficulty: "ADVANCED",
    },
  ],

  "http-methods-status-codes": [
    {
      id: "q-hmsc-1",
      text: "Which HTTP method should be used to partially update an existing resource?",
      options: { A: "PATCH", B: "PUT", C: "POST", D: "GET" },
      difficulty: "BEGINNER",
    },
    {
      id: "q-hmsc-2",
      text: "Which HTTP status code signifies that a new resource has been successfully created?",
      options: { A: "200 OK", B: "201 Created", C: "204 No Content", D: "202 Accepted" },
      difficulty: "BEGINNER",
    },
    {
      id: "q-hmsc-3",
      text: "What is the difference between status codes 401 and 403?",
      options: {
        A: "401 means Unauthorized (unauthenticated); 403 means Forbidden (authenticated but lacking permissions)",
        B: "401 is server error; 403 is client error",
        C: "401 is for GET; 403 is for POST",
        D: "They are identical in meaning",
      },
      difficulty: "INTERMEDIATE",
    },
    {
      id: "q-hmsc-4",
      text: "What status code should a server return when a requested resource ID does not exist in the database?",
      options: { A: "404 Not Found", B: "400 Bad Request", C: "500 Internal Server Error", D: "301 Moved" },
      difficulty: "BEGINNER",
    },
    {
      id: "q-hmsc-5",
      text: "Which status code represents a successful request that deliberately returns no body content (e.g. DELETE)?",
      options: { A: "204 No Content", B: "200 OK", C: "202 Accepted", D: "205 Reset" },
      difficulty: "BEGINNER",
    },
  ],

  "authentication-authorization": [
    {
      id: "q-auth-1",
      text: "What is the fundamental difference between Authentication and Authorization?",
      options: {
        A: "Authentication verifies who you are; Authorization determines what you are allowed to access",
        B: "Authentication checks permissions; Authorization verifies passwords",
        C: "Authentication is for databases; Authorization is for servers",
        D: "They are synonyms in software security",
      },
      difficulty: "BEGINNER",
    },
    {
      id: "q-auth-2",
      text: "What three parts comprise a JSON Web Token (JWT)?",
      options: {
        A: "Header, Payload, and Signature",
        B: "Username, Password, and Role",
        C: "Protocol, Domain, and Port",
        D: "Key, Value, and Checksum",
      },
      difficulty: "INTERMEDIATE",
    },
    {
      id: "q-auth-3",
      text: "Why should passwords never be encrypted with reversible encryption or stored in plain text?",
      options: {
        A: "They should be securely hashed with slow salted cryptographic functions (e.g. BCrypt, Argon2)",
        B: "Encrypted passwords cannot be checked during login",
        C: "Databases cannot store encrypted strings",
        D: "Plain text is required for password recovery emails",
      },
      difficulty: "BEGINNER",
    },
    {
      id: "q-auth-4",
      text: "In standard Bearer Token authorization, which HTTP header is used to pass the JWT?",
      options: {
        A: "`Authorization: Bearer <token>`",
        B: "`Authentication: JWT <token>`",
        C: "`X-Token: <token>`",
        D: "`Security-Key: <token>`",
      },
      difficulty: "BEGINNER",
    },
    {
      id: "q-auth-5",
      text: "What is Role-Based Access Control (RBAC)?",
      options: {
        A: "Restricting system access to authorized users based on their assigned organizational roles",
        B: "Granting root admin permissions to all logged-in users",
        C: "Rotating passwords every 30 days",
        D: "Limiting network connections by IP subnet",
      },
      difficulty: "INTERMEDIATE",
    },
  ],

  // 6. Spring Boot, Testing and Deployment
  "spring-framework-ioc": [
    {
      id: "q-ioc-1",
      text: "What is Inversion of Control (IoC) in the Spring Framework?",
      options: {
        A: "Delegating the creation, lifecycle management, and wiring of dependencies to the Spring container",
        B: "Reversing the flow of HTTP requests to the client",
        C: "Compiling Java code into bytecode backwards",
        D: "Running all controllers in reverse order",
      },
      difficulty: "BEGINNER",
    },
    {
      id: "q-ioc-2",
      text: "What is a Spring Bean?",
      options: {
        A: "An object instantiated, assembled, and managed by the Spring IoC Container",
        B: "A special Java data type for date values",
        C: "A database stored procedure",
        D: "An operating system service",
      },
      difficulty: "BEGINNER",
    },
    {
      id: "q-ioc-3",
      text: "Which interface represents the advanced Spring IoC container with event publishing and i18n support?",
      options: { A: "ApplicationContext", B: "BeanFactory", C: "ObjectFactory", D: "BeanContainer" },
      difficulty: "INTERMEDIATE",
    },
    {
      id: "q-ioc-4",
      text: "What is the default scope of a Spring Bean if not explicitly specified?",
      options: { A: "singleton (one shared instance per container)", B: "prototype", C: "request", D: "session" },
      difficulty: "BEGINNER",
    },
    {
      id: "q-ioc-5",
      text: "Which lifecycle callbacks are available to execute custom logic after bean creation and before destruction?",
      options: {
        A: "`@PostConstruct` and `@PreDestroy`",
        B: "`@Start` and `@Stop`",
        C: "`@Init` and `@Finalize`",
        D: "`@Create` and `@Delete`",
      },
      difficulty: "INTERMEDIATE",
    },
  ],

  "dependency-injection-spring-beans": [
    {
      id: "q-di-1",
      text: "Which Dependency Injection style is officially recommended by the Spring team for production code?",
      options: {
        A: "Constructor Injection (ensures immutability and testability without reflection)",
        B: "Field Injection using @Autowired on private fields",
        C: "Setter Injection only",
        D: "Manual instantiation with new keyword",
      },
      difficulty: "INTERMEDIATE",
    },
    {
      id: "q-di-2",
      text: "What is the purpose of the `@Component` annotation in Spring?",
      options: {
        A: "Marks a Java class as a Spring-managed component eligible for auto-detection during component scanning",
        B: "Declares an HTTP REST controller",
        C: "Maps a class to a database table",
        D: "Creates a thread pool",
      },
      difficulty: "BEGINNER",
    },
    {
      id: "q-di-3",
      text: "When should the `@Bean` annotation be used instead of `@Component`?",
      options: {
        A: "In `@Configuration` classes to register third-party library classes or customize instantiation",
        B: "When a class has only private fields",
        C: "When defining controllers only",
        D: "When using XML configuration",
      },
      difficulty: "INTERMEDIATE",
    },
    {
      id: "q-di-4",
      text: "What annotation is used to resolve ambiguity when multiple candidate beans match a required dependency type?",
      options: { A: "@Qualifier", B: "@Primary", C: "Both @Qualifier and @Primary can resolve it", D: "@Select" },
      difficulty: "INTERMEDIATE",
    },
    {
      id: "q-di-5",
      text: "Which annotation specializes `@Component` specifically for service layer business logic?",
      options: { A: "@Service", B: "@Repository", C: "@Controller", D: "@Logic" },
      difficulty: "BEGINNER",
    },
  ],

  "spring-boot-auto-configuration": [
    {
      id: "q-sb-1",
      text: "Which single annotation combines `@Configuration`, `@EnableAutoConfiguration`, and `@ComponentScan`?",
      options: {
        A: "`@SpringBootApplication`",
        B: "`@EnableSpringBoot`",
        C: "`@SpringDeployment`",
        D: "`@AutoApp`",
      },
      difficulty: "BEGINNER",
    },
    {
      id: "q-sb-2",
      text: "How does Spring Boot auto-configuration determine what beans to configure automatically?",
      options: {
        A: "By inspecting classpath JARs, properties, and conditions (e.g. @ConditionalOnClass)",
        B: "By querying a remote cloud registry on startup",
        C: "By hardcoding configuration in the JVM",
        D: "By prompting the developer at startup",
      },
      difficulty: "INTERMEDIATE",
    },
    {
      id: "q-sb-3",
      text: "Where is externalized application configuration primarily defined in a Spring Boot application?",
      options: {
        A: "`application.properties` or `application.yml` in `src/main/resources`",
        B: "`pom.xml`",
        C: "`index.html`",
        D: "The Windows registry",
      },
      difficulty: "BEGINNER",
    },
    {
      id: "q-sb-4",
      text: "What is the primary benefit of Spring Boot Starters (e.g. `spring-boot-starter-web`)?",
      options: {
        A: "Curated sets of convenient dependency descriptors that eliminate dependency version conflicts",
        B: "They execute unit tests during compilation",
        C: "They create database tables automatically without SQL",
        D: "They provide a web browser inside Java",
      },
      difficulty: "BEGINNER",
    },
    {
      id: "q-sb-5",
      text: "Which embedded servlet container is provided by default in `spring-boot-starter-web`?",
      options: { A: "Apache Tomcat", B: "Jetty", C: "Undertow", D: "Nginx" },
      difficulty: "BEGINNER",
    },
  ],

  "spring-data-jpa-hibernate": [
    {
      id: "q-jpa-1",
      text: "Which JPA annotation designates a Java class as an entity mapped to a relational database table?",
      options: { A: "@Entity", B: "@TableOnly", C: "@Model", D: "@DatabaseRecord" },
      difficulty: "BEGINNER",
    },
    {
      id: "q-jpa-2",
      text: "Which Spring Data interface provides built-in CRUD operations and pagination methods out of the box?",
      options: { A: "JpaRepository", B: "CrudService", C: "QueryManager", D: "DataAccessor" },
      difficulty: "BEGINNER",
    },
    {
      id: "q-jpa-3",
      text: "What does the `@Transactional` annotation do when placed on a service method?",
      options: {
        A: "Wraps the method execution in a database transaction, committing on success and rolling back on runtime exceptions",
        B: "Runs the method asynchronously on a background thread",
        C: "Caches the return value in Redis",
        D: "Validates incoming HTTP headers",
      },
      difficulty: "INTERMEDIATE",
    },
    {
      id: "q-jpa-4",
      text: "What is the 'N+1 Select Problem' in ORM frameworks like Hibernate?",
      options: {
        A: "Executing 1 query to fetch parent entities followed by N individual queries to fetch child relationships",
        B: "Inserting N+1 rows into an empty table",
        C: "Having N primary keys on one table",
        D: "Exceeding the database connection pool limit",
      },
      difficulty: "ADVANCED",
    },
    {
      id: "q-jpa-5",
      text: "Which JPA relationship annotation represents a parent that has many child entities (e.g. Category -> Skills)?",
      options: { A: "@OneToMany", B: "@ManyToOne", C: "@ManyToMany", D: "@OneToOne" },
      difficulty: "BEGINNER",
    },
  ],

  "unit-integration-testing": [
    {
      id: "q-test-1",
      text: "What is the main goal of unit testing in software development?",
      options: {
        A: "Verify that individual methods or classes work correctly in complete isolation from external systems",
        B: "Test network bandwidth speed",
        C: "Ensure database servers stay online",
        D: "Validate end-user UI clicks in a live browser",
      },
      difficulty: "BEGINNER",
    },
    {
      id: "q-test-2",
      text: "Which annotation marks a test method in JUnit 5 (Jupiter)?",
      options: { A: "@Test", B: "@RunTest", C: "@TestCase", D: "@Execute" },
      difficulty: "BEGINNER",
    },
    {
      id: "q-test-3",
      text: "In Mockito, what is the role of mock objects?",
      options: {
        A: "Simulate external dependencies (databases, APIs) with controlled behaviors to test classes in isolation",
        B: "Run performance load tests",
        C: "Generate fake database tables in production",
        D: "Measure line coverage statistics",
      },
      difficulty: "INTERMEDIATE",
    },
    {
      id: "q-test-4",
      text: "Which annotation bootstraps the full Spring application context for integration testing in Spring Boot?",
      options: { A: "@SpringBootTest", B: "@IntegrationTest", C: "@ContextConfiguration", D: "@TestContext" },
      difficulty: "INTERMEDIATE",
    },
    {
      id: "q-test-5",
      text: "What utility allows testing Spring MVC REST controllers by simulating HTTP requests without starting a live HTTP server?",
      options: { A: "MockMvc", B: "HttpClient", C: "RestVerifier", D: "TestBrowser" },
      difficulty: "INTERMEDIATE",
    },
  ],

  "docker-cicd": [
    {
      id: "q-dc-1",
      text: "What is Docker primarily used for in modern backend engineering?",
      options: {
        A: "Containerizing applications with their dependencies to guarantee consistent execution anywhere",
        B: "Writing SQL database queries",
        C: "Compiling JavaScript into machine code",
        D: "Replacing web browsers",
      },
      difficulty: "BEGINNER",
    },
    {
      id: "q-dc-2",
      text: "What is a Dockerfile?",
      options: {
        A: "A text script containing instructions to assemble a Docker container image step by step",
        B: "A live running container process",
        C: "A binary database backup file",
        D: "A configuration file for DNS servers",
      },
      difficulty: "BEGINNER",
    },
    {
      id: "q-dc-3",
      text: "What do the letters 'CI/CD' stand for in modern DevOps workflows?",
      options: {
        A: "Continuous Integration and Continuous Delivery / Deployment",
        B: "Centralized Interface and Code Distribution",
        C: "Container Infrastructure and Cloud Database",
        D: "Cloud Integration and Control Directive",
      },
      difficulty: "BEGINNER",
    },
    {
      id: "q-dc-4",
      text: "What tool allows defining and running multi-container Docker applications using a `docker-compose.yml` file?",
      options: { A: "Docker Compose", B: "Docker Swarm", C: "Docker Kubernetes", D: "Docker Engine" },
      difficulty: "INTERMEDIATE",
    },
    {
      id: "q-dc-5",
      text: "What is an automated CI/CD pipeline typically designed to execute upon every git push or pull request?",
      options: {
        A: "Linting, building the application, running test suites, and deploying artifact binaries",
        B: "Formatting code and deleting old git branches only",
        C: "Purchasing cloud domain names",
        D: "Rebooting developer laptops",
      },
      difficulty: "INTERMEDIATE",
    },
  ],
};

/**
 * Fallback generator for any custom or unrecognized skill.
 * Ensures that ANY skill node clicked in the graph produces 5 valid questions.
 */
function generateFallbackQuestions(skill) {
  const name = skill.name || "this skill";
  const category = skill.categoryName || "Backend Development";
  const diff = skill.difficultyLevel || "BEGINNER";

  return [
    {
      id: `q-gen-${skill.id}-1`,
      text: `What is the core purpose and primary application of "${name}" in ${category}?`,
      options: {
        A: `To structure and optimize core architectural patterns for ${name}`,
        B: `To replace all database and network interactions`,
        C: `To serve only as a deprecated legacy protocol`,
        D: `To perform basic operating system file deletions`,
      },
      difficulty: diff,
    },
    {
      id: `q-gen-${skill.id}-2`,
      text: `Which best practice is strongly recommended when implementing "${name}" in production systems?`,
      options: {
        A: `Follow robust separation of concerns, defensive validation, and proper error handling`,
        B: `Disable all logging to maximize network throughput`,
        C: `Store sensitive credentials in plain-text code files`,
        D: `Avoid unit and integration testing to accelerate deployment`,
      },
      difficulty: diff,
    },
    {
      id: `q-gen-${skill.id}-3`,
      text: `What common failure mode or bottleneck should engineers prevent when working with "${name}"?`,
      options: {
        A: `Unbounded memory leaks, unhandled exceptions, and unindexed lookups`,
        B: `Compiling with modern versions of the Java SDK`,
        C: `Writing clear API documentation`,
        D: `Using standard JSON formatting for responses`,
      },
      difficulty: "INTERMEDIATE",
    },
    {
      id: `q-gen-${skill.id}-4`,
      text: `How does "${name}" interact with upstream prerequisites in the ${category} roadmap?`,
      options: {
        A: `It builds upon foundational concepts to enable advanced scalable features`,
        B: `It is completely isolated from all other skills in the system`,
        C: `It disables all earlier learned modules`,
        D: `It requires bypassing the gateway server entirely`,
      },
      difficulty: "INTERMEDIATE",
    },
    {
      id: `q-gen-${skill.id}-5`,
      text: `In an enterprise workflow, how can mastery of "${name}" be verified through automated testing?`,
      options: {
        A: `By writing comprehensive unit tests and verifying assertions under edge-case conditions`,
        B: `By inspecting the UI manually once per year`,
        C: `By relying solely on end-user complaints in production`,
        D: `By skipping automated validation entirely`,
      },
      difficulty: "ADVANCED",
    },
  ];
}

/**
 * Fetch 5 questions for a given skill:
 * 1. Checks memory cache to avoid redundant requests.
 * 2. Attempts to fetch from existing backend endpoints if available.
 * 3. Falls back smoothly to the curated curriculum question bank.
 */
export async function fetchQuestionsBySkill(skill) {
  if (!skill) return [];

  const key = skill.id || skill.slug || skill.name;
  if (questionsCache.has(key)) {
    return questionsCache.get(key);
  }

  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Attempt backend API call if the endpoint exists
  const candidateEndpoints = [
    `${API_BASE_URL}/skills/${skill.id}/questions?limit=5`,
    `${API_BASE_URL}/tracks/backend-development/skills/${skill.slug}/questions`,
    `${API_BASE_URL}/questions?skillId=${skill.id}&limit=5`,
  ];

  for (const url of candidateEndpoints) {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers,
        cache: "no-store",
      });

      if (response.ok) {
        const data = await response.json();
        const list = Array.isArray(data) ? data : data.questions || [];
        if (list.length >= 5) {
          const formatted = list.slice(0, 5).map((q, idx) => ({
            id: q.id || `q-${skill.id}-${idx}`,
            text: q.questionText || q.text || q.question || `Question ${idx + 1}`,
            options: q.options || q.optionData || {},
            difficulty: q.difficulty || skill.difficultyLevel || "BEGINNER",
          }));
          questionsCache.set(key, formatted);
          return formatted;
        }
      }
    } catch {
      // Backend candidate endpoint not present or network error; try next candidate
    }
  }

  // Use curated question bank mapped by slug
  const slug = skill.slug || (skill.name ? skill.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") : "");
  const found = SKILL_QUESTION_BANK[slug];

  let questions;
  if (found && found.length === 5) {
    questions = found;
  } else {
    questions = generateFallbackQuestions(skill);
  }

  // Artificial short tick (120ms) to ensure smooth loading UI state transition
  await new Promise((resolve) => setTimeout(resolve, 120));

  questionsCache.set(key, questions);
  return questions;
}
