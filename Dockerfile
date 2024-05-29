FROM eclipse-temurin:21-jdk-alpine
ENV HOME=/app
RUN mkdir -p $HOME
WORKDIR $HOME
ADD . .
RUN ./mvnw install -DskipTests
ENTRYPOINT ["java","-jar","/app.jar"]