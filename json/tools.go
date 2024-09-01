package json

import (
	"net/http"

	"github.com/priyanshujain/tools/generic/panichandler"
	"github.com/priyanshujain/tools/templates"
)

type jsonTool struct {
}

type jsonToolHTTPHandler struct {
	http.ServeMux
	app *jsonTool
}

func (h *jsonToolHTTPHandler) init() {
	h.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		templates.JSONFormatter().Render(r.Context(), w)
	})
}

func NewJSONToolHTTPHandler() http.Handler {
	app := &jsonTool{}
	h := &jsonToolHTTPHandler{app: app}
	h.init()
	return panichandler.PanicHandler(h)
}
