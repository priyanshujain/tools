NAME := tools

default: run

run:
	@templ generate -path=templates/
	@go run cmd/main.go $(JOB)

generate:
	@templ generate -path=templates/

build: OUT ?= $(NAME)
build:
	@CGO_ENABLED=0 go build -o bin/$(OUT) cmd/main.go
