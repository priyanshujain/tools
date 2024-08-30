NAME := tools

default: run

run:
	@templ generate
	@go run .
