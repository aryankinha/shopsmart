variable "aws_region" {
  description = "AWS Region to deploy to"
  type        = string
  default     = "us-east-1"
}

variable "mongodb_uri" {
  description = "MongoDB Connection String"
  type        = string
  sensitive   = true
}
