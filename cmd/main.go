package main

import (
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/priyanshujain/tools/generic/panichandler"
	"github.com/priyanshujain/tools/json"
	"github.com/priyanshujain/tools/templates"
)

type httpHandler struct {
	http.ServeMux
}

func (h *httpHandler) init() {
	h.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		templates.Index().Render(r.Context(), w)
	})
}

func NewHTTPHandler() http.Handler {
	h := &httpHandler{}
	h.init()
	return panichandler.PanicHandler(h)
}

func main() {

	var app string
	if len(os.Args) == 2 {
		app = os.Args[1]
	}

	var h http.Handler
	switch app {
	case "json":
		h = json.NewJSONToolHTTPHandler()
	default:
		h = NewHTTPHandler()
	}

	port := os.Getenv("PORT")
	port = strings.TrimSpace(port)
	if port == "" {
		port = "8080"
	}
	http.ListenAndServe(fmt.Sprintf(":%s", port), h)
}
