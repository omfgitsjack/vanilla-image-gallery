var commentView = (function () {
    "use strict";

    let components = {
        getCommentSection: () => document.querySelector("#gallery-area .comments-wrapper"),
        getForm: () => document.querySelector("#gallery-area .comments-wrapper form"),
        getResponseArea: () => document.getElementById("response-container"),
        getPaginationContainer: () => document.getElementById("pagination-container"),
        getPrevPageBtn: () => document.getElementById("pagination-controls--prev"),
        getNextPageBtn: () => document.getElementById("pagination-controls--next")
    };

    onload = () => {
        // On submitting a new comment
        components.getForm().onsubmit = e => {
            e.preventDefault();

            let form = components.getForm(),
                response = components.getForm().querySelector('textarea');

            if (response.value) {
                let payload = { message: response.value };

                response.value = '';
                
                document.dispatchEvent(new CustomEvent(events.ON_SUBMIT_NEW_COMMENT, {
                    detail: payload
                }));
            } else {
                // console.error("Tried to submit response w/o filling in form");
            }
        };

        components.getPrevPageBtn().onclick = e =>
            document.dispatchEvent(new CustomEvent(events.ON_CLICK_PREV_RESPONSE_PAGE));

        components.getNextPageBtn().onclick = e =>
            document.dispatchEvent(new CustomEvent(events.ON_CLICK_NEXT_RESPONSE_PAGE));

        // Initially don't show the pagination container.
        components.getPaginationContainer().style.display = 'none';
        components.getResponseArea().innerHTML = '<div>None.</div>';
    };

    var view = {
        onload: onload,
        renderMessages: (payload, currentImage) => {

            if (!payload.messages) {
                components.getResponseArea().innerHTML = '<div>None.</div>';
            } else {
                let responseArea = components.getResponseArea();

                responseArea.innerHTML = ''; // First clear it out
                
                // Then we rerender each message into response area.
                payload.messages
                    .map(message => view.renderMessage(message, currentImage))
                    .forEach(messageNode => responseArea.appendChild(messageNode));
            }

            view.renderPagination(
                payload.hasPreviousPageOfMessages,
                payload.hasNextPageOfMessages,
                !payload.messages);
        },
        renderMessage: (message, currentImage) => {
            let date = [message.createdAt.getUTCDate(), message.createdAt.getUTCMonth() + 1, message.createdAt.getUTCFullYear()].join('/'),
                el = document.createElement('div');
            
            let removeBtn = '',
                currentUserName = document.cookie.split("=")[1];

            if (currentImage.author === currentUserName ||
                message.name === currentUserName) {
                removeBtn = '<img class="btn btn-image" src="./media/close_black.png">';
            }

            el.className = 'comment';
            el.innerHTML = `
                <div class="comment--title-area">
                    <div class="comment--author">${message.name} <span class="muted">${date}</span></div>
                    ${removeBtn}
                </div>
                <div class="comment--response">${message.message}</div>`;

            if (removeBtn) {
                el.querySelector("img").onclick = e => {
                    document.dispatchEvent(new CustomEvent(events.ON_CLICK_DELETE_MESSAGE, {
                        detail: message.id
                    }));
                };
            }

            return el;
        },
        renderPagination: (hasPrev, hasNext, hideBoth = false) => {
            let prevBtn = components.getPrevPageBtn(),
                nextBtn = components.getNextPageBtn();

            if (hideBoth) {
                components.getPaginationContainer().style.display = 'none';
            } else {
                components.getPaginationContainer().style.display = 'block';
                prevBtn.className = hasPrev ? 'btn btn-image' : 'btn btn-image disabled';
                nextBtn.className = hasNext ? 'btn btn-image' : 'btn btn-image disabled';
            }
        }
    };

    return view;

} (events));