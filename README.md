🚀 DevOps CI/CD Pipeline on AWS
📌 Overview

This project implements a complete DevOps pipeline on AWS that automates the deployment of a containerized application using:

Terraform (Infrastructure as Code)
Ansible (Configuration Management)
Docker (Containerization)
Kubernetes (Orchestration)
GitLab CI (CI/CD)

Any code push automatically triggers testing, image build, and deployment to a Kubernetes cluster.

🏗️ Architecture
AWS Infrastructure
VPC, Subnet, Security Group
2 EC2 instances:
Master node (Kubernetes control plane)
Worker node
Application
Flask API
Dockerized and stored on Docker Hub
CI/CD
GitLab pipeline:
Test
Build & Push
Deploy
Deployment
Kubernetes Deployment + Service (NodePort)
⚙️ Setup
1. Provision Infrastructure
cd terraform
terraform init
terraform apply
2. Configure Servers
cd ansible
ansible-playbook -i inventory install_k8s.yml
3. Deploy Application (Manual)
kubectl apply -f kubernetes/deploy.yml
4. CI/CD Configuration

Set these variables in GitLab:

DOCKER_USERNAME
DOCKER_PASSWORD
SSH_PRIVATE_KEY
MASTER_IP
EC2_USER
🔁 CI/CD Workflow
Push code to GitLab
Pipeline runs:
Tests application
Builds & pushes Docker image
Deploys to Kubernetes via SSH
Application updates automatically
📂 Project Structure
.
├── app/
├── docker/
├── terraform/
├── ansible/
├── kubernetes/
└── .gitlab-ci.yml
🧪 Run Locally
pip install -r app/requirements.txt
python app/app.py
📌 Notes
Uses latest Docker tag
Deployment update triggered via rollout restart
Only master node is publicly accessible
👨‍💻 Author

Mouhcine