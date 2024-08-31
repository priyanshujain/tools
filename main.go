package main

import (
	"fmt"
	log "log/slog"
	"net/http"
	"os"
	"strings"
)

type app struct {
}

type httpHandler struct {
	http.ServeMux
	app *app
}
func (h *httpHandler) init() {
	h.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		Index().Render(r.Context(), w)
	})
}

func NewHTTPHandler(app *app) http.Handler {
	h := &httpHandler{app: app}
	h.init()
	return panicHandler(h)
}

func main() {
	a := &app{}
	h := NewHTTPHandler(a)
	port := os.Getenv("PORT")
	port = strings.TrimSpace(port)
	if port == "" {
		port = "8080"
	}
	http.ListenAndServe(fmt.Sprintf(":%s", port), h)
}

func panicHandler(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if r := recover(); r != nil {
				log.Error("panic while handling http request", "recover", r)
				w.WriteHeader(http.StatusInternalServerError)
			}
		}()
		h.ServeHTTP(w, r)
	})
}
