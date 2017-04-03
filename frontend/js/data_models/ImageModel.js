var Image = (function () {
    "use strict";

    function Image({ _id, name, author, externalPictureRoute, nextImage, previousImage }) {
        if (externalPictureRoute) {
            this.imgUrl = externalPictureRoute;
        } else {
            this.imgUrl = `/api/images/${_id}/picture`;
        }
        this.id = _id;
        this.name = name;
        this.author = author;
        this.comments = [];
        this.nextImage = nextImage;
        this.previousImage = previousImage;
    }

    return Image;
} ());