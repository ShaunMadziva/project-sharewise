
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