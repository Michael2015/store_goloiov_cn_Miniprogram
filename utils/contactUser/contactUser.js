function getContext() {
    var pages = getCurrentPages();
    return pages[pages.length - 1];
}

let contact;

var Contact = (fun, props = undefined) => {
    return new Promise(function (resolve) {
        contact = getContext().selectComponent('#contact-view');
        if (!contact) {
            console.warn('未找到节点，请在wxml里添加');
        } else {
            contact[fun](props).then(() => {
                resolve()
            })
        }
    })
}

Contact.show = function () {
    return Contact('show', arguments)
}

Contact.close = () => {
    return Contact('close')
}


export default Contact;