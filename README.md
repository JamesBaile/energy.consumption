# energy.consumption
Stores the energy consumption of a given user

docker build . -t energy.consumption

docker run -e "MONGO=mongodb://mongo:27017/energy-usage" energy.consumption
