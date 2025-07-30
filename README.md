# Final Project Starter

This will be the starter code for your final project! But first, we're going to spend a day making improvements to it. We'll use pull requests to manage this, and for that you'll need to be on your own branch. You can work in pairs or on your own.

## Fork the Repository 
Click on the Fork button: This is usually found in the top-right corner of the repository's page. This will create a copy of the repository under your own GitHub account.

## Clone the Forked Repository
1. Go to your forked repository on GitHub.
2. Click on the green "Code" button and copy the command.
3. Open your terminal or Git Bash and run it! It'll look like this: 
```js
gh repo clone your-username/repository-name
```

4. Navigate to the repository directory

# Install Packages
1. Run the following command to be able to run your program.
```js
$ npx expo installs
```

# Set Up the Upstream Remote
1. Add the original repository as a remote: This allows you to pull in updates from the original repository.
```js
$ git remote add upstream https://github.com/Snap-Engineering-Academy-2025/SnapChatStarterForkable.git
```
2. Verify the new remote named 'upstream'

```js
$ git remote -v
```
##  Add Supabase Environment Variable!

Get the code running! You'll need to rename `.env.example` to `.env.local` file. You should be able to reuse the Supabase keys from earlier's week project.
