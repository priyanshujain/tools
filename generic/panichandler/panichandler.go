package panichandler

import (
	"net/http"

	log "log/slog"
)

func PanicHandler(h http.Handler) http.Handler {
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
