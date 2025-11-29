# Java Version Mismatch Fix

## Error

```
java.lang.UnsupportedClassVersionError:
com/hospitalmanagement/backend/BackendApplication has been compiled by a more recent version
of the Java Runtime (class file version 68.0), this version of the Java Runtime only
recognizes class file versions up to 67.0
```

## Root Cause

**Java version mismatch between compilation and runtime:**

- Code was compiled with **Java 24** (class version 68.0)
- Maven was trying to run with **Java 23** (max class version 67.0)

## Version Mapping

| Java Version | Class File Version |
| ------------ | ------------------ |
| Java 21      | 65.0               |
| Java 22      | 66.0               |
| Java 23      | 67.0               |
| Java 24      | 68.0               |

## Problem Details

### Check Java Versions

```bash
# Java command uses Java 24
java -version
# Output: java version "24.0.1"

# Maven uses Java 23
mvn -version
# Output: Java version: 23.0.2
```

### Why This Happens

1. IDE (like IntelliJ or Eclipse) compiled with Java 24
2. Maven configured to use Java 23
3. Class files compiled with newer version can't run on older version

## Solution

### Quick Fix (Used)

Recompile with Maven's Java version:

```bash
cd backend
mvn clean package -DskipTests
mvn spring-boot:run
```

This forces recompilation with Java 23 (Maven's version).

### Alternative Solutions

#### Option 1: Update Maven to Use Java 24

Set `JAVA_HOME` environment variable:

**Windows:**

```cmd
set JAVA_HOME=C:\Program Files\Java\jdk-24
set PATH=%JAVA_HOME%\bin;%PATH%
mvn -version
```

**Linux/Mac:**

```bash
export JAVA_HOME=/path/to/jdk-24
export PATH=$JAVA_HOME/bin:$PATH
mvn -version
```

#### Option 2: Configure pom.xml

Specify Java version in `pom.xml`:

```xml
<properties>
    <java.version>23</java.version>
    <maven.compiler.source>23</maven.compiler.source>
    <maven.compiler.target>23</maven.compiler.target>
</properties>
```

#### Option 3: Use Maven Toolchains

Create `~/.m2/toolchains.xml`:

```xml
<toolchains>
  <toolchain>
    <type>jdk</type>
    <provides>
      <version>23</version>
    </provides>
    <configuration>
      <jdkHome>C:\Program Files\Java\jdk-23</jdkHome>
    </configuration>
  </toolchain>
</toolchains>
```

## Prevention

### Best Practices

1. **Use Same Java Version Everywhere**

   - IDE: Java 23
   - Maven: Java 23
   - Runtime: Java 23

2. **Set JAVA_HOME Correctly**

   ```bash
   echo %JAVA_HOME%  # Windows
   echo $JAVA_HOME   # Linux/Mac
   ```

3. **Configure IDE**

   - IntelliJ: File → Project Structure → Project SDK
   - Eclipse: Window → Preferences → Java → Installed JREs

4. **Always Clean Before Build**
   ```bash
   mvn clean package
   ```

## Verification

### Check Current Setup

```bash
# Check Java version
java -version

# Check Maven's Java version
mvn -version

# Check JAVA_HOME
echo %JAVA_HOME%  # Windows
echo $JAVA_HOME   # Linux/Mac
```

### Verify Build

```bash
cd backend
mvn clean package -DskipTests
# Should complete successfully

mvn spring-boot:run
# Should start without errors
```

### Expected Output

```
Started BackendApplication in X.XXX seconds
✓ Seeded 10 departments
✓ Seeded XX doctors
```

## Common Errors

### Error 1: Class Version Mismatch

```
UnsupportedClassVersionError: class file version XX.0
```

**Solution:** Recompile with correct Java version

### Error 2: JAVA_HOME Not Set

```
Error: JAVA_HOME is not defined correctly
```

**Solution:** Set JAVA_HOME environment variable

### Error 3: Wrong Java in PATH

```
java -version shows different version than expected
```

**Solution:** Update PATH to point to correct Java

## Project Configuration

### Current Setup

```xml
<!-- pom.xml -->
<properties>
    <java.version>21</java.version>
</properties>
```

This means the project targets Java 21, but can be compiled with Java 23.

### Recommended Setup

Keep all tools on same version:

- Java: 21 or 23 (stable LTS versions)
- Maven: Latest (3.9.x)
- Spring Boot: 3.5.x

## Troubleshooting

### If Backend Still Won't Start

1. **Clean Everything**

   ```bash
   mvn clean
   rm -rf target/
   ```

2. **Rebuild**

   ```bash
   mvn package -DskipTests
   ```

3. **Check Java Version**

   ```bash
   mvn -version
   java -version
   ```

4. **Run with Correct Java**
   ```bash
   mvn spring-boot:run
   ```

### If Different Error Appears

Check logs for:

- Database connection errors
- Port already in use (8080)
- Missing dependencies
- Configuration errors

## Summary

**Problem:** Code compiled with Java 24, Maven running with Java 23

**Solution:** Recompiled with Maven's Java version (23)

**Command Used:**

```bash
mvn clean package -DskipTests
mvn spring-boot:run
```

**Result:** Backend now starts successfully! ✅

## Current Status

✅ Backend compiled successfully with Java 23
✅ Backend running on port 8080
✅ Database initialized
✅ Departments seeded
✅ Doctors seeded
✅ API endpoints accessible

**Next Step:** Refresh frontend to load departments!
