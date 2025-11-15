@REM docker build -t matheusgon/chat-back:latest ./back
@REM docker push matheusgon/chat-back:latest

docker build -t matheusgon/chat-front:latest ./front
docker push matheusgon/chat-front:latest

@REM kubectl delete namespace chat-namespace --ignore-not-found
@REM kubectl apply -f k8s/namespace.yaml

@REM kubectl delete -f .\k8s\back.yaml
kubectl delete -f .\k8s\front.yaml
kubectl apply -f k8s/