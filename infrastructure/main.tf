terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}


provider "aws" {
  region = "us-east-1"
}

resource "tls_private_key" "key_pair" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "generated_key" {
  key_name   = var.key_name
  public_key = tls_private_key.key_pair.public_key_openssh
}

resource "aws_instance" "servers" {
    count = length(aws_subnet.subnets)
    ami = data.aws_ami.aws_linux_2023_ami_latest.id
    key_name = aws_key_pair.generated_key.key_name
    instance_type = var.instance_type
    associate_public_ip_address = "true"
    vpc_security_group_ids = [aws_security_group.sg_groups.id]
    subnet_id = element(aws_subnet.subnets[*].id, count.index)

    tags = {
      name = "servers_${count.index + 1}"
    }

}