#!/bin/bash

# Initialize Git repository
git init

# Add all files to Git
git add .

# Commit the files
git commit -m "Initial commit of CRM system"

# Instructions for connecting to GitHub
echo "
Repository initialized locally. To push to GitHub:

1. Create a new repository on GitHub (don't initialize with README, .gitignore, or license)
2. Run the following commands:

git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main

Replace YOUR_USERNAME and YOUR_REPO_NAME with your GitHub username and repository name.
"
