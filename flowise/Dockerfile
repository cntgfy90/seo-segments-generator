FROM flowiseai/flowise:3.1.1

WORKDIR /app

# configuration for testing existing flow
COPY chatflow.json .

EXPOSE 3000

# Clear the entrypoint and set full command
ENTRYPOINT []
CMD ["flowise", "start"]
