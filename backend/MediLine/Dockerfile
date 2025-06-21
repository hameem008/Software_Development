# Use a JDK base image for Java 21 (since your pom.xml uses Java 21)
FROM eclipse-temurin:21-jdk

# Set working directory
WORKDIR /app

# Copy all project files
COPY . .

# Package the application (skip tests for speed)
RUN ./mvnw clean package -DskipTests

# Run the Spring Boot application
CMD ["java", "-jar", "target/MediLine-0.0.1-SNAPSHOT.jar"]
