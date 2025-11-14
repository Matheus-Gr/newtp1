docker build -t matheusgon/chat-back:latest ./back
docker push matheusgon/chat-back:latest

docker build -t matheusgon/chat-front:latest ./front
docker push matheusgon/chat-front:latest

kubectl delete namespace chat-namespace --ignore-not-found
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/