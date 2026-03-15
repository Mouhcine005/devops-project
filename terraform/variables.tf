variable "region" {
  description = "AWS region to deploy in"
  default     = "us-east-1"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  default     = "10.0.0.0/16"
}

variable "subnet_cidr" {
  description = "CIDR block for the subnet"
  default     = "10.0.1.0/24"
}

variable "key_name" {
  description = "SSH key pair name"
  default     = "devops-key"
}

variable "master_instance_type" {
  description = "EC2 instance type for the master node"
  default     = "t3.micro"
}

variable "worker_instance_type" {
  description = "EC2 instance type for the worker node"
  default     = "t3.micro"
}

variable "ami_id" {
  description = "AMI ID for EC2 instances (Ubuntu)"
  default     = "ami-0c02fb55956c7d316"
}

variable "root_volume_size" {
  description = "Root volume size in GB"
  default     = 8
}