# Homework distributed transactions

## Install payment service

namespace default
```bash
helm install payment ./app -f ./payment-service/values.yaml
```

## Install coordinator service

namespace default
```bash
helm install coordinator ./app -f ./coordinator-service/values.yaml
```

## Install delivery service

namespace default
```bash
helm install delivery ./app -f ./delivery-service/values.yaml
```

## Install order service

namespace default
```bash
helm install order ./app -f ./order-service/values.yaml
```

## Install warehouse service

namespace default
```bash
helm install warehouse ./app -f ./warehouse-service/values.yaml
```

## Install Kafka
Add repo
```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
helm install kafka bitnami/kafka
```

## Installation nginx ingress

If you are using minikube, turn on ingress addon with command
```bash
minikube addons  enable ingress
```

Add repo
```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
```
Install nginx-ingress
```bash
helm install --version "3.35.0" -n nginx-ingress -f ./nginx-ingress/nginx.yaml \
ingress-nginx ingress-nginx/ingress-nginx
```

Apply routes
```bash
kubectl apply -f ./nginx-ingress/routes.yaml

minikube service -n nginx-ingress ingress-nginx-controller
```

## Uninstall

```bash
helm un user
helm un order
helm un billing
helm un notification
```


## Tests
Install newman if you wish:
```
brew install newman
```
and run prepared test
```
newman run ./hw_distributed_transaction.postman_collection.json
```
or import this file to postman, and start manually


Link to course: https://otus.ru/lessons/microservice-architecture
