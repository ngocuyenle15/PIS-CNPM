# Stage 1: Build
FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /app

COPY mvnw ./
COPY .mvn .mvn
COPY pom.xml ./

RUN chmod +x mvnw

RUN ./mvnw dependency:resolve -B -q

COPY src ./src

RUN ./mvnw clean package -DskipTests -B -q

# Stage 2: Runtime 
FROM eclipse-temurin:17-jre-alpine AS runtime

LABEL authors="Uyen"
LABEL description="PIS Backend - Spring Boot Application"

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

USER appuser

ENV SERVER_PORT=8080
ENV MySQL_JDBC_URL=jdbc:mysql://host.docker.internal:3306/pis
ENV MySQL_USER=root
ENV MySQL_PASSWORD=123456
ENV EMAIL_USERNAME=
ENV EMAIL_PASSWORD=

ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:InitialRAMPercentage=50.0 -Djava.security.egd=file:/dev/./urandom"
EXPOSE ${SERVER_PORT}

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]