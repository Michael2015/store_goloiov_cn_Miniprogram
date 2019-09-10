function getContext() {
    var pages = getCurrentPages();
    return pages[pages.length - 1];
}

let compositeposter;

var compositePoster = (fun, props = undefined) => {
    return new Promise(function (resolve, reject) {
        compositeposter = getContext().selectComponent('#compositePoster-view');
        if (!compositeposter) {
            console.warn('未找到节点，请在wxml里添加');
        } else {
            compositeposter[fun](props);
            resolve()
        }
    })
}

compositePoster.createPoster = function () {
    return compositePoster('createPoster', arguments)
}

export default compositePoster;