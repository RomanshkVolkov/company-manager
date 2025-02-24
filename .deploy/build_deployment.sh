#!/bin/bash

stack=""
deployment_dir=""
image=""
host=""
tls="internal"
env_file=""
environment=""

for arg in "$@"; do
  case $arg in
    stack=*)
      stack="${arg#*=}"
      shift
      ;;
    deployment_dir=*)
      deployment_dir="${arg#*=}"
      shift
      ;;
    image=*)
      image="${arg#*=}"
      shift
      ;;
    host=*)
      host="${arg#*=}"
      shift
      ;;
    tls=*)
      tls="${arg#*=}"
      shift
      ;;
    env_file=*)
      env_file="${arg#*=}"
      shift
      ;;
    environment=*)
      environment="${arg#*=}"
      shift
      ;;
    *)
      ;;
  esac
done

# Check if the variables are set

if [ -z "$deployment_dir" ]; then
  echo "deployment_dir is required"
  exit 1
fi

if [ -z "$image" ]; then
  echo "image is required"
  exit 1
fi

if [ -z "$host" ]; then
  echo "host is required"
  exit 1
fi

if [ -z "$environment" ]; then
  echo "environment is required"
  exit 1
fi

if [ -z "$stack" ]; then
  echo "stack is required"
  exit 1
fi

# Deploy the stack

yaml_content=$(cat "$deployment_dir/deployment.template.yml")

# envs

if [ -f "$env_file" ]; then
  while IFS='=' read -r key value; do
    if [[ -n "$key" && -n "$value" && "$key" =~ ^[a-zA-Z_][a-zA-Z0-9_]*$ ]]; then
      export "$key=$value" > /dev/null 2>&1
    fi
  done < <(grep -v '^#' "$env_file")
else
  while IFS='=' read -r key value; do
    if [[ "$key" =~ ^[a-zA-Z_][a-zA-Z0-9_]*$ && -n "$value" ]]; then
      export "$key=$value" > /dev/null 2>&1
    fi
  done < <(env)
fi

for var in $(env | grep '^DEPLOY_'); do
  IFS='=' read -r key value <<< "$var"
  cleaned_key="${key#DEPLOY_}"

  yaml_content=$(echo "$yaml_content" | yq eval ".services.STACK_PLACEHOLDER-app.environment += [\"$cleaned_key=$value\"]")
done

# Replace placeholders
yaml_content=$(echo "$yaml_content" | sed "s|STACK_PLACEHOLDER|$stack-$environment|g")
yaml_content=$(echo "$yaml_content" | sed "s|ENVIRONMENT_PLACEHOLDER|$environment|g")
yaml_content=$(echo "$yaml_content" | sed "s|IMAGE_PLACEHOLDER|$image|g")
yaml_content=$(echo "$yaml_content" | sed "s|HOST_PLACEHOLDER|$host|g")
yaml_content=$(echo "$yaml_content" | sed "s|TLS_PLACEHOLDER|$tls|g")

echo "$yaml_content"