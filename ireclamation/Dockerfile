# Stage 1: Base image with runtime and dependencies like wkhtmltopdf
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app

# Install wkhtmltopdf
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    wkhtmltopdf \
    libgdiplus && \
    rm -rf /var/lib/apt/lists/*

# Stage 2: Build stage
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src

# Copy csproj and restore as distinct layers
COPY ["iReclamation.csproj", "./"]
RUN dotnet restore "iReclamation.csproj"

# Copy the rest of the source code
COPY . .

# Build the application
RUN dotnet build "iReclamation.csproj" -c Release -o /app/build

# Stage 3: Publish
FROM build AS publish
RUN dotnet publish "iReclamation.csproj" -c Release -o /app/publish

# Stage 4: Final image
FROM base AS final
WORKDIR /app

# Copy published app from previous stage
COPY --from=publish /app/publish .

# Optional: expose ports
EXPOSE 80
EXPOSE 443

# Entry point
ENTRYPOINT ["dotnet", "iReclamation.dll"]
