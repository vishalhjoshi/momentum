#!/bin/bash

# Deployment Validation Script
# This script checks if the application is ready for production deployment

set -e

echo "======================================"
echo "  Momentum Deployment Validation"
echo "======================================"
echo ""

ERRORS=0
WARNINGS=0

# Color codes
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

error() {
    echo -e "${RED}✗ ERROR: $1${NC}"
    ERRORS=$((ERRORS + 1))
}

warning() {
    echo -e "${YELLOW}⚠ WARNING: $1${NC}"
    WARNINGS=$((WARNINGS + 1))
}

success() {
    echo -e "${GREEN}✓ $1${NC}"
}

info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Check if pnpm is installed
echo "Checking prerequisites..."
if ! command -v pnpm &> /dev/null; then
    error "pnpm is not installed. Install it with: npm install -g pnpm"
else
    success "pnpm is installed ($(pnpm --version))"
fi

# Check if Docker is installed (for Docker deployments)
if ! command -v docker &> /dev/null; then
    warning "Docker is not installed. Required for containerized deployments."
else
    success "Docker is installed ($(docker --version | cut -d' ' -f3 | tr -d ','))"
fi

# Check if docker-compose is available
if ! command -v docker compose &> /dev/null; then
    warning "docker compose is not available. Required for local Docker deployments."
else
    success "docker compose is available"
fi

echo ""
echo "Checking environment files..."

# Check for .env.example files
if [ ! -f ".env.example" ]; then
    warning "Root .env.example not found"
else
    success "Root .env.example exists"
fi

if [ ! -f "backend/.env.example" ]; then
    warning "Backend .env.example not found"
else
    success "Backend .env.example exists"
fi

if [ ! -f "frontend/.env.example" ]; then
    warning "Frontend .env.example not found"
else
    success "Frontend .env.example exists"
fi

# Check that .env files are not committed (should be in .gitignore)
if git ls-files --error-unmatch .env 2> /dev/null; then
    error ".env file is tracked by git! Remove it: git rm --cached .env"
fi

if git ls-files --error-unmatch backend/.env 2> /dev/null; then
    error "backend/.env is tracked by git! Remove it: git rm --cached backend/.env"
fi

if git ls-files --error-unmatch frontend/.env 2> /dev/null; then
    error "frontend/.env is tracked by git! Remove it: git rm --cached frontend/.env"
fi

echo ""
echo "Installing dependencies..."

# Install dependencies
if ! pnpm install --frozen-lockfile 2>&1 | grep -q "up to date"; then
    info "Dependencies installed/updated"
else
    success "Dependencies are up to date"
fi

echo ""
echo "Running linters..."

# Run linting
if pnpm lint > /dev/null 2>&1; then
    success "All code passes linting"
else
    error "Linting failed. Run 'pnpm lint' to see errors."
fi

echo ""
echo "Running type checks..."

# Type check backend
cd backend
if pnpm type-check > /dev/null 2>&1; then
    success "Backend passes type checking"
else
    error "Backend type checking failed. Run 'cd backend && pnpm type-check' to see errors."
fi
cd ..

# Type check frontend
cd frontend
if pnpm type-check > /dev/null 2>&1; then
    success "Frontend passes type checking"
else
    error "Frontend type checking failed. Run 'cd frontend && pnpm type-check' to see errors."
fi
cd ..

echo ""
echo "Building application..."

# Build backend
cd backend
if pnpm build > /dev/null 2>&1; then
    success "Backend builds successfully"
else
    error "Backend build failed. Run 'cd backend && pnpm build' to see errors."
fi
cd ..

# Build frontend
cd frontend
if pnpm build > /dev/null 2>&1; then
    success "Frontend builds successfully"
else
    error "Frontend build failed. Run 'cd frontend && pnpm build' to see errors."
fi
cd ..

echo ""
echo "Checking Dockerfiles..."

# Check if Dockerfiles exist
if [ ! -f "backend/Dockerfile" ]; then
    error "backend/Dockerfile not found"
else
    success "Backend Dockerfile exists"
fi

if [ ! -f "frontend/Dockerfile" ]; then
    error "frontend/Dockerfile not found"
else
    success "Frontend Dockerfile exists"
fi

# Check .dockerignore files
if [ ! -f "backend/.dockerignore" ]; then
    warning "backend/.dockerignore not found (recommended for smaller images)"
else
    success "Backend .dockerignore exists"
fi

if [ ! -f "frontend/.dockerignore" ]; then
    warning "frontend/.dockerignore not found (recommended for smaller images)"
else
    success "Frontend .dockerignore exists"
fi

echo ""
echo "Checking critical files..."

# Check nginx config
if [ ! -f "frontend/nginx.conf" ]; then
    error "frontend/nginx.conf not found (required for Docker deployment)"
else
    success "nginx.conf exists"
    
    # Check for security headers in nginx config
    if grep -q "X-Frame-Options" frontend/nginx.conf; then
        success "Security headers present in nginx.conf"
    else
        warning "Security headers not found in nginx.conf"
    fi
fi

# Check backend start script
if [ ! -f "backend/start.sh" ]; then
    error "backend/start.sh not found (required for Docker deployment)"
else
    success "Backend start.sh exists"
    
    # Check if start.sh is executable
    if [ -x "backend/start.sh" ]; then
        success "start.sh is executable"
    else
        warning "start.sh is not executable. Run: chmod +x backend/start.sh"
    fi
fi

# Check Prisma schema
if [ ! -f "backend/prisma/schema.prisma" ]; then
    error "Prisma schema not found"
else
    success "Prisma schema exists"
fi

# Check if Prisma client is generated
if [ ! -d "backend/node_modules/.prisma" ]; then
    warning "Prisma client not generated. Run: cd backend && pnpm db:generate"
else
    success "Prisma client is generated"
fi

echo ""
echo "Checking documentation..."

# Check for deployment docs
if [ ! -f "DEPLOYMENT.md" ]; then
    warning "DEPLOYMENT.md not found"
else
    success "DEPLOYMENT.md exists"
fi

if [ ! -f "README.md" ]; then
    warning "README.md not found"
else
    success "README.md exists"
fi

if [ ! -f "ENV_VARS.md" ]; then
    warning "ENV_VARS.md not found (recommended for environment variable reference)"
else
    success "ENV_VARS.md exists"
fi

echo ""
echo "Testing Docker build (optional)..."

# Ask user if they want to test Docker build
read -p "Do you want to test Docker builds? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    info "Building Docker images (this may take a few minutes)..."
    
    if docker compose build > /dev/null 2>&1; then
        success "Docker images build successfully"
    else
        error "Docker build failed. Run 'docker compose build' to see errors."
    fi
else
    info "Skipping Docker build test"
fi

echo ""
echo "======================================"
echo "  Validation Summary"
echo "======================================"

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed! Your application is ready for deployment.${NC}"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ $WARNINGS warning(s) found. Review them before deploying.${NC}"
    exit 0
else
    echo -e "${RED}✗ $ERRORS error(s) and $WARNINGS warning(s) found.${NC}"
    echo -e "${RED}Please fix the errors before deploying to production.${NC}"
    exit 1
fi
