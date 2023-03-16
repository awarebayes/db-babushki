cd backend || exit
docker-compose up -d
cd ..
cd frontend || exit
npm run dev -- --open
