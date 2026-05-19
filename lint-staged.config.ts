export default {
  "*.*": ["npx prettier --write"],
  "*.{ts,tsx,js,jsx}": ["npm run lint"],
};
