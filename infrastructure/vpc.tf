resource "aws_vpc" "main" {
 cidr_block = "10.0.0.0/16"
 
 tags = {
   Name = "Project VPC"
 }
}

resource "aws_subnet" "subnets" {
 count      = length(var.subnet_cidrs)
 vpc_id     = aws_vpc.main.id
 cidr_block = element(var.subnet_cidrs, count.index)
 availability_zone = element(var.azs, count.index)
 
 tags = {
   Name = "Subnet ${count.index + 1}"
 }
}

resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }
}

resource "aws_route_table_association" "public_subnet_assoc" {
  count = length(var.subnet_cidrs)
  subnet_id      = element( aws_subnet.subnets[*].id, count.index)
  route_table_id = aws_route_table.public.id
}