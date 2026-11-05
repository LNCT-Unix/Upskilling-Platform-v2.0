
-- CATEGORY 1
INSERT INTO questions (
    id,
    question_text,
    question_type,
    option_data,
    correct_answer,
    explanation,
    difficulty,
    difficulty_parameter,
    is_active
)
VALUES

-- SKILL 1:

(
    '50000000-0000-0000-0000-000000000001',
    'Which Java data type is suitable for storing a whole number?',
    'MCQ',
    '{"A":"float","B":"int","C":"char","D":"boolean"}'::jsonb,
    'B',
    'The int data type is used to store whole numbers.',
    'BEGINNER',
    -1.000,
    TRUE
),

(
    '50000000-0000-0000-0000-000000000002',
    'What happens when a double value is assigned directly to an int variable in Java?',
    'MCQ',
    '{"A":"The value is automatically rounded","B":"The value is converted to a string","C":"A compilation error occurs","D":"The program ignores the assignment"}'::jsonb,
    'C',
    'Java does not allow implicit narrowing conversion from double to int.',
    'MEDIUM',
    0.000,
    TRUE
),

(
    '50000000-0000-0000-0000-000000000003',
    'What is the output of the following code? byte value = (byte) 130; System.out.println(value);',
    'MCQ',
    '{"A":"130","B":"-126","C":"0","D":"Compilation error"}'::jsonb,
    'B',
    'A byte stores values from -128 to 127. Casting 130 causes overflow, resulting in -126.',
    'HARD',
    1.000,
    TRUE
),


-- SKILL 2

(
    '50000000-0000-0000-0000-000000000004',
    'Which operator is used to calculate the remainder in Java?',
    'MCQ',
    '{"A":"/","B":"%","C":"*","D":"//"}'::jsonb,
    'B',
    'The modulo operator (%) returns the remainder after division.',
    'BEGINNER',
    -1.000,
    TRUE
),

(
    '50000000-0000-0000-0000-000000000005',
    'What is the output? int x = 5; System.out.println(x++ + ++x);',
    'MCQ',
    '{"A":"10","B":"11","C":"12","D":"13"}'::jsonb,
    'C',
    'x++ returns 5 and then increments x to 6. ++x increments it to 7 and returns 7. The sum is 12.',
    'MEDIUM',
    0.000,
    TRUE
),

(
    '50000000-0000-0000-0000-000000000006',
    'What is the output? int a = 10; int b = 5; boolean result = a > 5 && b++ > 5; System.out.println(result + " " + b);',
    'MCQ',
    '{"A":"true 6","B":"true 5","C":"false 5","D":"false 6"}'::jsonb,
    'D',
    'The first condition is true, so the second condition executes. Since 5 > 5 is false, result is false. The post-increment changes b to 6.',
    'HARD',
    1.000,
    TRUE
),


-- SKILL 3
(
    '50000000-0000-0000-0000-000000000007',
    'Which statement is used to execute code based on a condition in Java?',
    'MCQ',
    '{"A":"for","B":"if","C":"class","D":"import"}'::jsonb,
    'B',
    'The if statement executes a block of code when its condition is true.',
    'BEGINNER',
    -1.000,
    TRUE
),

(
    '50000000-0000-0000-0000-000000000008',
    'What is printed? int x = 10; if (x > 5) { System.out.println("A"); } else { System.out.println("B"); }',
    'MCQ',
    '{"A":"A","B":"B","C":"AB","D":"Nothing"}'::jsonb,
    'A',
    'Since x is greater than 5, the if block executes and prints A.',
    'MEDIUM',
    0.000,
    TRUE
),

(
    '50000000-0000-0000-0000-000000000009',
    'What happens when no case matches in a switch statement and there is no default case?',
    'MCQ',
    '{"A":"The first case executes","B":"A compilation error occurs","C":"No case block executes","D":"The last case executes"}'::jsonb,
    'C',
    'Without a matching case or default block, no case block executes.',
    'HARD',
    1.000,
    TRUE
),

-- SKILL 4:

(
    '50000000-0000-0000-0000-000000000010',
    'Which loop executes its body at least once, even if the condition is initially false?',
    'MCQ',
    '{"A":"for","B":"while","C":"do-while","D":"enhanced for"}'::jsonb,
    'C',
    'A do-while loop checks its condition after executing the loop body.',
    'BEGINNER',
    -1.000,
    TRUE
),

(
    '50000000-0000-0000-0000-000000000011',
    'How many times does this loop execute? for (int i = 1; i <= 5; i += 2)',
    'MCQ',
    '{"A":"2","B":"3","C":"4","D":"5"}'::jsonb,
    'B',
    'The values of i are 1, 3 and 5. Therefore, the loop executes three times.',
    'MEDIUM',
    0.000,
    TRUE
),

(
    '50000000-0000-0000-0000-000000000012',
    'What is printed by this code? for (int i = 1; i <= 2; i++) { for (int j = 1; j <= i; j++) { System.out.print(i); } }',
    'MCQ',
    '{"A":"1122","B":"112","C":"121","D":"122"}'::jsonb,
    'B',
    'For i = 1, the output is 1. For i = 2, the output is 22. The combined output is 122.',
    'HARD',
    1.000,
    TRUE
),


-- SKILL 5

(
    '50000000-0000-0000-0000-000000000013',
    'Which keyword is used to return a value from a Java method?',
    'MCQ',
    '{"A":"break","B":"return","C":"continue","D":"static"}'::jsonb,
    'B',
    'The return keyword sends a value back from a method to its caller.',
    'BEGINNER',
    -1.000,
    TRUE
),

(
    '50000000-0000-0000-0000-000000000014',
    'Which condition allows method overloading in Java?',
    'MCQ',
    '{"A":"Methods must have different return types only","B":"Methods must have different parameter lists","C":"Methods must have different access modifiers","D":"Methods must have different names"}'::jsonb,
    'B',
    'Method overloading requires different parameter lists, such as different numbers or types of parameters.',
    'MEDIUM',
    0.000,
    TRUE
),

(
    '50000000-0000-0000-0000-000000000015',
    'What can happen if a recursive method does not have a valid base condition?',
    'MCQ',
    '{"A":"The method automatically stops","B":"The compiler converts it into a loop","C":"A StackOverflowError may occur","D":"The method returns zero"}'::jsonb,
    'C',
    'Without a terminating base condition, recursive calls may continue until the call stack is exhausted.',
    'HARD',
    1.000,
    TRUE
),


-- SKILL 6
(
    '50000000-0000-0000-0000-000000000016',
    'What is the index of the first element in a Java array?',
    'MCQ',
    '{"A":"0","B":"1","C":"-1","D":"Depends on the array size"}'::jsonb,
    'A',
    'Java arrays use zero-based indexing, so the first element is at index 0.',
    'BEGINNER',
    -1.000,
    TRUE
),

(
    '50000000-0000-0000-0000-000000000017',
    'What is the output of "Java".length()?',
    'MCQ',
    '{"A":"3","B":"4","C":"5","D":"Compilation error"}'::jsonb,
    'B',
    'The String length() method returns the number of characters. Java contains four characters.',
    'MEDIUM',
    0.000,
    TRUE
),

(
    '50000000-0000-0000-0000-000000000018',
    'What is printed? String s = "Java"; s.concat(" Programming"); System.out.println(s);',
    'MCQ',
    '{"A":"Java Programming","B":"Programming","C":"Java","D":"null"}'::jsonb,
    'C',
    'Strings are immutable in Java. concat() returns a new String, but its result is not assigned to s.',
    'HARD',
    1.000,
    TRUE
)

ON CONFLICT (id) DO NOTHING;


-- CATEGORY 2:

INSERT INTO questions (
    id,
    question_text,
    question_type,
    option_data,
    correct_answer,
    explanation,
    difficulty,
    difficulty_parameter,
    is_active
)
VALUES

-- SKILL 7


(
    '50000000-0000-0000-0000-000000000019',
    'What is an object in Java?',
    'MCQ',
    '{"A":"A blueprint for creating classes","B":"An instance of a class","C":"A method inside a class","D":"A package containing classes"}'::jsonb,
    'B',
    'An object is an instance of a class. It can have state and behavior.',
    'BEGINNER',
    -1.000,
    TRUE
),

(
    '50000000-0000-0000-0000-000000000020',
    'Which statement correctly creates an object of a class named Student in Java?',
    'MCQ',
    '{"A":"Student obj = new Student();","B":"Student obj = Student();","C":"new Student obj;","D":"object Student = new Student;"}'::jsonb,
    'A',
    'The new keyword creates an object by invoking the class constructor.',
    'MEDIUM',
    0.000,
    TRUE
),

(
    '50000000-0000-0000-0000-000000000021',
    'Consider the code: class Counter { int count = 0; } Counter c1 = new Counter(); Counter c2 = new Counter(); c1.count = 10; What is the value of c2.count?',
    'MCQ',
    '{"A":"10","B":"1","C":"0","D":"Compilation error"}'::jsonb,
    'C',
    'Each object has its own instance variable. Changing c1.count does not change c2.count.',
    'HARD',
    1.000,
    TRUE
),

-- SKILL 8: 

(
    '50000000-0000-0000-0000-000000000022',
    'Which access modifier is commonly used to restrict direct access to a class field for encapsulation?',
    'MCQ',
    '{"A":"public","B":"protected","C":"private","D":"static"}'::jsonb,
    'C',
    'The private modifier restricts direct access to a field from outside its declaring class.',
    'BEGINNER',
    -1.000,
    TRUE
),

(
    '50000000-0000-0000-0000-000000000023',
    'Which approach is commonly used to provide controlled access to private fields in Java?',
    'MCQ',
    '{"A":"Using only static methods","B":"Using getter and setter methods","C":"Making every field public","D":"Declaring every field final"}'::jsonb,
    'B',
    'Getter and setter methods allow controlled reading and modification of private fields.',
    'MEDIUM',
    0.000,
    TRUE
),

(
    '50000000-0000-0000-0000-000000000024',
    'Consider a private field balance in a BankAccount class. Which setter implementation best protects the balance from invalid negative values?',
    'MCQ',
    '{"A":"this.balance = value;","B":"if (value >= 0) { this.balance = value; }","C":"balance = -value;","D":"return balance;"}'::jsonb,
    'B',
    'Checking that the value is non-negative before updating the field provides basic validation.',
    'HARD',
    1.000,
    TRUE
),


-- SKILL 9


(
    '50000000-0000-0000-0000-000000000025',
    'Which keyword is used when one Java class inherits from another class?',
    'MCQ',
    '{"A":"implements","B":"inherits","C":"extends","D":"super"}'::jsonb,
    'C',
    'The extends keyword establishes inheritance between classes.',
    'BEGINNER',
    -1.000,
    TRUE
),

(
    '50000000-0000-0000-0000-000000000026',
    'What is the purpose of the super keyword in a Java subclass?',
    'MCQ',
    '{"A":"To create an unrelated object","B":"To access superclass members or constructors","C":"To make a method private","D":"To prevent inheritance"}'::jsonb,
    'B',
    'The super keyword refers to the immediate superclass and can access its members or invoke its constructor.',
    'MEDIUM',
    0.000,
    TRUE
),

(
    '50000000-0000-0000-0000-000000000027',
    'Which statement about class inheritance in Java is correct?',
    'MCQ',
    '{"A":"A class can directly extend multiple classes","B":"A class can directly extend only one class","C":"Interfaces cannot be implemented by a subclass","D":"A final class can always be extended"}'::jsonb,
    'B',
    'Java supports single inheritance for classes. A class can directly extend only one superclass.',
    'HARD',
    1.000,
    TRUE
),


-- SKILL 10


(
    '50000000-0000-0000-0000-000000000028',
    'What does polymorphism mean in object-oriented programming?',
    'MCQ',
    '{"A":"One class having no methods","B":"The ability of an entity to take multiple forms","C":"Hiding all class variables","D":"Creating objects without constructors"}'::jsonb,
    'B',
    'Polymorphism allows the same interface or reference type to represent different object forms.',
    'BEGINNER',
    -1.000,
    TRUE
),

(
    '50000000-0000-0000-0000-000000000029',
    'Which type of polymorphism is achieved through method overloading in Java?',
    'MCQ',
    '{"A":"Compile-time polymorphism","B":"Runtime polymorphism","C":"Dynamic memory allocation","D":"Data hiding"}'::jsonb,
    'A',
    'Method overloading is resolved by the compiler based on the method arguments.',
    'MEDIUM',
    0.000,
    TRUE
),

(
    '50000000-0000-0000-0000-000000000030',
    'What is printed? class Animal { void sound() { System.out.println("Animal"); } } class Dog extends Animal { @Override void sound() { System.out.println("Dog"); } } Animal a = new Dog(); a.sound();',
    'MCQ',
    '{"A":"Animal","B":"Dog","C":"Animal Dog","D":"Compilation error"}'::jsonb,
    'B',
    'The overridden method is selected at runtime based on the actual object type, which is Dog.',
    'HARD',
    1.000,
    TRUE
),

-- SKILL 11:

(
    '50000000-0000-0000-0000-000000000031',
    'Which keyword is used to declare an abstract class in Java?',
    'MCQ',
    '{"A":"interface","B":"abstract","C":"virtual","D":"implements"}'::jsonb,
    'B',
    'The abstract keyword is used to declare an abstract class.',
    'BEGINNER',
    -1.000,
    TRUE
),

(
    '50000000-0000-0000-0000-000000000032',
    'Which statement correctly describes an interface in Java?',
    'MCQ',
    '{"A":"A class uses the implements keyword to implement an interface","B":"An interface must always be instantiated directly","C":"A class can implement only one interface","D":"An interface cannot declare methods"}'::jsonb,
    'A',
    'A Java class uses implements to provide implementations for an interface.',
    'MEDIUM',
    0.000,
    TRUE
),

(
    '50000000-0000-0000-0000-000000000033',
    'What happens when code attempts to directly create an object of an abstract class?',
    'MCQ',
    '{"A":"The object is created with default methods","B":"The abstract methods are automatically implemented","C":"A compilation error occurs","D":"The class becomes concrete automatically"}'::jsonb,
    'C',
    'An abstract class cannot be instantiated directly. A concrete subclass must be created instead.',
    'HARD',
    1.000,
    TRUE
),

-- SKILL 12: 

(
    '50000000-0000-0000-0000-000000000034',
    'Which block is used to handle an exception in Java?',
    'MCQ',
    '{"A":"try","B":"catch","C":"finally","D":"throws"}'::jsonb,
    'B',
    'The catch block handles an exception thrown from the associated try block.',
    'BEGINNER',
    -1.000,
    TRUE
),

(
    '50000000-0000-0000-0000-000000000035',
    'Which statement about the finally block in Java is correct?',
    'MCQ',
    '{"A":"It executes only when an exception occurs","B":"It normally executes whether or not an exception occurs","C":"It can be used only without a catch block","D":"It declares checked exceptions"}'::jsonb,
    'B',
    'The finally block normally executes after the try and catch blocks, whether or not an exception occurs.',
    'MEDIUM',
    0.000,
    TRUE
),

(
    '50000000-0000-0000-0000-000000000036',
    'What happens if a catch block for Exception appears before a catch block for IOException in the same try-catch structure?',
    'MCQ',
    '{"A":"Both catch blocks execute","B":"IOException is handled by the second block","C":"A compilation error occurs because the IOException catch is unreachable","D":"The program skips both catch blocks"}'::jsonb,
    'C',
    'IOException is a subclass of Exception. The earlier Exception catch already handles it, making the later IOException catch unreachable.',
    'HARD',
    1.000,
    TRUE
)

ON CONFLICT (id) DO NOTHING;



-- CATEGORY 3


INSERT INTO questions (
    id,
    question_text,
    question_type,
    option_data,
    correct_answer,
    explanation,
    difficulty,
    difficulty_parameter,
    is_active
)
VALUES


-- SKILL 13

(
    '50000000-0000-0000-0000-000000000037',
    'Which Java collection interface allows duplicate elements and maintains their insertion order?',
    'MCQ',
    '{"A":"Set","B":"List","C":"Map","D":"Queue"}'::jsonb,
    'B',
    'The List interface allows duplicate elements and preserves their positional order.',
    'BEGINNER',
    -1.000,
    TRUE
),

(
    '50000000-0000-0000-0000-000000000038',
    'Which Java collection is most suitable for storing unique elements without requiring insertion order?',
    'MCQ',
    '{"A":"ArrayList","B":"LinkedList","C":"HashSet","D":"Stack"}'::jsonb,
    'C',
    'HashSet stores unique elements and does not guarantee insertion order.',
    'MEDIUM',
    0.000,
    TRUE
),

(
    '50000000-0000-0000-0000-000000000039',
    'Consider the code: Map<String, Integer> marks = new HashMap<>(); marks.put("A", 80); marks.put("B", 90); marks.put("A", 95); What is the value returned by marks.get("A")?',
    'MCQ',
    '{"A":"80","B":"90","C":"95","D":"null"}'::jsonb,
    'C',
    'A Map cannot store multiple values for the same key. The second put operation replaces the previous value associated with A.',
    'HARD',
    1.000,
    TRUE
),


-- SKILL 14

(
    '50000000-0000-0000-0000-000000000040',
    'Which method is commonly used to calculate the hash value of a key in Java HashMap?',
    'MCQ',
    '{"A":"hashCode()","B":"equals()","C":"toString()","D":"compareTo()"}'::jsonb,
    'A',
    'HashMap uses the key hash code as part of determining the bucket location.',
    'BEGINNER',
    -1.000,
    TRUE
),

(
    '50000000-0000-0000-0000-000000000041',
    'What happens when two different keys in a HashMap have the same hash value?',
    'MCQ',
    '{"A":"One key is automatically deleted","B":"A hash collision occurs","C":"The HashMap becomes empty","D":"The second key is always rejected"}'::jsonb,
    'B',
    'When different keys map to the same bucket, a hash collision occurs. HashMap handles collisions internally.',
    'MEDIUM',
    0.000,
    TRUE
),

(
    '50000000-0000-0000-0000-000000000042',
    'Why should equals() and hashCode() be implemented consistently when using custom objects as HashMap keys?',
    'MCQ',
    '{"A":"To ensure equal objects have equal hash codes","B":"To make every object have a unique hash code","C":"To sort keys alphabetically","D":"To prevent all hash collisions"}'::jsonb,
    'A',
    'The Java contract requires equal objects to have equal hash codes so hash-based collections can locate matching keys correctly.',
    'HARD',
    1.000,
    TRUE
),


-- SKILL 15


(
    '50000000-0000-0000-0000-000000000052',
    'Which searching algorithm repeatedly divides a sorted search space into two halves?',
    'MCQ',
    '{"A":"Linear Search","B":"Binary Search","C":"Selection Sort","D":"Bubble Sort"}'::jsonb,
    'B',
    'Binary Search compares the target with the middle element and eliminates half of the remaining search space.',
    'BEGINNER',
    -1.000,
    TRUE
),

(
    '50000000-0000-0000-0000-000000000053',
    'What is the worst-case time complexity of Binary Search on a sorted array of n elements?',
    'MCQ',
    '{"A":"O(1)","B":"O(log n)","C":"O(n)","D":"O(n²)"}'::jsonb,
    'B',
    'Binary Search repeatedly halves the search space, resulting in logarithmic worst-case time complexity.',
    'MEDIUM',
    0.000,
    TRUE
),

(
    '50000000-0000-0000-0000-000000000054',
    'What is the worst-case time complexity of Merge Sort for an array of n elements?',
    'MCQ',
    '{"A":"O(n)","B":"O(log n)","C":"O(n log n)","D":"O(n²)"}'::jsonb,
    'C',
    'Merge Sort divides the array into halves and merges the sorted parts. Its worst-case time complexity is O(n log n).',
    'HARD',
    1.000,
    TRUE
)

ON CONFLICT (id) DO NOTHING;


-- CATEGORY 4
INSERT INTO questions (
    id,
    question_text,
    question_type,
    option_data,
    correct_answer,
    explanation,
    difficulty,
    difficulty_parameter,
    is_active
)
VALUES

-- SKILL 16

(
    '50000000-0000-0000-0000-000000000055',
    'What does a row represent in a relational database table?',
    'MCQ',
    '{"A":"A database","B":"A record","C":"A column","D":"A relationship"}'::jsonb,
    'B',
    'A row represents a single record or tuple in a relational table.',
    'BEGINNER',
    -1.000,
    TRUE
),

(
    '50000000-0000-0000-0000-000000000056',
    'What is the purpose of a database schema?',
    'MCQ',
    '{"A":"To define the structure of database objects","B":"To store only user passwords","C":"To execute SELECT queries automatically","D":"To remove duplicate records"}'::jsonb,
    'A',
    'A schema defines the logical structure of database objects such as tables, columns and constraints.',
    'MEDIUM',
    0.000,
    TRUE
),

(
    '50000000-0000-0000-0000-000000000057',
    'A table has 8 rows and 5 columns. How many tuples and attributes does it contain?',
    'MCQ',
    '{"A":"5 tuples and 8 attributes","B":"8 tuples and 5 attributes","C":"13 tuples and attributes","D":"40 tuples and attributes"}'::jsonb,
    'B',
    'Rows represent tuples and columns represent attributes. Therefore, the table has 8 tuples and 5 attributes.',
    'HARD',
    1.000,
    TRUE
),

-- SKILL 17

(
    '50000000-0000-0000-0000-000000000058',
    'Which SQL command is used to retrieve data from a table?',
    'MCQ',
    '{"A":"INSERT","B":"UPDATE","C":"SELECT","D":"DELETE"}'::jsonb,
    'C',
    'SELECT retrieves data from one or more database tables.',
    'BEGINNER',
    -1.000,
    TRUE
),

(
    '50000000-0000-0000-0000-000000000059',
    'Which SQL clause filters rows based on a specified condition?',
    'MCQ',
    '{"A":"ORDER BY","B":"WHERE","C":"GROUP BY","D":"DISTINCT"}'::jsonb,
    'B',
    'The WHERE clause filters rows according to a specified condition.',
    'MEDIUM',
    0.000,
    TRUE
),

(
    '50000000-0000-0000-0000-000000000060',
    'Which query retrieves the second-highest distinct salary from an Employee table?',
    'MCQ',
    '{"A":"SELECT MAX(salary) FROM Employee;","B":"SELECT MIN(salary) FROM Employee;","C":"SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);","D":"SELECT salary FROM Employee ORDER BY salary ASC LIMIT 1;"}'::jsonb,
    'C',
    'The subquery finds the highest salary. The outer query finds the maximum salary below that value, giving the second-highest distinct salary when at least two distinct non-NULL salaries exist.',
    'HARD',
    1.000,
    TRUE
),


-- SKILL 18


(
    '50000000-0000-0000-0000-000000000061',
    'Which SQL JOIN returns only rows that have matching values in both tables?',
    'MCQ',
    '{"A":"LEFT JOIN","B":"RIGHT JOIN","C":"INNER JOIN","D":"FULL OUTER JOIN"}'::jsonb,
    'C',
    'INNER JOIN returns rows where the join condition matches in both tables.',
    'BEGINNER',
    -1.000,
    TRUE
),

(
    '50000000-0000-0000-0000-000000000062',
    'What does a LEFT JOIN return when a row from the left table has no matching row in the right table?',
    'MCQ',
    '{"A":"The left row is excluded","B":"The left row is returned with NULL values for right-table columns","C":"The query always fails","D":"The unmatched left row is deleted"}'::jsonb,
    'B',
    'LEFT JOIN preserves all rows from the left table and supplies NULL values for unmatched right-table columns.',
    'MEDIUM',
    0.000,
    TRUE
),

(
    '50000000-0000-0000-0000-000000000063',
    'A subquery returns multiple rows. Which operator is suitable for checking whether a value matches any value returned by that subquery?',
    'MCQ',
    '{"A":"=","B":"IN","C":"LIKE","D":"IS NULL"}'::jsonb,
    'B',
    'IN checks whether an expression matches any value in the set returned by the subquery.',
    'HARD',
    1.000,
    TRUE
),

-- SKILL 19

(
    '50000000-0000-0000-0000-000000000064',
    'What is the main purpose of a primary key?',
    'MCQ',
    '{"A":"To uniquely identify each row","B":"To store duplicate records","C":"To connect every database to the internet","D":"To sort rows automatically"}'::jsonb,
    'A',
    'A primary key uniquely identifies each row in a table and cannot contain NULL values.',
    'BEGINNER',
    -1.000,
    TRUE
),

(
    '50000000-0000-0000-0000-000000000065',
    'What does a foreign key enforce between two relational tables?',
    'MCQ',
    '{"A":"Data encryption","B":"Referential integrity","C":"Automatic sorting","D":"Unique values in every column"}'::jsonb,
    'B',
    'A foreign key ensures that referenced values correspond to valid rows in the referenced table, subject to the constraint rules.',
    'MEDIUM',
    0.000,
    TRUE
),

(
    '50000000-0000-0000-0000-000000000066',
    'A table uses (student_id, course_id) together as its primary key. What type of key is this?',
    'MCQ',
    '{"A":"Candidate key","B":"Foreign key","C":"Composite key","D":"Surrogate key"}'::jsonb,
    'C',
    'A composite key consists of two or more columns that jointly identify a row.',
    'HARD',
    1.000,
    TRUE
),


-- SKILL 20

(
    '50000000-0000-0000-0000-000000000067',
    'What is the primary goal of database normalization?',
    'MCQ',
    '{"A":"To increase unnecessary duplication","B":"To reduce data redundancy and update anomalies","C":"To remove all foreign keys","D":"To combine every table into one"}'::jsonb,
    'B',
    'Normalization organizes relational data to reduce redundancy and prevent insertion, update and deletion anomalies.',
    'BEGINNER',
    -1.000,
    TRUE
),

(
    '50000000-0000-0000-0000-000000000068',
    'A relation is in First Normal Form (1NF) when each attribute contains:',
    'MCQ',
    '{"A":"Only multiple values","B":"Atomic values","C":"Only foreign keys","D":"Calculated values"}'::jsonb,
    'B',
    'First Normal Form requires each attribute value to be atomic, with no repeating groups or multivalued cells.',
    'MEDIUM',
    0.000,
    TRUE
),

(
    '50000000-0000-0000-0000-000000000069',
    'A relation is in 2NF when it is already in 1NF and every non-prime attribute is:',
    'MCQ',
    '{"A":"Fully functionally dependent on every candidate key","B":"Dependent on only part of a candidate key","C":"Always a foreign key","D":"Independent of all candidate keys"}'::jsonb,
    'A',
    'Second Normal Form removes partial dependencies of non-prime attributes on candidate keys.',
    'HARD',
    1.000,
    TRUE
),

-- SKILL 21

(
    '50000000-0000-0000-0000-000000000070',
    'Which ACID property ensures that a transaction is treated as one indivisible unit?',
    'MCQ',
    '{"A":"Consistency","B":"Isolation","C":"Atomicity","D":"Durability"}'::jsonb,
    'C',
    'Atomicity ensures that all operations in a transaction succeed together or the transaction is rolled back.',
    'BEGINNER',
    -1.000,
    TRUE
),

(
    '50000000-0000-0000-0000-000000000071',
    'Which SQL command permanently saves the changes made by a transaction?',
    'MCQ',
    '{"A":"ROLLBACK","B":"COMMIT","C":"SAVEPOINT","D":"GRANT"}'::jsonb,
    'B',
    'COMMIT makes the transaction changes permanent.',
    'MEDIUM',
    0.000,
    TRUE
),

(
    '50000000-0000-0000-0000-000000000072',
    'Which ACID property ensures that committed transaction changes survive a system failure?',
    'MCQ',
    '{"A":"Atomicity","B":"Consistency","C":"Isolation","D":"Durability"}'::jsonb,
    'D',
    'Durability ensures that committed changes persist even after a system crash or restart.',
    'HARD',
    1.000,
    TRUE
)

ON CONFLICT (id) DO NOTHING;


-- CATEGORY 

-- Skill 22

INSERT INTO questions
(id, question_text, question_type, option_data, correct_answer, explanation, difficulty, difficulty_parameter, is_active)
VALUES

('50000000-0000-0000-0000-000000000073',
'What is the primary purpose of DNS?',
'MCQ',
'{"A":"To encrypt network traffic","B":"To convert domain names into IP addresses","C":"To store website files","D":"To increase internet speed"}'::jsonb,
'B',
'DNS (Domain Name System) translates human-readable domain names into IP addresses that computers use to communicate.',
'BEGINNER', -1.000, TRUE),

('50000000-0000-0000-0000-000000000074',
'What happens when a user enters a website URL in a browser?',
'MCQ',
'{"A":"The browser directly executes the website database","B":"The browser requests the website from a server using network protocols","C":"The browser automatically downloads the server operating system","D":"The browser converts the URL into source code"}'::jsonb,
'B',
'The browser resolves the domain name and sends a request to the appropriate server using network protocols such as HTTP or HTTPS.',
'MEDIUM', 0.000, TRUE),

('50000000-0000-0000-0000-000000000075',
'Which statement best describes the role of an IP address in internet communication?',
'MCQ',
'{"A":"It identifies a device or network interface for communication","B":"It stores the HTML content of a website","C":"It encrypts passwords automatically","D":"It identifies the programming language used by a server"}'::jsonb,
'A',
'An IP address provides an address used to identify a device or network interface so that data can be routed to the correct destination.',
'HARD', 1.000, TRUE)
ON CONFLICT (id) DO NOTHING;

-- Skill 23

INSERT INTO questions
(id, question_text, question_type, option_data, correct_answer, explanation, difficulty, difficulty_parameter, is_active)
VALUES

('50000000-0000-0000-0000-000000000076',
'In client-server architecture, what is the primary role of a client?',
'MCQ',
'{"A":"To provide services to all servers","B":"To request services or resources from a server","C":"To manage the server operating system","D":"To store all server source code"}'::jsonb,
'B',
'A client initiates requests for resources or services, while the server processes those requests and provides responses.',
'BEGINNER', -1.000, TRUE),

('50000000-0000-0000-0000-000000000077',
'In a web application, which component generally processes business logic and communicates with the database?',
'MCQ',
'{"A":"Browser","B":"CSS stylesheet","C":"Backend server","D":"HTML document"}'::jsonb,
'C',
'The backend server handles application logic, processes requests, and communicates with the database when required.',
'MEDIUM', 0.000, TRUE),

('50000000-0000-0000-0000-000000000078',
'A server receives requests from many clients simultaneously. Which approach helps it handle multiple requests efficiently?',
'MCQ',
'{"A":"Processing only one request during the entire server lifetime","B":"Using concurrency or asynchronous request processing","C":"Disabling network communication","D":"Storing every request only in the browser"}'::jsonb,
'B',
'Concurrency and asynchronous processing allow a server to make progress on multiple requests without waiting for each request to finish sequentially.',
'HARD', 1.000, TRUE)
ON CONFLICT (id) DO NOTHING;

-- Skill 24

INSERT INTO questions
(id, question_text, question_type, option_data, correct_answer, explanation, difficulty, difficulty_parameter, is_active)
VALUES

('50000000-0000-0000-0000-000000000079',
'What does HTTP stand for?',
'MCQ',
'{"A":"HyperText Transfer Protocol","B":"High Transfer Text Process","C":"Hyper Transfer Technical Program","D":"Host Text Transmission Protocol"}'::jsonb,
'A',
'HTTP stands for HyperText Transfer Protocol. It is used for communication between web clients and servers.',
'BEGINNER', -1.000, TRUE),

('50000000-0000-0000-0000-000000000080',
'What is the main security benefit of HTTPS over HTTP?',
'MCQ',
'{"A":"It makes websites load without servers","B":"It encrypts communication using TLS","C":"It removes the need for IP addresses","D":"It automatically prevents every type of cyberattack"}'::jsonb,
'B',
'HTTPS uses TLS to encrypt communication between the client and server, helping protect data during transmission.',
'MEDIUM', 0.000, TRUE),

('50000000-0000-0000-0000-000000000081',
'During a TLS handshake, what is one important purpose of the server certificate?',
'MCQ',
'{"A":"To prove the server identity to the client","B":"To store the complete website database","C":"To assign a private IP address to the client","D":"To replace the HTTP protocol"}'::jsonb,
'A',
'A server certificate helps the client verify the server identity and contains information used to establish a secure TLS connection.',
'HARD', 1.000, TRUE)
ON CONFLICT (id) DO NOTHING;

-- Skill 25

INSERT INTO questions
(id, question_text, question_type, option_data, correct_answer, explanation, difficulty, difficulty_parameter, is_active)
VALUES

('50000000-0000-0000-0000-000000000082',
'What does REST stand for?',
'MCQ',
'{"A":"Representational State Transfer","B":"Remote Execution Service Technology","C":"Resource Exchange System Transfer","D":"Representational Server Technology"}'::jsonb,
'A',
'REST stands for Representational State Transfer. It is an architectural style used to design network-based applications.',
'BEGINNER', -1.000, TRUE),

('50000000-0000-0000-0000-000000000083',
'Which statement is a key characteristic of REST APIs?',
'MCQ',
'{"A":"The server must store every client session permanently","B":"Each request should contain the information needed to process it","C":"REST APIs can only return XML","D":"Every REST endpoint must use the POST method"}'::jsonb,
'B',
'REST follows a stateless communication constraint. Each request should contain the information needed for the server to process it.',
'MEDIUM', 0.000, TRUE),

('50000000-0000-0000-0000-000000000084',
'An API uses GET /users/42 to retrieve a user. Which design best follows REST resource-oriented principles?',
'MCQ',
'{"A":"GET /getUserDetails?id=42","B":"POST /users/delete/42","C":"GET /users/42","D":"GET /executeUserOperation/42"}'::jsonb,
'C',
'GET /users/42 identifies a user resource through its URI and uses GET to retrieve its representation.',
'HARD', 1.000, TRUE)
ON CONFLICT (id) DO NOTHING;

-- Skill 26

INSERT INTO questions
(id, question_text, question_type, option_data, correct_answer, explanation, difficulty, difficulty_parameter, is_active)
VALUES

('50000000-0000-0000-0000-000000000085',
'Which HTTP method is commonly used to retrieve data from a server?',
'MCQ',
'{"A":"POST","B":"DELETE","C":"GET","D":"PATCH"}'::jsonb,
'C',
'GET is used to retrieve a representation of a resource from the server.',
'BEGINNER', -1.000, TRUE),

('50000000-0000-0000-0000-000000000086',
'Which HTTP status code indicates that a resource was successfully created?',
'MCQ',
'{"A":"200 OK","B":"201 Created","C":"400 Bad Request","D":"500 Internal Server Error"}'::jsonb,
'B',
'201 Created indicates that the request succeeded and resulted in the creation of a resource.',
'MEDIUM', 0.000, TRUE),

('50000000-0000-0000-0000-000000000087',
'Which HTTP method is generally preferred for partially updating an existing resource?',
'MCQ',
'{"A":"GET","B":"POST","C":"PATCH","D":"OPTIONS"}'::jsonb,
'C',
'PATCH is generally used for partial modifications to a resource, while PUT commonly represents replacement of the resource.',
'HARD', 1.000, TRUE)
ON CONFLICT (id) DO NOTHING;

-- Skill 27

INSERT INTO questions
(id, question_text, question_type, option_data, correct_answer, explanation, difficulty, difficulty_parameter, is_active)
VALUES

('50000000-0000-0000-0000-000000000088',
'What is authentication?',
'MCQ',
'{"A":"Checking what actions a user can perform","B":"Verifying the identity of a user","C":"Deleting a user account","D":"Creating a database table"}'::jsonb,
'B',
'Authentication verifies who a user is, commonly through credentials or another identity verification method.',
'BEGINNER', -1.000, TRUE),

('50000000-0000-0000-0000-000000000089',
'What is the main difference between authentication and authorization?',
'MCQ',
'{"A":"Authentication verifies identity, while authorization checks permissions","B":"Both terms mean exactly the same thing","C":"Authorization verifies identity, while authentication checks permissions","D":"Authentication is only used in databases"}'::jsonb,
'A',
'Authentication answers who you are, whereas authorization determines what resources or actions you are allowed to access.',
'MEDIUM', 0.000, TRUE),

('50000000-0000-0000-0000-000000000090',
'A user has a valid login token but does not have permission to access an admin-only endpoint. What should the API generally return?',
'MCQ',
'{"A":"200 OK","B":"201 Created","C":"401 Unauthorized","D":"403 Forbidden"}'::jsonb,
'D',
'403 Forbidden indicates that the server understood the request but refuses access because the authenticated user lacks the required permission.',
'HARD', 1.000, TRUE)

ON CONFLICT (id) DO NOTHING;



-- CATEGORY 6
-- Skill 28

INSERT INTO questions
(id, question_text, question_type, option_data, correct_answer, explanation, difficulty, difficulty_parameter, is_active)
VALUES

('50000000-0000-0000-0000-000000000091',
'What is the primary purpose of the Spring Framework?',
'MCQ',
'{"A":"To develop only frontend applications","B":"To simplify Java application development through features like dependency injection","C":"To replace the Java programming language","D":"To manage only database backups"}'::jsonb,
'B',
'Spring simplifies Java application development by providing features such as dependency injection, IoC, transaction management, and more.',
'BEGINNER', -1.000, TRUE),

('50000000-0000-0000-0000-000000000092',
'What does Inversion of Control (IoC) mean in Spring?',
'MCQ',
'{"A":"Objects create and manage all their dependencies themselves","B":"The framework takes responsibility for creating and managing objects","C":"The database controls Java objects","D":"The application stops using objects"}'::jsonb,
'B',
'IoC means that object creation and dependency management are handled by the Spring container rather than being controlled entirely by application code.',
'MEDIUM', 0.000, TRUE),

('50000000-0000-0000-0000-000000000093',
'Which Spring component is responsible for managing application beans and their dependencies?',
'MCQ',
'{"A":"Spring Container","B":"JDBC Driver","C":"Servlet Browser","D":"Maven Compiler"}'::jsonb,
'A',
'The Spring IoC container creates, configures, and manages beans along with their dependencies.',
'HARD', 1.000, TRUE)
ON CONFLICT (id) DO NOTHING;

-- Skill 29

INSERT INTO questions
(id, question_text, question_type, option_data, correct_answer, explanation, difficulty, difficulty_parameter, is_active)
VALUES

('50000000-0000-0000-0000-000000000094',
'What is a Spring Bean?',
'MCQ',
'{"A":"A Java object managed by the Spring IoC container","B":"A database table","C":"A Maven dependency file","D":"A frontend component"}'::jsonb,
'A',
'A Spring Bean is an object instantiated, assembled, and managed by the Spring IoC container.',
'BEGINNER', -1.000, TRUE),

('50000000-0000-0000-0000-000000000095',
'Which annotation is commonly used to inject a dependency into a Spring component?',
'MCQ',
'{"A":"@Entity","B":"@Autowired","C":"@Table","D":"@Override"}'::jsonb,
'B',
'@Autowired allows Spring to resolve and inject a required dependency. Constructor injection is generally preferred for mandatory dependencies.',
'MEDIUM', 0.000, TRUE),

('50000000-0000-0000-0000-000000000096',
'Why is constructor injection generally preferred over field injection in Spring?',
'MCQ',
'{"A":"It removes the need for dependency objects","B":"It makes dependencies explicit and supports immutable fields and easier unit testing","C":"It automatically creates database tables","D":"It prevents the application from using interfaces"}'::jsonb,
'B',
'Constructor injection makes required dependencies explicit, allows final fields, and makes it easier to create objects in unit tests without relying on Spring reflection.',
'HARD', 1.000, TRUE)
ON CONFLICT (id) DO NOTHING;

-- Skill 30

INSERT INTO questions
(id, question_text, question_type, option_data, correct_answer, explanation, difficulty, difficulty_parameter, is_active)
VALUES

('50000000-0000-0000-0000-000000000097',
'Which annotation is commonly used as the main entry point of a Spring Boot application?',
'MCQ',
'{"A":"@SpringBootApplication","B":"@RestController","C":"@Entity","D":"@Repository"}'::jsonb,
'A',
'@SpringBootApplication is commonly placed on the main application class and combines configuration, component scanning, and auto-configuration support.',
'BEGINNER', -1.000, TRUE),

('50000000-0000-0000-0000-000000000098',
'What is the purpose of Spring Boot auto-configuration?',
'MCQ',
'{"A":"To automatically write all business logic","B":"To configure application components based on available dependencies and settings","C":"To remove the need for Java classes","D":"To automatically deploy every application to the cloud"}'::jsonb,
'B',
'Spring Boot auto-configuration attempts to configure beans based on the dependencies present on the classpath and the application configuration.',
'MEDIUM', 0.000, TRUE),

('50000000-0000-0000-0000-000000000099',
'Which annotation can be used to exclude a specific auto-configuration class from a Spring Boot application?',
'MCQ',
'{"A":"@EnableAutoConfiguration(exclude = SomeAutoConfiguration.class)","B":"@Entity(exclude = true)","C":"@Autowired(exclude = true)","D":"@ComponentScan(disable = true)"}'::jsonb,
'A',
'The exclude attribute of @EnableAutoConfiguration can exclude a specified auto-configuration class. The same option is available through @SpringBootApplication.',
'HARD', 1.000, TRUE)
ON CONFLICT (id) DO NOTHING;

-- Skill 31

INSERT INTO questions
(id, question_text, question_type, option_data, correct_answer, explanation, difficulty, difficulty_parameter, is_active)
VALUES

('50000000-0000-0000-0000-000000000100',
'What is the purpose of the @Entity annotation in JPA?',
'MCQ',
'{"A":"To mark a Java class as a persistent entity","B":"To create a REST endpoint","C":"To start the Spring Boot server","D":"To define a CSS class"}'::jsonb,
'A',
'@Entity marks a Java class as an entity that can be mapped to a database table through JPA.',
'BEGINNER', -1.000, TRUE),

('50000000-0000-0000-0000-000000000101',
'What is the main purpose of a JpaRepository in Spring Data JPA?',
'MCQ',
'{"A":"To design frontend pages","B":"To provide ready-made database operations for entity management","C":"To configure HTTP security","D":"To compile Java source files"}'::jsonb,
'B',
'JpaRepository provides common persistence operations such as saving, finding, deleting, and pagination for JPA entities.',
'MEDIUM', 0.000, TRUE),

('50000000-0000-0000-0000-000000000102',
'In JPA, what does the @Transactional annotation primarily help manage?',
'MCQ',
'{"A":"CSS rendering","B":"Database transaction boundaries","C":"HTTP URL mapping","D":"Java package imports"}'::jsonb,
'B',
'@Transactional defines transaction boundaries so that database operations can be committed or rolled back together according to the transaction outcome.',
'HARD', 1.000, TRUE)
ON CONFLICT (id) DO NOTHING;

-- Skill 32

INSERT INTO questions
(id, question_text, question_type, option_data, correct_answer, explanation, difficulty, difficulty_parameter, is_active)
VALUES

('50000000-0000-0000-0000-000000000103',
'What is the main purpose of unit testing?',
'MCQ',
'{"A":"To test individual units of code in isolation","B":"To test the entire production network","C":"To deploy the application","D":"To create database backups"}'::jsonb,
'A',
'Unit testing checks individual methods or components independently to verify that they behave as expected.',
'BEGINNER', -1.000, TRUE),

('50000000-0000-0000-0000-000000000104',
'Which annotation is commonly used in JUnit 5 to mark a test method?',
'MCQ',
'{"A":"@Test","B":"@Entity","C":"@Bean","D":"@RequestMapping"}'::jsonb,
'A',
'JUnit 5 uses the @Test annotation to identify methods that should be executed as test cases.',
'MEDIUM', 0.000, TRUE),

('50000000-0000-0000-0000-000000000105',
'What is the key difference between unit testing and integration testing?',
'MCQ',
'{"A":"Unit testing checks isolated components, while integration testing checks interactions between components","B":"Unit testing is only for databases, while integration testing is only for frontend code","C":"Both always test the entire deployed application","D":"Integration testing does not execute application code"}'::jsonb,
'A',
'Unit tests focus on isolated units, while integration tests verify that multiple components work together correctly.',
'HARD', 1.000, TRUE)
ON CONFLICT (id) DO NOTHING;

-- Skill 33

INSERT INTO questions
(id, question_text, question_type, option_data, correct_answer, explanation, difficulty, difficulty_parameter, is_active)
VALUES

('50000000-0000-0000-0000-000000000106',
'What is Docker primarily used for?',
'MCQ',
'{"A":"Creating and running applications inside containers","B":"Writing SQL queries only","C":"Designing website layouts","D":"Replacing programming languages"}'::jsonb,
'A',
'Docker is a platform used to build, package, and run applications in containers.',
'BEGINNER', -1.000, TRUE),

('50000000-0000-0000-0000-000000000107',
'What does CI stand for in CI/CD?',
'MCQ',
'{"A":"Code Installation","B":"Continuous Integration","C":"Container Initialization","D":"Central Interface"}'::jsonb,
'B',
'Continuous Integration involves frequently integrating code changes and automatically building and testing them.',
'MEDIUM', 0.000, TRUE),

('50000000-0000-0000-0000-000000000108',
'What is the main purpose of a CI/CD pipeline?',
'MCQ',
'{"A":"To manually edit every source file","B":"To automate stages such as building, testing, and deploying applications","C":"To replace version control systems","D":"To store passwords in source code"}'::jsonb,
'B',
'A CI/CD pipeline automates software delivery stages such as building, running tests, and deploying changes.',
'HARD', 1.000, TRUE)

ON CONFLICT (id) DO NOTHING;
