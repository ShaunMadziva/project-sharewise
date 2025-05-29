# Current deployment: <a href="http://34.39.114.116/index2.html" target="_blank">ShareWise.com</a>

ShareWise is a web-based platform that connects schools with organisations willing to donate surplus tech supplies that would otherwise be destroyed/end up in landfills.

# 🚀 Full CI/CD Pipeline and Cloud Deployment Project

This project demonstrates the complete end-to-end deployment of a containerized application using a modern DevOps toolchain. It covers everything from continuous integration to provisioning infrastructure and automating deployments in the cloud.

## 📌 Project Overview

The goal of this project was to build a scalable, secure, and automated infrastructure for a web application using best practices in Cloud & DevOps. It simulates a real-world production environment with a full CI/CD pipeline and cloud hosting using AWS.

## 🧱 Architecture

- **Code Repository**: GitHub
- **CI/CD Automation**: Jenkins
- **Containerization**: Docker
- **Image Registry**: Docker Hub
- **Infrastructure as Code (IaC)**: Terraform
- **Configuration Management**: Ansible
- **Cloud Provider**: AWS

### 🔧 AWS Architecture

- **VPC with Subnets**
  - Public Subnet: Hosts API servers (EC2 instances)
  - Private Subnet: Hosts database servers (EC2 instance)
- **Elastic Load Balancer (ELB)**: Routes traffic to the API instances
- **EC2 Instances**: Used for API and Database layers

## ⚙️ Workflow

1. **Code Push**: Developer pushes code to GitHub
2. **CI Trigger**: Jenkins is triggered and:
   - Builds the Docker image
   - Pushes the image to Docker Hub
3. **Infrastructure Provisioning**: Terraform sets up AWS resources
4. **Deployment**: Ansible pulls the Docker image from Docker Hub and deploys the containers to EC2 instances
5. **Traffic Management**: ELB distributes traffic across API instances

## 📦 Tools & Technologies

| Category                 | Tool / Service      |
| ------------------------ | ------------------- |
| Version Control          | GitHub              |
| CI/CD                    | Jenkins             |
| Containerization         | Docker              |
| Image Registry           | Docker Hub          |
| IaC                      | Terraform           |
| Configuration Management | Ansible             |
| Cloud Provider           | AWS (EC2, ELB, VPC) |

## 🌐 Outcome

- Fully automated build, test, and deployment pipeline
- Infrastructure created and managed as code
- Decoupled architecture with scalability and security in mind
- Hands-on experience with DevOps tools in a real-world scenario

## 🚀 Getting Started

To test or deploy the project:

1. Clone the repository
2. Update AWS credentials and backend config in `terraform/`
3. Run `terraform apply` to provision infrastructure
4. Trigger Jenkins pipeline manually or via GitHub push
5. Use Ansible to deploy containers to provisioned EC2 instances
