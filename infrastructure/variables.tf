
variable "instance_type" {
  description = "The type of EC2 instance to use"
  type        = string
  default     = "t2.micro"
}

variable "key_name" {
  description = "Key pair for EC2 instance"
  type        = string
  default     = "default_key"
}

variable "subnet_cidrs" {
 type        = list(string)
 description = "Subnet CIDR values"
 default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "azs" {
 type        = list(string)
 description = "Availability Zones"
 default     = ["us-east-1a", "us-east-1b"]
}