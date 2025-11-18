@REM echo [1/5] Buildando iamgens Docker...
docker build -t matheusgon/chat-back:latest ./back
docker push matheusgon/chat-back:latest
docker build -t matheusgon/chat-front:latest ./front
docker push matheusgon/chat-front:latest
docker build -t matheusgon/chat-jaiminho:latest ./jaiminho
docker push matheusgon/chat-jaiminho:latest


@REM echo [2/5] Reservando o IP Estatico Global 'chat-ingress-ip'...
@REM gcloud compute addresses create chat-ingress-ip --global

@REM echo [3/5] Criando o Namespace 'chat-namespace'...
@REM kubectl apply -f k8s/namespace.yaml

@REM echo [4/5] Subindo todos os Servicos ...
@REM kubectl apply -f k8s/

@REM echo [5/5] Deploy enviado!
@REM echo Para monitorizar, execute este comando noutro terminal:
@REM echo kubectl get ingress chat-ingress -n chat-namespace -w
