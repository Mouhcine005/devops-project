output "master_ip" {
  description = "Public IP of the master node"
  value       = aws_instance.master.public_ip
}

output "worker_ip" {
  description = "Public IP of the worker node"
  value       = aws_instance.worker.public_ip
}

output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.devops_vpc.id
}

output "subnet_id" {
  description = "Subnet ID"
  value       = aws_subnet.devops_subnet.id
}

output "security_group_id" {
  description = "Security Group ID"
  value       = aws_security_group.devops_sg.id
}