FROM eclipse-temurin:21-jdk

WORKDIR /app

# Copy Maven config first to cache dependencies
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

RUN ./mvnw dependency:go-offline

# Copy source code
COPY src ./src

# Build the app
RUN ./mvnw clean package -DskipTests

# Copy the JAR
RUN cp target/*.jar app.jar

CMD ["java", "-jar", "app.jar"]
