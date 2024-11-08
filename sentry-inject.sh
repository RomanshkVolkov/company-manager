#!/bin/bash

# Inject Sentry DSN into the app
onError() {
  if [ $? -ne 0 ]; then
    echo "Failed to inject Sentry DSN into the app"
    exit 1
  fi
}

if [ -z "$SENTRY_AUTH_TOKEN" ]; then
  SENTRY_AUTH_TOKEN=$(op read 'op://dwit/integratpv/sentry_auth_token')
  onError
  export SENTRY_AUTH_TOKEN
fi

echo "Injecting Sentry DSN into the app..."
echo "# Sentry token injected by shell script" > .env.sentry-build-plugin
echo "SENTRY_ORG=dwit" >> .env.sentry-build-plugin
echo "SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN" >> .env.sentry-build-plugin