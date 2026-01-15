rm -rf node_modules
rm -f package-lock.json
rm -rf .open-next
rm -rf .next

npm install

npm run build
