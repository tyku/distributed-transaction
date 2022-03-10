# Homework stream-processing

## Install kafka

``
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install kafka bitnami/kafka
``

kafka client pod:

``
kubectl run kafka-client --restart='Never' --image docker.io/bitnami/kafka:2.8.0-debian-10-r27 --namespace default --command -- sleep infinity
``

kafka producer with test topic:

``
kubectl exec --tty -i kafka-client --namespace default -- bash
kafka-console-producer.sh --broker-list kafka-0.kafka-headless.default.svc.cluster.local:9092 --topic test
``

kafka consumer with test topic:

``
kafka-console-consumer.sh --bootstrap-server kafka-0.kafka-headless.default.svc.cluster.local:9092 --from-beginning --topic test
``

Link to course: https://otus.ru/lessons/microservice-architecture
