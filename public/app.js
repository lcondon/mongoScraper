$('.saveButton').on('click', function () {
    var id = $(this).attr('data-id');
    $.ajax({
        method: "POST",
        url: "/saved",
        data: {
            id: id
        }
    })
        .then(function (data) {
            window.location.assign('/home')
        });
})

$('.deleteButton').on('click', function () {
    var id = $(this).attr('data-id');
    $.ajax({
        method: "DELETE",
        url: "/saved",
        data: {
            id: id
        }
    })
        .then(function (data) {
            window.location.assign('/saved')
        });
})

$('.saveNote').on('click', function () {
    var id = $(this).attr('data-id');
    var comment = $(`#${id}Text`).val().trim();
    if (comment !== '') {
        $.ajax({
            method: "POST",
            url: "/comments",
            data: {
                id: id,
                comment: comment
            }
        })
            .then(function (data) {
                window.location.assign('/saved')
            });
    } else {

    }

})

$('.deleteComment').on('click', function () {
    console.log($(this).siblings('.textBody')[0].innerText)
    var comment = $(this).siblings('.textBody')[0].innerText;
    var articleId = $(this).parents('ul').attr('data-id');
    $.ajax({
        method: "DELETE",
        url: "/comments",
        data: {
            comment: comment,
            articleId: articleId
        }
    })
        .then(function (data) {
            window.location.assign('/saved')
        });
})

$('.clearArticles').on('click', function () {
    $.ajax({
        method: "DELETE",
        url: "/articles"
    })
        .then(function (data) {
            window.location.assign('/home')
        });
})

$('.scrapeArticles').on('click', function () {
    $.ajax({
        method: "GET",
        url: "/articles"
    })
        .then(function (data) {
            window.location.assign('/')
        });
})