function randomId(length) {
    var str = "",
        characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
        charactersLength = characters.length;
    for (var i = 0; i < length; i++) str += characters.charAt(Math.floor(Math.random() * charactersLength));
    return str;
}

class Modal {
    constructor(body, title, footer) {
        this.id = `modal-${randomId(16)}`;
        this.title = title || "Notice";
        this.body = body;
        this.footer = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">OK</button>`;
        this.element = null;
        this.createElement();
    }
    html() {
        return `
            <div class="modal-dialog modal-fullscreen" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="${this.id}-title">${this.title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">${this.body}</div>
                    <div class="modal-footer">${this.footer}</div>
                </div>
            </div>
        `;
    }
    createElement() {
        var modal = document.createElement("div");
        modal.classList.add("modal", "fade");
        modal.id = this.id;
        modal.setAttribute("tabindex", "-1");
        modal.setAttribute("role", "dialog");
        modal.setAttribute("aria-labelledby", `${this.id}-title`);
        modal.setAttribute("aria-hidden", "true");
        modal.innerHTML = this.html();
        document.body.appendChild(modal);
        this.element = $(`#${this.id}`);
        this.domElement = modal;
    }
    update() {
        this.element.html(this.html());
    }
    show() {
        this.update();
        this.element.modal("show");
    }
    hide() {
        this.element.modal("hide");
    }
    toggle() {
        this.update();
        this.element.modal("toggle");
    }
    delete() {
        this.element.modal("dispose");
        this.domElement.remove();
        this.id = null;
        this.element = null;
        this.domElement = null;
        this.title = null;
        this.body = null;
        this.footer = null;
    }
}