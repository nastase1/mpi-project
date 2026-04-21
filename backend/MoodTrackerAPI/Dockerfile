# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["MoodTrackerAPI.csproj", "./"]
RUN dotnet restore "MoodTrackerAPI.csproj"

# Copy everything else and build
COPY . .
RUN dotnet build "MoodTrackerAPI.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "MoodTrackerAPI.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Copy published app
COPY --from=publish /app/publish .

# Expose port
EXPOSE 8080

# Start the application
ENTRYPOINT ["dotnet", "MoodTrackerAPI.dll"]