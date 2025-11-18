@REM echo [1/5] Buildando iamgens Docker...
@REM docker build -t matheusgon/chat-back:latest ./back
@REM docker push matheusgon/chat-back:latest
@REM docker build -t matheusgon/chat-front:latest ./front
@REM docker push matheusgon/chat-front:latest

@REM docker build -t matheusgon/chat-back:v22 ./back
@REM docker push matheusgon/chat-back:v22
@REM kubectl set image deployment/back back=matheusgon/chat-back:v22 -n chat-namespace

docker build -t matheusgon/chat-front:v28 ./front
docker push matheusgon/chat-front:v28
kubectl set image deployment/front front=matheusgon/chat-front:v28 -n chat-namespace

@REM docker build -t matheusgon/chat-jaiminho:v20 ./jaiminho
@REM docker push matheusgon/chat-jaiminho:v20
@REM kubectl set image deployment/jaiminho jaiminho=matheusgon/chat-jaiminho:v20 -n chat-namespace

@REM kubectl rollout restart deployment back -n chat-namespace    
@REM kubectl rollout restart deployment front -n chat-namespace  

@REM echo [2/5] Reservando o IP Estatico Global 'chat-ingress-ip'...
@REM gcloud compute addresses create chat-ingress-ip --global

@REM echo [3/5] Criando o Namespace 'chat-namespace'...
@REM kubectl apply -f k8s/namespace.yaml

@REM echo [4/5] Subindo todos os Servicos ...
@REM kubectl apply -f k8s/

@REM echo [5/5] Deploy enviado!
@REM echo Para monitorizar, execute este comando noutro terminal:
@REM echo kubectl get ingress chat-ingress -n chat-namespace -w
