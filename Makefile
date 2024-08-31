NAME := tools

default: run

run:
	@templ generate
	@go run .

build:
	@go build
