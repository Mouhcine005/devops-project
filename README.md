# 🚀 DevOps CI/CD Pipeline on AWS

A fully automated DevOps pipeline that provisions cloud infrastructure, configures servers, containerizes an application, and deploys it to Kubernetes — triggered on every code push.

---

## 🛠️ Tech Stack

| Layer | Tool |
|---|---|
| Infrastructure | Terraform |
| Configuration | Ansible |
| Containerization | Docker |
| Orchestration | Kubernetes |
| CI/CD | GitLab CI |
| Cloud | AWS (EC2, VPC) |

---

## 🏗️ Architecture

### AWS Infrastructure
- VPC, Subnet, Security Group
- **2 EC2 instances:**
  - `master` — Kubernetes control plane (publicly accessible)
  - `worker` — Kubernetes worker node

### Application
- Flask REST API
- Dockerized and pushed to Docker Hub

### CI/CD Pipeline (GitLab)

```
Code Push → Test → Build & Push Image → Deploy to Kubernetes
```

### Kubernetes
- `Deployment` + `Service` (NodePort)

---

## 📂 Project Structure

```
.
├── app/                  # Flask application
├── docker/               # Dockerfile
├── terraform/            # AWS infrastructure (IaC)
├── ansible/              # Server configuration playbooks
├── kubernetes/           # K8s manifests
└── .gitlab-ci.yml        # CI/CD pipeline definition
```

---

## ⚙️ Setup

### 1. Provision Infrastructure

```bash
cd terraform
terraform init
terraform apply
```

### 2. Configure Servers

```bash
cd ansible
ansible-playbook -i inventory install_k8s.yml
```

### 3. Deploy Application (Manual)

```bash
kubectl apply -f kubernetes/deploy.yml
```

### 4. CI/CD Variables

Set the following secrets in **GitLab → Settings → CI/CD → Variables**:

| Variable | Description |
|---|---|
| `DOCKER_USERNAME` | Docker Hub username |
| `DOCKER_PASSWORD` | Docker Hub password |
| `SSH_PRIVATE_KEY` | Private key to SSH into EC2 |
| `MASTER_IP` | Public IP of the master node |
| `EC2_USER` | EC2 SSH user (e.g. `ubuntu`) |

---

## 🔁 CI/CD Workflow

```
1. Push code to GitLab
        ↓
2. Pipeline triggers automatically
        ↓
3. [Test]    Run application tests
        ↓
4. [Build]   Build Docker image & push to Docker Hub
        ↓
5. [Deploy]  SSH into master node → kubectl rollout restart
```

> Only the master node is publicly accessible. The worker node is internal.

---

## 🧪 Run Locally

```bash
pip install -r app/requirements.txt
python app/app.py
```

---

## 📌 Notes

- Docker image is tagged as `latest`
- Deployments are updated via `kubectl rollout restart`
- Only the master node exposes a public IP

---

## 👨‍💻 Author

**Mouhcine** — Built with ❤️ and a lot of `terraform apply`
