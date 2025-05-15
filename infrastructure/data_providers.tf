data "aws_subnets" "default_subnets" {
    filter {
        name = "vpc-id"
        values = [aws_default_vpc.default.id]
    }
}

data "aws_ami" "aws_linux_2023_ami_latest" {
    most_recent = true
    owners = ["amazon"]
    filter {
        name = "name"
        values = ["al2023-ami-2023*"]
    }
    filter {
        name = "virtualization-type"
        values = ["hvm"]
    }
    filter {
        name = "architecture"
        values = ["x86_64"]
    }
}