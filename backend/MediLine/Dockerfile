FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY . .

# Package the application
RUN ./mvnw clean package -DskipTests

# Copy jar explicitly (safer)
RUN cp target/*.jar app.jar

CMD ["java", "-jar", "app.jar"]
