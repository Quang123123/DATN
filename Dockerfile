FROM ubuntu:latest
#FROM eclipse-temurin:15-jdk
FROM adoptopenjdk/openjdk15
LABEL authors="Quang"
WORKDIR /app

COPY .mvn/ .mvn
COPY mvnw pom.xml ./
COPY src ./src
CMD chmod +x mvnw
RUN ./mvnw dependency:resolve
COPY --from=build /app ./
CMD ["./mvnw", "spring-boot:run"]
