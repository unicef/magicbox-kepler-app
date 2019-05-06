# Deploy the Magicbox Kepler Front/Back

Deployment options.

## On Kubernetes

### Prerequisites

Make sure that you have installed the following technologies on your host:

* Docker (Tested with 18.06.3-ce version).
* NPM (Tested with 6.9.0 version).
* Kubernetes CLI (`kubectl`, tested with v1.14.0 version).
* Git (Tested with 2.17.1 version).

And you also need:

* A Kubernetes cluster, if you will use minikube follow these [guide](https://kubernetes.io/docs/setup/minikube/) to install it first.
* A Registry for container images.
* Ingress Controller deployed and configured.
* A FQDN that resolve an IP or VIP, this one have to balance the Kubernetes nodes with Ingress Controllers.

### How to deploy

The process count with the following steps:

1. Generate container images of Client and Server code:

   ```bash
   # Clone repo and go to code folder
   $ git clone https://github.com/unicef/magicbox-kepler-app -b dev magicbox-kepler-app && cd $_
   # Build Client Dockerfile
   $ cd client && npm i && npm run docker-build
   # Come back to main folder
   $ cd ..
   # Build Server Dockerfile
   $ cd server && npm i && npm run docker-build
   ```

2. Push generated images to a registry:

   > **¡WARNING!**
   > Make sure that your Kubernetes cluster is able to pull images from your registry.

   ```bash
   # Log in registry
   $ docker login <registry-host-or-ip>
   # Tag and push Client image
   $ docker tag unicef/magicbox-kepler-ui <registry-host-or-ip>[:port]/unicef/magicbox-kepler-ui
   $ docker push <registry-host-or-ip>[:port]/unicef/magicbox-kepler-ui
   # Tag and push Server image
   $ docker tag unicef/magicbox-kepler-back <registry-host-or-ip>[:port]/unicef/magicbox-kepler-back
   $ docker push <registry-host-or-ip>[:port]/unicef/magicbox-kepler-back
   # Log out from registry
   $ docker logout <registry-host-or-ip>[:port]
   ```

3. Generate the YAML files for deploy from the templates:

   ```bash
   # Replace registry URI
   $ sed 's/unicef\/magicbox-kepler-back/<registry-host-or-ip>[:port]\/unicef\/magicbox-kepler-back/' \
        deploy/kubernetes/deployment.template.yaml > deployment.yaml
   # Replace FQDN used to expose the front and back
   $ sed 's/magicbox-kepler.example.com/<fqdn>/' \
        deploy/kubernetes/ingress.template.yaml > ingress.yaml
   ```

4. Deploy the generated YAML files:

   ```bash
   # Copy the kubeconfig from the Kubernetes cluster to your host and use it to apply the deployment configuration
   $ kubectl apply -f deployment.yaml -n <namespace> --config /path/of/kubeconfig
   $ kubectl apply -f ingress.yaml -n <namespace> --config /path/of/kubeconfig
   ```

5. Test the application using a web browser with the FQDN configured: `http://<fqdn>`.