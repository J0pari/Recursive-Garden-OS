# Steps to Delete the "main" branch and make "master" default

## Option 1: Using GitHub Web Interface (RECOMMENDED)

1. Go to https://github.com/J0pari/Recursive-Garden
2. Click on "Settings" (in the repository, not your profile)
3. In the left sidebar, click "Branches" 
4. Under "Default branch", click the switch icon
5. Select "master" from the dropdown
6. Click "Update"
7. Confirm the change

8. Now you can delete "main":
   - Still in Settings > Branches
   - Or go to the branches page: https://github.com/J0pari/Recursive-Garden/branches
   - Find "main" and click the trash icon to delete it

## Option 2: Using GitHub CLI (if you have it installed)

```bash
# Set master as default branch
gh repo edit J0pari/Recursive-Garden --default-branch master

# Delete main branch
git push origin --delete main
```

## Option 3: Using Git Commands (after changing default on GitHub)

After you've changed the default branch to "master" on GitHub:

```bash
cd "C:\Users\tmdru\OneDrive\Documents\Recursive Garden OS"
git push origin --delete main
```

The key is: GitHub won't let you delete the default branch, so you MUST change the default to "master" first!