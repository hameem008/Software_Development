FROM eclipse-temurin:21-jdk

# Set the working directory inside the container
WORKDIR /app

# Copy all files from the project directory into the container
COPY . .

# ✅ Make the Maven wrapper executable
RUN chmod +x mvnw

# 🛠️ Package the Spring Boot application, skipping tests
RUN ./mvnw clean package -DskipTests

# ✅ Copy the resulting JAR file to a known name
RUN cp target/*.jar app.jar

# 🔥 Set the default command to run the Spring Boot app
CMD ["java", "-jar", "app.jar"]
