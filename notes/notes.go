package notes

import (
	"net/http"

	"github.com/priyanshujain/tools/generic/panichandler"
	"github.com/priyanshujain/tools/templates"
)

type notesHTTPHandler struct {
	http.ServeMux
}

func (h *notesHTTPHandler) init() {
	h.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		templates.NotesApp().Render(r.Context(), w)
	})
}

func NewNotesHTTPHandler() http.Handler {
	h := &notesHTTPHandler{}
	h.init()
	return panichandler.PanicHandler(h)
}
